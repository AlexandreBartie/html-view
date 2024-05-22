import { test } from '@playwright/test';
import { WebBrowser } from '../src/webView';

test.describe('load controls', () => {

  const web = new WebBrowser('controls');

  const testCases = [
    {
      file: 'radio',
      run: true,
    },
  ];
  
  const scopeTestCases = testCases.filter(testCase => testCase.run);

  scopeTestCases.forEach((testCase) => {

    let testFile = testCase.file + '.html';

    test(testFile, async ({}) => {
      const view = web.setLoad(testFile);
      
      view.elements.show(`List of Elements:`, web.tags);
      view.elements.show(`List of Labels:`, web.labels);

      view.save(testFile);
    });
  });

});
