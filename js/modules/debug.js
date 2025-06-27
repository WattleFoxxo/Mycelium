export class DebugManager {
    constructor() {

    }

    init() {
        console.logs = [];

        console.defaultLog = console.log.bind(console);
        console.log = function() {
            console.logs.push({"type": "log", "datetime": Date().toLocaleString(), "value": Array.from(arguments)});
            console.defaultLog.apply(console, arguments);
        }

        console.defaultError = console.error.bind(console);
        console.error = function() {
            console.logs.push({"type": "error", "datetime": Date().toLocaleString(), "value": Array.from(arguments)});
            console.defaultError.apply(console, arguments);
        }

        console.defaultWarn = console.warn.bind(console);
        console.warn = function() {
            console.logs.push({"type": "warn", "datetime": Date().toLocaleString(), "value": Array.from(arguments)});
            console.defaultWarn.apply(console, arguments);
        }

        console.defaultDebug = console.debug.bind(console);
        console.debug = function() {
            console.logs.push({"type": "debug", "datetime": Date().toLocaleString(), "value": Array.from(arguments)});
            console.defaultDebug.apply(console, arguments);
        }
    }

    clear() {
        console.logs = [];
    }
}