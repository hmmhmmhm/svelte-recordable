import * as Interface from '../interface'
import * as Utils from '../utils'
import { Writable } from './writable'

export class Readable<T> implements Interface.Readable<T> {
    protected value?: T
    protected start: Interface.StartStopNotifier<T>
    protected _store: Interface.Writable<T>

    constructor(value?: T, start: Interface.StartStopNotifier<T> = Utils.noop) {
        this.value = value
        this.start = start
        this._store = new Writable<T>(this.value, this.start)
    }
    get() {
        return Utils.getStoreValue(this)
    }
    subscribe(
        run: Interface.Subscriber<T>,
        invalidate?: Interface.Invalidator<T>
    ) {
        return this._store.subscribe(run, invalidate)
    }
}
