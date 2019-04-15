
enum Color { Red, Green, Blue, Yellow, Purple, Pink, Brown, Orange };

class IMemoryLabel {
    name: string;
    color: Color;

    getName(): string { return this.name; }
    getColor(): Color { return this.color; }

    setName(name: string) { this.name = name; }
    setColor(color: Color) { this.color = color; }

    constructor(name: string, color: Color) { this.name = name; this.color = color; }
}