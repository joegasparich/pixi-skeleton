import { v4 as uuid } from "uuid";

class Mediator {

    private listeners: Map<string, {context: string; callback: Function}[]>;

    public constructor() {
        this.listeners = new Map();
    }

    public on(event: string, callback: Function): string {
        const context = uuid();

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push({context, callback});

        return context;
    }

    public fire(event: string, data?: Object): void {
        this.listeners.get(event)?.forEach(listener => listener.callback(data));
    }

    public unsubscribe(event: string, context: string): void {
        this.listeners.set(event, this.listeners.get(event).filter(listener => listener.context !== context));
    }
}

export default new Mediator();
