//Variables
const city = document.getElementById("city");
const getBtn = document.getElementById("submit");
const result = document.getElementById("weather-result");
const changeBtn = document.getElementById("change");

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
        result.textContent = `Prikazujem vreme za ${data.city.name}`;

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

        result.textContent = `Prikazujem vreme za ${data.city.name}`;
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





//Najbolji dodatni deo:

//Korišćenje geolokacije → uz navigator.geolocation prikaži vreme za trenutnu lokaciju.
//Offline fallback → prikaži “poslednje sačuvane podatke” iz localStorage ako nema neta.

