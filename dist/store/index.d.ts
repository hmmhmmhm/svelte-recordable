import * as Interface from '../interface';
import { Writable } from './writable';
import { Recordable } from './recordable';
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export declare const writable: <T>(value: T, start?: Interface.StartStopNotifier<T>) => Writable<T>;
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export declare const readable: <T>(value?: T | undefined, start?: Interface.StartStopNotifier<T>) => Interface.Readable<T>;
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initialValue - when used asynchronously
 */
export declare function derived<S extends Interface.Stores, T>(stores: S, callback: (values: Interface.StoresValues<S>, set: (value: T) => void) => Interface.Unsubscriber | void, initialValue?: T): Interface.Readable<T>;
/**
 * Creates a store where changes are recorded.
 * @param {T}value initial value
 * @param option
 * @example
 * // Normal Usage
 * const store = Store.recordable<any>({})
 *
 * // Advanced Usage
 * const storeOption = {
 *     load: (recordData) => {}, // (optional)
 *     save: (recordData) => {}, // (optional)
 *     autostart: true, // (optional)
 *     limit: 10 // (optional)
 * }
 * const store = Store.recordable<any>(
 *     {}, // initial value
 *     storeOption,
 * )
 */
export declare const recordable: <T>(value: T, option?: {
    load?: ((recordData?: Interface.IRecordData<string> | undefined) => Promise<Interface.IRecordData<string> | undefined>) | undefined;
    save?: ((recordData: Interface.IRecordData<string>) => Promise<boolean>) | undefined;
    autostart?: boolean | undefined;
    limit?: number | undefined;
} | undefined) => Recordable<T>;
