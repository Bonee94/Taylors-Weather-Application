let searchButton = document.getElementById('city-search-button');
let currentCityHdr = document.getElementById('current-city-header');
let daysContainer = document.getElementById('card-container');
let searchHistoryEl = document.getElementById('search-history-list');
let historyStored = [];
let degreeSym = "\u00B0";


let clearCities = document.getElementById('city-clear-button')
clearCities.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.setItem('City and State', JSON.stringify());
})

let foundLat = "";
let foundLon = "";

function init(locationRequested) {

    let stateArray = [];
    let locSplit = locationRequested.split(',').map(element => element.trim());


    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + locationRequested + '&limit=5&appid=86550c0e40a947163465566121712e2e')
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
                        foundLat = data[i].lat;
                        foundLon = data[i].lon;

                        break;
                    }
                }
            } else {
                printCity = data[0].name;
                printState = data[0].state;
                foundLat = data[0].lat;
                foundLon = data[0].lon
            }

            console.log(printCity)
            console.log(printState)
            console.log(foundLat)
            console.log(foundLon)

            writeCurrentCityLocalLogless(printCity, printState)
            getCurrentWeather(foundLat, foundLon)
            getWeatherData(foundLat, foundLon)
        });
}
init('san antonio, texas')

let citySearchInput = document.querySelector('#city-search')
citySearchInput.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
        searchButton.click();
        getLatLon;

    }
});
searchButton.addEventListener('click', getLatLon);


// Handles getting Lat, Lon and preparing city and state to print page
function getLatLon() {
    let locationRequestedInput = document.getElementById('city-search');
    let locationRequested = locationRequestedInput.value;
    let locSplit = locationRequested.split(',').map(element => element.trim());
    console.log(locationRequested);
    console.log(locSplit);
    let stateArray = [];


    if (locSplit[0] === '') {
        console.log('No Input')

        return
    }
    else {
        fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + locationRequested + '&limit=5&appid=86550c0e40a947163465566121712e2e')
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("error")
                    return
                }

                return response.json();
            })
            .then(function (data) {

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

                let printState = "";
                let printCity = "";
                // converting input to lowercase
                if (locSplit[1]) {
                    let inputState = (locSplit[1].toLowerCase());

                    // Checking lowercase array against input
                    for (i = 0; i < stateArrayLower.length; i++) {
                        if (stateArrayLower[i] === inputState) {
                            printCity = data[i].name;
                            printState = data[i].state;
                            foundLat = data[i].lat;
                            foundLon = data[i].lon;

                            break;
                        }
                    }
                } else {
                    printCity = data[0].name;
                    printState = data[0].state;
                    foundLat = data[0].lat;
                    foundLon = data[0].lon
                };

                console.log(printCity);
                console.log(printState);
                console.log(foundLat);
                console.log(foundLon);

                writeCurrentCity(printCity, printState);
                getCurrentWeather(foundLat, foundLon);
                getWeatherData(foundLat, foundLon);
                locationRequestedInput.value = "";
            });
    }
}

// Takes the Lat and Lon and retreives the current weather
function getCurrentWeather(latInc, lonInc) {

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latInc + '&lon=' + lonInc + '&units=imperial&appid=86550c0e40a947163465566121712e2e')
        .then(function (response) {
            if (response.status !== 200) {
                console.log('weather api error')
            }
            return response.json();
        })
        .then(function (data) {
            let curTemp = data.main.temp;
            let curWind = data.wind.speed;
            let curHumidity = data.main.humidity;
            let iconCurrent = data.weather[0].main;

            console.log(iconCurrent);



            writeCurrentCityWeather(curTemp, curWind, curHumidity, iconCurrent)
        })
};


// Takes the Lat and Lon and retreives the weather forecast
function getWeatherData(latInc, lonInc) {
    let syncNum = 7;

    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + latInc + '&lon=' + lonInc + '&units=imperial&appid=86550c0e40a947163465566121712e2e')
        .then(function (response) {
            if (response.status !== 200) {
                console.log('weather api error')
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            for (let i = 0; i < 5; i++) {

                let dateArray = data.list[syncNum].dt_txt.split(' ')[0].split('-');
                let timeSplit = data.list[syncNum].dt_txt.split(' ')[1].split(':')[0].split('')[1];
                let time = timeSplit + 'am';
                let date = (dateArray[1] + '/' + dateArray[2]) + '/' + dateArray[0];
                let temp = data.list[syncNum].main.temp + ' F' + degreeSym;
                let wind = data.list[syncNum].wind.speed + ' mph';
                let humidity = data.list[syncNum].main.humidity + '%';
                let icon = data.list[syncNum].weather[0].main;



                console.log(date, temp, wind, time, icon);
                syncNum = syncNum + 8;

                writeForecast(date, temp, wind, humidity, [i], icon)

            }

        })
};

// Handles Pringting city and state to page
function writeCurrentCity(currentCity, currentState) {
    if (currentState) {
        currentCityHdr.innerText = currentCity + ', ' + currentState + ' (Current Weather)';
    } else {
        currentCityHdr.innerText = currentCity + ' (Current Weather)';
    }

    let cityState = (currentCity + ", " + currentState);
    console.log(cityState);
    getSearchHistory(cityState)
};

