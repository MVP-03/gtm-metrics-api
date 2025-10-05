'use strict';

const { Router } = require('express');
const campaignService = require('../services/campaignService');
const { requireQuery } = require('../middleware/validate');

const router = Router();

// GET /campaigns — list all campaigns, optional ?name= filter
router.get('/', (req, res) => {
  const results = campaignService.getAll({ name: req.query.name });
  res.json({ count: results.length, data: results });
});

// GET /campaigns/names — unique campaign name list
router.get('/names', (_req, res) => {
  res.json({ data: campaignService.listNames() });
});

// GET /campaigns/:id — single campaign row by id
router.get('/:id', (req, res, next) => {
  const campaign = campaignService.getById(req.params.id);
  if (!campaign) {
    const err = new Error(`Campaign ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ data: campaign });
});

module.exports = router;
