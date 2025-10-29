// Mock client for local development
export const base44 = {
  // Mock any methods that are used by the application
  // This will prevent the app from trying to authenticate with Base44
  // while allowing the rest of the application to function
  query: () => Promise.resolve({ data: [] }),
  mutate: () => Promise.resolve({ data: {} }),
  // Add other methods as needed by the application
};
