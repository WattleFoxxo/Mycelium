import { Enum } from "./enum.js";

export const LogLevel = new Enum({
    DEBUG: 0,
    LOG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    DISABLED: 5
});

export class Logging {
    static _logLevel = LogLevel.DEBUG;

    static debug(...args) {
        if (this._logLevel > LogLevel.DEBUG) return;

        const tag = this._generateTag("DEBUG");
        console.log(tag, ...args);
    }

    static log(...args) {
        if (this._logLevel > LogLevel.LOG) return;

        const tag = this._generateTag("LOG", "");
        console.log(tag, ...args);
    }

    static info(...args) {
        if (this._logLevel > LogLevel.INFO) return;

        const tag = this._generateTag("INFO");
        console.info(tag, ...args);
    }

    static warn(...args) {
        if (this._logLevel > LogLevel.WARN) return;

        const tag = this._generateTag("WARN");
        console.info(tag, ...args);
    }

    static error(...args) {
        if (this._logLevel > LogLevel.ERROR) return;

        const tag = this._generateTag("ERROR");
        console.info(tag, ...args);
    }

    static NOT_IMPLEMENTED(...args) {
        if (this._logLevel > LogLevel.ERROR) return;

        const tag = this._generateTag("NOT_IMPLEMENTED");
        console.info(tag, ...args);
    }

    static setLogLevel(level) {
        this._logLevel = level;
    }

    static _generateTag(level) {
        return `[${level} -> ${this._getLine()}]`
    }

    static _getLine() {
        const stack = new Error().stack;

        if (!stack) return "UNKNOWN";

        const lines = stack.split("\n");
        const callerLine = lines[4] || lines[3];
        const match = callerLine.match(/(?:\()?(.*):(\d+):(\d+)\)?$/);

        if (match) {
            const file = match[1].split("/").slice(-1)[0];
            const line = match[2];

            return `${file}:${line}`;
        }

        return "UNKNOWN";
    }
}
