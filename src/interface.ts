export type Subscriber<T> = (value: T) => void
export type Unsubscriber = () => void
export type Updater<T> = (value?: T) => T
export type Invalidator<T> = (value?: T) => void

export type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>]
export type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void

export interface Readable<T> {
    /**
     * Get value and inform subscribers.
     */
    get(): T
    /**
     * Subscribe on value changes.
     * @param run subscription callback
     * @param invalidate cleanup callback
     */
    subscribe(run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber
}

export interface Writable<T> extends Readable<T> {
    /**
     * Set value and inform subscribers.
     * @param value to set
     */
    set(value?: T): void

    /**
     * Update value using callback and inform subscribers.
     * @param updater callback
     */
    update(updater: Updater<T>): void
}

/** One or more `Readable`s. */
export type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>]

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends Readable<infer U>
    ? U
    : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never }

export interface IRecordData<T> {
    records: T[]
    currentRecordIndex: number
    storeValue: any
}
