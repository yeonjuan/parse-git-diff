import Context from './context';
import { Hunk } from './types';
import {
  isAdditionLine,
  isAdditionMarkerLine,
  isDeletionMarkerLine,
  isChunkHeader,
} from './utils';

export function parseAdditionMarker(context: Context) {
  const line = context.getCurLine();
  if (line && isAdditionMarkerLine(line)) {
    context.nextLine();
    return line.replace('+++ ', '').replace('b/', '');
  }
  return null;
}

export function parseDeletionMarker(context: Context) {
  const line = context.getCurLine();
  if (line && isDeletionMarkerLine(line)) {
    context.nextLine();
    return line.replace('--- ', '').replace('a/', '');
  }
  return null;
}

export function parseChangeMarkers(context: Context): {
  deleted: string;
  added: string;
} | null {
  const deleted = parseDeletionMarker(context);
  const added = parseAdditionMarker(context);

  if (!added || !deleted) {
    return null;
  }
  return {
    added,
    deleted,
  };
}

export function parseChunkHeader(
  context: Context
): Pick<Hunk, 'addedPos' | 'deletedPos'> | null {
  const line = context.getCurLine();
  if (!line || !isChunkHeader(line)) {
    return null;
  }

  const exec = /^@@\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@\s?/.exec(line);

  if (!exec) {
    return null;
  }

  const [all, delStart, delLines, addStart, addLines] = exec;

  const addedStart = parseInt(addStart, 10);
  const addedPos = {
    start: addedStart,
    lines: addLines === undefined ? addedStart : parseInt(addLines, 10),
  };

  const deletedStart = parseInt(delStart, 10);
  const deletedPos = {
    start: deletedStart,
    lines: delLines === undefined ? deletedStart : parseInt(delLines, 10),
  };

  return {
    addedPos,
    deletedPos,
  };
}
