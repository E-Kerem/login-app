const { Builder, By, Key, until } = require('selenium-webdriver');

async function successfulEmailLogin() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000');
    await driver.findElement(By.id('email')).sendKeys('kesginkerem@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('kerem123', Key.RETURN);
    console.log('Successful email login test passed.');
  } finally {
    await driver.quit();
  }
}

successfulEmailLogin();
