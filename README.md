# flex arkitektur

Henter apper og tilhørende databaser fra bigquery.
Henter også metrikker fra prometheus for tbd-rapid data.

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

## Legge inn databaser

Databaser ligger ikke i dataproduktet per 19. januar 2024. Man kan manuelt legge det til for enkelte namespace.
Kjør denne kommandoen for å hente for et namespace:

`kubectl get app -n flex -o json | jq '[.items[] | {appName: .metadata.name, namespace: .metadata.namespace, databases: [(.spec.gcp?.sqlInstances[]?.databases[]? | .name)]} | select(.databases | length > 0)] | sort_by(.appName)'`

Oppdater deretter `database.ts` med det som kommer ut av denne kommandoen.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles til flex@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #flex.
