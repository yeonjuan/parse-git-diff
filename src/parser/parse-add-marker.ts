import { isAddMarkerLine } from './utils';
import Context from './context';

export default function parseAddMarker(context: Context): string | null {
  const line = context.getCurLine();

  if (line && isAddMarkerLine(line)) {
    context.nextLine();
    return line.replace('+++ ', '').replace('b/', '');
  }
  return null;
}
