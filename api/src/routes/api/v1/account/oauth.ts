import { TokenUtils } from '../../../../utils/tokenUtils';
import { Router, Request, Response } from 'express';
import config from "../../../../../config.json";
import { database } from '../../../..';
import bcrypt from "bcrypt";

const router: Router = Router();

router.post("/api/v1/account/oauth/token", async (req: Request, res: Response) => {
    switch (req.body.grant_type) {
        case "client_credentials": {
            if (req.headers["authorization"] === undefined) {
                console.log("no auth header");
                
                return res.status(401).json({
                    error: "invalid_credentials",
                    error_description: "The user credentials were incorrect."
                })
            }

            const [ type, credentials ] = req.headers["authorization"].split(" ");
            
            switch (type) {
                case "Basic": {
                    try {
                        const { email, password } = JSON.parse(Buffer.from(credentials, "base64").toString());

                        console.log(email, password);

                        const account = await database.findOne("users", { email: email.toLowerCase() });

                        if (!account) {
                            console.log("no account");

                            return res.status(401).json({
                                error: "invalid_credentials",
                                error_description: "The user credentials were incorrect."
                            })
                        }

                        const match = await bcrypt.compare(password, account.password);
                        
                        if (!match) {
                            console.log("no match");

                            return res.status(401).json({
                                error: "invalid_credentials",
                                error_description: "The user credentials were incorrect."
                            })
                        }

                        const token = TokenUtils.generateAccessToken(account);

                        const refreshToken = await (async () => {
                            const { token } = await database.findOne("tokens", { user_id: account._id, token_type: "refresh_token" }) || {};
                            if (token) { 
                                return token;
                            } else {
                                return TokenUtils.generateRefreshToken(account);
                            }
                        })()

                        await database.insertOne("tokens", {
                            token: refreshToken,
                            user_id: account._id,
                            token_type: "refresh_token"
                        })

                        return res.status(200).json({
                            _id: account._id,
                            token_type: "Bearer",
                            access_token: token,
                            refresh_token: refreshToken,
                            expires_in: config.jwt.expiresIn
                        })
                    } catch (e) {
                        console.log(e);

                        return res.status(500).json({
                            error: "internal_server_error",
                            error_description: "An internal server error has occured. Try again later."
                        })
                    }
                }

                default: {
                    return res.status(401).json({
                        error: "invalid_credentials",
                        error_description: "The user credentials were incorrect."
                    })
                }
            }
        }
    
        case "refresh_token": {
            const { refresh_token } = req.body;

            const token = await database.findOne("tokens", { token: refresh_token });

            if (!token) {
                return res.status(401).json({
                    error: "invalid_credentials",
                    error_description: "The user credentials were incorrect."
                })
            }

            const account = await database.findOne("users", { _id: token.user_id });

            if (!account) {
                return res.status(401).json({
                    error: "invalid_credentials",
                    error_description: "The user credentials were incorrect."
                })
            }

            const newToken = TokenUtils.generateAccessToken(account);

            const newRefreshToken = TokenUtils.generateRefreshToken(account);
            
            await database.updateOne("tokens", { token: refresh_token }, { $set: { token: newRefreshToken } });

            return res.status(200).json({
                _id: account._id,
                token_type: "Bearer",
                access_token: newToken,
                refresh_token: newRefreshToken,
                expires_in: config.jwt.expiresIn
            })
        }

        default: {
            return res.status(400).json({
                error: "unsupported_grant_type",
                error_description: "The grant type provided is unsupported."
            })
        }
    }

})

export default router;