export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export function successResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function errorResult<T>(
  error: string,
  fieldErrors?: Record<string, string>
): ActionResult<T> {
  return { success: false, error, fieldErrors };
}
