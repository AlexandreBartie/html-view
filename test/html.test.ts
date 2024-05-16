import { test } from '@playwright/test';
import { WebBrowser } from '../src/webView';

const testCases = [
  { url: 'example.com/' },
  { url: 'practicetestautomation.com/practice-test-login/' },
  {
    url: 'practicetestautomation.com/practice-test-login/',
    scope: '#main-container'
  },
  {
    url: 'practicetestautomation.com/practice-test-login/',
    scope: '#username'
  },  
  {
    url: 'katalon-test.s3.amazonaws.com/aut/html/form.html',
    scope: '#infoForm'
  },
  {
    url: 'demoqa.com/automation-practice-form/',
    scope: '.practice-form-wrapper'
  }
];

test.describe('generateHierarchy function', () => {
  testCases.forEach((testCase, index) => {
    const testName = testCase.scope
      ? `get scope '${testCase.scope}' of '${testCase.url}' `
      : `get url '${testCase.url}'`;

    test(testName, async () => {
      const url = 'https://' + testCase.url;
      const browser = new WebBrowser();
      await browser.show(url, testCase.scope);
    });
  });

  test('review get list using playwright', async ({ page }) => {
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
