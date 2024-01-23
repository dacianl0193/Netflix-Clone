import { Database } from "./database"
import config from "../config.json";
import { Server } from "./server";
import { Logger } from "./logger";
import { ReCaptcha } from "./utils/reCAPTCHA";

export const database = new Database({
    uri: config.database.uri,
    database: config.database.name
})

export const server = new Server({
    port: config.server.port
})

export const reCaptcha = new ReCaptcha({
    secret: config.recaptcha.secretKey
})

export const logger = new Logger();


const main = async () => {
    await server.start();
}

main();