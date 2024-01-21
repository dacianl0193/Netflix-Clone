import config from "../../config.json";
import jwt from 'jsonwebtoken';

export class TokenUtils {

    public static generateAccessToken = (account: any) => {
        return jwt.sign({
            id: account._id,
        }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        })
    }

    public static generateRefreshToken = (account: any) => {
        return "R~" + jwt.sign({
            id: account._id,
        }, config.jwt.secret, {
            expiresIn: config.jwt.refreshExpiresIn
        })
    }

}