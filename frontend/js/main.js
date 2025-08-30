// frontend/js/main.js

// 1) Imports
import { MAPBOX } from '../../config/mapbox-config.js';      // uses your config object
import { setupDrawing } from './drawing-wire-in.js';         // our wire-in helper
// If initializeLayerInteractions is exported from layer-interactions.js, import it:
// import { initializeLayerInteractions } from './layer-interactions.js';

// 2) Create the Mapbox map from config
mapboxgl.accessToken = MAPBOX.ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: MAPBOX.STYLE,
  center: MAPBOX.CENTER,
  zoom: MAPBOX.ZOOM
});

// 3) On map load: add drawings layer, then wire in the overlay, then your other init
map.on('load', () => {
  console.log('Map loaded successfully');

  // (A) Ensure a GeoJSON source/layer exists to display saved drawings
  if (!map.getSource('drawings')) {
    map.addSource('drawings', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    map.addLayer({
      id: 'drawings-line',
      type: 'line',
      source: 'drawings',
      paint: {
        'line-color': '#1a73e8',
        'line-width': 3,
        'line-opacity': 0.9
      }
    });
  }

  // (B) Wire-in the drawing overlay on top of the Mapbox canvas
  setupDrawing(map);

  // (C) Initialize your other interactions (if this function exists)
  // If it's globally available via another <script>, this call is fine.
  // If it's an ES module export, import it at the top and call it here.
  if (typeof initializeLayerInteractions === 'function') {
    initializeLayerInteractions(map);
  }

  // (D) Optional: expose for quick testing in DevTools
  window.map = map;
});

// 4) Error handling & debug info
map.on('error', (e) => {
  console.error('Mapbox error:', e);
});

console.log('Istanbul Coastline Atlas initialized');
console.log('Mapbox GL JS version:', mapboxgl.version);
