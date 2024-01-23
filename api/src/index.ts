import { Database } from "./database";
import { Server } from "./server";
import { Logger } from "./logger";
import { ReCaptcha } from "./utils/reCAPTCHA";
import config from "../config.json";

export const database = new Database({ uri: config.database.uri, database: config.database.name })
export const logger = new Logger();
export const reCaptcha = new ReCaptcha({ secret: config.recaptcha.secretKey })

export const server = new Server({ port: config.server.port });

server.start();
