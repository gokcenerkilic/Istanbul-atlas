# Istanbul Coastline Atlas

An interactive map and participatory archive of Istanbul's coastlines featuring geolocated text boxes, community contributions, and multimedia integration.

## Features

- Interactive Leaflet map with custom Mapbox tiles
- Geolocated text boxes with add, view, delete functionality
- Community contribution system
- Drawing tools for map annotations
- Media player integration
- Multi-language support (Turkish/English)
- LocalStorage persistence
- Modern UI with Tailwind CSS and shadcn/ui

## Getting Started

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

## Usage

### Text Boxes
1. Click cyan Text Box button in left panel
2. Click "Select Location from Map"
3. Click on map to set location
4. Add title and content
5. Click Save

### Features
- View: Click blue markers
- Delete: Click trash icon in popup
- Toggle: Use bottom-right control

## Technologies

- React 18 + Vite
- Leaflet + React Leaflet
- Tailwind CSS + shadcn/ui
- Framer Motion
- LocalStorage for persistence

## License

MIT
