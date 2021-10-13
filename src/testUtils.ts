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
