import { test } from '@playwright/test';
import { WebBrowser } from '../src/webView';

const web = new WebBrowser('sites');

const testCases = [
  {
    site: 'example',
    url: 'example.com/'
  },
  {
    site: 'practiceTest',
    url: 'practicetestautomation.com/practice-test-login/'
  },
  {
    site: 'practiceTest',
    url: 'practicetestautomation.com/practice-test-login/',
    scope: '#main-container',
    run: false,
  },
  {
    site: 'practiceTest',
    url: 'practicetestautomation.com/practice-test-login/',
    scope: '#username',
  },
  {
    site: 'katalonTest',
    url: 'katalon-test.s3.amazonaws.com/aut/html/form.html',
    scope: '#infoForm',
    run: true,
  },
  {
    site: 'demoQA',
    url: 'demoqa.com/automation-practice-form/',
    scope: '.practice-form-wrapper',
    run: false,
  }
];

const scopeTestCases = testCases.filter(testCase => testCase.run);

test.describe('open site', () => {
  scopeTestCases.forEach((testCase) => {
    const testName = testCase.scope
      ? `view scope '${testCase.scope}' of '${testCase.url}' `
      : `view url '${testCase.url}'`;

    let testFile = testCase.scope ? `scope_${testCase.scope}_` : '';

    testFile += `site_${testCase.site}.html`;

    test(testName, async ({page}) => {
      const url = 'https://' + testCase.url;
      await page.goto(url);
      const html = await page.content()
      const view = web.setView(html, testCase.scope);
      
      // List of types to check
      const tags = ['form', 'input', 'select', 'textarea', 'button', 'span', 'option'];
      const labels = ['label'];

     // 

      view.form.elements.show(`List of Elements:`, tags);
      view.form.elements.show(`List of Labels:`, labels);

      view.save(testFile);
    });
  });

  test.skip('refactor get list using playwright', async ({ page }) => {
    const url = 'https://practicetestautomation.com/practice-test-login/'; // 'chrome://version/'

    await page.goto(url);

    // Get the body element
    const body = page.locator('body');

    if (body) {
      // Find #main-container inside the body
      const main = body.locator('#main-container');

      const username = main.locator('#username');

      await username.fill('user-test');

      // Wait for a brief moment for any potential changes to take effect
      await page.waitForTimeout(1000);

      // Retrieve the input element handle
      const inputElementHandle = await username.elementHandle();

      if (inputElementHandle) {
        // Retrieve attributes using evaluateHandle function
        const attributes = await inputElementHandle.evaluate(
          (el: HTMLInputElement) => {
            return {
              tagName: el.tagName,
              value: el.value,
              type: el.type,
              title: el.title
            };
          }
        );
        // Log the retrieved attributes
        console.log('Tag:', attributes.tagName);
        console.log('Type:', attributes.type);
        console.log('Value:', attributes.value);
        console.log('Title:', attributes.title);
        console.log('====================');
      }
    }
  });
});
