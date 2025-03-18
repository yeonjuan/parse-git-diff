import type { Interface } from 'node:readline';

export function isAsyncGenerator(value: unknown): value is AsyncGenerator {
  return (
    typeof value === 'object' && value !== null && Symbol.asyncIterator in value
  );
}

export function isReadlineInterface(value: unknown): value is Interface {
  return (
    typeof value === 'object' &&
    value !== null &&
    Symbol.asyncIterator in value &&
    'getPrompt' in value
  );
}
