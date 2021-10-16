import Context from './context';

type Validator<Args extends any[] = any[]> = (...args: Args) => boolean;

function createBooleanTester<V extends Validator>(
  validator: V,
  result: boolean
) {
  return function validTester(cases: Parameters<V>[]): void {
    cases.forEach((c) => {
      expect(validator(...c)).toBe(result);
    });
  };
}

export function createValidTester<V extends Validator>(validator: V) {
  return createBooleanTester(validator, true);
}

export function createInvalidTester<V extends Validator>(validator: V) {
  return createBooleanTester(validator, false);
}

export function createContext(diff: string, initial: number = 1) {
  const context = new Context(diff);
  for (let i = 0; i < initial - 1; i++) {
    context.nextLine();
  }
  return context;
}
