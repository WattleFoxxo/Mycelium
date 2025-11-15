
export class Message {
    constructor(
        payloadType,
        payloadLength,
        payload
    ) {
        this.payloadType = payloadType;
        this.payloadLength = payloadLength;
        this.payload = payload;
    }
}
