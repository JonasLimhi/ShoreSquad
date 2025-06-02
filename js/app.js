// ShoreSquad App JS
// Features: Map, Weather, Crew Invite (stubbed for demo)

document.addEventListener('DOMContentLoaded', () => {
    // Crew Invite
    const crewList = document.getElementById('crew-list');
    const inviteBtn = document.getElementById('invite-btn');
    let crew = JSON.parse(localStorage.getItem('crewList')) || ['You', 'Alex', 'Jordan', 'Taylor'];

    function renderCrew() {
        crewList.innerHTML = '';
        crew.forEach((name, idx) => {
            const li = document.createElement('li');
            li.textContent = name;
            // Add remove button except for 'You'
            if (name !== 'You') {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.style.marginLeft = '1rem';
                removeBtn.style.background = '#FF7043';
                removeBtn.style.color = '#fff';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '0.3rem';
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = () => {
                    crew.splice(idx, 1);
                    renderCrew();
                };
                li.appendChild(removeBtn);
            }
            crewList.appendChild(li);
        });
        // Save to localStorage
        localStorage.setItem('crewList', JSON.stringify(crew));
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
    const weatherSection = document.getElementById('weather-section');
    const showMoreBtn = document.createElement('button');
    showMoreBtn.textContent = 'Show More Days';
    showMoreBtn.style.marginTop = '1rem';
    showMoreBtn.style.background = '#2196F3';
    showMoreBtn.style.color = '#fff';
    showMoreBtn.style.border = 'none';
    showMoreBtn.style.borderRadius = '0.5rem';
    showMoreBtn.style.padding = '0.5rem 1.2rem';
    showMoreBtn.style.fontSize = '1rem';
    showMoreBtn.style.cursor = 'pointer';
    showMoreBtn.style.transition = 'background 0.2s';
    let showAll = false;

    async function fetchWeatherForecast() {
        const weatherDiv = document.getElementById('weather');
        weatherDiv.textContent = 'Loading weather...';
        try {
            const resp = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
            if (!resp.ok) throw new Error('Weather API error');
            const data = await resp.json();
            const forecasts = data.items[0].forecasts;
            let html = '<div class="forecast-row">';
            // Show 2 days by default, all if showAll is true
            const daysToShow = showAll ? forecasts.length : 2;
            for (let i = 0; i < daysToShow; i++) {
                const day = forecasts[i];
                html += `<div class="forecast-day">
                    <div class='forecast-date'>${day.date}</div>
                    <div class='forecast-desc'>${day.forecast}</div>
                    <div class='forecast-temp'>${day.temperature.low}&deg;C - ${day.temperature.high}&deg;C</div>
                </div>`;
            }
            html += '</div>';
            weatherDiv.innerHTML = html;
            // Add button if more days are available
            if (forecasts.length > 2) {
                if (!weatherSection.contains(showMoreBtn)) {
                    weatherSection.appendChild(showMoreBtn);
                }
                showMoreBtn.textContent = showAll ? 'Show Less' : 'Show More Days';
            } else if (weatherSection.contains(showMoreBtn)) {
                weatherSection.removeChild(showMoreBtn);
            }
        } catch (e) {
            weatherDiv.textContent = 'Weather unavailable.';
            if (weatherSection.contains(showMoreBtn)) {
                weatherSection.removeChild(showMoreBtn);
            }
        }
    }

    showMoreBtn.onclick = function() {
        showAll = !showAll;
        fetchWeatherForecast();
    }

    fetchWeatherForecast();

    // Cleanup locations (future: could be dynamic)
    let cleanups = [
        {
            name: 'Pasir Ris',
            lat: 1.381497,
            lng: 103.955574,
            description: 'Next Cleanup: Pasir Ris'
        }
    ];

    function renderCleanup() {
        const mapSection = document.getElementById('map-section');
        const mapDiv = document.getElementById('map');
        // Remove any previous info text
        let info = mapSection.querySelector('.cleanup-info');
        if (info) info.remove();
        let cleanup = cleanups[0];
        if (!cleanup) {
            // If no cleanups, provide a default
            cleanup = {
                name: 'Pasir Ris',
                lat: 1.381497,
                lng: 103.955574,
                description: 'Next Cleanup: Pasir Ris'
            };
        }
        // Update map iframe
        mapDiv.innerHTML = `<iframe
            title="Next Cleanup at ${cleanup.name}"
            width="100%"
            height="400"
            frameborder="0"
            style="border:0; border-radius:0.5rem; min-width:250px;"
            src="https://maps.google.com/maps?q=${cleanup.lat},${cleanup.lng}&z=16&output=embed"
            allowfullscreen></iframe>`;
        // Add info below map
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cleanup-info';
        infoDiv.style.marginTop = '0.5rem';
        infoDiv.style.color = '#2196F3';
        infoDiv.style.fontWeight = 'bold';
        infoDiv.style.textAlign = 'center';
        infoDiv.textContent = cleanup.description;
        mapSection.appendChild(infoDiv);
    }

    renderCleanup();
});
