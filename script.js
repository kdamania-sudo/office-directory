/* ---------------- Icons ---------------- */

const buildingBadgeSVG = `
<svg viewBox="0 0 24 24" fill="none">
<rect x="4" y="9" width="6" height="12" fill="#ffffff"/>
<rect x="11" y="4" width="6" height="17" fill="#ffffff"/>
<rect x="18" y="12" width="4" height="9" fill="#ffffff"/>
</svg>
`;


const personSVG = `
<svg viewBox="0 0 24 24" fill="none">
<circle cx="12" cy="8" r="4" fill="#ffffff"/>
<path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
fill="#ffffff"/>
</svg>
`;



/* ---------------- Directory ---------------- */


function renderDirectory(){

const root = document.getElementById("directory");


root.innerHTML = directoryData.map(suite => `


<div class="suite">


<div class="suite-head">

<span class="icon-badge">
${buildingBadgeSVG}
</span>

<h2>
${suite.suiteName}
</h2>

</div>



<div class="suite-body">


${suite.entries.map(e => `


<div class="entry">


<span class="avatar">
${personSVG}
</span>


<span class="name-block">

${e.name}

${e.subtext ?
`<span class="small-text">${e.subtext}</span>`
:
""}


</span>


</div>


`).join("")}



</div>


</div>


`).join("");

}


renderDirectory();






/* ---------------- Clock ---------------- */


function updateClock(){

const now = new Date();


document.getElementById("clock").innerHTML =
now.toLocaleTimeString(
"en-CA",
{
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
}
);



document.getElementById("date").innerHTML =
now.toLocaleDateString(
"en-CA",
{
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
}
);


}


setInterval(updateClock,1000);

updateClock();







/* ---------------- Weather ---------------- */


async function loadWeather(){


const latitude = 43.5890;
const longitude = -79.6441;



const url =
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;



try{


const response = await fetch(url);

const data = await response.json();



const temp =
data.current.temperature_2m;


const code =
data.current.weather_code;



let icon = "";
let condition = "";





/* SUNNY */

if(code === 0){


icon = `

<svg viewBox="0 0 64 64">

<circle cx="32" cy="32" r="14"
fill="#fbbf24"/>

</svg>

`;

condition="Sunny";

}





/* PARTLY CLOUDY */

else if(code===1 || code===2){


icon = `

<svg viewBox="0 0 64 64">


<circle cx="24" cy="22" r="12"
fill="#fbbf24"/>


<path d="M18 45h30c8 0 8-14 0-14
-3-10-17-10-20 0
-8-1-12 14-10 14z"

fill="#ffffff"/>


</svg>

`;

condition="Partly Cloudy";


}





/* CLOUDY */

else if(code===3){


icon = `

<svg viewBox="0 0 64 64">

<path d="M15 42h35c8 0 8-15 0-15
-3-12-18-12-22 0
-9-1-14 15-13 15z"

fill="#ffffff"/>

</svg>

`;

condition="Cloudy";


}





/* RAIN */

else if(code>=51 && code<=67){


icon = `

<svg viewBox="0 0 64 64">


<path d="M15 35h35c8 0 8-15 0-15
-3-12-18-12-22 0
-9-1-14 15-13 15z"

fill="#ffffff"/>


<path d="M25 42l-5 10"
stroke="#4f8dff"
stroke-width="4"/>


<path d="M39 42l-5 10"
stroke="#4f8dff"
stroke-width="4"/>


</svg>

`;

condition="Rain";


}





/* SNOW */

else if(code>=71 && code<=77){


icon = `

<svg viewBox="0 0 64 64">


<path d="M15 35h35c8 0 8-15 0-15
-3-12-18-12-22 0
-9-1-14 15-13 15z"

fill="#ffffff"/>


<circle cx="25" cy="50" r="3"
fill="#ffffff"/>


<circle cx="40" cy="50" r="3"
fill="#ffffff"/>


</svg>

`;

condition="Snow";


}





document.getElementById("weather-icon").innerHTML = icon;


document.getElementById("temperature").innerHTML =
`${temp}°C`;


document.getElementById("location").innerHTML =
"Mississauga, ON";


document.getElementById("condition").innerHTML =
condition;



}

catch(error){

document.getElementById("condition").innerHTML =
"Weather unavailable";

}


}



loadWeather();


setInterval(
loadWeather,
1800000
);