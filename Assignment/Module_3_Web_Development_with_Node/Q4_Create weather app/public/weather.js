

const dropDownCountry = document.getElementById("DROPDOWN_COUNTRY")
const dropDownStates = document.getElementById("DROPDOWN_STATES")
const dropDownCities = document.getElementById("DROPDOWN_CITIES")


async function loadCountries() {


    const response = await fetch('http://localhost:3000/countries');
    const countries = await response.json();
    countries.forEach(country => {
        const option = document.createElement('option');
        option.text = country.name;
        option.value = country.id; // You can set value as well if needed
        dropDownCountry.add(option);
    });


}


async function populateStates(){

    const response = await fetch('http://localhost:3000/states?country='+dropDownCountry.value);
    const states = await response.json();
    states.forEach(country => {
        const option = document.createElement('option');
        option.text = country.state;
        option.value = country.id; // You can set value as well if needed
        dropDownStates.add(option);
    });
}

async function populateCity(){
    const response = await fetch('http://localhost:3000/cities?state='+dropDownStates.value);

    const city = await response.json();
    city.forEach(states=>{
        const option = document.createElement('option');
        option.text=states.name;
        option.value=states.id;
        dropDownCities.add(option);
    })

    
}


loadCountries();

