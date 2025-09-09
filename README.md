# OPIS APLIKACIJE
Aplikacija je moderan sistem za planiranje ishrane zasnovan na React (SPA) front-endu i Laravel API-ju, koji korisnicima omogućava kreiranje i pregled planova obroka po danima i tipovima (doručak/ručak/večera), izbor recepata iz baze uz prikaz sastojaka i nutritivnih vrednosti, kao i personalizaciju na osnovu unetih alergija i dijetetskih preferencija (uz automatske preporuke recepata). Podržani su registracija i prijava korisnika, uređivanje profila, pregled i filtriranje postojećih planova, dok ovlašćeni korisnici mogu dodavati, menjati i brisati recepte kako bi baza ostala aktuelna. Navigacija je jednostavna zahvaljujući breadcrumbs traci i klijent-skom rutiranju bez ponovnog učitavanja stranica.

## Koriscene tehnologije

- PHP 8.2+, Composer
- MySQL/PostgreSQL (ili SQLite)
- Node 18+ i npm

## Setup – Back-end (Laravel)
    cd Laravel
    composer install
    cp .env.example .env
    # Podesi DB_* vrednosti u .env  
    php artisan key:generate
    php artisan migrate --seed   
    php artisan serve             
## Setup – Front-end (React)
    cd reactapp
    npm install
    npm start
