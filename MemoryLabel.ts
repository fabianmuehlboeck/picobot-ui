

class MemoryLabel {

    statusli: HTMLLIElement;

    name: string;
    id: string;
    nameChangeHandlers: ((string) => void)[] = [];

    getName(): string { return this.name; }
    getId(): string { return this.id; }
    getElement(): HTMLLIElement { return this.statusli; }

    setName(name: string) {
        this.name = name; this.nameChangeHandlers.forEach((handler) => { handler(name); }); this.statusli.innerText = name;
    }

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.statusli = document.createElement("li");
        this.statusli.innerText = name;
        this.statusli.classList.add("robotmemory");
    }

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