import { test } from '@playwright/test';
import { WebBrowser } from '../src/new';
test.describe('generateHierarchy function', () => {
  test('get list from <<example>>', async () => {
    const url = 'https://example.com/'; // 'chrome://version/'
    const browser = new WebBrowser();
    await browser.setup(url);
    browser.show();
  });

  test('get list from <<practice-test-login>>', async () => {
    const url = 'https://practicetestautomation.com/practice-test-login/'; // 'chrome://version/'
    const browser = new WebBrowser();
    await browser.setup(url);
    browser.show();
  });

  test('this get list from <<practice-test-login>> scope <<main-container>>', async () => {
    const url = 'https://practicetestautomation.com/practice-test-login/'; // 'chrome://version/'
    const browser = new WebBrowser();
    await browser.setup(url);
    browser.show('#main-container');
  });

  test('get list from <<practice-test-login>> scope <<form>>', async () => {
    const url = 'https://practicetestautomation.com/practice-test-login/'; // 'chrome://version/'
    const browser = new WebBrowser();
    await browser.setup(url);
    browser.show('#form');
  });

  test('get list using playwright', async ({ page }) => {
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
        const attributes = await inputElementHandle.evaluate((el: HTMLInputElement) => {
          return {
            tagName: el.tagName,
            value: el.value,
            type: el.type,
            title: el.title
          };
        });
        // Log the retrieved attributes
        console.log('Tag:', attributes.tagName);
        console.log('Type:', attributes.type);
        console.log('Value:', attributes.value);
        console.log('Title:', attributes.title);
        console.log('====================');
      }



      // const inputHTML = await username.elementHandle() as unknown as HTMLInputElement;

      // const tag = inputHTML.tagName
      // const value = inputHTML.value
      // const type = inputHTML.type
      // const title = inputHTML.title
 
      // console.log('Tag:', tag);
      // console.log('Type:', type);
      // console.log('Value:', value);            
      // console.log('Title:', title);
      // console.log('===============');
      //   let mainHTML = null;

      //   // Convert to HTMLElement
      //   if (main) {
      //     mainHTML = (await main.elementHandle()) as unknown as HTMLElement; // (node => node);

      //     // Do something with the mainContainerHTMLElement
      //     console.log(mainHTML.getAttribute('tagName'));

      //     // Do something with the mainContainerHTMLElement
      //     console.log(await main.inputValue());
      //   }
    }
  });
});
