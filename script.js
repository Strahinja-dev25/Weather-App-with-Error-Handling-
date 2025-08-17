//Variables
const city = document.getElementById("city");
const getBtn = document.getElementById("submit");
const result = document.getElementById("weather-result");
const changeBtn = document.getElementById("change");
const suggestions = document.getElementById("suggestions"); // ul element za predloge
const geoBtn = document.getElementById("geoBtn"); //Za prikaz trenutne lokacije

const cards = Array.from(document.querySelectorAll(".card"));

//Event Listeners
getBtn.addEventListener("click", show);
changeBtn.addEventListener("click", change);

window.addEventListener("DOMContentLoaded", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        city.value = lastCity; // postavi u input
        show(); // pozovi show() automatski
    }
});

city.addEventListener("input", autocomplete);
geoBtn.addEventListener("click", myLocation);

//Functions
async function show () {
    const cityName = city.value.trim();
    if (!cityName) {
        result.textContent = "Molimo unesite ime grada.";
        return;
    }
    result.innerHTML = '<div class="spinner"></div> Učitavam...';

    const apiKey = "3b7488a13b75004615790f8f7b870265";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=en`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ne možemo da pronađemo grad koji ste uneli. Proverite pravopis i pokušajte ponovo.");
        const data = await res.json();

        // update UI...
        result.textContent = `📍 Prikazujem vreme za ${data.city.name}`;

        // sačuvaj u localStorage
        localStorage.setItem("lastCity", cityName);

        const indices = [0, 8, 16, 24, 32]; // približno 5 dana
        cards.forEach((card, i) => {
            const item = data.list[indices[i]];
            card.querySelector(`#temperature-${i+1}`).textContent = item.main.temp + " °C";
            card.querySelector(`#condition-${i+1}`).textContent = item.weather[0].description;
            card.querySelector(`#humidity-${i+1}`).textContent = item.main.humidity + " %";
            card.querySelector(`#wind-speed-${i+1}`).textContent = item.wind.speed + " m/s";
        });
    }
    catch (err) {
        if (err.message.includes("Grad")) {
            result.textContent = "❌ Ne možemo da pronađemo grad koji ste uneli. Proverite pravopis i pokušajte ponovo.";
        }
        else {
            result.textContent = "⚠️ Greška pri učitavanju podataka. Proverite internet konekciju i pokušajte ponovo.";
        }
    }
}

//Deo za promenu celzijusa u farenhajte i odbrnuto
let isCelsius = true; // globalna promenljiva koja pamti u kojoj si jedinici

async function change() {
    isCelsius = !isCelsius; // obrni jedinicu
    const cityName = city.value.trim();
    if (!cityName) return;
    result.innerHTML = '<div class="spinner"></div> Učitavam...';

    const apiKey = "3b7488a13b75004615790f8f7b870265";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=en`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ne možemo da pronađemo grad koji ste uneli. Proverite pravopis i pokušajte ponovo.");
        const data = await res.json();

        result.textContent = `📍 Prikazujem vreme za ${data.city.name}`;
        changeBtn.textContent = changeBtn.textContent === "°F" ? "°C" : "°F";

        const indices = [0, 8, 16, 24, 32]; // približno 5 dana
        cards.forEach((card, i) => {
                const item = data.list[indices[i]];
                let temp = item.main.temp;

                if (!isCelsius) {
                    // C -> F
                    temp = (temp * 9/5) + 32;
                }

                card.querySelector(`#temperature-${i+1}`).textContent = temp.toFixed(1) + (isCelsius ? " °C" : " °F");
            });
    }
    catch (err) {
        if (err.message.includes("Grad")) {
            result.textContent = "❌ Ne možemo da pronađemo grad koji ste uneli. Proverite pravopis i pokušajte ponovo.";
        }
        else {
            result.textContent = "⚠️ Greška pri učitavanju podataka. Proverite internet konekciju i pokušajte ponovo.";
        }
    }
}

//Autocomplete deo
async function autocomplete () {
    const query = city.value.trim();
    if (query.length < 3) {
        suggestions.innerHTML = "";
        return;
    }

    const apiKey = "3b7488a13b75004615790f8f7b870265";
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Greška u autocomplete fetch-u.");
        const data = await res.json();

        // očisti staru listu
        suggestions.innerHTML = "";

        data.forEach(place => {
            const li = document.createElement("li");
            li.textContent = `${place.name}, ${place.country}`;
            li.addEventListener("click", () => {
                city.value = place.name;
                suggestions.innerHTML = "";
                show(); // pozovi tvoju funkciju za prikaz vremena
            });
            suggestions.appendChild(li);
        });
    }
    catch (err) {
        console.error(err);
    }
}

//Deo za prikazivanje temperature na trenutnoj lokaciji
async function myLocation () {
    if (!navigator.geolocation) {
        result.textContent = "❌ Geolokacija nije podržana u ovom browseru.";
        return;
    }

    result.innerHTML = '<div class="spinner"></div> Učitavam lokaciju...';

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const apiKey = "3b7488a13b75004615790f8f7b870265";

            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("Ne možemo da pronađemo podatke za tvoju lokaciju.");
                const data = await res.json();

                result.textContent = `📍 Prikazujem vreme za ${data.city.name}`;

                const indices = [0, 8, 16, 24, 32];
                cards.forEach((card, i) => {
                    const item = data.list[indices[i]];
                    card.querySelector(`#temperature-${i+1}`).textContent = item.main.temp + " °C";
                    card.querySelector(`#condition-${i+1}`).textContent = item.weather[0].description;
                    card.querySelector(`#humidity-${i+1}`).textContent = item.main.humidity + " %";
                    card.querySelector(`#wind-speed-${i+1}`).textContent = item.wind.speed + " m/s";
                });
            }
            catch (err) {
                result.textContent = "⚠️ Greška pri učitavanju podataka sa lokacije.";
            }
        },
        (err) => {
            result.textContent = "❌ Ne možemo da pristupimo tvojoj lokaciji. Dozvoli pristup ili unesi grad ručno.";
        }
    );
}
