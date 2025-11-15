import { Constants } from "./constants.js";
import { Packet } from "./packet.js";
import { Message } from "./message.js";
import { Session } from "./session.js";
import { EventEmitter } from "./events.js";

class Mycelium extends EventEmitter {
    constructor(device) {
        super();

        this.device = device;
        this.sessions = new Map();

        this.device.on(Constants.MeshcorePushCodes.LogRxData, (data) => this._onRawCustom(data));
    }

    sendMessage(message) {
        const payload = new Uint8Array(new TextEncoder("utf-8").encode(message));

        this._sendMyceliumMessage(new Message(
            Constants.PayloadType.Message,
            payload.length,
            payload
        ));
    }

    sendFile(fileName, file) {
        const name = new TextEncoder("utf-8").encode(fileName);

        const payload = new Uint8Array([
            name.length,
            ...name,
            ...file
        ]);

        this._sendMyceliumMessage(new Message(
            Constants.PayloadType.File,
            payload.length,
            payload
        ));
    }

    _onMyceliumMessage(message) {
        switch (message.payloadType) {
            case Constants.PayloadType.Message:
                const text = new TextDecoder("utf-8").decode(message.payload);

                this.emit(Constants.MessageEvent.Message, {
                    message: text
                });
                break;
            
            case Constants.PayloadType.File:
                const fileNameLength = message.payload[0];
                const fileName = new TextDecoder("utf-8").decode(
                    message.payload.slice(1, fileNameLength + 1)
                );
                const file = message.payload.slice(fileNameLength + 1);

                this.emit(Constants.MessageEvent.File, {
                    fileName: fileName,
                    file: file
                });
                break;
        }
    }

    _sendMyceliumMessage(message) {
        const totalChunks = Math.ceil(message.payloadLength / Constants.ChunkSize);

        let session = new Session(
            Math.floor(Math.random() * 255) + 1, // Random session id for now
            totalChunks,
            message.payloadType
        );

        session.setPayload(message.payload);
        this.sessions.set(session.id, session);

        let chunk = session.getNextChunk();

        let packet = new Packet(
            session.id,
            session.totalChunks,
            session.currentChunk,
            session.payloadType,
            chunk.length,
            chunk
        );

        this.device.sendCommandSendRawData([], packet.toUint8Array());
    }

    async _onRawCustom(data) {
        // Filter out non RawCustom packets
        if (data.raw[0] != 0x3e) return;

        const rawPacket = data.raw.slice(2);

        // Filter out non Mcelium packets
        if (!rawPacket.slice(0, 2).every(
            (v, i) => v === [0x4D, 0x50][i])
        ) return false;
        
        const packet = Packet.fromUint8Array(rawPacket);

        if (packet.totalChunks == 1) {
            let message = new Message(
                packet.payloadType,
                packet.payload.length,
                packet.payload
            );

            this._onMyceliumMessage(message);
        } else {
            if (packet.payloadType == Constants.PayloadType.Signalling) {
                this._sendChunkPacket(packet);
                return;
            }

            this._handleChunkedPacket(packet);
        }
    }

    _sendChunkPacket(packet) {
        let session = this.sessions.get(packet.session);
        let chunk = session.chunks.get(packet.chunkIndex);

        session.currentChunk = packet.chunkIndex;

        let responsePacket = new Packet(
            session.id,
            session.totalChunks,
            session.currentChunk,
            session.payloadType,
            chunk.length,
            chunk
        );

        this.device.sendCommandSendRawData([], responsePacket.toUint8Array());
    }

    _sendSignallingPacket(packet) {
        let responsePacket = new Packet(
            packet.session,
            0,
            packet.chunkIndex + 1,
            Constants.PayloadType.Signalling,
            0,
            []
        );

        this.device.sendCommandSendRawData([], responsePacket.toUint8Array());
    }

    _handleChunkedPacket(packet) {
        let session;

        // Check if fist packet
        if (packet.chunkIndex == 0) {
            session = new Session(
                packet.session,
                packet.totalChunks,
                packet.payloadType
            );

            session.chunks.set(packet.chunkIndex, packet.payload);
            this.sessions.set(packet.session, session);
        } else {
            session = this.sessions.get(packet.session);

            session.currentChunk = packet.chunkIndex;
            session.chunks.set(packet.chunkIndex, packet.payload);
        }

        this.emit(Constants.MessageEvent.MessageProgress, {
            session: session,
            totalChunks: packet.totalChunks,
            chunkIndex: packet.chunkIndex
        });

        session.retryTimer.stopRetryTimer();

        // Check if last packet
        if (packet.chunkIndex + 1 >= packet.totalChunks) {
            session.retryTimer.stopRetryTimer();

            let payload = session.getPayload();

            let message = new Message(
                packet.payloadType,
                payload.length,
                payload
            );

            this._onMyceliumMessage(message);

            return;
        }

        session.retryTimer.startRetryTimer(() => this._sendSignallingPacket(packet), () => {
            this.sessions.delete(packet.session);

            console.error(`Chunked packet transfer in session (${packet.session}) has timed out...`);
        });

        this._sendSignallingPacket(packet)
    }
}

export {
    Mycelium,
    Constants,
    Packet,
    Message,
    Session,
    EventEmitter
}