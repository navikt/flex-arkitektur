# Copilot Instructions for flex-arkitektur

## Project Overview

This is a Next.js 15 application that visualizes NAV's architecture by fetching data from BigQuery and rendering interactive network graphs using vis-network. It displays relationships between NAIS applications including synchronous calls, Kafka topics, databases, and external hosts.

## Build, Test, and Lint

```bash
# Development
npm run dev              # Start dev server
npm run local            # Start with local testdata (no BigQuery)

# Build and start
npm run build            # Build for production
npm start                # Start production server

# Code quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run prettier:check   # Check formatting
npm run prettier:write   # Fix formatting
npm run format           # Run prettier + eslint fix
npm run tsc              # TypeScript type check
```

## Architecture

### Data Flow

1. **Data Source**: BigQuery table `aura-prod-d7e3.dataproduct_apps.dataproduct_apps_unique_v3` contains NAIS app metadata
2. **Data Fetching**: `src/bigquery/naisAppsFetching.ts` queries BigQuery or loads from testdata
3. **Node Calculation**: `src/nodes/kalkulerNoder.ts` transforms NaisApp data into graph nodes
4. **Edge Calculation**: `src/nodes/kalkulerNoderOgKanter.ts` creates edges between nodes based on relationships
5. **Filtering**: `src/nodes/filtrerNoder.ts` applies user filters (Trie-based search)
6. **Rendering**: `src/components/Graph.tsx` renders the network using vis-network

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/bigquery/` - BigQuery integration and testdata
- `src/nodes/` - Node/edge calculation logic for architecture graphs
- `src/components/` - React components (Arkitektur, Graph, etc.)
- `src/trie/` - Trie data structure for efficient app name search
- `src/databaser/` - Manual database mappings per namespace
- `src/namespace/` - Namespace colors and emoji mappings
- `src/auth/` - Azure AD authentication via @navikt/oasis

### Routes

- `/` - Main architecture visualization (Arkitektur component)
- `/po-helse` - PO Health team documentation
- `/tbd-rapid` - TBD Rapid Kafka events visualization
- `/api/v1/naisapper` - API endpoint returning all NAIS apps
- `/api/v1/tbd-rapid` - API endpoint for TBD Rapid data
- `/api/internal/isAlive` - Health check endpoint
- `/api/internal/preStop` - Pre-stop hook

## Conventions

### State Management

- **URL State**: Use `nuqs` for all user-facing filters and settings (env, filter, emoji, nivaaerInn, nivaaerUt, slettedeNoder)
- **Server State**: Use `@tanstack/react-query` for data fetching (NaisApp data, TBD Rapid data)
- **Component State**: Use React `useState` only for ephemeral UI state not relevant to URL sharing

### Node Calculation Pattern

When working with graph node/edge calculations:

1. Start with `kalkulerNoder()` to create base nodes from NaisApp data
2. Apply filters with `filtrerNoder()` using Trie search
3. Calculate edges with `kalkulerNoderOgKanter()` based on visibility options (kafka, sync calls, external hosts, databases)
4. For Rapid: Use `kalkulerRapidNoder()` and `kalkulerRapidNoderOgKanter()` instead

### Filtering Logic

- **Trie Search**: Apps are indexed in a Trie for O(m) prefix matching where m = query length
- **Multi-token Support**: Space-separated tokens are AND-ed together
- **Node Deletion**: Deleted nodes are tracked in URL state and excluded from graph
- **Level Expansion**: `nivaaerInn`/`nivaaerUt` control how many relationship levels to traverse

### Authentication

- Uses `@navikt/oasis` for Azure AD token validation
- `middleware.ts` intercepts requests and adds `x-path` header for redirect
- `verifyUserLoggedIn()` validates token in Server Components
- Local development skips auth when `LOCAL_TESTDATA=true`

### Environment Setup

For BigQuery access:
```bash
# Authenticate with gcloud
gcloud auth application-default login

# Create .env file
GOOGLE_APPLICATION_CREDENTIALS=/Users/you/.config/gcloud/application_default_credentials.json
GOOGLE_CLOUD_PROJECT=flex-dev  # or another project where you have BigQuery access
```

For local testdata (no BigQuery required):
```bash
npm run local  # Sets LOCAL_TESTDATA=true
```

### NAV-Specific Dependencies

- `@navikt/ds-react` - Design system components (Alert, Button, Chips, etc.)
- `@navikt/oasis` - Azure AD authentication
- `@navikt/next-logger` - Structured logging
- `@navikt/eslint-config-teamsykmelding` - Shared ESLint config

### TypeScript Path Alias

Use `@/*` for all imports: `import { NaisApp } from '@/types'`

### Database Mappings

Databases are not in the BigQuery dataproduct. Manual mappings are maintained in `src/databaser/databaser.ts`. To update:

```bash
kubectl get app -n <namespace> -o json | jq '[.items[] | {appName: .metadata.name, namespace: .metadata.namespace, databases: [(.spec.gcp?.sqlInstances[]?.databases[]? | .name)]} | select(.databases | length > 0)] | sort_by(.appName)'
```

## Graph Visualization Options

The Arkitektur component supports these toggles:
- **visKafka**: Show Kafka topic relationships
- **visSynkroneAppKall**: Show synchronous app-to-app calls
- **visEksterneKall**: Show calls to external hosts
- **visDatabase**: Show database connections
- **visIngresser**: Show ingress endpoints
- **emoji**: Use emoji instead of namespace names in node labels

## Testing Changes

No automated tests exist. Verify changes by:
1. Running `npm run local` to test with local testdata
2. Checking TypeScript compilation with `npm run tsc`
3. Running linter with `npm run lint`
4. Visually testing graph rendering for your changes
