import { Router, Request, Response } from 'express';
import config from "../../../../../config.json";
import { database, reCaptcha } from '../../../..';
import bcrypt from "bcrypt";
import axios from "axios";
import { TokenUtils } from '../../../../utils/tokenUtils';

const router: Router = Router();

router.post("/api/v1/account/register", async (req: Request, res: Response) => {
    const { email, password, recaptchaToken } = req.body;

    const assessment = await reCaptcha.createAssessment({ token: recaptchaToken });

    if (!assessment.success) {
        return res.status(400).json({
            error: "recaptcha_failed",
            error_description: "The reCAPTCHA assessment failed. Please try again."
        })
    }

    const account = await database.findOne("users", { email: email.toLowerCase() });

    if (account) {
        return res.status(400).json({
            error: "email_already_taken",
            error_description: "The email provided is already taken."
        })
    }

    if (email.includes(":")) 
        return sendError(res, "email_contains_illegal_characters", "The email provided contains illegal characters.");
    
    if (!isValidEmail(email))
        return sendError(res, "email_invalid", "The email provided is invalid.");
    
    if (password.length < 6) 
        return sendError(res, "password_too_short", "The password provided is too short.");
    
    if (password.includes(":")) 
        return sendError(res, "password_contains_illegal_characters", "The password provided contains illegal characters.");

    const passwordHash = await bcrypt.hash(password, 10);

    const id = await database.count("users");
    await database.insertOne("users", {
        _id: id,
        email: email.toLowerCase(),
        password: passwordHash,
        created_at: new Date().getTime()
    })

    const user = await database.findOne("users", { email: email.toLowerCase() });

    const token = TokenUtils.generateAccessToken(user);

    const refreshToken = await (async () => {
        const { token } = await database.findOne("tokens", { user_id: user._id, token_type: "refresh_token" }) || {};
        if (token) { 
            return token;
        } else {
            return TokenUtils.generateRefreshToken(user);
        }
    })()

    await database.insertOne("tokens", {
        token: refreshToken,
        user_id: user._id,
        token_type: "refresh_token"
    })

    return res.status(200).json({
        _id: user._id,
        token_type: "Bearer",
        access_token: token,
        refresh_token: refreshToken,
        expires_in: config.jwt.expiresIn
    })
})

const sendError = (res: Response, errorType: string, errorDescription: string) => {
    return res.status(400).json({
        error: errorType,
        error_description: errorDescription
    })
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default router;