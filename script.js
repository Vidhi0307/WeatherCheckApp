var regionArray = [];
var searchList = document.getElementById('SearchList')
var api = 'cc7debabebe7858a548cbd219910b493';// api key





function fetchInfo() {

    event.preventDefault();


    //location getting value based on whether this function is being triggered by search(submit button) or searchHistory list button's click

    if (event.type === 'submit') {

        var location = $('#location').val();
        document.getElementById('error').textContent = '';
        if (location === '') {
            document.getElementById('error').textContent = "Please enter a location!";
            return;
        }


    }
    else if (event.type === 'click') {
        var location = event.target.textContent;
        document.getElementById('error').textContent = '';
    }

    $('#regionName').text(location);
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=5&appid=' + api;
    $('#location').val("");
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var locatationLatitude = data[0].lat;
                    var locationLongitude = data[0].lon;
                    if (!regionArray.includes(location)) {
                        saveSearchHistory(location);
                    }
                    fethchWeatherinfo(locatationLatitude, locationLongitude)
                    renderSearchHistory();




                });
            } else {
                alert("Error:" + response.statusTxt + "\n Page not found");
            }

        })
}

//fetching longitude and latitude information for the location name
function fethchWeatherinfo(locatationLatitude, locationLongitude) {


    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + locatationLatitude + '&lon=' + locationLongitude + '&appid=' + api + '&units=metric';
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var weatherImage = document.getElementById("imageToday");
                    weatherImage.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
                    weatherImage.alt = "demo icon"
                    console.log(weatherImage.src);
                    $('#temp').text('Temperature:   ' + data.main.temp + ' \u00B0 C');
                    //changing the temperature into km/hr
                    $('#Wind').text('Wind:  ' + data.wind.speed + 'm/s');
                    $('#humidity').text('Humidity:   ' + data.main.humidity + '%');
                    document.getElementById('weatherInfo').classList.add('border', 'border-dark', 'p-3');
                    getUVindex(locatationLatitude, locationLongitude);
                    fiveDayForecast(locatationLatitude, locationLongitude);



                });
            } else {
                alert("Error:" + response.statusTxt + "\n Page not found");
            }

        })

}
// getting uv index value for location
function getUVindex(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + api + '&units=metric';

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            var ui = $('#ui')
            ui.text('UI: ' + data.value);
            ui.addClass("text-bg-success mb-5");


        });

}

//function for 5 days forecast
function fiveDayForecast(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + api + '&units=metric';
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var forecastFrame = document.getElementById('FC5')

            //looping through the data to get relevant data.
            for (i = 7, j = 0; i < 40, j < 5; i += 8, j++) {

                let weatherImage = document.getElementById("image" + j);

                var forecastCard = document.getElementById('weatherInfo' + j);
                var temperature = document.getElementById('temp' + j);
                var windSpeed = document.getElementById('Wind' + j);
                var humidity = document.getElementById('humidity' + j);
                var forecastDate = document.getElementById('date' + j);
                weatherImage.src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png"
                weatherImage.alt = "demo icon"
                temperature.textContent = 'Temperature :' + data.list[i].main.temp + ' \u00B0 C';
                windSpeed.textContent = 'Wind Speed   :' + data.list[i].wind.speed + 'm/s';
                humidity.textContent = 'Humidity   :' + data.list[i].main.humidity + '%';
                forecastDate.textContent = 'Date :' + moment(data.list[i].dt_txt, 'YYYY-MM-DD hh:mm:ss').format("MMM Do, YYYY");
                forecastCard.classList.add('border', 'border-dark');

            }



        });


}


//function for saving history

function saveSearchHistory(location) {

    regionArray.push(location);
    localStorage.setItem("searchHistory", JSON.stringify(regionArray));

}

function fetchInfobutton(event) {
    event.preventDefault();

    location = event.target.textContent;
    console.log(event.target);
    fetchInfo();

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
        button.classList.add('region-button', 'rounded');
        button.textContent = region;
        searchList.appendChild(button);
        button.addEventListener("click", fetchInfo);

    }


}

renderSearchHistory();