import express, { Express, NextFunction, Request, Response } from "express";

import register from "./routes/api/v1/account/register";
import oauth from "./routes/api/v1/account/oauth";
import { logger } from ".";

interface ServerOptions {
    port: number
}

export class Server {

    public readonly app: Express;
    public readonly port: number;

    constructor({ port }: ServerOptions) {
        this.app = express();
        this.port = port;

        this.app.use(express.json());

        this.app.use(oauth);
        this.app.use(register);

        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            return res.status(500).json({
                error: "internal_server_error",
                error_description: "An internal server error has occured. Try again later."
            })
        })

    }

    public start = async () => {
        this.app.listen(this.port, () => {
            logger.info(`Server started, listening to port ${this.port}`);
        })
    } 

}