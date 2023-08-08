import './styles.css';
// import "./images"
// images

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
    const conditionCode = weatherData.current.condition.code
    const isDay = weatherData.current.is_day

    return {farenheit, condition, conditionCode, isDay}
}

function parseDailyAverage(weatherData, dayIndex){
    const date = weatherData.forecast.forecastday[dayIndex].date
    const averages = weatherData.forecast.forecastday[dayIndex].day

    const averageFarenheit = averages.avgtemp_f
    const averageCondition = averages.condition.text
    const averageConditionCode = averages.condition.code
    const averageChanceRain = averages.daily_chance_of_rain
    const averageChanceSnow = averages.daily_chance_of_snow
    const highOf = averages.maxtemp_f
    const lowOf = averages.mintemp_f
    return {date, averageFarenheit, averageCondition, averageConditionCode, averageChanceRain, averageChanceSnow, highOf, lowOf}
}

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

function getImage(isDay, iconCode){

    let relativePath
    if (isDay == 0){
        relativePath = `./images/night/${iconCode}.png`
    } else {
        relativePath = `./images/day/${iconCode}.png`
    }
    return relativePath
}

function displayCurrentTemperatureDetails(locationObject1, locationObject2){
    const temp = locationObject1["farenheit"]
    const condition = locationObject1["condition"]
    const conditionCode = locationObject1["conditionCode"]
    const isDay = locationObject1["isDay"]
    const iconCode = getIconCode(conditionCode)
    
    const tempContainer = document.querySelector('div.current-temperature')
    tempContainer.textContent = temp+String.fromCharCode("0176")

    const weatherIcon = document.querySelector('img.current-weather-icon')
    weatherIcon.src = getImage(isDay, iconCode)

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
    // console.log(dateObject)
    const date = new Date(dateObject)

    return isNaN(date.getUTCDay()) ? null : 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getUTCDay()];
  }

function getIconCode(code){
    // console.log(code)
    const codeToIconDict = {'1000':'113','1003':'116','1006':'119','1009':'122','1030':'143','1063':'176','1066':'179','1069':'182','1072':'185','1087':'200','1114':'227','1117':'230','1135':'248','1147':'260','1150':'263','1153':'266','1168':'281','1171':'284','1180':'293','1183':'296','1186':'299','1189':'302','1192':'305','1195':'308','1198':'311','1201':'314','1204':'317','1207':'320','1210':'323','1213':'326','1216':'329','1219':'332','1222':'335','1225':'338','1237':'350','1240':'353','1243':'356','1246':'359','1249':'362','1252':'365','1255':'368','1258':'371','1261':'374','1264':'377','1273':'386','1276':'389','1279':'392','1282':'395'}
    const icon = codeToIconDict[code]
    // console.log(icon)
    return icon
}

function createForecastContainer(i, locationObject){
    const forecast = document.createElement("div")
    forecast.classList.add("forecast")
    forecast.classList.add(i)

    const forecastDay = document.createElement("div")
    forecastDay.classList.add("day")

    if (i == 0){
        forecastDay.textContent = "Today"
    } else {
        forecastDay.textContent = getDayOfWeek(locationObject.date)
    }
    

    const dailyAverage = document.createElement("div")
    dailyAverage.classList.add("daily-average")
    dailyAverage.classList.add(i)
    dailyAverage.textContent= locationObject.averageFarenheit+String.fromCharCode("0176")

    const dailyCondition = document.createElement("div")
    dailyCondition.classList.add("condition")
    dailyCondition.textContent = locationObject.averageCondition

    const conditionCode = getIconCode(locationObject.averageConditionCode)
    const icon = document.createElement("img")
    icon.classList.add("forecast-icon")
    icon.src = getImage(null, conditionCode)

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

    forecast.appendChild(forecastDay)
    forecast.appendChild(dailyAverage)
    forecast.appendChild(icon)
    forecast.appendChild(dailyCondition)
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
    // console.log(weatherData)
    const todayForecastObject = parseDailyAverage(weatherData, 0)
    displayCurrentTemperatureDetails(currentWeatherObject, todayForecastObject)

    removeForecasts()
    
    for (let i=0; i < Number(days); i++){
        const forecastAtDay = parseDailyAverage(weatherData,i)
        createForecastContainer(i, forecastAtDay)
    }

    
})

displayWeather('Chicago', '4')













