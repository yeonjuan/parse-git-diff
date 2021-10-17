import type Context from './context';

const UNHANDLED_EXTENDED_HEADERS = new Set([
  'index',
  'old',
  'copy',
  'rename',
  'similarity',
  'dissimilarity',
]);

const startsWith = (str: string, target: string) => {
  return str.indexOf(target) === 0;
};

export default function parseExtendedHeader(ctx: Context) {
  const line = ctx.getCurLine();
  const type = line.slice(0, line.indexOf(' '));

  if (UNHANDLED_EXTENDED_HEADERS.has(type)) {
    ctx.nextLine();
    return {
      type: 'unhandled',
    };
  }
  if (startsWith(line, 'deleted ')) {
    ctx.nextLine();
    return 'deleted';
  } else if (startsWith(line, 'new file ')) {
    ctx.nextLine();
    return 'new file';
  }

  return null;
}
