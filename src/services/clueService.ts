// Service to handle secure clue/reward retrieval via Netlify Functions
import type { GameMode } from '../types/game.types';

export const clueService = {
  // Claim the reward based on game mode
  // Generates token and claims reward in one flow (no expiration issues)
  async claimReward(mode: GameMode): Promise<string | null> {
    try {
      // Step 1: Get a fresh token
      const tokenResponse = await fetch('/.netlify/functions/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!tokenResponse.ok) {
        return null;
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      if (!token) {
        return null;
      }

      // Step 2: Immediately use token to claim reward
      const endpoint = mode === 'hell' 
        ? '/.netlify/functions/claim-hell-reward'
        : '/.netlify/functions/claim-clue';

      const claimResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (claimResponse.ok) {
        const data = await claimResponse.json();
        // Return either 'clue' or 'message' depending on endpoint
        return data.clue || data.message;
      }

      return null;
    } catch (e) {
      return null;
    }
  },
};
