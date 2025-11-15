import { Constants } from "./constants.js";

export class Session {
    constructor(id, totalChunks, payloadType) {
        this.id = id;
        this.totalChunks = totalChunks;
        this.payloadType = payloadType;

        this.currentChunk = -1;
        this.chunks = new Map();
        this.retryTimer = new RetryTimer();
    }

    setPayload(payload) {
        let index = 0;

        for (let i = 0; i < payload.length; i += Constants.ChunkSize) {
            const chunk = payload.slice(i, i + Constants.ChunkSize);

            this.chunks.set(index++, chunk);
        }
    }

    getNextChunk() {
        return this.chunks.get(++this.currentChunk);
    }

    getPayload() {
        let totalLength = 0;

        for (const chunk of this.chunks.values()) {
            totalLength += chunk.length;
        }

        const payload = new Uint8Array(totalLength);

        let offset = 0;

        for (const chunk of this.chunks.values()) {
            payload.set(chunk, offset);
            offset += chunk.length;
        }

        return payload;
    }
}

class RetryTimer {
    constructor (maxRetries = 5, retryTimeout = 5000) {
        this.count = 0;
        this.timer = null;
        this.maxRetries = maxRetries;
        this.retryTimeout = retryTimeout;
    }

    startRetryTimer(onRetry, onTimeout) {
        this.stopRetryTimer();

        this.timer = setTimeout(async () => {
            this.count++;
            
            if (this.count > this.maxRetries) {
                this.stopRetryTimer();
                onTimeout();
                return;
            }
    
            onRetry();
            this.startRetryTimer(onRetry, onTimeout);
        }, this.retryTimeout);
    }
    
    stopRetryTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.count = 0;
    }
}
