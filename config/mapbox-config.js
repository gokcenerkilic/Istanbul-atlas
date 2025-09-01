// config/mapbox-config.js  (ES module)

export const MAPBOX = {
  ACCESS_TOKEN: 'pk.eyJ1IjoiZ29rY2VuZXJraWxpYyIsImEiOiJjbWVtdzR3cHkwd3o1MmtvbGJqYTFqa2s3In0.Mc_XAHqv1rpTz6BuZndegQ',
  STYLE: 'mapbox://styles/gokcenerkilic/cm7et6tk1003o01qpfltz19qs',
  CENTER: [29.0, 41.0],
  ZOOM: 10
};

// Layer configuration for interactive layers
export const LAYER_CONFIG = {
  R1: {
    id: 'R1',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ff0000',
    originalWidth: 2,
    highlightColor: '#ff0000',
    highlightWidth: 6,
    name: 'R1 Region',
    category: 'Residential'
  },
  A1: {
    id: 'A1',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ff0000',
    originalWidth: 2,
    highlightColor: '#ff0000',
    highlightWidth: 6,
    name: 'A1 Area',
    category: 'Administrative'
  },
  A2: {
    id: 'A2',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ffffff',       // avoid 8-digit hex; use #ffffff or rgba()
    originalWidth: 2,
    highlightColor: '#ffffff',
    highlightWidth: 6,
    name: 'A2 Area',
    category: 'Administrative'
  },
  D1: {
    id: 'D1',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ff0000',
    originalWidth: 2,
    highlightColor: '#ff0000',
    highlightWidth: 6,
    name: 'D1 District',
    category: 'Development'
  },
  D2: {
    id: 'D2',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ffffff',       // was '#ffffffff' → changed
    originalWidth: 2,
    highlightColor: '#ffffff',
    highlightWidth: 6,
    name: 'D2 District',
    category: 'Development'
  },
  G1: {
    id: 'G1',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ff0000',
    originalWidth: 2,
    highlightColor: '#ff0000',
    highlightWidth: 6,
    name: 'G1 Zone',
    category: 'Green'
  },
  G2: {
    id: 'G2',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ffffff',       // was '#ffffffff' → changed
    originalWidth: 2,
    highlightColor: '#ffffff',
    highlightWidth: 6,
    name: 'G2 Zone',
    category: 'Green'
  },
  GCL1: {
    id: 'GCL1',
    source: 'composite',
    sourceLayer: 'cl-c4sq61',
    originalColor: '#ff0000',
    originalWidth: 2,
    highlightColor: '#ff0000',
    highlightWidth: 6,
    name: 'GCL1 Coastline',
    category: 'Coastal'
  }
};
