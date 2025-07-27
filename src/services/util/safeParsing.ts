export function safeJSONParse<T>(str: string) {
  try {
    // TODO: Better typechecking
    const jsonValue: T = JSON.parse(str);

    return jsonValue;
  } catch {
    return undefined;
  }
}
