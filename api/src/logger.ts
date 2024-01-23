import { createLogger, format, transports, Logger as WistonLogger } from "winston";

const loggerLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
}

export class Logger {

    private readonly logger: WistonLogger;

    constructor() {
        this.logger = createLogger({
            levels: loggerLevels,
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.timestamp({
                            format: 'DD/MM/YYYY HH:mm:ss'
                        }),
                        format.printf(({ timestamp, level, message }) => {
                            return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                        })
                    )
                })
            ]
        });

        this.logger.info("Logger initialized");
    }

    public fatal = (message: string) => {
        this.logger.log("fatal", message);
    }

    public error = (message: string) => {
        this.logger.log("error", message);
    }

    public warn = (message: string) => {
        this.logger.log("warn", message);
    }

    public info = (message: string) => {
        this.logger.log("info", message);
    }

    public debug = (message: string) => {
        this.logger.log("debug", message);
    }

    public trace = (message: string) => {
        this.logger.log("trace", message);
    }

}