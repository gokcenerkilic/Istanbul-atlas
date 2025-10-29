// Mock entity functions for local development
const mockEntity = (name) => ({
  find: () => Promise.resolve([]),
  findOne: () => Promise.resolve(null),
  create: (data) => Promise.resolve({ _id: Date.now().toString(), ...data }),
  update: (id, data) => Promise.resolve({ _id: id, ...data }),
  delete: () => Promise.resolve({ success: true })
});

// Export mock entities
export const Contribution = mockEntity('Contribution');
export const Drawing = mockEntity('Drawing');
export const WorkshopMedia = mockEntity('WorkshopMedia');

// Mock auth functions
export const User = {
  currentUser: () => Promise.resolve({ id: 'local-user', name: 'Local User' }),
  signIn: () => Promise.resolve({ user: { id: 'local-user', name: 'Local User' } }),
  signOut: () => Promise.resolve({ success: true }),
  isAuthenticated: () => Promise.resolve(true)
};