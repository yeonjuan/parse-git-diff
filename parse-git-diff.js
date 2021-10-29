(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.parseGitDiff = factory());
})(this, (function () { 'use strict';

    class Context {
        constructor(diff) {
            this.line = 1;
            this.lines = [];
            this.lines = diff.split('\n');
        }
        getCurLine() {
            return this.lines[this.line - 1];
        }
        nextLine() {
            this.line++;
            return this.getCurLine();
        }
        isEof() {
            return this.line > this.lines.length;
        }
    }

    const LineType = {
        Added: 'AddedLine',
        Deleted: 'DeletedLine',
        Unchanged: 'UnchangedLine',
    };
    const FileType = {
        Changed: 'ChangedFile',
        Added: 'AddedFile',
        Deleted: 'DeletedFile',
        Renamed: 'RenamedFile',
    };
    const ExtendedHeader = {
        Index: 'index',
        Old: 'old',
        Copy: 'copy',
        Similarity: 'similarity',
        Dissimilarity: 'dissimilarity',
        Deleted: 'deleted',
        NewFile: 'new file',
        RenameFrom: 'rename from',
        RenameTo: 'rename to',
    };
    const ExtendedHeaderValues = Object.values(ExtendedHeader);

    function parseGitDiff(diff) {
        const ctx = new Context(diff);
        const files = parseFileChanges(ctx);
        return {
            type: 'GitDiff',
            files,
        };
    }
    function parseFileChanges(ctx) {
        const changedFiles = [];
        while (!ctx.isEof()) {
            const changed = parseFileChange(ctx);
            if (!changed) {
                break;
            }
            changedFiles.push(changed);
        }
        return changedFiles;
    }
    function parseFileChange(ctx) {
        if (!isComparisonInputLine(ctx.getCurLine())) {
            return;
        }
        ctx.nextLine();
        let isDeleted = false;
        let isNew = false;
        let isRename = false;
        let pathBefore = '';
        let pathAfter = '';
        while (!ctx.isEof()) {
            const extHeader = parseExtendedHeader(ctx);
            if (!extHeader) {
                break;
            }
            if (extHeader.type === ExtendedHeader.Deleted)
                isDeleted = true;
            if (extHeader.type === ExtendedHeader.NewFile)
                isNew = true;
            if (extHeader.type === ExtendedHeader.RenameFrom) {
                isRename = true;
                pathBefore = extHeader.path;
            }
            if (extHeader.type === ExtendedHeader.RenameTo) {
                isRename = true;
                pathAfter = extHeader.path;
            }
        }
        const changeMarkers = parseChangeMarkers(ctx);
        const chunks = parseChunks(ctx);
        if (isDeleted && changeMarkers) {
            return {
                type: FileType.Deleted,
                chunks,
                path: changeMarkers.deleted,
            };
        }
        else if (isNew && changeMarkers) {
            return {
                type: FileType.Added,
                chunks,
                path: changeMarkers.added,
            };
        }
        else if (isRename) {
            return {
                type: FileType.Renamed,
                pathAfter,
                pathBefore,
                chunks,
            };
        }
        else if (changeMarkers) {
            return {
                type: FileType.Changed,
                chunks,
                path: changeMarkers.added,
            };
        }
        return;
    }
    function isComparisonInputLine(line) {
        return line.indexOf('diff') === 0;
    }
    function parseChunks(context) {
        const chunks = [];
        while (!context.isEof()) {
            const chunk = parseChunk(context);
            if (!chunk) {
                break;
            }
            chunks.push(chunk);
        }
        return chunks;
    }
    function parseChunk(context) {
        const chunkHeader = parseChunkHeader(context);
        if (!chunkHeader) {
            return;
        }
        if (chunkHeader.type === 'Normal') {
            const changes = parseChanges(context, chunkHeader.fromFileRange, chunkHeader.toFileRange);
            return Object.assign(Object.assign({}, chunkHeader), { type: 'Chunk', changes });
        }
        else if (chunkHeader.type === 'Combined' &&
            chunkHeader.fromFileRangeA &&
            chunkHeader.fromFileRangeB) {
            const changes = parseChanges(context, chunkHeader.fromFileRangeA.start < chunkHeader.fromFileRangeB.start
                ? chunkHeader.fromFileRangeA
                : chunkHeader.fromFileRangeB, chunkHeader.toFileRange);
            return Object.assign(Object.assign({}, chunkHeader), { type: 'CombinedChunk', changes });
        }
    }
    function parseExtendedHeader(ctx) {
        const line = ctx.getCurLine();
        const type = ExtendedHeaderValues.find((v) => line.startsWith(v));
        if (type) {
            ctx.nextLine();
        }
        if (type === ExtendedHeader.RenameFrom || type === ExtendedHeader.RenameTo) {
            return {
                type,
                path: line.slice(`${type} `.length),
            };
        }
        else if (type) {
            return {
                type,
            };
        }
        return null;
    }
    function parseChunkHeader(ctx) {
        const line = ctx.getCurLine();
        const normalChunkExec = /^@@\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@/.exec(line);
        if (!normalChunkExec) {
            const combinedChunkExec = /^@@@\s\-(\d+),?(\d+)?\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@@/.exec(line);
            if (!combinedChunkExec) {
                return null;
            }
            const [all, delStartA, delLinesA, delStartB, delLinesB, addStart, addLines,] = combinedChunkExec;
            ctx.nextLine();
            return {
                type: 'Combined',
                fromFileRangeA: getRange(delStartA, delLinesA),
                fromFileRangeB: getRange(delStartB, delLinesB),
                toFileRange: getRange(addStart, addLines),
            };
        }
        const [all, delStart, delLines, addStart, addLines] = normalChunkExec;
        ctx.nextLine();
        return {
            type: 'Normal',
            toFileRange: getRange(addStart, addLines),
            fromFileRange: getRange(delStart, delLines),
        };
    }
    function getRange(start, lines) {
        const startNum = parseInt(start, 10);
        return {
            start: startNum,
            lines: lines === undefined ? startNum : parseInt(lines, 10),
        };
    }
    function parseChangeMarkers(context) {
        var _a, _b;
        const deleted = (_a = parseMarker(context, '--- ')) === null || _a === void 0 ? void 0 : _a.replace('a/', '');
        const added = (_b = parseMarker(context, '+++ ')) === null || _b === void 0 ? void 0 : _b.replace('b/', '');
        return added && deleted ? { added, deleted } : null;
    }
    function parseMarker(context, marker) {
        const line = context.getCurLine();
        if (line === null || line === void 0 ? void 0 : line.startsWith(marker)) {
            context.nextLine();
            return line.replace(marker, '');
        }
        return null;
    }
    const CHAR_TYPE_MAP = {
        '+': LineType.Added,
        '-': LineType.Deleted,
        ' ': LineType.Unchanged,
    };
    function parseChanges(ctx, rangeBefore, rangeAfter) {
        const changes = [];
        let lineBefore = rangeBefore.start;
        let lineAfter = rangeAfter.start;
        while (!ctx.isEof()) {
            const line = ctx.getCurLine();
            const type = getLineType(line);
            if (!type) {
                break;
            }
            ctx.nextLine();
            let change;
            const content = line.slice(1);
            switch (type) {
                case LineType.Added: {
                    change = {
                        type,
                        lineAfter: lineAfter++,
                        content,
                    };
                    break;
                }
                case LineType.Deleted: {
                    change = {
                        type,
                        lineBefore: lineBefore++,
                        content,
                    };
                    break;
                }
                case LineType.Unchanged: {
                    change = {
                        type,
                        lineBefore: lineBefore++,
                        lineAfter: lineAfter++,
                        content,
                    };
                    break;
                }
            }
            changes.push(change);
        }
        return changes;
    }
    function getLineType(line) {
        return CHAR_TYPE_MAP[line[0]] || null;
    }

    return parseGitDiff;

}));
