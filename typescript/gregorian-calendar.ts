export class GregorianCalendar
{
    static readonly minDay = 1;
    static readonly minMonth = 0;
    static readonly maxMonth = 11;
    static readonly minYear = 1900;
    static readonly maxYear = 2099;
    static readonly maxWeekCount = 52;
    static readonly dayCountInWeek = 7;
    static readonly monthCountInYear = 12;
    static readonly yearCountInDecade = 10;

    static isValidYear(year: number): boolean
    {
        if (!year) return false;
        if (isNaN(year)) return false;

        return (this.minYear <= year && year <= this.maxYear);
    }

    static isLeapYear(year: number): boolean
    {
        if (!this.isValidYear(year)) return false;

        return new Date(year, 1, 29).getDate() === 29;
    }

    static isValidMonth(month: number): boolean
    {
        if (month === null || month === undefined) return false;
        if (isNaN(month)) return false;

        return (this.minMonth <= month && month <= this.maxMonth);
    }

    static isValidDay(day: number, month: number, year: number): boolean
    {
        if (!this.isValidYear(year)) return false;
        if (!this.isValidMonth(month)) return false;
        const maxDay = new Date(year, month + 1, 0).getDate();
        if (!day) return false;
        if (isNaN(day)) return false;

        return (this.minDay <= day && day <= maxDay);

    }

    static getNearestPrevMonday(date: Date = new Date()): number
    {
        const clonedDate = new Date(date);
        clonedDate.setHours(0, 0, 0, 0);
        const dayStepToNearestPrevMonday = -(clonedDate.getDay() + (this.dayCountInWeek - 1)) % this.dayCountInWeek;

        return clonedDate.getDate() + dayStepToNearestPrevMonday;
    }

    static getWeekNumber(date: Date = new Date()): number
    {
        const clonedDate = new Date(date);
        clonedDate.setHours(0, 0, 0, 0);
        const millisecondCountInDay = 86400000;
        const nearestPrevMonday = new Date(clonedDate);
        nearestPrevMonday.setDate(this.getNearestPrevMonday(clonedDate));

        // January 4th is always in week 1.
        const fourthDay = 4;
        const fourthOfJanuary = new Date(clonedDate.getFullYear(), 0, fourthDay);
        const firstMondayOfFirstWeek = new Date(fourthOfJanuary);
        firstMondayOfFirstWeek.setDate(this.getNearestPrevMonday(fourthOfJanuary));
        const distanceToFirstWeekInMillisecond = nearestPrevMonday.getTime() - firstMondayOfFirstWeek.getTime();
        const distanceToFirstWeekInDate = distanceToFirstWeekInMillisecond / millisecondCountInDay;

        return Math.round(distanceToFirstWeekInDate / this.dayCountInWeek) + 1;
    }

    static getFullMonthName(month: number): string
    {
        if (!this.isValidMonth(month)) return;
        const fullNameOfMonths = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        return fullNameOfMonths[month];
    }

    static getShortMonthName(month: number): string
    {
        if (!this.isValidMonth(month)) return;
        const shortNameOfMonths = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        return shortNameOfMonths[month];
    }

    static getDecadeFirstYear(year: number = new Date().getFullYear()): number
    {
        if (!this.isValidYear(year)) return NaN;
        let decadeFirstYear = year;
        while (decadeFirstYear % this.yearCountInDecade !== 0) decadeFirstYear--;

        return decadeFirstYear;
    }

    static getTimeDuration(startDate: Date, endDate: Date, minimumTimeUnit: TimeUnit): string
    {
        const millisecondCountInDay = 86400000;
        let dayCount = (endDate.getTime() - startDate.getTime()) / millisecondCountInDay;

        const dayCountInNonLeapYear = 365;
        const dayCountInAstronomicalYear = 365.25;
        const hasFebruary29 = (dayCount: number): boolean =>
        {
            const dayCountIn4ConsecutiveYears = 1461;
            if (dayCount >= dayCountIn4ConsecutiveYears) return true;

            let leapYear: number;
            for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++)
            {
                if (this.isLeapYear(year))
                {
                    leapYear = year;
                    break;
                }
            }

            return startDate.getTime() <= new Date(leapYear, 1, 29).getTime();
        };
        const dayCountInYear = hasFebruary29(dayCount) ? dayCountInAstronomicalYear : dayCountInNonLeapYear;
        let yearCount = Math.trunc(dayCount / dayCountInYear);

        dayCount %= dayCountInYear;
        const averageDayCountInMonth = 30.4375;
        let monthCount = Math.trunc(dayCount / averageDayCountInMonth);
        dayCount = Math.trunc(dayCount % averageDayCountInMonth);

        if (minimumTimeUnit > TimeUnit.Day)
        {
            if (dayCount >= 15) monthCount++;
            dayCount = 0;
        }

        if (minimumTimeUnit === TimeUnit.Year)
        {
            if (monthCount >= 6) yearCount++;
            monthCount = 0;
        }

        const tokenize = (unitCount: number, timeUnit: TimeUnit): string =>
            unitCount > 0
                ? `${unitCount} ${TimeUnit[timeUnit]}${unitCount > 1 ? "s" : ""}`
                : "";
        const tokens: string[] = [];
        if (yearCount > 0) tokens.push(tokenize(yearCount, TimeUnit.Year));
        if (monthCount > 0) tokens.push(tokenize(monthCount, TimeUnit.Month));
        if (dayCount > 0) tokens.push(tokenize(dayCount, TimeUnit.Day));

        return tokens.join(", ");
    }

    static toString(date: Date, format = DateFormat.Short, minimumTimeUnit = TimeUnit.Day): string
    {
        if (!date) return "";
        switch (format)
        {
            case DateFormat.Short:
                return date.toLocaleDateString("vi-VN", {
                    timeZone: minimumTimeUnit < TimeUnit.Day ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
                    day: minimumTimeUnit === TimeUnit.Day ? "2-digit" : undefined,
                    month: minimumTimeUnit < TimeUnit.Year ? "2-digit" : undefined,
                    year: "numeric"
                }).replace(/\//g, " / ");
            case DateFormat.Long:
                return date.toLocaleDateString("en-US", {
                    timeZone: minimumTimeUnit < TimeUnit.Day ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
                    day: minimumTimeUnit === TimeUnit.Day ? "2-digit" : undefined,
                    month: minimumTimeUnit < TimeUnit.Year ? "long" : undefined,
                    year: "numeric"
                });
        }
    }

    static isEqualDate(date1: Date, date2: Date): boolean
    {
        if (!date1 && !date2) return true;
        if (!date1 || !date2) return false;

        const clonedDate1 = new Date(date1);
        clonedDate1.setHours(0, 0, 0, 0);
        const clonedDate2 = new Date(date2);
        clonedDate2.setHours(0, 0, 0, 0);

        return clonedDate1.getTime() === clonedDate2.getTime();
    }

    static isEqualMonth(date1: Date, date2: Date): boolean
    {
        if (!date1 && !date2) return true;
        if (!date1 || !date2) return false;

        const clonedDate1 = new Date(date1);
        clonedDate1.setDate(1);
        clonedDate1.setHours(0, 0, 0, 0);
        const clonedDate2 = new Date(date2);
        clonedDate2.setDate(1);
        clonedDate2.setHours(0, 0, 0, 0);

        return clonedDate1.getTime() === clonedDate2.getTime();
    }

    static isEqualYear(date1: Date, date2: Date): boolean
    {
        if (!date1 && !date2) return true;
        if (!date1 || !date2) return false;

        const clonedDate1 = new Date(date1);
        clonedDate1.setMonth(0);
        clonedDate1.setDate(1);
        clonedDate1.setHours(0, 0, 0, 0);
        const clonedDate2 = new Date(date2);
        clonedDate2.setMonth(0);
        clonedDate2.setDate(1);
        clonedDate2.setHours(0, 0, 0, 0);

        return clonedDate1.getTime() === clonedDate2.getTime();
    }
}

export enum Day
{
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

export enum TimeUnit
{
    Day,
    Month,
    Year
}

export enum DateFormat
{
    Short,
    Long
}
