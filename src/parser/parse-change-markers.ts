import parseDeleteMarker from './parse-delete-marker';
import parseAddMarker from './parse-add-marker';
import type Context from './context';

export default function parseChangeMarkers(context: Context): {
  deleted: string;
  added: string;
} | null {
  const deleted = parseDeleteMarker(context);
  const added = parseAddMarker(context);

  if (!added || !deleted) {
    return null;
  }
  return {
    added,
    deleted,
  };
}
