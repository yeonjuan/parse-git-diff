import { readFileSync } from 'fs';
import { resolve } from 'path';

export function getFixture(name: string): string {
  return readFileSync(
    resolve(process.cwd(), 'src', '__fixtures__', name),
    'utf-8'
  );
}
