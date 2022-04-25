/** Capitalize the first letter of a string */
String.prototype.capitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/** Paginate over an array */
Array.prototype.paginate = function <T>(pageSize: number, pageNumber: number): T[] {
    --pageNumber;
    return this.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
};

Array.prototype.remove = function <T>(item: T): T[] {
    return this.filter((element: T) => element !== item);
};
