export class User {
    id!: number;
    number!: string;
    name!: string;
    constructor(
        id: number,
        number: string,
        name: string
    ) {
        this.id = id;
        this.number = number;
        this.name = name;
    }
}