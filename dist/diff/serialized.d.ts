import * as PlainOperational from './plain';
import * as JSONDiffPatch from 'jsondiffpatch';
/**
 * @description
 * Returns the changed value of the object.
 *
 * @param left any
 * @param right any
 */
export declare const diff: (left: any, right: any) => string | undefined;
/**
 * @description
 * Returns the changed values of the object.
 *
 * @param object any
 */
export declare const diffs: (object: any[]) => string[];
/**
 * @description
 * Returns the changed content in
 * JSON PATCH (RFC 6902) format.
 *
 * @param diff string
 * @param original any
 * @returns It returns JSON PATCH (RFC 6902)
 */
export declare const changelogs: (diff: string, original: any) => PlainOperational.IChangeLogs[] | undefined;
export interface IChangelogsFormattedOption {
    diff: string;
    original: any;
    format: 'console' | 'annotated' | 'html';
}
/**
 * @description
 * Returns the changed content in
 * human readable log form.
 *
 * @param option
 * @returns string
 */
export declare const changelogsFormatted: (option: IChangelogsFormattedOption) => string | undefined;
/**
 * @description
 * Applies changes to objects.
 *
 * @param left any
 * @param diff string
 */
export declare const patch: (left: any, diff: string) => any;
/**
 * @description
 * Applies multiple changes to objects.
 *
 * @param left any
 * @param diffs string[]
 */
export declare const patches: (object: any, diffs: string[]) => any;
/**
 * @description
 * Exclude changes from objects.
 *
 * @param right any
 * @param diff string
 */
export declare const unpatch: (right: any, diff: string) => any;
/**
 * @description
 * Exclude multiple changes from objects.
 *
 * @param right any
 * @param diffs string
 */
export declare const unpatches: (object: any, diffs: string[]) => any;
/**
 * @description
 * Reverse the diff order.
 *
 * @param diff string
 */
export declare const reverse: (diff: string) => JSONDiffPatch.Delta | undefined;
export declare const decodeDiff: (diff: string) => JSONDiffPatch.Delta | undefined;
export declare const decodeDiffs: (diffs: string[]) => JSONDiffPatch.Delta[] | undefined;
export declare const encodeDiff: (diff: JSONDiffPatch.Delta) => string | undefined;
export declare const encodeDiffs: (diffs: JSONDiffPatch.Delta[]) => string[] | undefined;
