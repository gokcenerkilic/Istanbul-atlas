import { Base44 } from '@base44/sdk';

// Initialize Base44 client
// Check if environment variables are set, otherwise use mock mode
const projectId = import.meta.env.VITE_BASE44_PROJECT_ID;
const apiKey = import.meta.env.VITE_BASE44_API_KEY;

let base44Client;

if (projectId && apiKey) {
  // Production mode: Use real Base44 client
  console.log('✅ Base44 SDK initialized with project:', projectId);
  base44Client = new Base44({
    projectId,
    apiKey,
    apiUrl: import.meta.env.VITE_BASE44_API_URL || 'https://api.base44.com'
  });
} else {
  // Development mode: Use mock client
  console.warn('⚠️ Base44 credentials not found. Using mock mode.');
  console.warn('To enable Base44 storage:');
  console.warn('1. Copy .env.example to .env');
  console.warn('2. Add your Base44 project ID and API key');
  
  base44Client = {
    // Mock methods for local development
    query: () => Promise.resolve({ data: [] }),
    mutate: () => Promise.resolve({ data: {} }),
    isConnected: () => false
  };
}

export const base44 = base44Client;

// Export helper to check if Base44 is properly configured
export const isBase44Connected = () => {
  return !!(projectId && apiKey);
};
