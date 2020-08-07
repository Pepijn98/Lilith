/** Capitalize the first letter of a string */
String.prototype.capitalize = function (): string {
    // eslint-disable-line no-extend-native
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/** Paginate over an array */
Array.prototype.paginate = function <T>(pageSize: number, pageNumber: number): T[] {
    // eslint-disable-line no-extend-native
    --pageNumber;
    return this.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
};

Array.prototype.remove = function <T>(item: T): T[] {
    // eslint-disable-line no-extend-native
    for (let i = 0; i < this.length; i++) {
        if (this[i] === item) this.splice(i, 1);
    }
    return this;
};
