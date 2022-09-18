var searchLocation = $('#location');


var api = 'cc7debabebe7858a548cbd219910b493';

function fetchInfo() {
    event.preventDefault();

    //  var longLatData = fetchLongLat(data);
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchLocation + '&limit=5&appid=' + api;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var locatationLatitude = data[0].lat;
            var locationLongitude = data[0].lon;


            fethchWeatherinfo(locatationLatitude, locationLongitude)


        });
}

function fethchWeatherinfo(locatationLatitude, locationLongitude) {
    var weatherInformation = $('#weatherInfo')

    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + locatationLatitude + '&lon=' + locationLongitude + '&appid=' + api + '&units=imperial';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            $('#temp').text('Temp:' + data.wind.speed);
            /*   $('#').innerHtml=;
              $('#').innerHtml=;
   */
        });
}

/* saveSearchHistory();

function saveSearchHistory() {
    console.log("save history called")
} */

