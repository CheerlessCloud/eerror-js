export = EError

declare class EError extends Error {
  [prop: string]: unknown;

  public combine(fields: Record<string, unknown>): EError
  public wrap<TError extends Partial<Error>>(error: TError): TError & { [prop: string]: unknown }

  public static wrap<TError extends Partial<Error>>(error: TError, fields: Record<string, unknown>): TError & { [prop: string]: unknown }

  public static prepare(baseClass: EErrorClass, fields: Record<string, unknown>): EErrorClass
  public static prepare(fields: Record<string, unknown>): EErrorClass
}

declare interface EErrorClass {
  new (message?: string): EError;
}
