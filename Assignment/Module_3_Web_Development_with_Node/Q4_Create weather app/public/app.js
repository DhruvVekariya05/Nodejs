document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const weatherForm = document.getElementById('weather-form');
    const weatherResult = document.getElementById('weather-result');

    // Fetch and populate countries
    axios.get('/api/countries').then(response => {
        response.data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    });

    // Fetch and populate states based on selected country
    countrySelect.addEventListener('change', () => {
        stateSelect.innerHTML = '<option value="">Select State</option>';
        citySelect.innerHTML = '<option value="">Select City</option>';
        axios.get(`/api/states/${countrySelect.value}`).then(response => {
            response.data.forEach(state => {
                const option = document.createElement('option');
                option.value = state.code;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
        });
    });

    // Fetch and populate cities based on selected state
    stateSelect.addEventListener('change', () => {
        citySelect.innerHTML = '<option value="">Select City</option>';
        axios.get(`/api/cities/${stateSelect.value}`).then(response => {
            response.data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        });
    });

    // Fetch and display weather based on selected city
    weatherForm.addEventListener('submit', event => {
        event.preventDefault();
        const city = citySelect.value;
        axios.get(`/api/weather/${city}`).then(response => {
            weatherResult.innerHTML = `
                <h2>Weather in ${city}</h2>
                <p>Temperature: ${response.data.main.temp}°C</p>
                <p>Weather: ${response.data.weather[0].description}</p>
            `;
        });
    });
});
