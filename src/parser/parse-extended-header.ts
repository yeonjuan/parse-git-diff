import type Context from './context';

const UNHANDLED_EXTENDED_HEADERS = new Set([
  'index',
  'old',
  'copy',
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
    } as const;
  }
  if (startsWith(line, 'deleted ')) {
    ctx.nextLine();
    return {
      type: 'deleted',
    } as const;
  } else if (startsWith(line, 'new file ')) {
    ctx.nextLine();
    return {
      type: 'new file',
    } as const;
  } else if (startsWith(line, 'rename from ')) {
    ctx.nextLine();
    return {
      type: 'rename from',
      path: line.slice('rename from '.length),
    } as const;
  } else if (startsWith(line, 'rename to ')) {
    ctx.nextLine();
    return {
      type: 'rename to',
      path: line.slice('rename to '.length),
    } as const;
  }

  return null;
}
