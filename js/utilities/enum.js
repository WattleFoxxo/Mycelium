
export class Enum {
    constructor(entries) {
        this._nameToValue = {};
        this._valueToName = {};

        for (const [name, value] of Object.entries(entries)) {
            this._nameToValue[name] = value;
            this._valueToName[value] = name;
            this[name] = value;
        }

        Object.freeze(this._nameToValue);
        Object.freeze(this._valueToName);
        Object.freeze(this);
    }

    getName(value) {
        return this._valueToName[value];
    }

    getValue(name) {
        return this._nameToValue[name];
    }

    entries() {
        return Object.entries(this._nameToValue);
    }

    keys() {
        return Object.keys(this._nameToValue);
    }

    values() {
        return Object.values(this._nameToValue);
    }
}
