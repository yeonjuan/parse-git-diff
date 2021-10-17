import type Context from './context';

const UNHANDLED_EXTENDED_HEADERS = new Set([
  'index',
  'old',
  'new',
  'copy',
  'rename',
  'similarity',
  'dissimilarity',
]);

export default function parseExtendedHeader(ctx: Context) {
  const line = ctx.getCurLine();
  const type = line.slice(0, line.indexOf(' '));

  if (UNHANDLED_EXTENDED_HEADERS.has(type)) {
    ctx.nextLine();
    return {
      type: 'unhandled',
    };
  }
  switch (type) {
    case 'deleted':
      ctx.nextLine();
      return 'deleted';
  }
  return null;
}
