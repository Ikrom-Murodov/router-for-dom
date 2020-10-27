/**
 * This function checks if there is a continuation after the forward slash.
 * @param {string} path - Path to check.
 * @throws Will throw an error if the argument is not string.
 * @return {boolean} - Will return true or false depending on the check.
 */
export function checkingPathToContinueAfterSlash(path: string = ''): boolean {
  if (typeof path !== 'string') {
    throw new Error(`The path should only be a string, not a ${typeof path}`);
  }

  const checkPath = path.slice(1).match(/\//);

  if (!checkPath) return false;

  const { index = 0, input = '' } = checkPath;

  if (!input[index + 1]) return false;

  return true;
}
