import test from 'ava';
import EError from './index';

test('eerror - smoke test', (t) => {
  t.notThrows(() => {
    const error = new EError('Message', 'val1', { success: true });
    t.true(error instanceof Error);
    t.is(typeof error.stack, 'string');
    t.is(error.param1, 'val1');
    t.is(error.success, true);
  });
});

test('eerror - extend error object', (t) => {
  const error = new TypeError('Some error');
  const eerror = new EError(error, { port: 100500 });
  t.is(eerror.name, 'TypeError');
  t.is(eerror.port, 100500);
});
