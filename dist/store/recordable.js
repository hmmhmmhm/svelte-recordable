"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var SerializedOperational = __importStar(require("../diff/serialized"));
var events_1 = require("events");
var Utils = __importStar(require("../utils"));
var Recordable = /** @class */ (function () {
    function Recordable(option) {
        this.records = [];
        this.currentRecordIndex = -1;
        this.event = new events_1.EventEmitter();
        this.option = option;
        if (this.option.autostart)
            this.startRecording(this.option.limit);
    }
    /**
     * Returns the value of the store.
     * @returns StoreValue
     * @example
     * store.get()
     */
    Recordable.prototype.get = function () {
        return this.option.store.get();
    };
    /**
     * Set the store value to that value.
     * @param newValue
     * @example
     * store.set(newValue)
     */
    Recordable.prototype.set = function (newValue) {
        this.option.store.set(newValue);
    };
    /**
     * Set the store value to that value without recording.
     * @param newValue
     * @example
     * store.setWithNoRecord(newValue)
     */
    Recordable.prototype.setWithNoRecord = function (newValue) {
        if (newValue) {
            newValue.____ignoreRecordByOperational = true;
        }
        this.option.store.set(newValue);
    };
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
    Recordable.prototype.update = function (callback) {
        this.option.store.update(callback);
    };
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
    Recordable.prototype.updateWithNoRecord = function (callback) {
        this.option.store.update(function () {
            var changedValue = callback();
            if (changedValue) {
                // @ts-ignore
                changedValue.____ignoreRecordByOperational = true;
            }
            return changedValue;
        });
    };
    /**
     * When the value of the store is modified,
     * it sends the value through the callback.
     * @param run
     * @example
     * store.subscribe((storeValue) => {
     *     // console.log(storeValue)
     * })
     */
    Recordable.prototype.subscribe = function (run, invalidate) {
        if (invalidate === void 0) { invalidate = Utils.noop; }
        return this.option.store.subscribe(run, invalidate);
    };
    /**
     * Returns the store value to the previous value.
     * @param diff
     * @example
     * store.undo() // When reverting to recorded diff value
     * store.undo(diff) // When reverting to not recorded diff value
     */
    Recordable.prototype.undo = function (diff) {
        if (!this.isCanUndo())
            return false;
        var storeValue = this.option.store.get();
        if (!storeValue)
            return false;
        if (diff) {
            try {
                var undoApplied = SerializedOperational.unpatch(storeValue, diff);
                this.setWithNoRecord(undoApplied);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        var recordDiff = this.records[--this.currentRecordIndex];
        if (!recordDiff)
            return false;
        this.event.emit('recordIndexChanged', this.currentRecordIndex, 'undo');
        try {
            var undoApplied = SerializedOperational.unpatch(storeValue, recordDiff);
            this.setWithNoRecord(undoApplied);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    /**
     * Returns to the original value before reverting.
     * @param diff
     * @example
     * store.redo() // When restoring to recorded diff value
     * store.redo(diff) // When restoring to not recorded diff value
     */
    Recordable.prototype.redo = function (diff) {
        if (!this.isCanRedo())
            return false;
        var storeValue = this.option.store.get();
        if (!storeValue)
            return false;
        if (diff) {
            try {
                var redoApplied = SerializedOperational.patch(storeValue, diff);
                this.setWithNoRecord(redoApplied);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        var recordDiff = this.records[this.currentRecordIndex++];
        if (!recordDiff)
            return false;
        this.event.emit('recordIndexChanged', this.currentRecordIndex, 'redo');
        try {
            var redoApplied = SerializedOperational.patch(storeValue, recordDiff);
            this.setWithNoRecord(redoApplied);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * This function check whether the store value
     * can be reverting to its previous value.
     * @example
     * store.isCanUndo()
     */
    Recordable.prototype.isCanUndo = function () {
        if (!this.isRecording())
            return false;
        return this.currentRecordIndex > 0;
    };
    /**
     * This function check whether the store value
     * can be reverting to its before reverting value.
     * @example
     * store.isCanRedo()
     */
    Recordable.prototype.isCanRedo = function () {
        if (!this.isRecording())
            return false;
        if (this.records.length == 0)
            return false;
        return this.currentRecordIndex < this.records.length;
    };
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
    Recordable.prototype.startRecording = function (limit) {
        var _this = this;
        this.stopRecording();
        this.limit = limit;
        this.stopRecorder = this.option.store.subscribe(function (changedStoreValue) {
            if (changedStoreValue &&
                typeof changedStoreValue['____ignoreRecordByOperational'] !=
                    'undefined') {
                delete changedStoreValue['____ignoreRecordByOperational'];
                return;
            }
            if (!_this.beforeStoreValue) {
                _this.beforeStoreValue = JSON.parse(JSON.stringify(changedStoreValue));
                return;
            }
            try {
                var diff = SerializedOperational.diff(_this.beforeStoreValue, changedStoreValue);
                _this.beforeStoreValue = JSON.parse(JSON.stringify(changedStoreValue));
                if (!diff)
                    return;
                if (_this.currentRecordIndex == -1) {
                    _this.currentRecordIndex = 1;
                }
                else if (_this.currentRecordIndex != _this.records.length) {
                    _this.records = _this.records.slice(0, _this.currentRecordIndex);
                    _this.currentRecordIndex += 1;
                }
                else {
                    _this.currentRecordIndex += 1;
                }
                _this.event.emit('recordIndexChanged', _this.currentRecordIndex, 'new');
                _this.records.push(diff);
                _this.event.emit('recordsChanged', _this.records, 'new');
                if (_this.limit) {
                    while (_this.limit < _this.records.length) {
                        _this.records.shift();
                        _this.event.emit('recordsChanged', _this.records, 'calibrate');
                        _this.currentRecordIndex -= 1;
                        _this.event.emit('recordIndexChanged', _this.currentRecordIndex, 'calibrate');
                    }
                }
            }
            catch (e) { }
        });
    };
    /**
     * Stops recording changes in store values.
     * @example
     * store.stopRecording()
     */
    Recordable.prototype.stopRecording = function () {
        if (this.stopRecorder != undefined) {
            this.stopRecorder();
            this.stopRecorder = undefined;
        }
    };
    /**
     * It returns whether changes in the
     * store are being recording.
     * @example
     * store.isRecording()
     */
    Recordable.prototype.isRecording = function () {
        return this.stopRecorder != undefined;
    };
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
    Recordable.prototype.load = function (recordData) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedRecords, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!recordData || !recordData.records)) return [3 /*break*/, 5];
                        if (!this.option.load)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.option.load()];
                    case 2:
                        loadedRecords = _a.sent();
                        if (!loadedRecords)
                            return [2 /*return*/, false];
                        this.records = loadedRecords.records;
                        this.currentRecordIndex = loadedRecords.currentRecordIndex;
                        this.setWithNoRecord(loadedRecords.storeValue);
                        return [2 /*return*/, true];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.records = recordData.records;
                        this.currentRecordIndex = recordData.currentRecordIndex;
                        this.setWithNoRecord(recordData.storeValue);
                        _a.label = 6;
                    case 6: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * It will be return the save data of the store.
     * If a save callback is already declared at first time,
     * save callback will be automatically called.
     * @example
     * (async () => {
     *     let storeData = await store.save() // JSON Object
     * })()
     */
    Recordable.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var saveData, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        saveData = {
                            records: this.records,
                            currentRecordIndex: this.currentRecordIndex,
                            storeValue: this.option.store.get()
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!this.option.save) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.option.save(saveData)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, saveData];
                }
            });
        });
    };
    /**
     * Returns the values of changes recorded.
     * @returns string[]
     * @example
     * store.getRecords()
     */
    Recordable.prototype.getRecords = function () {
        return this.records;
    };
    /**
     * Returns the single value of changes recorded.
     * @returns string[]
     * @example
     * store.getRecords()
     */
    Recordable.prototype.getRecord = function (index) {
        return this.records[index];
    };
    /**
     * It returns the index value currently being referenced.
     * If undo has never occurred, index will be
     * refer to index that does not yet exist.
     * @example
     * store.getCurrentRecordIndex()
     */
    Recordable.prototype.getCurrentRecordIndex = function () {
        return this.currentRecordIndex;
    };
    /**
     * Initializes all records loaded on the object.
     *  @example
     * store.clearRecords()
     */
    Recordable.prototype.clearRecords = function () {
        this.records = [];
        this.currentRecordIndex = -1;
        this.event.emit('recordCleared', this.records, this.currentRecordIndex);
    };
    /**
     * It returns the event object.
     * @example
     * store.getEvent().on(...)
     */
    Recordable.prototype.getEvent = function () {
        return this.event;
    };
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
    Recordable.prototype.changelogs = function (diff, storeValue) {
        if (storeValue !== undefined)
            return SerializedOperational.changelogs(diff, storeValue);
        return SerializedOperational.changelogs(diff, this.option.store.get());
    };
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
    Recordable.prototype.changelogsFormatted = function (diff, format, storeValue) {
        if (storeValue !== undefined)
            return SerializedOperational.changelogsFormatted({
                diff: diff,
                format: format,
                original: storeValue
            });
        return SerializedOperational.changelogsFormatted({
            diff: diff,
            format: format,
            original: this.option.store.get()
        });
    };
    return Recordable;
}());
exports.Recordable = Recordable;
