import CBOR from 'cbor'
import * as PlainOperational from './plain'
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
    const _diff = PlainOperational.diff(left, right)
    if (!_diff) return _diff

    try {
        const cborEncoded = CBOR.encode(_diff)
        const compressed = cborEncoded.toString('base64')
        if (!compressed) throw new Error()

        return compressed
    } catch (e) {
        return undefined
    }
}

/**
 * @description
 * Returns the changed values of the object.
 *
 * @param object any
 */
export const diffs = (object: any[]) => {
    const diffs: string[] = []
    for (let i = 0; i < object.length - 1; i++) {
        const left = object[i]
        const right = object[i + 1]
        const diffObject = diff(left, right)
        if (diffObject) diffs.push(diffObject)
    }
    return diffs
}

/**
 * @description
 * Returns the changed content in
 * JSON PATCH (RFC 6902) format.
 *
 * @param diff string
 * @param original any
 * @returns It returns JSON PATCH (RFC 6902)
 */
export const changelogs = (diff: string, original: any) => {
    try {
        const _diff: JSONDiffPatch.Delta = CBOR.decode(
            Buffer.from(diff, 'base64')
        )
        return PlainOperational.changelogs(_diff, original)
    } catch (e) {
        return undefined
    }
}

export interface IChangelogsFormattedOption {
    diff: string
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
    try {
        const diff: JSONDiffPatch.Delta = CBOR.decode(
            Buffer.from(option.diff, 'base64')
        )
        return PlainOperational.changelogsFormatted({
            diff,
            format: option.format,
            original: option.original,
        })
    } catch (e) {
        return undefined
    }
}

/**
 * @description
 * Applies changes to objects.
 *
 * @param left any
 * @param diff string
 */
export const patch = (left: any, diff: string) => {
    try {
        const _diff: JSONDiffPatch.Delta = CBOR.decode(
            Buffer.from(diff, 'base64')
        )
        return CustomizedDiffPatch.patch(left, _diff)
    } catch (e) {
        return undefined
    }
}

/**
 * @description
 * Applies multiple changes to objects.
 *
 * @param left any
 * @param diffs string[]
 */
export const patches = (object: any, diffs: string[]) => {
    let patched: any = object
    try {
        for (let diff of diffs) {
            const _diff: JSONDiffPatch.Delta = CBOR.decode(
                Buffer.from(diff, 'base64')
            )
            patched = CustomizedDiffPatch.patch(patched, _diff)
        }
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
 * @param diff string
 */
export const unpatch = (right: any, diff: string) => {
    const _diff: JSONDiffPatch.Delta = CBOR.decode(Buffer.from(diff, 'base64'))
    return CustomizedDiffPatch.unpatch(right, _diff)
}

/**
 * @description
 * Exclude multiple changes from objects.
 *
 * @param right any
 * @param diffs string
 */
export const unpatches = (object: any, diffs: string[]) => {
    let patched: any = undefined
    try {
        for (let diff of diffs) {
            const _diff: JSONDiffPatch.Delta = CBOR.decode(
                Buffer.from(diff, 'base64')
            )
            patched = CustomizedDiffPatch.unpatch(patched, _diff)
        }
    } catch (e) {}
    return patched
}

/**
 * @description
 * Reverse the diff order.
 *
 * @param diff string
 */
export const reverse = (diff: string) => {
    try {
        const _diff: JSONDiffPatch.Delta = CBOR.decode(
            Buffer.from(diff, 'base64')
        )
        return CustomizedDiffPatch.reverse(_diff)
    } catch (e) {
        return undefined
    }
}

export const decodeDiff = (diff: string) => {
    try {
        const decoded: JSONDiffPatch.Delta = CBOR.decode(
            Buffer.from(diff, 'base64')
        )
        if (!decoded) throw new Error()
        return decoded
    } catch (e) {
        return undefined
    }
}

export const decodeDiffs = (diffs: string[]) => {
    let decodedDiffs: JSONDiffPatch.Delta[] = []
    try {
        for (let diff of diffs) {
            const decodedDiff = decodeDiff(diff)
            if (!decodedDiff) throw new Error()
            decodedDiffs.push(decodedDiff)
        }
        return decodedDiffs
    } catch (e) {
        return undefined
    }
}

export const encodeDiff = (diff: JSONDiffPatch.Delta) => {
    try {
        const encoded: string = CBOR.encode(diff).toString('base64')
        if (!encoded) throw new Error()
        return encoded
    } catch (e) {
        return undefined
    }
}

export const encodeDiffs = (diffs: JSONDiffPatch.Delta[]) => {
    let encodedDiffs: string[] = []
    try {
        for (let diff of diffs) {
            const encodedDiff = encodeDiff(diff)
            if (!encodedDiff) throw new Error()
            encodedDiffs.push(encodedDiff)
        }
        return encodedDiffs
    } catch (e) {
        return undefined
    }
}
