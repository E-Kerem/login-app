async function googleOAuthLogin() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('http://localhost:3000/login');
      await driver.findElement(By.css('button[onClick="handleSignInWithGoogle"]')).click();
      // Further automation of OAuth flow is complex and may not be feasible
      console.log('Google OAuth login initiated.');
    } finally {
      await driver.quit();
    }
  }
  