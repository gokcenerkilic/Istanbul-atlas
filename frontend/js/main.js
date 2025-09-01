// frontend/js/main.js
import { MAPBOX } from '../../config/mapbox.js';
import { setupDrawing } from './drawing-wire-in.js';
// If exported from layer-interactions.js:
import { initializeLayerInteractions } from './layer-interactions.js';

mapboxgl.accessToken = MAPBOX.ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: MAPBOX.STYLE,
  center: MAPBOX.CENTER,
  zoom: MAPBOX.ZOOM
});

map.on('load', () => {
  console.log('Map loaded successfully');

  // Attach drawing overlay (also ensures 'drawings' source/layer exists)
  setupDrawing(map);

  // Your other interactions (only if exported/imported)
  if (typeof initializeLayerInteractions === 'function') {
    initializeLayerInteractions(map);
  }

  window.map = map; // optional for console testing
});

map.on('error', (e) => console.error('Mapbox error:', e));
