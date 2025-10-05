# gtm-metrics-api

REST API for querying outbound campaign metrics and A/B variant analysis. Built with Node.js and Express.

## Architecture

```
src/
  data/           campaigns.json    flat data store
  services/       campaignService   filter / lookup
                  metricsService    aggregate / compare
  routes/         campaigns         CRUD-style endpoints
                  metrics           summary + variant analysis
  middleware/     validate          query-param guard factory
                  errorHandler      centralised 4-arg handler
  index.js        app entry, mounts routers
tests/
  campaigns.test.js  supertest integration suite
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/campaigns` | All rows; `?name=` filter |
| GET | `/campaigns/names` | Unique campaign names |
| GET | `/campaigns/:id` | Single row by id |
| GET | `/metrics/summary` | Aggregate rates; `?campaign=` filter |
| GET | `/metrics/variants` | A/B comparison — requires `?campaign=` |

## Quickstart

```bash
npm install
npm start          # http://localhost:3000

# dev with auto-reload
npm run dev
```

## Testing

```bash
npm test
```

## Sample Requests

```bash
# overall metrics
curl http://localhost:3000/metrics/summary

# A/B comparison for a campaign
curl "http://localhost:3000/metrics/variants?campaign=Q2%20Series%20B%20Outbound"

# filter rows by campaign
curl "http://localhost:3000/campaigns?name=Reactivation%20-%20Churned"
```
