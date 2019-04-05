import EError from './index';

test('construct error and combine', () => {
  expect(() => {
    const error = new EError('ErrMessage').combine({ success: false });
    expect(error instanceof Error).toBe(true);
    expect(error instanceof EError).toBe(true);
    expect(typeof error.stack).toBe('string');
    expect(error.message).toBe('ErrMessage');
    expect(error.success).toBe(false);
  }).not.toThrow();
});

test('construct error without message argument', () => {
  expect(() => {
    const error = new EError().combine({ success: false });
    expect(error instanceof Error).toBe(true);
    expect(error instanceof EError).toBe(true);
    expect(typeof error.stack).toBe('string');
    expect(error.message).toBe('');
    expect(error.success).toBe(false);

    const error2 = new EError();
    expect(error2 instanceof Error).toBe(true);
    expect(error2 instanceof EError).toBe(true);
    expect(typeof error2.stack).toBe('string');
    expect(error2.message).toBe('');
    expect(error2.success).toBe(undefined);
  }).not.toThrow();
});

test('combine error with error', () => {
  expect(() => {
    const err1 = new EError('SomeMessage').combine({ success: false });
    const error = new EError('ErrMessage').combine(err1);
    expect(error instanceof Error).toBe(true);
    expect(error instanceof EError).toBe(true);
    expect(typeof error.stack).toBe('string');
    expect(error.message).toBe('ErrMessage');
    expect(error.success).toBe(undefined);
    expect(error.error).toBe(err1);
    expect(error.error.success).toBe(err1.success);
  }).not.toThrow();
});

test('error name getted from class name', () => {
  class MyError extends EError { }

  expect((new MyError()).name).toBe('MyError');
});

test('wrap error from instance', () => {
  const eerror = new EError('Some error').combine({ port: 80, code: 'USED' });
  const typeError = new TypeError();
  const wrapped = eerror.wrap(typeError);
  expect(wrapped.name).toBe(typeError.name);
  expect(wrapped.stack).toBe(typeError.stack);
  expect(wrapped.message).toBe('Some error');
  expect(wrapped.port).toBe(80);
  expect(wrapped.code).toBe('USED');
});

test('static wrap error', () => {
  const error = new TypeError('Some error');
  const eerror = EError.wrap(error, { port: 100500 });
  expect(eerror.name).toBe('TypeError');
  expect(eerror.port).toBe(100500);
});

test('static wrap error doesn\' throw error on no options', () => {
  const error = new EError('Some error')
    .combine({ name: 'TypeError', port: 100500 });
  const wrapped = EError.wrap(error);
  expect(wrapped.name).toBe('TypeError');
  expect(wrapped.port).toBe(100500);
});

test('prepare error', () => {
  expect(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared('This will be rewrite').combine({ port: 42 });

    expect(error.name).toBe('SomePreparedError');
    expect(error.message).toBe('Prepared error');
    expect(error.port).toBe(42);
  }).not.toThrow();
});

test('prepared error by default instanceof EError', () => {
  expect(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared('This will be rewrite').combine({ port: 42 });

    expect(error instanceof Prepared).toBe(true);
    expect(error instanceof EError).toBe(true);
    expect(error.name).toBe('SomePreparedError');
    expect(error.message).toBe('Prepared error');
    expect(error.port).toBe(42);
  }).not.toThrow();
});

test('prepared error can extends of other error constructor', () => {
  class NewBaseError extends EError {}

  const Prepared = EError.prepare(NewBaseError, {
    message: 'Prepared error',
    name: 'SomePreparedError',
  });

  const error = new Prepared('This will be rewrite').combine({ port: 42 });

  expect(error instanceof Prepared).toBe(true);
  expect(error instanceof NewBaseError).toBe(true);
  expect(error instanceof EError).toBe(true);
  expect(error.name).toBe('SomePreparedError');
  expect(error.message).toBe('Prepared error');
  expect(error.port).toBe(42);
});

test('prepared error can extends only from child of EError', () => {
  class NewBaseError extends Error {}

  expect(() => {
    EError.prepare(NewBaseError, {
      message: 'Prepared error',
      name: 'SomePreparedError',
    });
  }).toThrowError(/Base class must be extended from EError/i);
});

test('prepare method throws error on invalid arguments', () => {
  class NewBaseError extends Error {}

  expect(() => {
    EError.prepare(NewBaseError);
  }).toThrowError(/Invalid arguments/i);
});

test('call constructor of prepared error without arguments', () => {
  expect(() => {
    const Prepared = EError.prepare({
      message: 'Prepared error',
      name: 'SomePreparedError',
    });

    const error = new Prepared();

    expect(error.name).toBe('SomePreparedError');
    expect(error.message).toBe('Prepared error');
  }).not.toThrow();
});

test('prepared error instance wrap', () => {
  expect(() => {
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

    expect(error.name).toBe('PortError');
    expect(error.message).toBe('Prepared error');
    expect(error.port).toBe(46);
    expect(error.type).toBe('number');
  }).not.toThrow();
});

test('prepared error static wrap', () => {
  expect(() => {
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

    expect(error.name).toBe(portError.name);
    expect(error.stack).toBe(portError.stack);
    expect(error.message).toBe('Prepared error');
    expect(error.port).toBe(42);
    expect(error.type).toBe('number');
  }).not.toThrow();
});
