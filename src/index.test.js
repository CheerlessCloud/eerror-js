import test from 'ava';
import EError from './index';

test('construct error and combine', (t) => {
  t.notThrows(() => {
    const error = new EError('ErrMessage').combine({ success: false });
    t.true(error instanceof Error);
    t.true(error instanceof EError);
    t.is(typeof error.stack, 'string');
    t.is(error.message, 'ErrMessage');
    t.is(error.success, false);
  });
});

test('construct error without message argument', (t) => {
  t.notThrows(() => {
    const error = new EError().combine({ success: false });
    t.true(error instanceof Error);
    t.true(error instanceof EError);
    t.is(typeof error.stack, 'string');
    t.is(error.message, '');
    t.is(error.success, false);

    const error2 = new EError();
    t.true(error2 instanceof Error);
    t.true(error2 instanceof EError);
    t.is(typeof error2.stack, 'string');
    t.is(error2.message, '');
    t.is(error2.success, undefined);
  });
});

test('combine error with error', (t) => {
  t.notThrows(() => {
    const err1 = new EError('SomeMessage').combine({ success: false });
    const error = new EError('ErrMessage').combine(err1);
    t.true(error instanceof Error);
    t.true(error instanceof EError);
    t.is(typeof error.stack, 'string');
    t.is(error.message, 'ErrMessage');
    t.is(error.success, undefined);
    t.is(error.error, err1);
    t.is(error.error.success, err1.success);
  });
});

test('error name getted from class name', (t) => {
  class MyError extends EError { }

  t.is((new MyError()).name, 'MyError');
});

test('wrap error from instance', (t) => {
  const eerror = new EError('Some error').combine({ port: 80, code: 'USED' });
  const typeError = new TypeError();
  const wrapped = eerror.wrap(typeError);
  t.is(wrapped.name, typeError.name);
  t.is(wrapped.stack, typeError.stack);
  t.is(wrapped.message, 'Some error');
  t.is(wrapped.port, 80);
  t.is(wrapped.code, 'USED');
});

test('static wrap error', (t) => {
  const error = new TypeError('Some error');
  const eerror = EError.wrap(error, { port: 100500 });
  t.is(eerror.name, 'TypeError');
  t.is(eerror.port, 100500);
});

test('static wrap error doesn\' throw error on no options', (t) => {
  const error = new EError('Some error')
    .combine({ name: 'TypeError', port: 100500 });
  const wrapped = EError.wrap(error);
  t.is(wrapped.name, 'TypeError');
  t.is(wrapped.port, 100500);
});

test('prepare error', (t) => {
  t.notThrows(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared('This will be rewrite').combine({ port: 42 });

    t.is(error.name, 'SomePreparedError');
    t.is(error.message, 'Prepared error');
    t.is(error.port, 42);
  });
});

test('prepared error by default instanceof EError', (t) => {
  t.notThrows(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared('This will be rewrite').combine({ port: 42 });

    t.true(error instanceof Prepared);
    t.true(error instanceof EError);
    t.is(error.name, 'SomePreparedError');
    t.is(error.message, 'Prepared error');
    t.is(error.port, 42);
  });
});

test('prepared error can extends of other error constructor', (t) => {
  class NewBaseError extends EError {}

  const Prepared = EError.prepare(NewBaseError, {
    message: 'Prepared error',
    name: 'SomePreparedError',
  });

  const error = new Prepared('This will be rewrite').combine({ port: 42 });

  t.true(error instanceof Prepared);
  t.true(error instanceof NewBaseError);
  t.true(error instanceof EError);
  t.is(error.name, 'SomePreparedError');
  t.is(error.message, 'Prepared error');
  t.is(error.port, 42);
});

test('prepared error can extends only from child of EError', (t) => {
  class NewBaseError extends Error {}

  t.throws(() => {
    EError.prepare(NewBaseError, {
      message: 'Prepared error',
      name: 'SomePreparedError',
    });
  }, /Base class must be extended from EError/i, 'Base class must be extended from EError');
});

test('prepare method throws error on invalid arguments', (t) => {
  class NewBaseError extends Error {}

  t.throws(() => {
    EError.prepare(NewBaseError);
  }, /Invalid arguments/i);
});

test('call constructor of prepared error without arguments', (t) => {
  t.notThrows(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared();

    t.is(error.name, 'SomePreparedError');
    t.is(error.message, 'Prepared error');
  });
});

test('prepared error instance wrap', (t) => {
  t.notThrows(() => {
    const typeError = new EError().combine({
      name: 'PortError',
      port: 46,
      type: 'number',
    });

    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared().wrap(typeError);

    t.is(error.name, 'PortError');
    t.is(error.message, 'Prepared error');
    t.is(error.port, 46);
    t.is(error.type, 'number');
  });
});

test('prepared error static wrap', (t) => {
  t.notThrows(() => {
    const portError = new EError().combine({
      name: 'PortError',
      port: 46,
      type: 'number',
    });

    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = Prepared.wrap(portError, { port: 42 });

    t.is(error.name, portError.name);
    t.is(error.stack, portError.stack);
    t.is(error.message, 'Prepared error');
    t.is(error.port, 42);
    t.is(error.type, 'number');
  });
});
