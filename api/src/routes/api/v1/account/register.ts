import { Router, Request, Response } from 'express';
import config from "../../../../../config.json";
import { database } from '../../../..';
import bcrypt from "bcrypt";
import axios from "axios";

const router: Router = Router();

router.post("/api/v1/account/register", async (req: Request, res: Response) => {
    const { email, password, recaptchaToken } = req.body;

    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
        params: {
            secret: config.recaptcha.secretKey,
            response: recaptchaToken
        }
    })
    .catch((error) => error.response);

    if (!response.data.success) {
        return res.status(403).json({
            error: "invalid_recaptcha_token",
            error_description: "The recaptcha token provided is invalid."
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

    return res.status(200).json({
        message: "Successfully registered."
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