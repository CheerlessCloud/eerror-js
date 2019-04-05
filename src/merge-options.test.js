import { merge, findMaxId } from './merge-options';

test('find max id', () => {
  const obj = {
    a__old0: 'new_a',
    a__old1: 'new_a',
    a__old5: 'new_a',
  };

  expect(findMaxId(obj, 'a')).toBe(5);
});

test('combine with non-object options throws error', () => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  expect(() => merge(target, null)).toThrowErrorMatchingInlineSnapshot(`"Options must be object"`);
  expect(() => merge(target, undefined)).toThrowErrorMatchingInlineSnapshot(
    `"Options must be object"`,
  );
  expect(() => merge(target, () => {})).toThrowErrorMatchingInlineSnapshot(
    `"Options must be object"`,
  );
  expect(() => merge(target, [1, 2, 3])).toThrowErrorMatchingInlineSnapshot(
    `"Options must be object"`,
  );
});

test('smoke test', () => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  const options = {
    a: 'new_a',
    b: 'new_b',
    c: 'new_c',
  };

  const options2 = {
    a: 'new_dup_a',
    b: 'new_dup_b',
    c: 'new_dup_c',
  };

  const merged = merge(merge(target, options), options2);

  expect(merged).toEqual({
    a: 'new_dup_a',
    b: 'new_dup_b',
    c: 'new_dup_c',
    a__old1: 'orig_a',
    b__old1: 'orig_b',
    c__old1: 'orig_c',
    a__old2: 'new_a',
    b__old2: 'new_b',
    c__old2: 'new_c',
  });
});

test('smoke test', () => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  const options = {
    a: 'new_a',
    b: 'new_b',
    c: 'new_c',
  };

  const options2 = {
    a: 'new_dup_a',
    b: 'new_dup_b',
    c: 'new_dup_c',
  };

  const merged = merge(merge(target, options), options2);

  expect(merged).toEqual({
    a: 'new_dup_a',
    b: 'new_dup_b',
    c: 'new_dup_c',
    a__old1: 'orig_a',
    b__old1: 'orig_b',
    c__old1: 'orig_c',
    a__old2: 'new_a',
    b__old2: 'new_b',
    c__old2: 'new_c',
  });
});

test('merge with error', () => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  const options = new Error('some message');
  options.success = false;

  const merged = merge(target, options);

  expect(merged).toEqual({
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
    error: options,
  });
});

test('merge object with getters/setters', done => {
  const target = {
    get a() {
      return 'orig_a';
    },
    get b() {
      return 'old_b_value_from_getter';
    },
    set b(value) {
      done.fail('setter must be replaced');
    },
  };

  const options = {
    a: 'new_a',
    b: 'new_b',
  };

  expect(() => {
    const merged = merge(target, options);

    expect(merged).toEqual({
      a: 'new_a',
      b: 'new_b',
      a__old1: 'orig_a',
      b__old1: 'old_b_value_from_getter',
    });
  }).not.toThrow();

  done();
});

test("don't merge undefined properties", () => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  const options = {
    a: 'new_a',
    b: undefined,
  };

  expect(() => {
    const merged = merge(target, options);

    expect(merged).toEqual({
      a: 'new_a',
      b: 'orig_b',
      c: 'orig_c',
      a__old1: 'orig_a',
    });
  }).not.toThrow();
});

test('should throw error when target not object', () => {
  const options = {
    a: 'new_a',
  };

  expect(() => merge(undefined, options)).toThrowErrorMatchingInlineSnapshot(
    `"Target must be object"`,
  );

  expect(() => merge(null, options)).toThrowErrorMatchingInlineSnapshot(`"Target must be object"`);

  expect(() => merge('string', options)).toThrowErrorMatchingInlineSnapshot(
    `"Target must be object"`,
  );
});
