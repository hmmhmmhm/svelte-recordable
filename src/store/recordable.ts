import * as Interface from '../interface'
import * as SerializedOperational from '../diff/serialized'
import { EventEmitter } from 'events'
import * as Utils from '../utils'

export interface IRecordable<T> {
    undo: (diff?: T) => boolean
    redo: (diff?: T) => boolean
    startRecording: (limit?: number) => void
    stopRecording: () => void
    isRecording: () => boolean
    load: (recordData?: Interface.IRecordData<T>) => Promise<boolean>
    save: () => Promise<undefined | Interface.IRecordData<T>>
    getRecords: () => string[] | undefined
    clearRecords: () => void
}

export interface IRecordableOption<T, StoreType> {
    store: Interface.Writable<StoreType>
    load?: (
        recordData?: Interface.IRecordData<T>
    ) => Promise<undefined | Interface.IRecordData<T>>
    save?: (
        recordData: Interface.IRecordData<T>
    ) => Promise<boolean>
    autostart: boolean
    limit?: number
}

export interface IRecordableEvent {
    on(
        event: 'recordIndexChanged',
        listener: (
            currentRecordIndex: number,
            status: 'undo' | 'redo' | 'new' | 'calibrate'
        ) => void
    ): this

    on(
        event: 'recordsChanged',
        listener: (records: string[], status: 'new' | 'calibrate') => void
    ): this

    on(
        event: 'recordCleared',
        listener: (records: string[], currentRecordIndex: number) => void
    ): this
}

export class Recordable<StoreType> implements IRecordable<string> {
    protected option: IRecordableOption<string, StoreType>
    protected records: string[] = []
    protected currentRecordIndex: number = -1
    protected stopRecorder?: Interface.Unsubscriber
    protected beforeStoreValue: any
    protected limit?: number
    protected event: EventEmitter & IRecordableEvent = new EventEmitter()

    constructor(option: IRecordableOption<string, StoreType>) {
        this.option = option
        if (this.option.autostart) this.startRecording(this.option.limit)
    }

    /**
     * Returns the value of the store.
     * @returns StoreValue
     * @example
     * store.get()
     */
    get() {
        return this.option.store.get()
    }

    /**
     * Set the store value to that value.
     * @param newValue
     * @example
     * store.set(newValue)
     */
    set(newValue: StoreType) {
        this.option.store.set(newValue)
    }

    /**
     * Set the store value to that value without recording.
     * @param newValue
     * @example
     * store.setWithNoRecord(newValue)
     */
    setWithNoRecord(newValue: StoreType & { ____ignoreRecordByOperational }) {
        if (newValue) {
            newValue.____ignoreRecordByOperational = true
        }
        this.option.store.set(newValue)
    }

    /**
     * Update the store value through callback.
     * @param callback
     * @example
     * store.update((storeValue) => {
     *     // logic that transforms storeValue
     *     // should be contained here.
     *     return storeValue
     * })
     */
    update(callback: Interface.Updater<StoreType>) {
        this.option.store.update(callback)
    }

    /**
     * Update the store value through callback without recording.
     * @param callback
     * @example
     * store.updateWithNoRecord((storeValue) => {
     *     // logic that transforms storeValue
     *     // should be contained here.
     *     return storeValue
     * })
     */
    updateWithNoRecord(callback: Interface.Updater<StoreType>) {
        this.option.store.update(() => {
            const changedValue = callback()

            if (changedValue) {
                // @ts-ignore
                changedValue.____ignoreRecordByOperational = true
            }
            return changedValue
        })
    }

    /**
     * When the value of the store is modified,
     * it sends the value through the callback.
     * @param run
     * @example
     * store.subscribe((storeValue) => {
     *     // console.log(storeValue)
     * })
     */
    subscribe(
        run: Interface.Subscriber<StoreType>,
        invalidate: Interface.Invalidator<StoreType> = Utils.noop
    ) {
        return this.option.store.subscribe(run, invalidate)
    }

