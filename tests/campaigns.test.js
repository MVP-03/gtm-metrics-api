'use strict';

const request = require('supertest');
const app     = require('../src/index');

describe('GET /campaigns', () => {
  it('returns all campaigns with count', async () => {
    const res = await request(app).get('/campaigns');
    expect(res.status).toBe(200);
    expect(typeof res.body.count).toBe('number');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(res.body.data.length);
  });

  it('filters by name', async () => {
    const res = await request(app).get('/campaigns?name=Q2+Series+B+Outbound');
    expect(res.status).toBe(200);
    res.body.data.forEach(c => {
      expect(c.campaign_name).toBe('Q2 Series B Outbound');
    });
  });
});

describe('GET /campaigns/names', () => {
  it('returns unique campaign names', async () => {
    const res = await request(app).get('/campaigns/names');
    expect(res.status).toBe(200);
    const names = res.body.data;
    expect(Array.isArray(names)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('GET /campaigns/:id', () => {
  it('returns a single campaign row', async () => {
    const res = await request(app).get('/campaigns/c1-s1-a');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('c1-s1-a');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/campaigns/not-a-real-id');
    expect(res.status).toBe(404);
  });
});

describe('GET /metrics/summary', () => {
  it('returns aggregate metrics across all campaigns', async () => {
    const res = await request(app).get('/metrics/summary');
    expect(res.status).toBe(200);
    const d = res.body.data;
    expect(typeof d.totalSent).toBe('number');
    expect(typeof d.openRate).toBe('number');
    expect(typeof d.replyRate).toBe('number');
    expect(typeof d.bookingRate).toBe('number');
  });

  it('filters summary by campaign name', async () => {
    const res = await request(app).get('/metrics/summary?campaign=Reactivation+-+Churned');
    expect(res.status).toBe(200);
    expect(res.body.data.totalSent).toBeGreaterThan(0);
  });
});

describe('GET /metrics/variants', () => {
  it('returns A/B comparison for a campaign', async () => {
    const res = await request(app).get('/metrics/variants?campaign=Q2+Series+B+Outbound');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const winner = res.body.data.find(v => v.winner);
    expect(winner).toBeDefined();
  });

  it('returns 400 when campaign param is missing', async () => {
    const res = await request(app).get('/metrics/variants');
    expect(res.status).toBe(400);
  });
});
