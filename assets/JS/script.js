let searchButton = document.getElementById('city-search-button');
let currentCityHdr = document.getElementById('current-city-header');
let daysContainer = document.getElementById('card-container');
let weatherDates = [];


let foundLat = "";
let foundLon = "";



searchButton.addEventListener('click', getLatLon);


// Handles getting Lat, Lon and preparing city and state to print page
function getLatLon() {
    let locationRequestedInput = document.getElementById('city-search');
    let locationRequested = locationRequestedInput.value;
    let locSplit = locationRequested.split(',').map(element => element.trim());
    console.log(locationRequested);
    console.log(locSplit);
    let stateArray = [];
    let checkThisLocation = '';


    if (locSplit[0] === '') {
        console.log('No Input')

        return
    }
    else {
        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + locationRequested + '&limit=5&appid=86550c0e40a947163465566121712e2e')
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("error")
                    return
                }

                return response.json();
            })
            .then(function (data) {
                foundLat = data[0].lat;
                foundLon = data[0].lon

                console.log(foundLat)
                console.log(foundLon)

                console.log(data);
                // Collecting all the states from the fetch response
                for (i = 0; i < data.length; i++) {
                    stateArray.push(data[i].state);
                }
                console.log(stateArray);

                // Converting all states to lowercase to check them
                let stateArrayLower = stateArray.map(element => {
                    return element.toLowerCase();
                })
                console.log(stateArrayLower);

                // converting input to lowercase
                if (locSplit[1]) {
                    let inputState = (locSplit[1].toLowerCase());

                    // Checking lowercase array against input
                    for (i = 0; i < stateArrayLower.length; i++) {
                        if (stateArrayLower[i] === inputState) {
                            printCity = data[i].name;
                            printState = data[i].state;


                            console.log(data[i].state);
                            break;
                        }
                    }


                    console.log(inputState);
                } else {
                    printCity = data[0].name;
                    printState = data[0].state;
                }

                console.log(printCity)
                console.log(printState)

                writeCurrentCity(printCity, printState)
            });
    }
}
// Handles Pringting city and state to page
function writeCurrentCity(currentCity, currentState) {
    if (currentState) {
        currentCityHdr.innerText = currentCity + ', ' + currentState;
    } else {
        currentCityHdr.innerText = currentCity;
    }
};

function writeCards() {

    // Creates the elements for each card
    let divEl = document.createElement('div');
    let h4El = document.createElement('h4');
    let iconEl = document.createElement('i');
    let ulEl = document.createElement('ul');
    let liElTemp = document.createElement('li');
    let liElWind = document.createElement('li');
    let liElHumidity = document.createElement('li');

    // Adds needed classes and id's to each element
    divEl.classList.add('box', 'card');
    divEl.setAttribute('id', 'forecast-card-' + [i]);
    h4El.setAttribute('id', 'forecast-date-' + [i]);
    iconEl.setAttribute('id', 'forecast-icon-' + [i]);
    ulEl.classList.add('forecast-ul');
    ulEl.setAttribute('forecast-ul-' + [i]);
    liElTemp.setAttribute('id', 'forecast-temp-' + [i]);
    liElWind.setAttribute('id', 'forecast-wind-' + [i]);
    liElHumidity.setAttribute('id', 'forecast-humidity-' + [i]);

    // Structures the whole card together
    divEl.appendChild(h4El);
    divEl.appendChild(iconEl);
    divEl.appendChild(ulEl);
    ulEl.appendChild(liElTemp);
    ulEl.appendChild(liElWind);
    ulEl.appendChild(liElHumidity);


};