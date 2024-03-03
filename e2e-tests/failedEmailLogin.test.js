async function failedEmailLogin() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('http://localhost:3000/login');
      await driver.findElement(By.id('email')).sendKeys('user@example.com');
      await driver.findElement(By.id('password')).sendKeys('wrongpassword');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.css('.error-message')), 10000); // Adjust based on how error messages are displayed
      console.log('Failed email login test passed.');
    } finally {
      await driver.quit();
    }
  }
  
  failedEmailLogin();
  