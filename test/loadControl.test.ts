import { test } from '@playwright/test';
import { WebBrowser } from '../src/webView';

test.describe('load controls', () => {

  const web = new WebBrowser('controls');

  const testCases = [
    {
      control: 'tag-radio',
      run: true,
    },
    {
      control: 'tag-checkbox',
      run: true,
    },
  ];
  
  const scopeTestCases = testCases.filter(testCase => testCase.run);

  scopeTestCases.forEach((testCase) => {

    let testFile = testCase.control + '.html';

    test(testFile, async ({}) => {
      const view = web.setLoad(testFile);   
      view.form.show(`List of Elements:`);
    });
  });

});
