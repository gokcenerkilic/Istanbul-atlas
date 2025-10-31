import { base44 } from './base44Client';

// Base44 entities are accessed through the client
// The client provides: base44.entities.EntityName.method()

// Helper to get entity with fallback
const getEntity = (entityName) => {
  if (base44.entities && base44.entities[entityName]) {
    return base44.entities[entityName];
  }
  // Return mock entity if not available
  return {
    list: () => Promise.resolve([]),
    filter: () => Promise.resolve([]),
    get: () => Promise.resolve(null),
    create: (data) => Promise.resolve({ _id: Date.now().toString(), ...data }),
    update: (id, data) => Promise.resolve({ _id: id, ...data }),
    delete: () => Promise.resolve({ success: true })
  };
};

// Export entity accessors
// Note: Entity schemas should be defined in Base44 dashboard
export const Contribution = getEntity('contributions');
export const Drawing = getEntity('drawings');
export const TextBox = getEntity('textboxes');
export const WorkshopMedia = getEntity('workshop_media');

// Auth functions using Base44 client
export const User = {
  currentUser: () => base44.auth.me(),
  signIn: (returnPath) => base44.auth.login(returnPath),
  signOut: () => base44.auth.logout(),
  isAuthenticated: () => base44.auth.isAuthenticated(),
  isAdmin: async () => {
    try {
      const user = await base44.auth.me();
      return user?.role === 'admin' || user?.email?.includes('admin');
    } catch {
      return false;
    }
  }
};

// Helper function to generate sequential IDs
export const generateSequentialId = async (entity, prefix) => {
  try {
    // Get all items sorted by ID descending
    const items = await entity.filter({}, { sort: { [`${prefix.toLowerCase()}Id`]: -1 }, limit: 1 });
    
    if (items.length === 0) {
      return `${prefix}-001`;
    }
    
    // Extract number from last ID (e.g., "CONT-005" -> 5)
    const lastId = items[0][`${prefix.toLowerCase()}Id`];
    const lastNumber = parseInt(lastId.split('-')[1]) || 0;
    const nextNumber = lastNumber + 1;
    
    // Format with leading zeros (e.g., 6 -> "006")
    return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating sequential ID:', error);
    // Fallback to timestamp-based ID
    return `${prefix}-${Date.now()}`;
  }
};