import * as JSONDiffPatch from 'jsondiffpatch'
import { CustomizedDiffPatch } from './diff'

/**
 * @description
 * Returns the changed value of the object.
 *
 * @param left any
 * @param right any
 */
export const diff = (left: any, right: any) => {
    return CustomizedDiffPatch.diff(left, right)
}

/**
 * @description
 * Returns the changed values of the object.
 *
 * @param object any
 */
export const diffs = (object: any[]) => {
    const diffs: JSONDiffPatch.Delta[] = []
    for (let i = 0; i < object.length - 1; i++) {
        const left = object[i]
        const right = object[i + 1]
        const diffObject = CustomizedDiffPatch.diff(left, right)
        if (diffObject) diffs.push(diffObject)
    }
    return diffs
}

export interface IChangeLogs {
    op: 'add' | 'remove' | 'replace' | 'move'
    path: string
    value: any
}

/**
 * @description
 * Returns the changed content in
 * JSON PATCH (RFC 6902) format.
 *
 * @param diff
 * @param original any
 * @returns It returns JSON PATCH (RFC 6902)
 */
export const changelogs = (diff: JSONDiffPatch.Delta, original: any) => {
    try {
        // @ts-ignore
        const result: IChangeLogs[] = JSONDiffPatch.formatters.jsonpatch.format(
            diff,
            original
        )
        if (!result) throw new Error()
        return result
    } catch (e) {
        return undefined
    }
}

export interface IChangelogsFormattedOption {
    diff: JSONDiffPatch.Delta
    original: any
    format: 'console' | 'annotated' | 'html'
}

/**
 * @description
 * Returns the changed content in
 * human readable log form.
 *
 * @param option
 * @returns string
 */
export const changelogsFormatted = (option: IChangelogsFormattedOption) => {
    let result: string | undefined = undefined
    try {
        switch (option.format) {
            case 'annotated':
                result = JSONDiffPatch.formatters.annotated.format(
                    option.diff,
                    option.original
                )
                break
            case 'console':
                result = JSONDiffPatch.formatters.console.format(
                    option.diff,
                    option.original
                )
                break
            case 'html':
                result = JSONDiffPatch.formatters.html.format(
                    option.diff,
                    option.original
                )
                break
        }
    } catch (e) {}
    return result
}

/**
 * @description
 * Applies changes to objects.
 *
 * @param left any
 * @param diff
 */
export const patch = (left: any, diff: JSONDiffPatch.Delta) => {
    return CustomizedDiffPatch.patch(left, diff)
}

/**
 * @description
 * Applies multiple changes to objects.
 *
 * @param left any
 * @param diffs
 */
export const patches = (object: any, diffs: JSONDiffPatch.Delta[]) => {
    let patched: any = object
    try {
        for (let diff of diffs)
            patched = CustomizedDiffPatch.patch(patched, diff)
    } catch (e) {
        return undefined
    }
    return patched
}

/**
 * @description
 * Exclude changes from objects.
 *
 * @param right any
 * @param diff
 */
export const unpatch = (right: any, diff: JSONDiffPatch.Delta) => {
    return CustomizedDiffPatch.unpatch(right, diff)
}

/**
 * @description
 * Exclude multiple changes from objects.
 *
 * @param right any
 * @param diff
 */
export const unpatches = (object: any, diffs: JSONDiffPatch.Delta[]) => {
    let patched: any = undefined
    try {
        for (let diff of diffs)
            patched = CustomizedDiffPatch.unpatch(patched, diff)
    } catch (e) {
        return undefined
    }
    return patched
}

/**
 * @description
 * Reverse the diff order.
 *
 * @param diff
 */
export const reverse = (diff: JSONDiffPatch.Delta) => {
    return CustomizedDiffPatch.reverse(diff)
}
