/**
 * MARKETING DATASET
 * -----------------------------------
 * INPUT: None
 * OUTPUT: Array<Campaign>
 *
 * PURPOSE:
 *  Tracks campaign performance, ROI, engagement
 */

export const MARKETING = Array.from({ length: 350 }, (_, i) => ({
  id: i + 1,
  campaignId: `CMP${10000 + i}`,
  campaignName: `Campaign ${i + 1}`,
  campaignType: ["Digital", "TV", "In-Store"][i % 3],
  channel: ["Facebook", "Google", "Email", "SMS"][i % 4],
  region: ["South", "North", "West"][i % 3],
  startDate: "2026-01-01",
  endDate: "2026-02-01",
  budget: 50000 + i * 100,
  spend: 30000 + i * 80,
  impressions: 10000 + i * 50,
  clicks: 1000 + i * 10,
  conversions: 100 + (i % 50),
  revenueGenerated: 80000 + i * 120,
  roi: ((80000 + i * 120) / (50000 + i * 100)).toFixed(2),
  customerSegment: ["New", "Returning"][i % 2],
  engagementScore: Math.floor(Math.random() * 100),
  bounceRate: (Math.random() * 50).toFixed(2),
  ctr: ((1000 + i * 10) / (10000 + i * 50)).toFixed(2),
  cpc: (Math.random() * 10).toFixed(2),
  status: ["Active", "Completed", "Paused"][i % 3],
  manager: `Manager ${i % 10}`,
  platform: ["Web", "Mobile"][i % 2],
  createdAt: "2026-01-01",
  updatedAt: "2026-02-01"
}));