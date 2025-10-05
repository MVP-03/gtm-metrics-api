'use strict';

const express = require('express');
const campaignRoutes = require('./routes/campaigns');
const metricsRoutes = require('./routes/metrics');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/campaigns', campaignRoutes);
app.use('/metrics', metricsRoutes);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`gtm-metrics-api running on :${PORT}`));
}

module.exports = app;
