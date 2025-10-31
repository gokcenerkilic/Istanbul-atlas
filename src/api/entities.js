import { Entity, Auth } from '@base44/sdk';

// Initialize Base44 entities with proper schemas

// Contribution Entity - User submitted media with location
export const Contribution = new Entity('contributions', {
  schema: {
    contributionId: { type: 'string', required: true }, // Format: CONT-001, CONT-002, etc.
    type: { type: 'string', required: true }, // 'photo', 'video', 'audio'
    title: { type: 'string', required: true },
    description: { type: 'string' },
    contributor_name: { type: 'string', required: true },
    contributor_email: { type: 'string' },
    location: {
      type: 'object',
      properties: {
        lat: { type: 'number', required: true },
        lng: { type: 'number', required: true }
      }
    },
    media_url: { type: 'string', required: true },
    thumbnail_url: { type: 'string' },
    status: { type: 'string', default: 'pending' }, // 'pending', 'approved', 'rejected'
    created_date: { type: 'date', default: () => new Date() },
    approved_date: { type: 'date' }
  }
});

// Drawing Entity - User drawn polygons/lines on map
export const Drawing = new Entity('drawings', {
  schema: {
    drawingId: { type: 'string', required: true }, // Format: DRW-001, DRW-002, etc.
    title: { type: 'string' },
    description: { type: 'string' },
    contributor_name: { type: 'string' },
    coordinates: { 
      type: 'array', 
      required: true,
      items: {
        type: 'object',
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' }
        }
      }
    },
    style: {
      type: 'object',
      properties: {
        color: { type: 'string', default: '#ff6b6b' },
        weight: { type: 'number', default: 3 },
        opacity: { type: 'number', default: 0.8 }
      }
    },
    status: { type: 'string', default: 'pending' }, // 'pending', 'approved', 'rejected'
    created_date: { type: 'date', default: () => new Date() },
    approved_date: { type: 'date' }
  }
});

// TextBox Entity - Text annotations on map
export const TextBox = new Entity('textboxes', {
  schema: {
    textBoxId: { type: 'string', required: true }, // Format: TXT-001, TXT-002, etc.
    content: { type: 'string', required: true },
    contributor_name: { type: 'string' },
    coords: {
      type: 'object',
      required: true,
      properties: {
        lat: { type: 'number', required: true },
        lng: { type: 'number', required: true }
      }
    },
    style: {
      type: 'object',
      properties: {
        fontSize: { type: 'string', default: '14px' },
        color: { type: 'string', default: '#000000' },
        backgroundColor: { type: 'string', default: '#ffffff' }
      }
    },
    status: { type: 'string', default: 'pending' }, // 'pending', 'approved', 'rejected'
    created_date: { type: 'date', default: () => new Date() },
    approved_date: { type: 'date' }
  }
});

// WorkshopMedia Entity - Pre-loaded workshop media
export const WorkshopMedia = new Entity('workshop_media', {
  schema: {
    mediaId: { type: 'string', required: true },
    type: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string' },
    location: {
      type: 'object',
      properties: {
        lat: { type: 'number', required: true },
        lng: { type: 'number', required: true }
      }
    },
    media_url: { type: 'string', required: true },
    thumbnail_url: { type: 'string' },
    created_date: { type: 'date', default: () => new Date() }
  }
});

// Auth functions
export const User = {
  currentUser: () => Auth.currentUser(),
  signIn: (credentials) => Auth.signIn(credentials),
  signOut: () => Auth.signOut(),
  isAuthenticated: () => Auth.isAuthenticated(),
  isAdmin: async () => {
    const user = await Auth.currentUser();
    return user?.role === 'admin' || user?.email?.includes('admin');
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