    /**
     * Returns the store value to the previous value.
     * @param diff
     * @example
     * store.undo() // When reverting to recorded diff value
     * store.undo(diff) // When reverting to not recorded diff value
     */
    undo(diff?: string) {
        if (!this.isCanUndo()) return false

        const storeValue = this.option.store.get()
        if (!storeValue) return false

        if (diff) {
            try {
                const undoApplied = SerializedOperational.unpatch(
                    storeValue,
                    diff
                )
                this.setWithNoRecord(undoApplied)
                return true
            } catch (e) {
                return false
            }
        }

        const recordDiff = this.records[--this.currentRecordIndex]
        if (!recordDiff) return false

        this.event.emit('recordIndexChanged', this.currentRecordIndex, 'undo')

        try {
            const undoApplied = SerializedOperational.unpatch(
                storeValue,
                recordDiff
            )
            this.setWithNoRecord(undoApplied)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    /**
     * Returns to the original value before reverting.
     * @param diff
     * @example
     * store.redo() // When restoring to recorded diff value
     * store.redo(diff) // When restoring to not recorded diff value
     */
    redo(diff?: string) {
        if (!this.isCanRedo()) return false

        const storeValue = this.option.store.get()
        if (!storeValue) return false

        if (diff) {
            try {
                const redoApplied = SerializedOperational.patch(
                    storeValue,
                    diff
                )
                this.setWithNoRecord(redoApplied)
                return true
            } catch (e) {
                return false
            }
        }

        const recordDiff = this.records[this.currentRecordIndex++]
        if (!recordDiff) return false

        this.event.emit('recordIndexChanged', this.currentRecordIndex, 'redo')

        try {
            const redoApplied = SerializedOperational.patch(
                storeValue,
                recordDiff
            )
            this.setWithNoRecord(redoApplied)
            return true
        } catch (e) {
            return false
        }
    }

    /**
     * This function check whether the store value
     * can be reverting to its previous value.
     * @example
     * store.isCanUndo()
     */
    isCanUndo() {
        if (!this.isRecording()) return false
        return this.currentRecordIndex > 0
    }

    /**
     * This function check whether the store value
     * can be reverting to its before reverting value.
     * @example
     * store.isCanRedo()
     */
    isCanRedo() {
        if (!this.isRecording()) return false
        if (this.records.length == 0) return false
        return this.currentRecordIndex < this.records.length
    }

    /**
     * It will be start the recording
     * of the changing value of the store.
     *
     * @param limit number
     * @example
     * store.startRecording()
     *
     * // Record the number of records
     * // with a limit of the given number.
     * store.startRecording(limit)
     */
    startRecording(limit?: number) {
        this.stopRecording()
        this.limit = limit
        this.stopRecorder = this.option.store.subscribe((changedStoreValue) => {
            if (
                changedStoreValue &&
                typeof changedStoreValue['____ignoreRecordByOperational'] !=
                'undefined'
            ) {
                delete changedStoreValue['____ignoreRecordByOperational']
                return
            }
            if (!this.beforeStoreValue) {
                this.beforeStoreValue = JSON.parse(
                    JSON.stringify(changedStoreValue)
                )
                return
            }
            try {
                const diff = SerializedOperational.diff(
                    this.beforeStoreValue,
                    changedStoreValue
                )
                this.beforeStoreValue = JSON.parse(
                    JSON.stringify(changedStoreValue)
                )
                if (!diff) return

                if (this.currentRecordIndex == -1) {
                    this.currentRecordIndex = 1
                } else if (this.currentRecordIndex != this.records.length) {
                    this.records = this.records.slice(
                        0,
                        this.currentRecordIndex
                    )
                    this.currentRecordIndex += 1
                } else {
                    this.currentRecordIndex += 1
                }
                this.event.emit(
                    'recordIndexChanged',
                    this.currentRecordIndex,
                    'new'
                )

                this.records.push(diff)
                this.event.emit('recordsChanged', this.records, 'new')

                if (this.limit) {
                    while (this.limit < this.records.length) {
                        this.records.shift()
                        this.event.emit(
                            'recordsChanged',
                            this.records,
                            'calibrate'
                        )
                        this.currentRecordIndex -= 1
                        this.event.emit(
                            'recordIndexChanged',
                            this.currentRecordIndex,
                            'calibrate'
                        )
                    }
                }
            } catch (e) { }
        })
    }

    /**
     * Stops recording changes in store values.
     * @example
     * store.stopRecording()
     */
    stopRecording() {
        if (this.stopRecorder != undefined) {
            this.stopRecorder()
            this.stopRecorder = undefined
        }
    }

    /**
     * It returns whether changes in the
     * store are being recording.
     * @example
     * store.isRecording()
     */
    isRecording() {
        return this.stopRecorder != undefined
    }

    /**
     * Load the data into the store.
     * @param recordData
     * @example
     * (async () => {
     *     await store.load({
     *          records, // string[]
     *          currentRecordIndex, // number
     *          storeValue, // any
     *     })
     * })()
     */
    async load(recordData?: Interface.IRecordData<string>) {
        if (!recordData || !recordData.records) {
            if (!this.option.load) return false
            try {
                const loadedRecords = await this.option.load()
                if (!loadedRecords) return false

                this.records = loadedRecords.records
                this.currentRecordIndex = loadedRecords.currentRecordIndex
                this.setWithNoRecord(loadedRecords.storeValue)
                return true
            } catch (e) {
                return false
            }
        } else {
            this.records = recordData.records
            this.currentRecordIndex = recordData.currentRecordIndex
            this.setWithNoRecord(recordData.storeValue)
        }
        return true
    }

    /**
     * It will be return the save data of the store.
     * If a save callback is already declared at first time,
     * save callback will be automatically called.
     * @example
     * (async () => {
     *     let storeData = await store.save() // JSON Object
     * })()
     */
    async save() {
        const saveData = {
            records: this.records,
            currentRecordIndex: this.currentRecordIndex,
            storeValue: this.option.store.get(),
        }

        try {
            if (this.option.save) await this.option.save(saveData)
        } catch (e) { }
        return saveData
    }

    /**
     * Returns the values of changes recorded.
     * @returns string[]
     * @example
     * store.getRecords()
     */
    getRecords() {
        return this.records
    }

    /**
     * Returns the single value of changes recorded.
     * @returns string[]
     * @example
     * store.getRecords()
     */
    getRecord(index: number) {
        return this.records[index]
    }

    /**
     * It returns the index value currently being referenced.
     * If undo has never occurred, index will be
     * refer to index that does not yet exist.
     * @example
     * store.getCurrentRecordIndex()
     */
    getCurrentRecordIndex() {
        return this.currentRecordIndex
    }

    /**
     * Initializes all records loaded on the object.
     *  @example
     * store.clearRecords()
     */
    clearRecords() {
        this.records = []
        this.currentRecordIndex = -1
        this.event.emit('recordCleared', this.records, this.currentRecordIndex)
    }

    /**
     * It returns the event object.
     * @example
     * store.getEvent().on(...)
     */
    getEvent() {
        return this.event
    }
    /**
     * It returns interpreted history of changes in the object.
     * @param diff
     * @param storeValue
     * @example
     * const changelogs = store.changelogs(diff)
     *
     * // If want to compare diffs with
     * // objects at a specific point in time.
     * const changelogs = store.changelogs(diff, storeValue)
     */
    changelogs(diff: string, storeValue?: any) {
        if (storeValue !== undefined)
            return SerializedOperational.changelogs(diff, storeValue)
        return SerializedOperational.changelogs(diff, this.option.store.get())
    }
    /**
     * It returns interpreted history of changes in the object.
     * You can get the value of the desired format.
     * @param diff
     * @param storeValue
     * @example
     * const changelogs = store.changelogsFormatted(diff, 'console')
     *
     * // If want to compare diffs with
     * // objects at a specific point in time.
     * const changelogs = store.changelogsFormatted(diff, 'html', storeValue)
     */
    changelogsFormatted(
        diff: string,
        format: 'annotated' | 'console' | 'html',
        storeValue?: any
    ) {
        if (storeValue !== undefined)
            return SerializedOperational.changelogsFormatted({
                diff,
                format,
                original: storeValue,
            })
        return SerializedOperational.changelogsFormatted({
            diff,
            format,
            original: this.option.store.get(),
        })
    }
}
