const { Builder, By, until } = require('selenium-webdriver');

async function failedEmailLogin() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('http://localhost:3000');
      await driver.findElement(By.id('email')).sendKeys('user@example.com');
      await driver.findElement(By.id('password')).sendKeys('wrongpassword');
      await driver.findElement(By.css('button[type="submit"]')).click();
      console.log('Failed email login test passed.');
    } finally {
      await driver.quit();
    }
  }
  
  failedEmailLogin();
  