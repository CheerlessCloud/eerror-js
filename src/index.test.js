import test from 'ava';
import EError from './index';

test('smoke test', (t) => {
  t.notThrows(() => {
    const error = new EError('Message', 'val1', { success: true });
    t.true(error instanceof Error);
    t.is(typeof error.stack, 'string');
    t.is(error.param1, 'val1');
    t.is(error.success, true);
  });
});

test('extend error object', (t) => {
  const error = new TypeError('Some error');
  const eerror = new EError(error, { port: 100500 });
  t.is(eerror.name, 'TypeError');
  t.is(eerror.port, 100500);
});

test('prepare error', (t) => {
  t.notThrows(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared('This will be rewrite', { port: 42 });

    t.is(error.name, 'SomePreparedError');
    t.is(error.message, 'Prepared error');
    t.is(error.port, 42);
  });
});

test('prepare error wrapp', (t) => {
  t.notThrows(() => {
    const typeError = new EError('', {
      name: 'TypeError',
      port: 46,
      type: 'number',
    });

    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared(typeError, { port: 42 });

    t.is(error.name, 'SomePreparedError');
    t.is(error.message, 'Prepared error');
    t.is(error.port, 42);
    t.is(error.type, 'number');
  });
});
