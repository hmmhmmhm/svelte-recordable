"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Utils = __importStar(require("../utils"));
var writable_1 = require("./writable");
var readable_1 = require("./readable");
var recordable_1 = require("./recordable");
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
exports.writable = function (value, start) {
    if (start === void 0) { start = Utils.noop; }
    return new writable_1.Writable(value, start);
};
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
exports.readable = function (value, start) {
    if (start === void 0) { start = Utils.noop; }
    return new readable_1.Readable(value, start);
};
function derived(stores, callback, initialValue) {
    var single = !Array.isArray(stores);
    var storesArray = single
        ? [stores]
        : stores;
    var auto = callback.length < 2;
    return exports.readable(initialValue, function (set) {
        var inited = false;
        var values = [];
        var pending = 0;
        var cleanup = Utils.noop;
        var sync = function () {
            if (pending)
                return;
            cleanup();
            var result = callback(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = Utils.isFunction(result) ? result : Utils.noop;
            }
        };
        var unsubscribers = storesArray.map(function (store, i) { return Utils.subscribe(store, function (value) {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, function () {
            pending |= (1 << i);
        }); });
        inited = true;
        sync();
        return function stop() {
            Utils.runAll(unsubscribers);
            cleanup();
        };
    });
}
exports.derived = derived;
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
exports.recordable = function (value, option) {
    return new recordable_1.Recordable({
        store: exports.writable(value),
        load: option === null || option === void 0 ? void 0 : option.load,
        save: option === null || option === void 0 ? void 0 : option.save,
        autostart: (option && option.autostart !== undefined) ? option.autostart : true,
        limit: option === null || option === void 0 ? void 0 : option.limit
    });
};
