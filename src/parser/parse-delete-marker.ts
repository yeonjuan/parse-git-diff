import { isDeleteMarkerLine } from './utils';
import type Context from './context';

export default function parseDeleteMarker(context: Context): string | null {
  const line = context.getCurLine();

  if (line && isDeleteMarkerLine(line)) {
    context.nextLine();
    return line.replace('--- ', '').replace('a/', '');
  }
  return null;
}
