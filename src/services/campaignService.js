'use strict';

const campaigns = require('../data/campaigns.json');

/** Return all campaigns, optionally filtered by name substring. */
function getAll({ name } = {}) {
  if (!name) return campaigns;
  const q = name.toLowerCase();
  return campaigns.filter(c => c.campaign_name.toLowerCase().includes(q));
}

/** Return a single campaign by id, or null if not found. */
function getById(id) {
  return campaigns.find(c => c.id === id) ?? null;
}

/** Return unique campaign names. */
function listNames() {
  return [...new Set(campaigns.map(c => c.campaign_name))];
}

module.exports = { getAll, getById, listNames };
