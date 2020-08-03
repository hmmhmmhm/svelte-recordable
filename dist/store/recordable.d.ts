/// <reference types="node" />
import * as Interface from '../interface';
import { EventEmitter } from 'events';
export interface IRecordable<T> {
    undo: (diff?: T) => boolean;
    redo: (diff?: T) => boolean;
    startRecording: (limit?: number) => void;
    stopRecording: () => void;
    isRecording: () => boolean;
    load: (recordData?: Interface.IRecordData<T>) => Promise<boolean>;
    save: () => Promise<undefined | Interface.IRecordData<T>>;
    getRecords: () => string[] | undefined;
    clearRecords: () => void;
}
export interface IRecordableOption<T, StoreType> {
    store: Interface.Writable<StoreType>;
    load?: (recordData?: Interface.IRecordData<T>) => Promise<undefined | Interface.IRecordData<T>>;
    save?: (recordData: Interface.IRecordData<T>) => Promise<boolean>;
    autostart: boolean;
    limit?: number;
}
export interface IRecordableEvent {
    on(event: 'recordIndexChanged', listener: (currentRecordIndex: number, status: 'undo' | 'redo' | 'new' | 'calibrate') => void): this;
    on(event: 'recordsChanged', listener: (records: string[], status: 'new' | 'calibrate') => void): this;
    on(event: 'recordCleared', listener: (records: string[], currentRecordIndex: number) => void): this;
}
export declare class Recordable<StoreType> implements IRecordable<string> {
    protected option: IRecordableOption<string, StoreType>;
    protected records: string[];
    protected currentRecordIndex: number;
    protected stopRecorder?: Interface.Unsubscriber;
    protected beforeStoreValue: any;
    protected limit?: number;
    protected event: EventEmitter & IRecordableEvent;
    constructor(option: IRecordableOption<string, StoreType>);
    /**
     * Returns the value of the store.
     * @returns StoreValue
     * @example
     * store.get()
     */
    get(): StoreType;
    /**
     * Set the store value to that value.
     * @param newValue
     * @example
     * store.set(newValue)
     */
    set(newValue: StoreType): void;
    /**
     * Set the store value to that value without recording.
     * @param newValue
     * @example
     * store.setWithNoRecord(newValue)
     */
    setWithNoRecord(newValue: StoreType & {
        ____ignoreRecordByOperational: any;
    }): void;
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
    update(callback: Interface.Updater<StoreType>): void;
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
    updateWithNoRecord(callback: Interface.Updater<StoreType>): void;
    /**
     * When the value of the store is modified,
     * it sends the value through the callback.
     * @param run
     * @example
     * store.subscribe((storeValue) => {
     *     // console.log(storeValue)
     * })
     */
    subscribe(run: Interface.Subscriber<StoreType>, invalidate?: Interface.Invalidator<StoreType>): Interface.Unsubscriber;
    /**
     * Returns the store value to the previous value.
     * @param diff
     * @example
     * store.undo() // When reverting to recorded diff value
     * store.undo(diff) // When reverting to not recorded diff value
     */
    undo(diff?: string): boolean;
    /**
     * Returns to the original value before reverting.
     * @param diff
     * @example
     * store.redo() // When restoring to recorded diff value
     * store.redo(diff) // When restoring to not recorded diff value
     */
    redo(diff?: string): boolean;
    /**
     * This function check whether the store value
     * can be reverting to its previous value.
     * @example
     * store.isCanUndo()
     */
    isCanUndo(): boolean;
    /**
     * This function check whether the store value
     * can be reverting to its before reverting value.
     * @example
     * store.isCanRedo()
     */
    isCanRedo(): boolean;
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
    startRecording(limit?: number): void;
    /**
     * Stops recording changes in store values.
     * @example
     * store.stopRecording()
     */
    stopRecording(): void;
    /**
     * It returns whether changes in the
     * store are being recording.
     * @example
     * store.isRecording()
     */
    isRecording(): boolean;
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
    load(recordData?: Interface.IRecordData<string>): Promise<boolean>;
    /**
     * It will be return the save data of the store.
     * If a save callback is already declared at first time,
     * save callback will be automatically called.
     * @example
     * (async () => {
     *     let storeData = await store.save() // JSON Object
     * })()
     */
    save(): Promise<{
        records: string[];
        currentRecordIndex: number;
        storeValue: StoreType;
    }>;
    /**
     * Returns the values of changes recorded.
     * @returns string[]
     * @example
     * store.getRecords()
     */
    getRecords(): string[];
    /**
     * Returns the single value of changes recorded.
     * @returns string[]
     * @example
     * store.getRecords()
     */
    getRecord(index: number): string;
    /**
     * It returns the index value currently being referenced.
     * If undo has never occurred, index will be
     * refer to index that does not yet exist.
     * @example
     * store.getCurrentRecordIndex()
     */
    getCurrentRecordIndex(): number;
    /**
     * Initializes all records loaded on the object.
     *  @example
     * store.clearRecords()
     */
    clearRecords(): void;
    /**
     * It returns the event object.
     * @example
     * store.getEvent().on(...)
     */
    getEvent(): EventEmitter & IRecordableEvent;
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
    changelogs(diff: string, storeValue?: any): import("../diff/plain").IChangeLogs[] | undefined;
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
    changelogsFormatted(diff: string, format: 'annotated' | 'console' | 'html', storeValue?: any): string | undefined;
}
