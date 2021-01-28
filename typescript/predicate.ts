export class Predicate {
    static truthy(): boolean { return true; }

    static falsy(): boolean { return false; }
}

export type IPredicate<TParam1 = never, TParam2 = never, TParam3 = never, TParam4 = never, TParam5 = never, TParam6 = never> =
    (p1?: TParam1, p2?: TParam2, p3?: TParam3, p4?: TParam4, p5?: TParam5, p6?: TParam6) => boolean;
