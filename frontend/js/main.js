// frontend/js/main.js

import { MAPBOX } from '../../config/mapbox-config.js';
import { setupDrawing } from './drawing-wire-in.js';
// If your file exports this, keep the import; otherwise remove it or export from that file:
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

  // Wire-in the drawing overlay (adds/updates the 'drawings' source/layer itself)
  setupDrawing(map);

  // Your other interactions (only if exported/imported as above)
  if (typeof initializeLayerInteractions === 'function') {
    initializeLayerInteractions(map);
  }

  // Optional: for console testing
  window.map = map;
});

map.on('error', (e) => console.error('Mapbox error:', e));

console.log('Istanbul Coastline Atlas initialized');
console.log('Mapbox GL JS version:', mapboxgl.version);
