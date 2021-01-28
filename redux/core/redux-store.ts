import {AnyAction, applyMiddleware, createStore, PreloadedState, Store} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import {createPlainObjectActionMiddleware} from "../middlewares/plain-object-action-middleware";

export class ReduxStore<TReduxState = undefined>
{
    private static singleInstance: ReduxStore;
    private reduxStore: Store;

    private constructor() { /* Singleton */ }

    static SingleInstance<T>(): ReduxStore<T>
    {
        if (!this.singleInstance)
        {
            this.singleInstance = new ReduxStore();
        }

        return this.singleInstance;
    }

    createReduxStore(rootSagaWatcher: () => Generator, initialReduxState: PreloadedState<TReduxState>): Store<TReduxState>
    {
        if (!this.reduxStore)
        {
            const plainObjectActionMiddleware = createPlainObjectActionMiddleware();
            const sagaMiddleware = createSagaMiddleware();
            this.reduxStore = createStore(
                (state: TReduxState, action: AnyAction): TReduxState =>
                {
                    if (!action.updateReduxStore)
                    {
                        return state;
                    }

                    const clonedState: TReduxState = {...state};
                    return action.updateReduxStore(clonedState);
                },
                initialReduxState,
                composeWithDevTools(applyMiddleware(plainObjectActionMiddleware, sagaMiddleware))
            );
            sagaMiddleware.run(rootSagaWatcher);
        }

        return this.reduxStore;
    }

    dispatch(action: AnyAction): void { this.reduxStore.dispatch(action); }

    getApplicationState(): TReduxState { return this.reduxStore.getState(); }
}
