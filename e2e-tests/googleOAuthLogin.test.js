const { Builder, By, until } = require('selenium-webdriver');

async function googleOAuthLogin() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('http://localhost:3000');
      await driver.findElement(By.css('button[data-testid="google-login-button"]')).click();
      // Further automation of OAuth flow is complex and not be feasible
      console.log('Google OAuth login initiated.');
    } finally {
      await driver.quit();
    }
  }
  
googleOAuthLogin();