import * as Interface from '../interface';
export declare class Readable<T> implements Interface.Readable<T> {
    protected value?: T;
    protected start: Interface.StartStopNotifier<T>;
    protected _store: Interface.Writable<T>;
    constructor(value?: T, start?: Interface.StartStopNotifier<T>);
    get(): any;
    subscribe(run: Interface.Subscriber<T>, invalidate?: Interface.Invalidator<T>): Interface.Unsubscriber;
}
