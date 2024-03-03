const { Builder, By, Key, until } = require('selenium-webdriver');

async function successfulEmailLogin() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.id('email')).sendKeys('kesginkerem@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('kerem123', Key.RETURN);
    await driver.wait(until.urlContains('dashboard'), 10000); // Adjust based on your app's logic
    console.log('Successful email login test passed.');
  } finally {
    await driver.quit();
  }
}

successfulEmailLogin();
