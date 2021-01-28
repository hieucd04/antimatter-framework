export class $number
{
    static readonly min = -999999999999999;
    static readonly max = 999999999999999;
    static readonly oneHundredPercent = 100;
    static readonly fullAngle = 360;

    static shorten(value: number): string
    {
        if (value === undefined || value === null) return "";
        const thousandMilestone = 1000;
        const millionMilestone = 1000000;
        const billionMilestone = 1000000000;

        let shortenedValue = value;
        let postFix = "";
        if (Math.abs(shortenedValue) >= billionMilestone)
        {
            shortenedValue /= billionMilestone;
            postFix = "B";
        }
        else if (Math.abs(shortenedValue) >= millionMilestone)
        {
            shortenedValue /= millionMilestone;
            postFix = "M";
        }
        else if (Math.abs(shortenedValue) >= thousandMilestone)
        {
            shortenedValue /= thousandMilestone;
            postFix = "K";
        }

        return `${shortenedValue.toLocaleString("en-us", {useGrouping: true, maximumFractionDigits: 2})}${postFix}`;
    }

    static clamp(value: number, min?: number, max?: number): number
    {
        if (value === undefined || value === null || Number.isNaN(value))
        {
            return Number.NaN;
        }

        if (min !== undefined && min !== null && min !== Number.NaN && value <= min)
        {
            return min;
        }

        if (max !== undefined && max !== null && max !== Number.NaN && value >= max)
        {
            return max;
        }

        return value;
    }

    static double(value: number): number
    {
        if (value === undefined || value === null)
        {
            return Number.NaN;
        }

        return value + value;
    }

    static getFractionalDigits(value: number): string
    {
        if (value === undefined || value === null)
        {
            return "";
        }

        const stringValue = value.toString();
        if (stringValue.indexOf(".") < 0)
        {
            return "";
        }

        return stringValue.substr(stringValue.indexOf(".") + 1);
    }

    static toRadians(percent: number): number
    {
        if (percent === undefined || percent === null)
        {
            return Number.NaN;
        }

        const oneRotation = 360;
        const halfRotation = 180;
        const degrees = oneRotation * percent;

        return degrees * (Math.PI / halfRotation);
    }

    static toPercent(value: number): number
    {
        if (value === undefined || value === null)
        {
            return Number.NaN;
        }

        const hundredPercent = 100;
        if (value < 0) return 0;
        if (value > 1) return hundredPercent;

        return value * hundredPercent;
    }

    static halve(value: number): number
    {
        if (value === undefined || value === null)
        {
            return Number.NaN;
        }

        return value * 0.5;
    }

    static quarter(value: number): number
    {
        if (value === undefined || value === null)
        {
            return Number.NaN;
        }

        return this.halve(this.halve(value));
    }
}
