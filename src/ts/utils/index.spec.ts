import {
  getId,
  checkingPathToContinueAfterSlash,
  compareASimpleUrlWithADynamicUrl,
} from './index';

test('checking the "getId" function.', () => {
  const result = getId('/user/Ikrom', '/user/:name');
  expect(result).toEqual({ name: 'Ikrom' });
});

test('checking the "checkingPathToContinueAfterSlash" function.', () => {
  expect(checkingPathToContinueAfterSlash('/user/Ikrom')).toBeTruthy();
  expect(checkingPathToContinueAfterSlash('/user')).toBeFalsy();
});

test('checking the "compareASimpleUrlWithADynamicUrl" function.', () => {
  const simpleUrl = '/user/Ikrom/Murodov/18';
  let dynamicUrl = '/user/:name/:surname/:age';

  const response = {
    comparisonResult: true,
    ids: {
      name: 'Ikrom',
      surname: 'Murodov',
      age: '18',
    },
  };

  expect(compareASimpleUrlWithADynamicUrl(simpleUrl, dynamicUrl)).toEqual(
    response,
  );

  response.comparisonResult = false;
  // eslint-disable-next-line
  // @ts-ignore
  delete response.ids.age;
  dynamicUrl = '/user/:name/:surname/contact';

  expect(compareASimpleUrlWithADynamicUrl(simpleUrl, dynamicUrl)).toEqual(
    response,
  );
});
