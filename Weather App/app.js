
let long;
let lat;
let temperatureDescription = document.querySelector('.temperature-description');
let temperatureDegree = document.querySelector('.temperature-degree');
let locationTimezone = document.querySelector('.location-timezone');
let temperatureSection = document.querySelector('.temperature');
let humiditySection = document.querySelector('.humidity');
let DailyReport = document.querySelector('.summary');
let DailyReportList = document.getElementById("summaryHourly");
const temperatureSpan = document.querySelector('.temperature span');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;

        const proxy = "https://cors-anywhere.herokuapp.com/";
        const api = `${proxy}https://api.darksky.net/forecast/a60de2034da94de9fbfd1b7f4dd9f027/${lat},${long}`;

        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //Logging of api data
                console.log(data);
                const { temperature, summary, icon, humidity } = data.currently;
                const dailySummary = data.daily.summary;
                const dailySH = data.daily.data;

                for(let i = 0; i < dailySH.length; i++){
                    let temp = dailySH[i].summary;
                    let entry = document.createElement("li");
                    entry.appendChild(document.createTextNode(temp));
                    DailyReportList.appendChild(entry);
                }

                //Set DOM elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = "Timezone: " + data.timezone.replace(/_/g, " ").substring(data.timezone.indexOf("/")+1);
                humiditySection.textContent = Math.floor(humidity * 100) + "% Humidity";
                DailyReport.textContent += dailySummary;

                //FORMULA FOR CELSIUS
                let celsius = (temperature - 32) * (5 / 9);

                //set Icon
                setIcons(icon, document.querySelector('.icon'));

                //change temperature to F or C
                conversion(temperature, celsius);
            });
    });
} else { alert('Enable Location to use app!'); }

function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}
function conversion(temperature, celsius) {
    temperatureSection.addEventListener('click', () => {
        if (temperatureSpan.textContent === "F") {
            temperatureSpan.textContent = "C";
            temperatureDegree.textContent = Math.floor(celsius);
        } else {
            temperatureSpan.textContent = "F";
            temperatureDegree.textContent = temperature;
        }
    });
}