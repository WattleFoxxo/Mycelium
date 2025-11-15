
export class EventEmitter {
    constructor() {
        this.eventListenersMap = new Map();
    }

    on(event, callback) {
        if(!this.eventListenersMap.has(event)){
            this.eventListenersMap.set(event, []);
        }

        this.eventListenersMap.get(event).push(callback);
    }

    off(event, callback) {
        if(this.eventListenersMap.has(event)){
            const callbacks = this.eventListenersMap.get(event).filter(cb => cb !== callback);
            
            this.eventListenersMap.set(event, callbacks);
        }
    }

    once(event, callback) {
        const internalCallback = (...data) => {
            this.off(event, internalCallback);

            setTimeout(() => callback(...data), 0);
        };

        this.on(event, internalCallback);
    }

    emit(event, ...data) {
        if(this.eventListenersMap.has(event)){
            for(const eventListener of this.eventListenersMap.get(event)){
                setTimeout(() => eventListener(...data), 0);
            }
        }
    }
}
