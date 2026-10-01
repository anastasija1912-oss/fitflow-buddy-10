# FitTrack Pro

Kreiraj React web aplikaciju pod nazivom "FitTracker - Evidencija Treninga".

Cilj aplikacije: Omogućiti korisnicima lak unos, pregled i praćenje sopstvenih treninga, vežbi i napretka.

Tipovi korisnika:

- Registrovani vežbač (ima pristup svojim podacima, dodaje i pregleda treninge).

Glavne stranice i navigacija:

1. Početna stranica (Dashboard) - Prikaz statistike, nedeljnog pregleda i poslednjih zabeleženih treninga.

2. Unos treninga (Forma) - Forma za unos novog treninga (naziv treninga, tip: Kardio/Snaga/Joga, trajanje u minutima, utrošene kalorije, datum i napomena).

3. Pregled i Detalji - Lista svih unetih treninga sa mogućnošću filtriranja i klikom na pojedinačni trening radi prikaza detaljnih informacija.

4. Autentifikacija - Stranica za Prijavu / Registraciju.

Podaci za bazu (Supabase):

- Tabela `workouts`: `id`, `user_id`, `title`, `type`, `duration_min`, `calories`, `date`, `notes`, `created_at`.

Izgled i stil:

- Moderan, minimalistički UI sa svetlom pozadinom (#f8fafc), blagim pastelnim akcentima (roze/ljubičasta i meka zelena za uspeh), zaobljenim ivicama kartica i jednostavnom navigacijom.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8699010b-9782-4bab-84b2-d97844756e72).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
