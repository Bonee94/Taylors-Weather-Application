

let weatherDates = []

let locationRequested = "stockton"

let foundLat = "";
let foundLon = "";

let 


function getLatLon() {
fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + locationRequested + '&limit=1&appid=86550c0e40a947163465566121712e2e')
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
    });
}


function writeCards() {

}