class StringStream {

    str: string;
    index: number = 0;

    constructor(str: string) {
        this.str = str;
    }

    atEnd(): boolean {
        return this.index >= this.str.length;
    }

    move(len: number) : void {
        this.index += len;
    }

    peekFront(len: number) :string {
        return this.str.substr(this.index, len);
    }

    peekUntil(separator: string) : string {
        var nextpos = this.str.indexOf(separator, this.index);
        return this.str.substring(this.index, nextpos);
    }

    readUntil(separator: string): string {
        var nextpos = this.str.indexOf(separator, this.index);
        var curindex = this.index;
        this.index = nextpos + separator.length;
        return this.str.substring(curindex, nextpos);
    }
}