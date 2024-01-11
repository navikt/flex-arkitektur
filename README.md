# flex arkitektur

## Kjøre mot bigquery lokalt

Kjør `gcloud auth application-default login` for å skape en service account som kan brukes til å koble opp mot bigquery lokalt.
Lag en `.env` fil i rotmappen med følgende innhold:

```
GOOGLE_APPLICATION_CREDENTIALS=<path til service account json>
GOOGLE_CLOUD_PROJECT=<project id>
```

F.eks.:

```
GOOGLE_APPLICATION_CREDENTIALS=/Users/havard/.config/gcloud/application_default_credentials.json
GOOGLE_CLOUD_PROJECT=flex-dev
```

Prosjekt id må være et sted din bruker har bigquery tilgang. F.eks. ditt dev prosjekt.

Kjør deretter `npm run dev` for å starte opp applikasjonen.

## Kjøre mot lokal testdata

Kjør `npm run local` for å starte opp applikasjonen med lokal testdata.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles til flex@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #flex.
