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
                        format.timestamp(),
                        format.printf((info) => {
                            const t = info.timestamp.split("T");
                            const d = t[0].split("-");
                            const t2 = t[1].split(":");
                            const date = `${d[2]}/${d[1]}/${d[0]} ${t2[0]}:${t2[1]}:${t2[2].split(".")[0]}`;
                            return `[${date}] [${info.level.toUpperCase()}] ${info.message}`
                        })
                    )
                })
            ]
        })

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