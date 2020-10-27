/* eslint-disable operator-linebreak,@typescript-eslint/no-shadow,no-param-reassign */

/**
 * This interface for an object whose keys and values must be a string.
 * @interface
 */
interface IIds {
  [kye: string]: string;
}

/**
 * Checks a variable for type.
 * @param verifiable
 * @param type
 * @param message - a message that will be passed to the throw clause
 *  if the condition is not true
 */
function typeCheck(verifiable: unknown, type: string, message: string): void {
  if (typeof verifiable !== type) {
    throw new Error(message);
  }
}

/**
 * This function checks if there is a continuation after the forward slash.
 * @example
 * // returns true
 * checkingPathToContinueAfterSlash('/user/Ikrom');
 * @param {string} path - Path to check.
 * @throws Will throw an error if the argument is not string.
 * @return {boolean} - Will return true or false depending on the check.
 */
export function checkingPathToContinueAfterSlash(path: string = ''): boolean {
  typeCheck(
    path,
    'string',
    `The path should only be a string, not a ${typeof path}`,
  );

  const checkPath = path.slice(1).match(/\//);

  if (!checkPath) return false;

  const { index = 0, input = '' } = checkPath;

  if (!input[index + 1]) return false;

  return true;
}

/**
 * @example
 * // returns {name: 'Ikrom'}
 * getId('/user/Ikrom', '/user/:name');
 * @param {string} simpleUrl
 * @param {string} dynamicUrl
 * @throws Throws an error if the arguments are not a string.
 * @return {Object} - An object whose keys and value are strings.
 */
export function getId(simpleUrl: string, dynamicUrl: string): IIds {
  typeCheck(
    simpleUrl,
    'string',
    `The simpleUrl should only be a string, not a ${typeof simpleUrl}`,
  );

  typeCheck(
    dynamicUrl,
    'string',
    `The dynamicUrl should only be a string, not a ${typeof dynamicUrl}`,
  );

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

/**
 * This function compares a simple url to a dynamic url.
 *
 * @example
 * const dynamicUrl = '/user/:name/:surname/:age/contact/:email';
 * const simpleUrl = '/user/Ikrom/Murodov/18/contact/ikrommurodov2001@gmail.com';
 * const result = {
 *  comparisonResult: true,
 *    ids: {
 *      name: 'Ikrom',
 *      surname: 'Murodov',
 *      age: '18',
 *      email: 'ikrommurodov2001@gmail.com',
 *    },
 * };
 * compareASimpleUrlWithADynamicUrl(simpleUrl, dynamicUrl); // result
 *
 * @param {string} simpleUrl
 * @param {string} dynamicUrl
 * @throws Throws an error if the arguments are not a string.
 * @return {Object}
 */
function compareASimpleUrlWithADynamicUrl(
  simpleUrl: string,
  dynamicUrl: string,
): { comparisonResult: boolean; ids: IIds } {
  typeCheck(
    simpleUrl,
    'string',
    `The simpleUrl should only be a string, not a ${typeof simpleUrl}`,
  );

  typeCheck(
    dynamicUrl,
    'string',
    `The dynamicUrl should only be a string, not a ${typeof dynamicUrl}`,
  );

  let comparisonResult = false;
  let ids: IIds = {};

  function implementationComparison(
    simpleUrl: string,
    dynamicUrl: string,
  ): void {
    if (
      checkingPathToContinueAfterSlash(dynamicUrl) &&
      checkingPathToContinueAfterSlash(simpleUrl)
    ) {
      const dynamicUrlRegExp = dynamicUrl.match(/\/:/);

      if (dynamicUrlRegExp !== null) {
        const { index = 0 } = dynamicUrlRegExp;

        ids = { ...ids, ...getId(simpleUrl, dynamicUrl) };

        if (simpleUrl.slice(0, index) === dynamicUrl.slice(0, index)) {
          const simpleUrlRegExp = simpleUrl.slice(index + 1).match(/\//) || '';

          const regExp = /(\/:).+?(?=\/)/;

          dynamicUrl = dynamicUrl.slice(index);

          if (dynamicUrl.match(regExp)) {
            dynamicUrl = dynamicUrl.replace(regExp, '');
          } else if (simpleUrl.slice(index)) {
            dynamicUrl = '';
          }

          simpleUrl = simpleUrlRegExp
            ? simpleUrlRegExp?.input?.slice(simpleUrlRegExp?.index) || ''
            : '';

          implementationComparison(simpleUrl, dynamicUrl);
        }
      } else if (dynamicUrl === simpleUrl) {
        comparisonResult = true;
      }
    } else if (dynamicUrl === simpleUrl) {
      comparisonResult = true;
    } else if (
      dynamicUrl.match(/\/:/g)?.length === 1 &&
      dynamicUrl.match(/\//g)?.length === 1 &&
      simpleUrl.match(/\//g)?.length === 1
    ) {
      ids = { ...ids, ...getId(simpleUrl, dynamicUrl) };
      comparisonResult = true;
    }
  }

  implementationComparison(simpleUrl, dynamicUrl);

  return {
    ids,
    comparisonResult,
  };
}
