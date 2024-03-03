const { Builder, By, until } = require('selenium-webdriver');

async function facebookOAuthLoginTest() {
  let driver = await new Builder().forBrowser('chrome').build(); // Ensure ChromeDriver is installed and in PATH
  try {
    await driver.get('http://localhost:3000'); // Adjust to your application's login URL

    const facebookLoginButton = driver.wait(until.elementLocated(By.css('button[data-testid="facebook-login-button"]')), 10000);
    facebookLoginButton.click();
  

    console.log('Facebook OAuth login page reached.');
  } catch (error) {
    console.error('Facebook OAuth login test failed:', error);
  } finally {
    await driver.quit(); // Close the browser
  }
}

facebookOAuthLoginTest();
