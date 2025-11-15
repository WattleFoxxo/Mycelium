import { Constants } from "./constants.js";

export class Packet {
    constructor(
        session,
        totalChunks,
        chunkIndex,
        payloadType,
        payloadLength,
        payload
    ) {
        this.session = session;
        this.totalChunks = totalChunks;
        this.chunkIndex = chunkIndex;
        this.payloadType = payloadType;
        this.payloadLength = payloadLength;
        this.payload = payload;
    }
    
    toUint8Array() {
        return new Uint8Array([
            ...Constants.Magic,
            Constants.Version,
            this.session,
            this.totalChunks,
            this.chunkIndex,
            this.payloadType,
            this.payloadLength,
            ...this.payload
        ]);
    }

    static fromUint8Array(raw) {
        // Skip Magic (2 bytes) and Version (1 byte)

        return new Packet(
            raw[3], // Session
            raw[4], // totalChunks
            raw[5], // chunkIndex
            raw[6], // payloadType
            raw[7], // payloadLength
            raw.slice(8) // payload
        )
    }
}
