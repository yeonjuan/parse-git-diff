import type Context from './context';

export default function parseChangeMarkers(context: Context): {
  deleted: string;
  added: string;
} | null {
  const deleted = parseMarker(context, '--- ')?.replace('a/', '');
  const added = parseMarker(context, '+++ ')?.replace('b/', '');
  return added && deleted ? { added, deleted } : null;
}

function parseMarker(context: Context, marker: string): string | null {
  const line = context.getCurLine();
  if (line?.startsWith(marker)) {
    context.nextLine();
    return line.replace(marker, '');
  }
  return null;
}
