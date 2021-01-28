import {AnyAction} from "redux";

export abstract class ReduxAction<TReduxState> implements AnyAction
{
    readonly type: string;

    constructor()
    {
        this.type = this.constructor.name;
    }

    abstract updateReduxStore(clonedReduxState: TReduxState): TReduxState;
}