const moment = require('moment-timezone');

const cities = [
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Sydney', timezone: 'Australia/Sydney' }
];

function displayClocks() {
    console.clear();
    console.log('World Clock\n');

    cities.forEach(city => {
        const time = moment().tz(city.timezone).format('YYYY-MM-DD HH:mm:ss');
        console.log(`${city.name.padEnd(10)}: ${time}`);
    });
}


setInterval(displayClocks, 1000);