// Service to handle secure clue retrieval via Netlify Functions

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

  // Claim the clue using the session token
  async claimClue(): Promise<string | null> {
    if (!sessionToken) {
      return null;
    }

    try {
      const response = await fetch('/.netlify/functions/claim-clue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sessionToken }),
      });

      if (response.ok) {
        const data = await response.json();
        // Clear token after use
        sessionToken = null;
        return data.clue;
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



