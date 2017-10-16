import test from 'ava';
import { merge, findMaxId } from './merge-options';

test('find max id', (t) => {
  const obj = {
    a__old0: 'new_a',
    a__old1: 'new_a',
    a__old5: 'new_a',
  };

  t.is(findMaxId(obj, 'a'), 5);
});

test('combine with non-object options throws error', (t) => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  t.throws(() => merge(target, null), /Options must be object/);
  t.throws(() => merge(target, undefined), /Options must be object/);
  t.throws(() => merge(target, () => {}), /Options must be object/);
  t.throws(() => merge(target, [1, 2, 3]), /Options must be object/);
});

test('smoke test', (t) => {
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

  t.deepEqual(merged, {
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

test('smoke test', (t) => {
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

  t.deepEqual(merged, {
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

test('merge with error', (t) => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  const options = new Error('some message');
  options.success = false;

  const merged = merge(target, options);

  t.deepEqual(merged, {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
    error: options,
  });
});

test('merge object with getters/setters', (t) => {
  const target = {
    get a() { return 'orig_a'; },
    get b() { return 'old_b_value_from_getter'; },
    set b(value) { t.fail('setter must be replaced'); },
  };

  const options = {
    a: 'new_a',
    b: 'new_b',
  };

  t.notThrows(() => {
    const merged = merge(target, options);

    t.deepEqual(merged, {
      a: 'new_a',
      b: 'new_b',
      a__old1: 'orig_a',
      b__old1: 'old_b_value_from_getter',
    });
  });
});

test('don\'t merge undefined properties', (t) => {
  const target = {
    a: 'orig_a',
    b: 'orig_b',
    c: 'orig_c',
  };

  const options = {
    a: 'new_a',
    b: undefined,
  };

  t.notThrows(() => {
    const merged = merge(target, options);

    t.deepEqual(merged, {
      a: 'new_a',
      b: 'orig_b',
      c: 'orig_c',
      a__old1: 'orig_a',
    });
  });
});
