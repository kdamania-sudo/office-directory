
/* ---------------- Icons ---------------- */
const buildingBadgeSVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="9" width="6" height="12" fill="#ffffff"/>
  <rect x="11" y="4" width="6" height="17" fill="#ffffff"/>
  <rect x="18" y="12" width="4" height="9" fill="#ffffff"/>
</svg>`;

const personSVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="8" r="4" fill="#ffffff"/>
  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#ffffff"/>
</svg>`;

function renderDirectory(){
  const root = document.getElementById('directory');
  root.innerHTML = directoryData.map(suite => `
    <div class="suite">
      <div class="suite-head">
        <span class="icon-badge">${buildingBadgeSVG}</span>
        <h2>${suite.suiteName}</h2>
      </div>
      <div class="suite-body">
        ${suite.entries.map(e => `
          <div class="entry">
            <span class="avatar">${personSVG}</span>
            <span class="name-block">${e.name}${e.subtext ? `<span class="small-text">${e.subtext}</span>` : ``}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}
renderDirectory();

/* ---------------- Clock ---------------- */
function updateClock(){
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if(hours === 0) hours = 12;
  const mm = minutes.toString().padStart(2,'0');

  document.getElementById('time').textContent = `${hours}:${mm}`;
  document.getElementById('ampm').textContent = ampm;

  const dateStr = now.toLocaleDateString('en-US', {
    weekday:'long', month:'long', day:'numeric', year:'numeric'
  });
  document.getElementById('date').textContent = dateStr;
}
updateClock();
setInterval(updateClock, 1000);

/* ---------------- Weather ---------------- */
// Open-Meteo weather codes -> { label, icon key }
const weatherCodeMap = {
  0:  { label: "Clear Sky", icon: "sun" },
  1:  { label: "Mostly Clear", icon: "partly" },
  2:  { label: "Partly Cloudy", icon: "partly" },
  3:  { label: "Overcast", icon: "cloud" },
  45: { label: "Foggy", icon: "fog" },
  48: { label: "Foggy", icon: "fog" },
  51: { label: "Light Drizzle", icon: "rain" },
  53: { label: "Drizzle", icon: "rain" },
  55: { label: "Heavy Drizzle", icon: "rain" },
  56: { label: "Freezing Drizzle", icon: "rain" },
  57: { label: "Freezing Drizzle", icon: "rain" },
  61: { label: "Light Rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy Rain", icon: "rain" },
  66: { label: "Freezing Rain", icon: "rain" },
  67: { label: "Freezing Rain", icon: "rain" },
  71: { label: "Light Snow", icon: "snow" },
  73: { label: "Snow", icon: "snow" },
  75: { label: "Heavy Snow", icon: "snow" },
  77: { label: "Snow Grains", icon: "snow" },
  80: { label: "Rain Showers", icon: "rain" },
  81: { label: "Rain Showers", icon: "rain" },
  82: { label: "Violent Showers", icon: "rain" },
  85: { label: "Snow Showers", icon: "snow" },
  86: { label: "Snow Showers", icon: "snow" },
  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm", icon: "storm" },
  99: { label: "Thunderstorm", icon: "storm" }
};

const weatherIcons = {
  sun: `<circle cx="32" cy="32" r="12" fill="#fbbf24"/>
        <g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
          <line x1="32" y1="4" x2="32" y2="12"/>
          <line x1="32" y1="52" x2="32" y2="60"/>
          <line x1="4" y1="32" x2="12" y2="32"/>
          <line x1="52" y1="32" x2="60" y2="32"/>
          <line x1="11" y1="11" x2="17" y2="17"/>
          <line x1="47" y1="47" x2="53" y2="53"/>
          <line x1="11" y1="53" x2="17" y2="47"/>
          <line x1="47" y1="17" x2="53" y2="11"/>
        </g>`,
  partly: `<circle cx="24" cy="24" r="10" fill="#fbbf24"/>
        <g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
          <line x1="24" y1="2" x2="24" y2="8"/>
          <line x1="4" y1="24" x2="10" y2="24"/>
          <line x1="7" y1="7" x2="11.5" y2="11.5"/>
        </g>
        <path d="M20 46c-6 0-11-4.8-11-10.7 0-5.3 4-9.7 9.2-10.5 1.8-5.2 6.8-9 12.6-9 7.5 0 13.6 6 13.6 13.4 0 .5 0 1-.1 1.5 4.4 1 7.7 4.9 7.7 9.5 0 5.4-4.5 9.8-10 9.8H20z" fill="#e5edf9"/>`,
  cloud: `<path d="M16 44c-7 0-12.5-5.5-12.5-12.2 0-6 4.5-11 10.4-11.9C16 12.9 22.4 8 30 8c8.6 0 15.6 6.8 15.6 15.3 0 .6 0 1.2-.1 1.7 5 1.1 8.7 5.6 8.7 10.8 0 6.2-5.1 11.2-11.4 11.2H16z" fill="#c9d6ea"/>`,
  fog: `<g stroke="#c9d6ea" stroke-width="3.4" stroke-linecap="round">
          <line x1="10" y1="24" x2="54" y2="24"/>
          <line x1="6" y1="32" x2="58" y2="32"/>
          <line x1="12" y1="40" x2="52" y2="40"/>
          <line x1="16" y1="48" x2="48" y2="48"/>
        </g>`,
  rain: `<path d="M16 34c-7 0-12.5-5.5-12.5-12.2 0-6 4.5-11 10.4-11.9C16 2.9 22.4-2 30-2c8.6 0 15.6 6.8 15.6 15.3 0 .6 0 1.2-.1 1.7 5 1.1 8.7 5.6 8.7 10.8 0 6.2-5.1 11.2-11.4 11.2H16z" fill="#9db6d9" transform="translate(0,10)"/>
        <g stroke="#4f8dff" stroke-width="3" stroke-linecap="round">
          <line x1="20" y1="46" x2="16" y2="58"/>
          <line x1="32" y1="46" x2="28" y2="58"/>
          <line x1="44" y1="46" x2="40" y2="58"/>
        </g>`,
  snow: `<path d="M16 34c-7 0-12.5-5.5-12.5-12.2 0-6 4.5-11 10.4-11.9C16 2.9 22.4-2 30-2c8.6 0 15.6 6.8 15.6 15.3 0 .6 0 1.2-.1 1.7 5 1.1 8.7 5.6 8.7 10.8 0 6.2-5.1 11.2-11.4 11.2H16z" fill="#c9d6ea" transform="translate(0,10)"/>
        <g fill="#ffffff">
          <circle cx="18" cy="52" r="2.6"/>
          <circle cx="32" cy="56" r="2.6"/>
          <circle cx="44" cy="52" r="2.6"/>
        </g>`,
  storm: `<path d="M16 32c-7 0-12.5-5.5-12.5-12.2 0-6 4.5-11 10.4-11.9C16 .9 22.4-4 30-4c8.6 0 15.6 6.8 15.6 15.3 0 .6 0 1.2-.1 1.7 5 1.1 8.7 5.6 8.7 10.8 0 6.2-5.1 11.2-11.4 11.2H16z" fill="#93a6c4" transform="translate(0,10)"/>
        <polygon points="30,42 22,56 29,56 25,64 40,48 32,48 36,42" fill="#fbbf24"/>`
};

function setWeatherIcon(key){
  const svg = document.getElementById('weatherIcon');
  svg.innerHTML = weatherIcons[key] || weatherIcons.sun;
}

async function fetchWeather(){
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${weatherConfig.latitude}&longitude=${weatherConfig.longitude}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto`;
    const res = await fetch(url);
    if(!res.ok){
      throw new Error(`API responded with status ${res.status}`);
    }
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const info = weatherCodeMap[code] || { label: "—", icon: "sun" };

    document.getElementById('temp').textContent = temp;
    document.getElementById('weatherDesc').textContent = info.label;
    setWeatherIcon(info.icon);
  }catch(err){
    // Surface the real reason in the console so it's easy to debug on-device.
    console.error('Weather fetch failed:', err);
    const msg = (location.protocol === 'file:')
      ? 'Open via a web server (not file://) to load weather'
      : 'Weather unavailable';
    document.getElementById('weatherDesc').textContent = msg;
  }
  document.getElementById('cityLabel').textContent = weatherConfig.cityLabel;
}

fetchWeather();
setInterval(fetchWeather, 60 * 1000); // refresh every 1 minute
