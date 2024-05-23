import { test } from '@playwright/test';
import { WebBrowser } from '../src/webView';

test.describe('load sites', () => {

  const web = new WebBrowser('sites');

  const testCases = [
    {
      file: 'scope_infoForm_site_katalonTest',
      run: true,
    },
  ];
  
  const scopeTestCases = testCases.filter(testCase => testCase.run);

  scopeTestCases.forEach((testCase) => {

    let testFile = testCase.file + '.html';

    test(testFile, async ({}) => {
      const view = web.setLoad(testFile);
      
      view.form.elements.show(`List of Elements:`, web.tags);
      view.form.elements.show(`List of Labels:`, web.labels);

      view.save(testFile);
    });
  });

});