// Handles Pringting city upon init without saving anything to local storage
function writeCurrentCityLocalLogless(currentCity, currentState) {
    if (currentState) {
        currentCityHdr.innerText = currentCity + ', ' + currentState + ' (Current Weather)';
    } else {
        currentCityHdr.innerText = currentCity + ' (Current Weather)';
    }

    let cityState = (currentCity + ", " + currentState);
    console.log(cityState);
};

// Prints the 5-Day forecast cards to the page
function writeCards() {
    for (i = 0; i < 5; i++) {
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
        ulEl.setAttribute('id', 'forecast-ul-' + [i]);
        liElTemp.setAttribute('id', 'forecast-temp-' + [i]);
        liElWind.setAttribute('id', 'forecast-wind-' + [i]);
        liElHumidity.setAttribute('id', 'forecast-humidity-' + [i]);

        // Structures the whole card together
        daysContainer.appendChild(divEl)
        divEl.appendChild(h4El);
        divEl.appendChild(iconEl);
        divEl.appendChild(ulEl);
        ulEl.appendChild(liElTemp);
        ulEl.appendChild(liElWind);
        ulEl.appendChild(liElHumidity);
    }

};
writeCards()

// Writes the current weather to the main section
function writeCurrentCityWeather(curTemp, curWind, curHumidity, iconCurrent) {
    let currentTempEl = document.getElementById('current-city-temp');
    let currentWindEl = document.getElementById('current-city-wind');
    let currentHumidityEl = document.getElementById('current-city-humidity');
    let iconEl = document.getElementById('current-day-weather-icon');

    console.log(iconCurrent)

    iconEl.setAttribute("class", "");

    if (iconCurrent == 'Clouds' || iconCurrent == 'Fog') {
        iconEl.classList.add("fas", "fa-cloud");
    }
    if (iconCurrent == 'Rain' || iconCurrent == 'Mist') {
        iconEl.classList.add("fa", "fa-cloud-showers-heavy");
    }
    if (iconCurrent == 'Clear') {
        iconEl.classList.add("far", "fa-sun");
    }

    currentTempEl.innerText = 'Temp: ' + curTemp;
    currentWindEl.innerText = 'Wind: ' + curWind;
    currentHumidityEl.innerText = 'Humidity: ' + curHumidity;


}

// Writes the forecast to the cards
function writeForecast(date, temp, wind, humidity, iteration, iconValue) {
    let forecastDateEl = document.getElementById('forecast-date-' + iteration);
    let forecastIconEl = document.getElementById('forecast-icon-' + iteration);
    let forecastTempEl = document.getElementById('forecast-temp-' + iteration);
    let forecastWindEl = document.getElementById('forecast-wind-' + iteration);
    let forecastHumEl = document.getElementById('forecast-humidity-' + iteration);

    forecastIconEl.setAttribute("class", "");

    if (iconValue == 'Clouds' || iconValue == 'Fog') {
        forecastIconEl.classList.add("fas", "fa-cloud");
    } else if (iconValue == 'Rain' || iconValue == 'Mist') {
        forecastIconEl.classList.add("fa", "fa-cloud-showers-heavy");
    } else if (iconValue == 'Clear') {
        forecastIconEl.classList.add("far", "fa-sun");
    }

    forecastDateEl.innerText = date;
    forecastTempEl.innerText = 'Temp: ' + temp;
    forecastWindEl.innerText = 'Wind: ' + wind;
    forecastHumEl.innerText = 'Humidity:' + humidity;

}

function getSearchHistory(cityState) {
    historySearch = JSON.parse(localStorage.getItem('City and State'));
    console.log(historySearch);
    console.log(historyStored);

    if (historySearch == null) {
        historySearch = [];
    }

    if (cityState) {
        historySearch.push(cityState);
    }

    historyStored = historySearch;
    console.log(historySearch);
    console.log(historyStored);

    renderHistory(historyStored);

    if (cityState) {
        logSearchHistory(historyStored)
    }
}

function logSearchHistory(history) {

    localStorage.setItem("City and State", JSON.stringify(history));
}

function renderHistory(historyStored) {
    searchHistoryEl.innerHTML = "";
    let clearCities = document.getElementById('city-clear-button')

    for (let i = 0; i < historyStored.length; i++) {

        if (i < 5) {
            clearCities.style.display = "none"
        } else if (i = 5 || i > 5) {
            clearCities.style.display = "inherit"
        }

        liElement = document.createElement('button');
        liElement.setAttribute("class", "history-list");
        liElement.setAttribute("id", "history-button-" + i);
        liElement.innerText = historyStored[i];
        searchHistoryEl.appendChild(liElement);

        let historyButton = document.getElementById("history-button-" + i);

        historyButton.addEventListener('click', historyToSearch.bind(null, historyStored, i), false)


    }
}

function historyToSearch(historyStored, iteration) {
    console.log(historyStored[iteration]);
    let sameSearch = historyStored[iteration];
    init(sameSearch)
}
getSearchHistory();