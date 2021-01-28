export class Enum
{
    static getValue($enum: Record<string, string>, key: string): string
    {
        return $enum[key];
    }
}