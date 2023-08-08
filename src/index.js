import './styles.css';

async function fetchWeather(location, days){
    try {
        const key = 'ab8095a31a954ee3832105905230108'
        const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=${days}&aqi=no&alerts=yes`

        const response = await fetch(apiUrl, {mode: 'cors'});
        const weatherData = await response.json()

        return weatherData
    } catch (error) {
        console.log(error)
    }
}

function checkForError(weatherData){;
    if (Object.keys(weatherData)[0] == "error"){
        displayError();
    } else{
        hideError();
    }
};

function displayError(){
    const entryError = document.querySelector("span.invalid-location.error")
    entryError.textContent = "Check that entry is correct"
    entryError.className = "invalid-location error active"
}

function hideError(){
    const entryError = document.querySelector("span.invalid-location.error")
    entryError.textContent = ""
    entryError.className = "invalid-location error"
}

function parseLocation(weatherData){
    const country = weatherData.location.country
    const name = weatherData.location.name
    const region = weatherData.location.region
    return {country, name, region}
}

function parseCurrentWeather(weatherData){
    const farenheit = weatherData.current.temp_f
    const condition = weatherData.current.condition.text
    return {farenheit, condition}
}

function parseDailyAverage(weatherData, dayIndex){
    const date = weatherData.forecast.forecastday[dayIndex].date
    const averages = weatherData.forecast.forecastday[dayIndex].day

    const averageFarenheit = averages.avgtemp_f
    const averageCondition = averages.condition.text
    const averageChanceRain = averages.daily_chance_of_rain
    const averageChanceSnow = averages.daily_chance_of_snow
    const highOf = averages.maxtemp_f
    const lowOf = averages.mintemp_f
    return {date, averageFarenheit, averageCondition, averageChanceRain, averageChanceSnow, highOf, lowOf}
}

function parseDate(forecast, day){
    return forecast[day].date
}

function parseForecasts(weatherData){
    forecasts = weatherData.forecast.forecastday
    for (day in forecast){
        console.log(forecast[day])
    }
}

function createFooter(){
    const footer = document.createElement("div")
    footer.classList.add("footer")
    footer.textContent = "Weather Application!"

    return footer
};
 


const submitButton = document.querySelector("button.form-submit")
submitButton.addEventListener("click", submitClick, false)

function submitClick(event){
    event.preventDefault();
    const locationInput = document.getElementById("location").value
    const daysInput = document.getElementById("slider").value

    displayWeather(locationInput, daysInput)
    
}

let sliderInput = document.querySelector("input#slider");
let sliderOutput = document.querySelector("output");
sliderOutput.innerHTML = sliderInput.value

sliderInput.addEventListener("input", ()=>{
    sliderOutput.innerHTML = sliderInput.value;
}, false)

function displayLocation(locationObject){
    const country = locationObject["country"]
    const name = locationObject["name"]
    const region = locationObject["region"]

    const locationTitle = document.querySelector("h1.location")
    locationTitle.textContent = `Weather in ${name}, ${region} - ${country}`
}

function displayCurrentTemperatureDetails(locationObject1, locationObject2){
    const temp = locationObject1["farenheit"]
    const condition = locationObject1["condition"]
    
    const tempContainer = document.querySelector('div.current-temperature')
    tempContainer.textContent = temp+String.fromCharCode("0176")

    const conditionContainer = document.querySelector("div.current-condition")
    conditionContainer.textContent = condition

    const currentHigh = locationObject2.highOf
    const currentHighContainer = document.querySelector("div.current-high")
    currentHighContainer.textContent = "High: "+currentHigh+String.fromCharCode("0176")

    const currentLow = locationObject2.lowOf
    const currentLowContainer = document.querySelector("div.current-low")
    currentLowContainer.textContent = "Low: "+currentLow+String.fromCharCode("0176")
}

function removeForecasts(){
    const forecastContainer = document.querySelector("div.forecast-container")
    forecastContainer.innerHTML = ""
}

// {averageFarenheit, averageCondition, averageChanceRain, averageChanceSnow, highOf, lowOf}

// Accepts a Date object or date string that is recognized by the Date.parse() method
function getDayOfWeek(dateObject) {
    console.log(dateObject)
    const date = new Date(dateObject)

    return isNaN(date.getUTCDay()) ? null : 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getUTCDay()];
  }

function createForecastContainer(i, locationObject){
    const forecast = document.createElement("div")
    forecast.classList.add("forecast")
    forecast.classList.add(i)
    console.log(locationObject.date)

    forecast.textContent = getDayOfWeek(locationObject.date)


    const dailyAverage = document.createElement("div")
    dailyAverage.classList.add("daily-average")
    dailyAverage.classList.add(i)
    dailyAverage.textContent= locationObject.averageFarenheit+String.fromCharCode("0176")

    const forecastHighLow = document.createElement("div")
    forecastHighLow.classList.add("forecast-high-low")
    forecastHighLow.classList.add(i)

    const high = document.createElement("div")
    high.classList.add("high")
    high.classList.add(i)
    high.textContent= "High: "+locationObject.highOf+String.fromCharCode("0176")
    // "High: "+currentHigh+String.fromCharCode("0176")

    const low = document.createElement("div")
    low.classList.add("low")
    low.classList.add(i)
    low.textContent= "Low: " + locationObject.lowOf+String.fromCharCode("0176")

    forecastHighLow.appendChild(high)
    forecastHighLow.appendChild(low)

    forecast.appendChild(dailyAverage)
    forecast.appendChild(forecastHighLow)

    const forecastContainer = document.querySelector("div.forecast-container")
    forecastContainer.appendChild(forecast)
}

const displayWeather = (async (location, days) => {
    let weatherData = await fetchWeather(location, days);
    checkForError(weatherData);

    const locationObject = parseLocation(weatherData);
    displayLocation(locationObject);

    const currentWeatherObject = parseCurrentWeather(weatherData)
    console.log(weatherData)
    const todayForecastObject = parseDailyAverage(weatherData, 0)
    displayCurrentTemperatureDetails(currentWeatherObject, todayForecastObject)

    removeForecasts()
    
    for (let i=0; i < Number(days); i++){
        const forecastAtDay = parseDailyAverage(weatherData,i)
        createForecastContainer(i, forecastAtDay)
    }

    
})

displayWeather('Chicago', '4')













