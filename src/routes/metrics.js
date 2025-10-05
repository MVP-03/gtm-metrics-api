'use strict';

const { Router } = require('express');
const metricsService = require('../services/metricsService');

const router = Router();

// GET /metrics/summary?campaign= — aggregate metrics, optional campaign filter
router.get('/summary', (req, res, next) => {
  const result = metricsService.summarise(req.query.campaign ?? null);
  if (!result) {
    const err = new Error('No data found for the requested campaign');
    err.status = 404;
    return next(err);
  }
  res.json({ data: result });
});

// GET /metrics/variants?campaign= — A/B variant comparison for a campaign
router.get('/variants', (req, res, next) => {
  const { campaign } = req.query;
  if (!campaign) {
    const err = new Error('campaign query parameter is required');
    err.status = 400;
    return next(err);
  }
  const variants = metricsService.compareVariants(campaign);
  res.json({ campaign, data: variants });
});

module.exports = router;
