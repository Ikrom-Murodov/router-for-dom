/* eslint-disable operator-linebreak */

/**
 * This interface for an object whose keys and values must be a string.
 * @interface
 */
interface IIds {
  [kye: string]: string;
}

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

/**
 * @example
 * // returns {name: 'Ikrom'}
 * getId('/user/Ikrom', '/user/:name')
 * @param {string} simpleUrl
 * @param {string} dynamicUrl
 * @throws Throws an error if the arguments are not a string.
 * @return {Object} - An object whose keys and value are strings.
 */
export function getId(simpleUrl: string, dynamicUrl: string): IIds {
  if (typeof simpleUrl !== 'string') {
    throw new Error(
      `The simpleUrl should only be a string, not a ${typeof simpleUrl}`,
    );
  }

  if (typeof dynamicUrl !== 'string') {
    throw new Error(
      `The dynamicUrl should only be a string, not a ${typeof dynamicUrl}`,
    );
  }

  const dynamicUrlRegExp: RegExpMatchArray | null = dynamicUrl.match(/\/:/);
  const ids: IIds = {};

  if (dynamicUrlRegExp !== null) {
    const { index = 0 } = dynamicUrlRegExp;

    let id: RegExpMatchArray | string =
      dynamicUrl.slice(index + 2).match(/\//) || dynamicUrl.slice(index + 2);

    let value: RegExpMatchArray | string =
      simpleUrl.slice(index + 1).match(/\//) || simpleUrl.slice(index + 1);

    if (id && value) {
      if (typeof value !== 'string') {
        value = value.input?.slice(0, value.index) as string;
      }

      if (typeof id !== 'string') {
        id = id.input?.slice(0, id.index) as string;
      }

      ids[id] = value;
    }
  }

  return ids;
}
