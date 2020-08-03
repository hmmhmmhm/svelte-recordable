import * as Interface from '../interface'
import * as Utils from '../utils'
import { Writable } from './writable'
import { Readable } from './readable'
import { Recordable } from './recordable'

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export const writable = <T>(value: T, start: Interface.StartStopNotifier<T> = Utils.noop) => {
    return new Writable<T>(value, start)
}

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export const readable = <T>(value?: T, start: Interface.StartStopNotifier<T> = Utils.noop): Interface.Readable<T> => {
    return new Readable<T>(value, start)
}

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initialValue - when used asynchronously
 */
export function derived<S extends Interface.Stores, T>(
    stores: S,
    callback: (values: Interface.StoresValues<S>, set: (value: T) => void) => Interface.Unsubscriber | void,
    initialValue?: T
): Interface.Readable<T>

export function derived<T>(stores: Interface.Stores, callback: Function, initialValue?: T): Interface.Readable<T> {
    const single = !Array.isArray(stores)
    const storesArray: Array<Interface.Readable<any>> = single
        ? [stores as Interface.Readable<any>]
        : stores as Array<Interface.Readable<any>>

    const auto = callback.length < 2

    return readable<T>(initialValue, (set) => {
        let inited = false
        const values: T[] = []

        let pending = 0
        let cleanup = Utils.noop

        const sync = () => {
            if (pending) return
            cleanup()
            const result = callback(single ? values[0] : values, set)
            if (auto) {
                set(result as T)
            } else {
                cleanup = Utils.isFunction(result) ? result as Interface.Unsubscriber : Utils.noop
            }
        }

        const unsubscribers = storesArray.map((store, i) => Utils.subscribe(
            store,
            (value) => {
                values[i] = value
                pending &= ~(1 << i)
                if (inited) {
                    sync()
                }
            },
            () => {
                pending |= (1 << i)
            }),
        )

        inited = true
        sync()

        return function stop() {
            Utils.runAll(unsubscribers)
            cleanup()
        }
    })
}

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
export const recordable = <T>(
    value: T,
    option?: {
        load?: (recordData?: Interface.IRecordData<string>) => Promise<undefined | Interface.IRecordData<string>>,
        save?: (recordData: Interface.IRecordData<string>) => Promise<boolean>,
        autostart?: boolean,
        limit?: number
    }
) => {

    return new Recordable<T>({
        store: writable(value),
        load: option?.load,
        save: option?.save,
        autostart: (option && option.autostart !== undefined) ? option.autostart : true,
        limit: option?.limit,
    })
}