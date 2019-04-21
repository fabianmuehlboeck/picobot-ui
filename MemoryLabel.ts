

class MemoryLabel {
    name: string;
    nameChangeHandlers: ((string) => void)[] = [];

    getName(): string { return this.name; }

    setName(name: string) {
        this.name = name; this.nameChangeHandlers.forEach((handler) => { handler(name); });
    }

    constructor(name: string) { this.name = name; }

    addNameChangeHandler(handler: (string) => void): void {
        this.nameChangeHandlers.push(handler);
    }
    removeNameChangeHandler(handler: (string) => void): void {
        var index = this.nameChangeHandlers.indexOf(handler);
        if (index >= 0) {
            this.nameChangeHandlers.splice(index, 1);
        }
    }
}