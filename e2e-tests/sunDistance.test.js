const { Builder, By, until } = require('selenium-webdriver');

async function testSunDistanceCalculation() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:3000/sunDistance');

        // Use explicit wait to ensure the distance calculation updates from "Calculating..."
        // Wait until the text changes and no longer contains "Calculating..."
        let distanceElement = await driver.wait(until.elementLocated(By.css('[data-testid="distance-to-sun"]')), 20000);
        await driver.wait(until.elementTextContains(distanceElement, 'km'), 20000); // Ensure it contains 'km' indicating calculation is done

        const displayedDistance = await distanceElement.getText();

        // Get the actual latitude and longitude from the browser's geolocation API
        const { latitude, longitude } = await driver.executeScript(`
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
                    error => reject(error)
                );
            });
        `);

        // Calculate the expected distance based on the retrieved coordinates
        const expectedDistance = calculateExpectedDistance(latitude, longitude);

        // Compare the displayed distance with the expected distance
        if (displayedDistance.includes(expectedDistance.toFixed(2))) {
            console.log('Displayed distance to the Sun\'s core is correct.');
        } else {
            console.error('Displayed distance to the Sun\'s core is incorrect.');
            console.error(`Expected: ${expectedDistance.toFixed(2)} km, Found: ${displayedDistance}`);
        }
    } finally {
        await driver.quit();
    }
}

function calculateDistanceToSun(latitude, longitude) {
    const date = new Date();
    const dayOfYear = getDayOfYear(date);
    const eccentricity = 0.0167;
    const semiMajorAxis = 149600000; 

    const distanceToSun = semiMajorAxis * (1 - eccentricity * Math.cos(2 * Math.PI * (dayOfYear - 3) / 365.25));

    const earthRadius = 6371;
    const timeOffset = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + longitude / 15) % 24;
    const angleFromSun = 2 * Math.PI * (timeOffset / 24);
    const distanceAdjustment = earthRadius * Math.cos(latitude * Math.PI / 180) * Math.sin(angleFromSun);

    return distanceToSun + distanceAdjustment; 
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Use this function in your Selenium test
function calculateExpectedDistance(latitude, longitude) {
    return calculateDistanceToSun(latitude, longitude);
}

testSunDistanceCalculation();
