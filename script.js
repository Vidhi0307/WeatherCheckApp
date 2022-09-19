var regionArray = [];


var api = 'cc7debabebe7858a548cbd219910b493';

function fetchInfo() {
    event.preventDefault();

    var location = $('#location').val();

    $('#regionName').text(location);

    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=5&appid=' + api;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var locatationLatitude = data[0].lat;
            var locationLongitude = data[0].lon;

            saveSearchHistory(location);
            fethchWeatherinfo(locatationLatitude, locationLongitude)
            renderSearchHistory();


        });
}

function fethchWeatherinfo(locatationLatitude, locationLongitude) {


    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + locatationLatitude + '&lon=' + locationLongitude + '&appid=' + api + '&units=Metric';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            $('#temp').text('Temperature:   ' + data.main.temp + ' \u00B0');
            //changing the temperature into km/hr
            $('#Wind').text('Wind:  ' + data.wind.speed * 3.6 + 'km/hr');
            $('#humidity').text('Humidity:   ' + data.main.humidity + '%');

            getUVindex(locatationLatitude, locationLongitude);
            fiveDayForecast(locatationLatitude, locationLongitude);



        });
}

function getUVindex(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + api + '&units=Metric';

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var ui = $('#ui')
            ui.text('UI: ' + data.value);
            // ui.classList.add("text-bg-success");


        });

}

//function for 5 days forecast
function fiveDayForecast(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + '&cnt=' + 5 + "&appid=" + api + '&units=Metric';
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var forecastFrame = document.getElementById('FC5')
            for (i = 0; i < 5; i++) {
                var forecastCard = document.getElementById('weatherInfo' + i);
                var temperature = document.getElementById('temp' + i);
                var windSpeed = document.getElementById('Wind' + i);
                var humidity = document.getElementById('humidity' + i);
                var forecastDate = document.getElementById('date' + i);
                temperature.textContent = 'Temperature:' + data.list[i].main.temp;
                windSpeed.textContent = 'Wind Speed :' + data.list[i].wind.speed;
                humidity.textContent = 'Humidity :' + data.list[i].main.humidity;
                forecastDate.textContent = 'Date :' + data.list[i].dt_txt;

                forecastCard.classList.add('border', 'border-dark');

            }



        });


}


//function for saving history

function saveSearchHistory(location) {
    regionArray.push(location);
    localStorage.setItem("searchHistory", JSON.stringify(regionArray));

}

function renderSearchHistory() {

    var retrievedData = localStorage.getItem("searchHistory");
    var locationarray = JSON.parse(retrievedData);
    var searchList = document.getElementById('SearchList')
    searchList.innerHTML = "";

    for (i = 0; i < locationarray.length; i++) {
        // Render a new li for each search item
        var region = locationarray[i];
        var button = document.createElement("button");
        button.textContent = region;
        searchList.appendChild(button);
    }
}