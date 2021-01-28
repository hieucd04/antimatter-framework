export class Char
{
    static readonly space = "\u00A0";

    static isDigit(keyCode: number): boolean
    {
        return (48 <= keyCode && keyCode <= 57) || (96 <= keyCode && keyCode <= 105);
    }

    static isBackspace(keyCode: number): boolean
    {
        return keyCode === 8;
    }

    static isTab(keyCode: number): boolean
    {
        return keyCode === 9;
    }

    static isMinus(keyCode: number): boolean
    {
        return keyCode === 109 || keyCode === 189;
    }

    static isDot(keyCode: number): boolean
    {
        return keyCode === 110 || keyCode === 190;
    }

    static isLeftArrow(keyCode: number): boolean
    {
        return keyCode === 37;
    }

    static isRightArrow(keyCode: number): boolean
    {
        return keyCode === 39;
    }

    static isHome(keyCode: number): boolean
    {
        return keyCode === 36;
    }

    static isEnd(keyCode: number): boolean
    {
        return keyCode === 35;
    }

    static isDelete(keyCode: number): boolean
    {
        return keyCode === 46;
    }

    static isA(keyCode: number): boolean
    {
        return keyCode === 65;
    }

    static isC(keyCode: number): boolean
    {
        return keyCode === 67;
    }

    static isV(keyCode: number): boolean
    {
        return keyCode === 86;
    }

    static isX(keyCode: number): boolean
    {
        return keyCode === 88;
    }
}
