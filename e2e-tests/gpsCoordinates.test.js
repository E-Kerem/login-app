const { Builder, By, until } = require('selenium-webdriver');

async function testGPSAccuracy() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:3000/nearestSea');

        // Wait for the latitude and longitude elements to load and contain numeric values
        await driver.wait(async () => {
            const latitudeElement = await driver.findElement(By.id('latitude')).getText();
            const longitudeElement = await driver.findElement(By.id('longitude')).getText();
            return !latitudeElement.includes('Fetching...') && !longitudeElement.includes('Fetching...');
        }, 20000); // Waits up to 20 seconds for proper coordinates to be displayed

        // Get the latitude and longitude values
        const latitudeElement = await driver.findElement(By.id('latitude')).getText();
        const longitudeElement = await driver.findElement(By.id('longitude')).getText();

        // Get the actual latitude and longitude from the browser's geolocation API
        const { latitude, longitude } = await driver.executeScript(`
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve({ latitude: position.coords.latitude.toFixed(6), longitude: position.coords.longitude.toFixed(6) }),
                    error => reject(error)
                );
            });
        `);

        // Compare the displayed latitude and longitude with the actual values
        if (latitudeElement === latitude && longitudeElement === longitude) {
            console.log('Displayed latitude and longitude are correct.');
        } else {
            console.error('Displayed latitude and longitude are incorrect.');
        }
    } finally {
        await driver.quit();
    }
}

testGPSAccuracy();
