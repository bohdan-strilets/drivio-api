export function getCodeFromExceptionResponse(
  value: unknown,
): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const code = Object.getOwnPropertyDescriptor(value, 'code')?.value;
  return typeof code === 'string' ? code : undefined;
}
