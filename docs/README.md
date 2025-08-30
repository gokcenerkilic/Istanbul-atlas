# Istanbul Coastline Atlas

An interactive web mapping application for exploring Istanbul's coastline with drawing tools and layer interactions.

## Project Structure

```
istanbul-coastline-atlas/
├── frontend/
│   ├── index.html              # Main HTML file
│   ├── css/
│   │   └── styles.css          # All styling
│   └── js/
│       ├── main.js             # Map initialization
│       ├── layer-interactions.js # R1 layer hover/click functionality
│       └── drawing-tools.js    # Freehand drawing functionality
├── data/
│   ├── layers/                 # Layer data files
│   └── popup-content/          # Images and content for popups
├── docs/
│   └── README.md               # This file
└── config/
    └── mapbox-config.js        # Mapbox tokens and configuration
```

## Features

### 🗺️ **Interactive Map**
- Custom Mapbox style for Istanbul coastline
- Red crosshair cursor throughout the map
- Centered on Istanbul coordinates

### 🎯 **R1 Layer Interactions**
- **Hover**: Line highlights in red and shows popup
- **Click**: Pins the popup permanently (until closed)
- **Popup Content**: Placeholder for images and information

### ✏️ **Drawing Tools**
- Floating pencil icon to open drawing panel
- Freehand drawing with black lines
- Clear all drawings functionality
- Drawing panel slides in from the right

## Setup Instructions

### 1. **Open in VS Code**
1. Download all files to your project folder
2. Open VS Code
3. File → Open Workspace from File
4. Select `istanbul-atlas.code-workspace`

### 2. **Install Recommended Extensions**
VS Code will prompt you to install:
- Live Server (for local development)
- Prettier (code formatting)
- Auto Rename Tag
- Tailwind CSS IntelliSense

### 3. **Run the Project**
1. Right-click on `frontend/index.html`
2. Select "Open with Live Server"
3. Map will open in your default browser

## Configuration

### **Mapbox Settings**
Edit `config/mapbox-config.js` to update:
- Access token
- Map style
- Default center coordinates
- Default zoom level

### **Layer Configuration**
The R1 layer configuration is in `config/mapbox-config.js`:
- Source: `composite`
- Source Layer: `cl-c4sq61`
- Colors and styling options

## Customization

### **Adding Popup Content**
1. Place images in `data/popup-content/`
2. Edit the `createPopupContent()` function in `layer-interactions.js`
3. Replace placeholder content with your data

### **Styling**
- Main styles in `frontend/css/styles.css`
- Uses Hack font family (regular weight)
- Glassmorphism effects with backdrop blur

### **Adding More Layers**
1. Add layer config to `LAYER_CONFIG` in `config/mapbox-config.js`
2. Create interaction functions in `layer-interactions.js`
3. Follow the same pattern as R1 layer

## Browser Compatibility

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

## Dependencies

- Mapbox GL JS v3.12.0
- Google Fonts (Hack font)
- No additional npm packages required

## Development Tips

- Use browser DevTools to debug map issues
- Check console for Mapbox API errors
- Verify access token permissions
- Test on Live Server (not file:// protocol)

## File Descriptions

- **index.html**: Main application entry point
- **styles.css**: Complete styling including custom cursor
- **main.js**: Map initialization and setup
- **layer-interactions.js**: R1 hover/click functionality
- **drawing-tools.js**: Freehand drawing implementation
- **mapbox-config.js**: Configuration and API credentials