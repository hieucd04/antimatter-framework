export class $object
{
    static isEmptyObject(anyObject: Record<string, unknown>): boolean { return anyObject ? Object.keys(anyObject).length === 0 : false; }

    static isNullOrUndefined(anyObject: Record<string, unknown> | number | string | boolean): boolean
    {
        return anyObject === null || anyObject === undefined;
    }
}

export interface IObject
{
    [key: string]: Record<string, unknown>;
}
