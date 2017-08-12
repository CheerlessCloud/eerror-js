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
