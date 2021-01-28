import {Dispatch} from "react";
import {AnyAction, Middleware} from "redux";
import {ReduxAction, SagaAction} from "..";

export function createPlainObjectActionMiddleware<TReduxState>(): Middleware<AnyAction, TReduxState>
{
    return (): (next: Dispatch<AnyAction>) => (action: ReduxAction<TReduxState> | SagaAction) => void =>
        (next): (action: ReduxAction<TReduxState> | SagaAction) => void =>
            (action): void =>
            {
                let plainAction: AnyAction;
                if (action instanceof ReduxAction)
                {
                    plainAction = {
                        ...action,
                        updateReduxStore: (clonedState: TReduxState): TReduxState => action.updateReduxStore(clonedState)
                    };
                }
                else if (action instanceof SagaAction)
                {
                    plainAction = {
                        ...action,
                        doSideEffectWork: (): Generator => action.doSideEffectWork()
                    };
                }

                next(plainAction);
            };
}
