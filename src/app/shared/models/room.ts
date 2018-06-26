export class Room {
    id: string;
    readableName: string;
    activeUsers: number;

    constructor(inputJSON: any) {
        Object.assign(this, inputJSON);
        return this;
    }
}
