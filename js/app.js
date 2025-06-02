// ShoreSquad App JS
// Features: Map, Weather, Crew Invite (stubbed for demo)

document.addEventListener('DOMContentLoaded', () => {
    // Crew Invite
    const crewList = document.getElementById('crew-list');
    const inviteBtn = document.getElementById('invite-btn');
    let crew = ['You', 'Alex', 'Jordan', 'Taylor'];

    function renderCrew() {
        crewList.innerHTML = '';
        crew.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            crewList.appendChild(li);
        });
    }

    inviteBtn.addEventListener('click', () => {
        const name = prompt('Enter your friend\'s name:');
        if (name) {
            crew.push(name);
            renderCrew();
        }
    });

    renderCrew();

    // NEA 4-day weather forecast API integration
    async function fetchWeatherForecast() {
        const weatherDiv = document.getElementById('weather');
        weatherDiv.textContent = 'Loading weather...';
        try {
            const resp = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
            if (!resp.ok) throw new Error('Weather API error');
            const data = await resp.json();
            const forecasts = data.items[0].forecasts;
            let html = '<div class="forecast-row">';
            forecasts.forEach(day => {
                html += `<div class="forecast-day">
                    <div class='forecast-date'>${day.date}</div>
                    <div class='forecast-desc'>${day.forecast}</div>
                    <div class='forecast-temp'>${day.temperature.low}&deg;C - ${day.temperature.high}&deg;C</div>
                </div>`;
            });
            html += '</div>';
            weatherDiv.innerHTML = html;
        } catch (e) {
            weatherDiv.textContent = 'Weather unavailable.';
        }
    }

    fetchWeatherForecast();
});
