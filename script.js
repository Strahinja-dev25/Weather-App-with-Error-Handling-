//Variables

//Event Listeners

//Functions

//Dodati error handling za nepostojeci grad ("Grad nije pronađen.")
//Dodati error handling za gresku sa API-jem ("Greška pri učitavanju podataka.")
//Loading state (npr. prikaži spinner dok čekaš API).
//Sačuvaj poslednji grad u localStorage → kad otvoriš aplikaciju ponovo, automatski prikaže vreme za taj grad.
//User-friendly fallback - Kada API ne radi, grad ne postoji ili pukne internet, korisniku se prikazuje jasna i razumljiva poruka: "Ne možemo da pronađemo grad koji ste uneli. Proverite pravopis i pokušajte ponovo.", "Greška pri učitavanju podataka. Proverite konekciju."



//Najbolji dodatni deo:
//Autocomplete gradova → kad kucaš, koristi neki free API za geolokaciju ili napravi lokalnu listu gradova.
//Korišćenje geolokacije → uz navigator.geolocation prikaži vreme za trenutnu lokaciju.
//Offline fallback → prikaži “poslednje sačuvane podatke” iz localStorage ako nema neta.