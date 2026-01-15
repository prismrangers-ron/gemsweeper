// Service to handle secure clue/reward retrieval via Netlify Functions
import type { GameMode } from '../types/game.types';

let sessionToken: string | null = null;

export const clueService = {
  // Get a new session token when game starts
  async startSession(): Promise<void> {
    try {
      const response = await fetch('/.netlify/functions/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        sessionToken = data.token;
      } else {
        sessionToken = null;
      }
    } catch (e) {
      sessionToken = null;
    }
  },

  // Claim the reward based on game mode
  async claimReward(mode: GameMode): Promise<string | null> {
    if (!sessionToken) {
      return null;
    }

    const endpoint = mode === 'hell' 
      ? '/.netlify/functions/claim-hell-reward'
      : '/.netlify/functions/claim-clue';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sessionToken }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionToken = null;
        // Return either 'clue' or 'message' depending on endpoint
        return data.clue || data.message;
      }
      
      return null;
    } catch (e) {
      return null;
    }
  },

  // Clear the session token
  clearSession(): void {
    sessionToken = null;
  },
};
