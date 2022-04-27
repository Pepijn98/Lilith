import { Member } from "slash-create/lib/structures/member";
import { User } from "slash-create/lib/structures/user";

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

Object.defineProperty(User.prototype, "tag", {
    get: function(): string {
        return `${this.username}#${this.discriminator}`;
    }
});

Object.defineProperty(Member.prototype, "tag", {
    get: function(): string {
        return `${this.user.username}#${this.user.discriminator}`;
    }
});
