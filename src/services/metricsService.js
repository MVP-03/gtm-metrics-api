'use strict';

const campaigns = require('../data/campaigns.json');

/**
 * Aggregate campaign rows into summary metrics.
 * @param {string} campaignName - filter to this campaign; pass null for all
 */
function summarise(campaignName = null) {
  const rows = campaignName
    ? campaigns.filter(c => c.campaign_name === campaignName)
    : campaigns;

  if (!rows.length) return null;

  const totals = rows.reduce(
    (acc, r) => ({
      sent:            acc.sent + r.sent,
      opened:          acc.opened + r.opened,
      replied:         acc.replied + r.replied,
      positiveReplies: acc.positiveReplies + (r.positive_replies ?? 0),
      meetings:        acc.meetings + (r.meetings_booked ?? 0),
    }),
    { sent: 0, opened: 0, replied: 0, positiveReplies: 0, meetings: 0 }
  );

  return {
    campaignName: campaignName ?? 'all',
    ...totals,
    openRate:          rate(totals.opened, totals.sent),
    replyRate:         rate(totals.replied, totals.sent),
    bookingRate:       rate(totals.meetings, totals.sent),
    positiveReplyRate: rate(totals.positiveReplies, totals.replied),
  };
}

/**
 * Compare A/B variants within a campaign by booking rate.
 * @returns {Array} variant summaries sorted by booking rate desc, with winner flag
 */
function compareVariants(campaignName) {
  const rows = campaigns.filter(c => c.campaign_name === campaignName);
  const byVariant = {};

  for (const r of rows) {
    const v = r.variant ?? 'default';
    if (!byVariant[v]) {
      byVariant[v] = { sent: 0, replied: 0, meetings: 0 };
    }
    byVariant[v].sent    += r.sent;
    byVariant[v].replied += r.replied;
    byVariant[v].meetings += (r.meetings_booked ?? 0);
  }

  const variants = Object.entries(byVariant).map(([variant, t]) => ({
    variant,
    sent:        t.sent,
    replyRate:   rate(t.replied, t.sent),
    bookingRate: rate(t.meetings, t.sent),
  }));

  variants.sort((a, b) => b.bookingRate - a.bookingRate);
  if (variants.length) variants[0].winner = true;

  return variants;
}

function rate(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 10000) / 10000;
}

module.exports = { summarise, compareVariants };
