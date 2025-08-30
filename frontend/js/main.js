// Initialize Mapbox map
mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: MAPBOX_CONFIG.style,
    center: MAPBOX_CONFIG.center,
    zoom: MAPBOX_CONFIG.zoom
});

// Initialize all functionality when map loads
map.on('load', () => {
    console.log('Map loaded successfully');
    
    // Initialize layer interactions
    initializeLayerInteractions(map);
    
    // Initialize drawing tools
    initializeDrawingTools(map);
});

import { setupDrawing } from './drawing-wire-in.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ29rY2VuZXJraWxpYyIsImEiOiJjbWVtdzR3cHkwd3o1MmtvbGJqYTFqa2s3In0.Mc_XAHqv1rpTz6BuZndegQ';
const map = new mapboxgl.Map({ /* ... your options ... */ });

map.on('load', () => {
  // ... your sources/layers ...
  setupDrawing(map);
});

// Error handling
map.on('error', (e) => {
    console.error('Mapbox error:', e);
});

// Debug information
console.log('Istanbul Coastline Atlas initialized');
console.log('Mapbox GL JS version:', mapboxgl.version);

// Create the overlay on any container element
const overlay = new DrawingOverlay(document.getElementById('your-container'), {
  toolbar: true,             // shows built-in UI
  strokeWidth: 3,
  strokeStyle: '#1a73e8',
  onSave: (data) => {
    // Persist `data.geojson` in your app, or upload to your backend
    console.log('Saved drawing:', data);
  }
});

// When you want users to edit:
overlay.enable();
// To disable edit mode:
overlay.disable();
