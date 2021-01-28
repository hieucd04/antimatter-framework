export class LunarCalendarVn {
    static getLunarDate(gregorianDate: Date): number[] {
        let yy = gregorianDate.getFullYear();
        let ly = this.getLunarYear(gregorianDate.getFullYear());
        const month11 = ly[ly.length - 1];
        const jdToday = this.getJulianDayCount(gregorianDate, 7);
        const jdMonth11 = this.getJulianDayCount(new Date(month11[2], month11[1], month11[0]), 7);
        if (jdToday >= jdMonth11) {
            ly = this.getLunarYear(gregorianDate.getFullYear() + 1);
            yy = gregorianDate.getFullYear() + 1;
        }
        let i = ly.length - 1;
        while (jdToday < this.getJulianDayCount(new Date(ly[i][2], ly[i][1], ly[i][0]), 7))
            i--;

        const dd = jdToday - this.getJulianDayCount(new Date(ly[i][2], ly[i][1], ly[i][0]), 7) + 1;
        const mm = ly[i][3];
        if (mm >= 11) yy--;

        return [yy, mm, dd, ly[i][4]];
    }

    static getGregorianDate(year: number, month: number, day: number, isLeapMonth = false): Date {
        let yy = year;
        if (month >= 11) yy = year + 1;
        const lunarYear = this.getLunarYear(yy);
        let lunarMonth: number[] = null;
        for (const lm of lunarYear)
            if (lm[3] === month && !!lm[4] === isLeapMonth) {
                lunarMonth = lm;
                break;
            }

        if (lunarMonth !== null) {
            const jd = this.getJulianDayCount(new Date(lunarMonth[2], lunarMonth[1], lunarMonth[0]), 7);
            const result = this.getDate(jd + day);
            const ld = this.getLunarDate(result);
            if (ld[0] !== year || ld[1] !== month || ld[2] !== day || !!ld[3] !== isLeapMonth) return null;

            return result;
        } else return null;
    }

    private static getJulianDayCount(date: Date, timeZoneOffset = 0): number {
        return this.getJulianDayCountFromUniversalDate(date) - timeZoneOffset / 24;
    }

    private static getDate(julianDayCount: number, timeZoneOffset = 0): Date {
        return this.getUniversalDate(julianDayCount + timeZoneOffset / 24);
    }

    private static getNewMoon(k: number): number {
        const T = k / 1236.85;
        const T2 = T * T;
        const T3 = T2 * T;
        const dr = Math.PI / 180;
        let Jd1 = k * 29.53058868 + T2 * 0.0001178 - T3 * 0.000000155 + 2415020.75933;
        Jd1 = Jd1 + Math.sin((T * 132.87 - T2 * 0.009173 + 166.56) * dr) * 0.00033;
        const M = k * 29.10535608 - T2 * 0.0000333 - T3 * 0.00000347 + 359.2242;
        const Mpr = k * 385.81691806 + T2 * 0.0107306 + T3 * 0.00001236 + 306.0253;
        const F = k * 390.67050646 - T2 * 0.0016528 - T3 * 0.00000239 + 21.2964;
        let C1 = (0.1734 - T * 0.000393) * Math.sin(M * dr) + Math.sin(dr * M * 2) * 0.0021;
        C1 = C1 - Math.sin(Mpr * dr) * 0.4068 + Math.sin(dr * 2 * Mpr) * 0.0161;
        C1 = C1 - Math.sin(dr * 3 * Mpr) * 0.0004;
        C1 = C1 + Math.sin(dr * 2 * F) * 0.0104 - Math.sin(dr * (M + Mpr)) * 0.0051;
        C1 = C1 - Math.sin(dr * (M - Mpr)) * 0.0074 + Math.sin(dr * (F * 2 + M)) * 0.0004;
        C1 = C1 - Math.sin(dr * (F * 2 - M)) * 0.0004 - Math.sin(dr * (F * 2 + Mpr)) * 0.0006;
        C1 = C1 + Math.sin(dr * (F * 2 - Mpr)) * 0.001 + Math.sin(dr * (Mpr * 2 + M)) * 0.0005;
        const deltaT = T < -11
            ? T * 0.000839 + T2 * 0.0002261 - T3 * 0.00000845 - T * T3 * 0.000000081 + 0.001
            : T * 0.000265 + T2 * 0.000262 - 0.000278;

        return Jd1 + C1 - deltaT;
    }

    private static getSunLongitude(julianDayCount: number): number {
        const T = (julianDayCount - 2451545) / 36525;
        const T2 = T * T;
        const dr = Math.PI / 180;
        const M = T * 35999.0503 - T2 * 0.0001559 - T * T2 * 0.00000048 + 357.5291;
        const L0 = T * 36000.76983 + T2 * 0.0003032 + 280.46645;
        let DL = (-T * 0.004817 - T2 * 0.000014 + 1.9146) * Math.sin(dr * M);
        DL = DL + (0.019993 - T * 0.000101) * Math.sin(dr * 2 * M) + Math.sin(dr * 3 * M) * 0.00029;
        let L = L0 + DL;
        L = L * dr;
        L = L - Math.PI * 2 * (this.int(L / (Math.PI * 2)));

        return L;
    }

    private static getLunarNovember(year: number): Date {
        const off = this.getJulianDayCount(new Date(year, 11, 31), 7) - 2415021.076998695;
        const k = this.int(off / 29.530588853);
        let jd = this.getNewMoon(k);
        const ret = this.getDate(jd, 7);
        const sunLong = this.getSunLongitude(this.getJulianDayCount(ret, 7));
        if (sunLong > Math.PI * 3 / 2)
            jd = this.getNewMoon(k - 1);

        return this.getDate(jd, 7);
    }

    private static getLunarYear(gregorianYear: number): number[][] {
        const month11A = this.getLunarNovember(gregorianYear - 1);
        const jdMonth11A = this.getJulianDayCount(month11A, 7);
        const k = Math.floor((jdMonth11A - 2415021.076998695) / 29.530588853 + 0.5);
        const month11B = this.getLunarNovember(gregorianYear);
        const off = this.getJulianDayCount(month11B, 7) - jdMonth11A;
        const leap = off > 365;
        const retLength = leap ? 14 : 13;
        const ret: number[][] = [];
        ret[0] = [month11A.getDate(), month11A.getMonth(), month11A.getFullYear(), 0, 0];
        ret[retLength - 1] = [month11B.getDate(), month11B.getMonth(), month11B.getFullYear(), 0, 0];
        for (let i = 1; i < retLength - 1; i++) {
            const nm = this.getNewMoon(k + i);
            const a = this.getDate(nm, 7);
            ret[i] = [a.getDate(), a.getMonth(), a.getFullYear(), 0, 0];
        }
        for (let i = 0; i < retLength; i++) ret[i][3] = this.mod(i + 11, 12);
        if (leap) this.initLeapYear(ret);

        return ret;
    }

    private static initLeapYear(ret: number[][]): void {
        const sunLongitudes = [];
        for (let i = 0; i < ret.length; i++) {
            const a = ret[i];
            const jdAtMonthBegin = this.getJulianDayCount(new Date(a[2], a[1], a[0]), 7);
            sunLongitudes[i] = this.getSunLongitude(jdAtMonthBegin);
        }
        let found = false;
        for (let i = 0; i < ret.length; i++) {
            if (found) {
                ret[i][3] = this.mod(i + 10, 12);
                continue;
            }
            const sl1 = sunLongitudes[i];
            const sl2 = sunLongitudes[i + 1];
            const hasMajorTerm = Math.floor(sl1 / Math.PI * 6) !== Math.floor(sl2 / Math.PI * 6);
            if (!hasMajorTerm) {
                found = true;
                ret[i][4] = 1;
                ret[i][3] = this.mod(i + 10, 12);
            }
        }
    }

    private static getJulianDayCountFromUniversalDate(date: Date): number {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if (year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day > 14))
            return year * 367 - this.int((year + this.int((month + 9) / 12)) * 7 / 4) -
                this.int((this.int((year + (month - 9) / 7) / 100) + 1) * 3 / 4) + this.int(month * 275 / 9) + day + 1721028.5;

        return year * 367 - this.int((year + 5001 + this.int((month - 9) / 7)) * 7 / 4) + this.int(month * 275 / 9) + day + 1729776.5;
    }

    private static getUniversalDate(julianDayCount: number): Date {
        const Z = this.int(julianDayCount + 0.5);
        const F = (julianDayCount + 0.5) - Z;
        let A: number;
        if (Z < 2299161) A = Z;
        else {
            const alpha = this.int((Z - 1867216.25) / 36524.25);
            A = Z + 1 + alpha - this.int(alpha / 4);
        }
        const B = A + 1524;
        const C = this.int((B - 122.1) / 365.25);
        const D = this.int(C * 365.25);
        const E = this.int((B - D) / 30.6001);
        const day = this.int(B - D - this.int(E * 30.6001) + F);
        const month = E < 14 ? E - 1 : E - 13;
        const year = month < 3 ? C - 4715 : C - 4716;

        return new Date(year, month - 1, day);
    }

    private static int(n: number): number { return Math.floor(n); }

    private static mod(a: number, b: number): number {
        let remainder = a % b;
        if (remainder === 0) remainder = b;

        return remainder;
    }
}
