export class ChatMessage {
    userName: string;
    message: string;
    time: string;

    constructor(inputJSON: any) {
        Object.assign(this, inputJSON);
        return this;
    }
}
