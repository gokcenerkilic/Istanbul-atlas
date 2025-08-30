import { DrawingOverlay } from './drawing-overlay.js';

export function setupDrawing(map) {
  // Add a GeoJSON source/layer to show saved drawings
  if (!map.getSource('drawings')) {
    map.addSource('drawings', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    map.addLayer({
      id: 'drawings-line',
      type: 'line',
      source: 'drawings',
      paint: { 'line-color': '#1a73e8', 'line-width': 3, 'line-opacity': 0.9 }
    });
  }

  // Restore saved drawings
  const saved = localStorage.getItem('atlas:drawings');
  if (saved) map.getSource('drawings').setData(JSON.parse(saved));

  // Overlay on top of the map canvas
  const overlay = new DrawingOverlay(map.getCanvasContainer(), {
    toolbar: true,
    strokeWidth: 3,
    strokeStyle: '#1a73e8',
    simplifyTolerance: 0.5,
    toLngLat: ({ x, y }) => {
      const ll = map.unproject([x, y]);
      return { lng: ll.lng, lat: ll.lat };
    },
    fromLngLat: ({ lng, lat }) => {
      const p = map.project([lng, lat]);
      return { x: p.x, y: p.y };
    },
    onSave: ({ geojson }) => {
      map.getSource('drawings').setData(geojson);
      localStorage.setItem('atlas:drawings', JSON.stringify(geojson));
    }
  });

  // one-liner toggle you can call anywhere:
  window.atlasDrawing = overlay;
}
