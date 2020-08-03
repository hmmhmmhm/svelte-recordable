import * as Interface from '../interface';
export declare class Writable<T> implements Interface.Writable<T> {
    protected stop: Interface.Unsubscriber | null;
    protected subscribers: Array<Interface.SubscribeInvalidateTuple<T>>;
    protected value?: T;
    protected start: Interface.StartStopNotifier<T>;
    constructor(value?: T, start?: Interface.StartStopNotifier<T>);
    get(): any;
    set(newValue: T): void;
    update(callback: Interface.Updater<T>): void;
    subscribe(run: Interface.Subscriber<T>, invalidate?: Interface.Invalidator<T>): Interface.Unsubscriber;
}
