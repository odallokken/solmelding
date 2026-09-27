import { getStore } from '@netlify/blobs';
import { handleScores } from '../lib/scores.mjs';

export default async (request, context) => {
  try {
    const name = context.deploy.context === 'production' ? 'backgammon' : `backgammon-preview-${context.deploy.id}`;
    return await handleScores(request, getStore({ name, consistency: 'strong' }), process.env.SCORES_PIN);
  } catch (error) {
    console.error('Could not connect to backgammon store:', error);
    return new Response(JSON.stringify({ error: 'Poengtjenesten er ikke tilgjengelig.' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
};

export const config = {
  rateLimit: { action: 'rate_limit', windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
