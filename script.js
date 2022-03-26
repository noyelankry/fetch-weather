let input = document.getElementById('city-input')
console.log(input)

input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchCity()
    }
})

function createHtmlInfo(item) {
    const template = `
    <div class="location-details">
        <h1>${item.location.name}</h1> 
        (${item.location.region})
        ${item.location.country} 
        <br>
        ${item.location.localtime} 
        <br>
        <br>
    </div>
    <h3>Currently:</h3>
    <div class='current-weather'>
        <br>
            <img src="${item.current.condition.icon}" alt="weather-icon">
            <br>
            ${item.current.temp_c}&#8451;
            <br>
            ${item.current.condition.text}
    </div>
    <br>
    <div id="forecast">
        <h3>Forecast:</h3>
        <br>
    </div>
    `
    return $(template)
}

function renderChart(cData, fData, day, div) {
    JSC.Chart(div, {
        type: 'line',
        title_label_text: `24-hour forecast for ${day}`,
        series: [{
            name: 'celsius',
            points: cData
        },
        {
            name: 'fahrenheit',
            points: fData
        }],
        xAxis_scale_type: "hour",
        legend_template: '%name %icon %average',
        maintainAspectRatio: false
    })
}

//API Key:
const apiKey = '630053394cd9439ea0b53254222603'

function searchCity() {
    //delete the results for the previous search
    document.getElementsByClassName('results')[0].innerHTML = ''

    //get city name from the input value and transform it to lowercase
    let cityName = document.getElementsByClassName('city-input')[0].value
    cityName = cityName.toLowerCase()
    //if the city name is empty the page will reload
    if (cityName === '') {
        document.location.reload()
    }
    let daysNum = document.getElementById('days-num').value
    //if the user didn't select a number of days - alert and return.
    if (daysNum === '0') {
        alert('must choose number of days')
        return
    }

    document.getElementById('search-btn').setAttribute('disabled', true)

    cityName = cityName.replace(/\s/g, '-')
    console.log(cityName)

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${daysNum}&aqi=no&alerts=no`)
        .then(response => {
            response.json().then(data => {
                console.log('data', data)
                $('.results').append(createHtmlInfo(data))

                let item, cData, fData, div, divEl

                for (let i = 0; i < data.forecast.forecastday.length; i++) {
                    item = data.forecast.forecastday[i]
                    cData = Object.keys(item.hour).map(x => ([Number(x), item.hour[x].temp_c]))
                    fData = Object.keys(item.hour).map(x => ([Number(x), item.hour[x].temp_f]))

                    div = `chartDiv${i}`
                    divEl = document.createElement('div')
                    divEl.setAttribute('id', div)
                    console.log(divEl)
                    $('#forecast').append(divEl)
                    renderChart(cData, fData, item.date, div)
                }

                //after the results are done loading we can make the button functional again
                document.getElementById('search-btn').removeAttribute('disabled')

                if (document.getElementsByClassName('results').length != 0) {
                    if (document.getElementById('astro') !== null) {
                        document.getElementById('astro').remove()
                        document.getElementById('going-to').remove()
                    }
                }
            })
        })
    //clear search input
    document.getElementsByClassName('city-input')[0].value = ''
}

