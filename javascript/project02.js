/*
    Name: Mike Villeneuve
    Date: 07/11/2022
*/


/*
Executes call to get location and weather data after a zipcode is entered and 
the Get Weather button is clicked.  A getLocation function is triggered that 
retrieves longitude, latitude, and city name from the geonames.org API. The 
longitude and latitude data are then passed into the getWeather function to get 
the temperature, wind speed, and wind direction from the same API.  The output 
consists of the values of city name, temperature (in fahrenheit), wind speed 
(in mph), and wind direction with icons applied based on temperature and wind 
speed thresholds.
*/
const init = () => {

    // Add event listener to Get Weather button
    let weatherButton = document.querySelector("#getWeather");
    weatherButton.addEventListener("click", getLocation);

}


// Get weather including longitude, latitude, and city name using the geonames.org API
const getLocation = () => {

    let xhr = new XMLHttpRequest();
    let method = "get";
    let url = "http://api.geonames.org/postalCodeSearchJSON?";
    let username = "mdvilleneuve"
    let zipcode = captureZipcode();  // captureZipcode(); Hardcode value for testing
    let country = "us";
    let urlWithparameters = `${url}username=${username}&postalcode=${zipcode}&country=${country}`;

    console.log(`getLocation Url w/ Params: ${urlWithparameters}`);

//
    xhr.open(method, urlWithparameters);

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
//
            // JSON parsing (comment this section out for hardcoded testing)
            let data = JSON.parse(xhr.responseText);
            let latitude = data.postalCodes[0].lat;
            let longitude = data.postalCodes[0].lng;
            let cityName = data.postalCodes[0].placeName;

            // Testing values (uncomment this section for hardcoded testing)
            // const latitude = 42.668254;
            // const longitude = -89.002534;
            // const cityName = "Janesville";

            // Output values to the console for logging
            console.log(`Latitude: ${latitude}`);
            console.log(`Longitude: ${longitude}`);
            console.log(`City Name: ${cityName}`);

            // Generate preliminary output
            let output = `<br /><br /><h2>${cityName}</h2>`;
            document.getElementById("outputDiv").innerHTML = output;

            // Execute call to get weather data and remaining output
            getWeather(latitude, longitude);
//
        }
    }

    xhr.send(null);
//
}


// Captures the user entered zipcode in the textbox
const captureZipcode = () => {

    let zipcodeInput = document.querySelector("#zipcode").value;
    console.log(`Zipcode: ${zipcodeInput}`);

    return zipcodeInput;
}


// Get weather including temperature, wind speed, and wind direction using the geonames.org API
const getWeather = (latitude, longitude) => {

    let xhr = new XMLHttpRequest();
    let method = "get";
    let url = "http://api.geonames.org/findNearByWeatherJSON?";
    let username = "mdvilleneuve";
    let urlWithparameters = `${url}username=${username}&lat=${latitude}&lng=${longitude}`;

    console.log(`getWeather Url w/ Params: ${urlWithparameters}`);

//    
    xhr.open(method, urlWithparameters);

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
//
            // JSON parsing (comment this section out for hardcoded testing)
            let data = JSON.parse(xhr.responseText);
            let celsiusTemp = data.weatherObservation.temperature;
            // let windSpeedInKnots = data.weatherObservation.windSpeed;
            let windSpeedInKnots = 0;
            let windDirection = data.weatherObservation.windDirection;

            // Testing values (uncomment this section for hardcoded testing)
            // const celsiusTemp = 36;  // test icons with 0, 23, and 36
            // const windSpeedInKnots = 16;  // test icon with 7 and 16
            // const windDirection = 360;  // 260 test cardinal direction with 0, 45, 90, 135, 180, 225, 270, 315, 360

            // Icon retrieval
            const coldIcon = "<img src=\"images/cold.jpg\" class=\"temp\" alt=\"cold\" title=\"Cold\">";
            const hotIcon = "<img src=\"images/hot.jpg\" class=\"temp\" alt=\"hot\" title=\"hot\">";
            const windIcon = "<img src=\"images/wind.jpg\" id=\"wind\" alt=\"windy\" title=\"windy\">";

            // Calculated values
            const fahrenheitTemp = ((celsiusTemp * 9 / 5) + 32);
            const windSpeedInMph = (windSpeedInKnots * 1.150779);
            const windSpeedInMphRounded = Math.round(windSpeedInMph);
            const cardinalDirection = calculateCardinalDirection(windDirection);

            // Temperature and wind Icon selection
            const coldThreshold = 34;
            const hotThreshold = 83;
            let iconSelector = "";
            if(fahrenheitTemp <= coldThreshold) {
                iconSelector = coldIcon;
            } else if (fahrenheitTemp >= hotThreshold) {
                iconSelector = hotIcon;
            }

            const windThreshold = 15;
            let windSelector = "";
            if(windSpeedInMphRounded > windThreshold) {
                windSelector = windIcon;
            }

            // Output values to the console for logging
            console.log(`Celsius: ${celsiusTemp}°C`);
            console.log(`Fahrenheit: ${fahrenheitTemp}°F`);
            console.log(`WindSpeed in knots: ${windSpeedInKnots}`);
            console.log(`WindSpeed in MPH: ${windSpeedInMph}`);
            console.log(`WindSpeed in MPH (rounded): ${windSpeedInMphRounded}`);
            console.log(`WindDirection in degrees: ${windDirection}`);
            console.log(`WindDirection in cardinal degrees: ${cardinalDirection}`);

            // Concatenate output with previous city name output
            let output = 
                    `<br /><br />
                    <h2>${fahrenheitTemp}&#8457;\n${iconSelector}</h2>
                    <br /><br />
                    <h2>${windSpeedInMphRounded}\nMph\n${cardinalDirection}\nwind\n${windSelector}</h2>`;
            document.getElementById("outputDiv").innerHTML += output;
//            
        }
    }

    xhr.send(null);
//
}


/* 
Calculates cardinal direction based on passed in numeric value for wind direction.
This function uses an 8 sector cardinal direction format rather than a 16 sector format. 
This format is used because it results in a whole integer value of 45 degrees 
for each sector as opposed to the 22.5 degrees for a 16 sector format.  
This decision was made because it could not be determined through the geonames.org
API documentation if the wind direction variable includes decimal values or just 
passes whole integers.
*/
const calculateCardinalDirection = windDirection => {

    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    return directions[Math.round(windDirection / 45) % 8];
}


// Initialize page
window.onload = init;