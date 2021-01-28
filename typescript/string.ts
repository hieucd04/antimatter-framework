export class $string
{
    static readonly empty = "";
    static readonly emptyGuid = "00000000-0000-0000-0000-000000000000";

    static isEmpty(stringValue: string): boolean { return stringValue === this.empty; }

    static isNullOrEmpty(stringValue: string): boolean { return stringValue === null || this.isEmpty(stringValue); }
}
