import React, { useRef, useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MessageSquare } from 'lucide-react';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZ29rY2VuZXJraWxpYyIsImEiOiJjbWVtdzR3cHkwd3o1MmtvbGJqYTFqa2s3In0.Mc_XAHqv1rpTz6BuZndegQ";
const MAPBOX_USERNAME = "gokcenerkilic";
const MAPBOX_STYLE_ID = "cm7et6tk1003o01qpfltz19qs";

// Layer configuration for hover interactions
const LAYER_CONFIG = {
  R1: { id: 'R1', name: 'R1 District', category: 'Residential', color: '#ff4d4d' },
  D1: { id: 'D1', name: 'D1 District', category: 'Development', color: '#ff4d4d' },
  D2: { id: 'D2', name: 'D2 District', category: 'Development', color: '#00ffff' },
  A1: { id: 'A1', name: 'A1 District', category: 'Administrative', color: '#ff0000' },
  A2: { id: 'A2', name: 'A2 District', category: 'Administrative', color: '#00ffff' },
  G1: { id: 'G1', name: 'G1 District', category: 'Green Zone', color: '#ff4d4d' },
  G2: { id: 'G2', name: 'G2 District', category: 'Green Zone', color: '#ffffff' },
  GCL2: { id: 'GCL2', name: 'GCL2 District', category: 'Green Coastline', color: '#ffffff' }
};

export default function MapView2D({ 
  center, 
  zoom, 
  activeLayer,
  language,
  textBoxes,
  showTextBoxes,
  onTextBoxClick,
  onDeleteTextBox
}) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: center[1],
    latitude: center[0],
    zoom: zoom
  });
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get the appropriate style URL based on activeLayer
  const getStyleUrl = () => {
    if (activeLayer === 'satellite') {
      return 'mapbox://styles/mapbox/satellite-streets-v12';
    }
    return `mapbox://styles/${MAPBOX_USERNAME}/${MAPBOX_STYLE_ID}`;
  };

  // Update view when center or zoom changes
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      longitude: center[1],
      latitude: center[0],
      zoom: zoom
    }));
  }, [center, zoom]);

  // Handler for when map loads
  const handleMapLoad = (event) => {
    console.log('🗺️ Map onLoad event fired!');
    setMapLoaded(true);
  };

  // Add hover interactions for district layers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) {
      console.log('⏳ Waiting for map to load...', { hasRef: !!mapRef.current, mapLoaded });
      return;
    }
    
    const map = mapRef.current.getMap();
    console.log('🚀 MapView2D useEffect triggered - setting up hover interactions');

    let hoveredFeatureId = null;
    let currentLayer = null;
    let fixedPopup = null;
    let isPopupFixed = false;

    // Create a popup instance for hover
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '300px'
    });

    // Helper function to create popup content (uses current language prop)
    const createPopupContent = (layerConfig, isFixed) => {
      const currentLang = language || 'en'; // Fallback to English
      const subtitle = isFixed 
        ? `${currentLang === 'tr' ? 'Kapatmak için X\'e tıklayın' : 'Click X to close'}` 
        : `${currentLang === 'tr' ? 'Sabitlemek için tıklayın' : 'Click to pin this popup'}`;
      const title = isFixed 
        ? `${layerConfig.name} (${currentLang === 'tr' ? 'Sabitlendi' : 'Pinned'})` 
        : layerConfig.name;
      
      return `
        <div style="padding: 12px; min-width: 200px;">
          <div style="margin-bottom: 8px;">
            <h3 style="font-weight: bold; font-size: 16px; margin: 0 0 4px 0; color: #111827;">
              ${title}
            </h3>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              ${subtitle}
            </p>
          </div>
          <div style="background: #3b82f6; border-radius: 4px; padding: 40px; margin: 8px 0; text-align: center; color: white;">
            <strong>Placeholder Image</strong><br>
            <span style="font-size: 11px;">[Your content will go here]</span>
          </div>
          <p style="font-size: 14px; color: #374151; margin: 8px 0;">
            ${layerConfig.category} - Information about this ${layerConfig.category.toLowerCase()} area will be displayed here once you upload your content.
          </p>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              <strong>Details:</strong><br>
              Type: ${layerConfig.category}<br>
              Phase: ${isFixed ? 'Active' : 'Planning'}
            </p>
          </div>
        </div>
      `;
    };

    // Helper function to clear hover state
    const clearHoverState = () => {
      if (hoveredFeatureId !== null && currentLayer) {
        try {
          map.setFeatureState(
            { source: 'composite', sourceLayer: currentLayer.id, id: hoveredFeatureId },
            { hover: false }
          );
        } catch (e) {
          console.debug('Feature state not available');
        }
      }
      hoveredFeatureId = null;
      currentLayer = null;
    };

    // Wait for style to load before adding interactions
    const initializeHoverEvents = () => {
      console.log('🗺️ Initializing 2D hover events for district layers');
      
      // List all available layers
      const allLayers = map.getStyle().layers;
      console.log('📋 All available layers:', allLayers.map(l => l.id));

      Object.values(LAYER_CONFIG).forEach(layerConfig => {
        const layerId = layerConfig.id;

        // Check if layer exists
        const layer = map.getLayer(layerId);
        if (!layer) {
          console.log(`❌ Layer ${layerId} NOT FOUND in style`);
          return;
        }

        console.log(`✅ Layer ${layerId} found! Type: ${layer.type}, Source: ${layer.source}`);

        // Update layer paint properties for hover effects using feature-state
        try {
          map.setPaintProperty(layerId, 'line-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#ff0000', // Bright red on hover
            layerConfig.color // Original color
          ]);

          map.setPaintProperty(layerId, 'line-width', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            5, // Thicker on hover
            3 // Original width
          ]);
        } catch (e) {
          console.debug(`Could not set feature-state paint properties for ${layerId}`);
        }

        // Mouse enter: highlight the feature and show popup
        const handleMouseEnter = (e) => {
          // Don't show hover popup if there's already a fixed popup
          if (isPopupFixed) return;

          if (e.features && e.features.length > 0) {
            console.log(`🖱️ Mouse entered layer: ${layerId}`);
            map.getCanvas().style.cursor = 'pointer';
            
            // Clear previous hover state
            clearHoverState();

            // Set new hover state
            const feature = e.features[0];
            hoveredFeatureId = feature.id;
            currentLayer = layerConfig;

            try {
              map.setFeatureState(
                { source: 'composite', sourceLayer: layerId, id: hoveredFeatureId },
                { hover: true }
              );
            } catch (e) {
              console.debug('Feature state not available');
            }

            // Show popup
            const coordinates = e.lngLat;
            const popupContent = createPopupContent(layerConfig, false);
            
            popup.setLngLat(coordinates)
              .setHTML(popupContent)
              .addTo(map);
          }
        };

        // Mouse leave: remove highlight and popup (only if not fixed)
        const handleMouseLeave = () => {
          // Don't remove popup if it's fixed
          if (isPopupFixed) return;

          map.getCanvas().style.cursor = '';
          
          // Remove hover state
          clearHoverState();

          // Remove popup
          popup.remove();
        };

        // Click on layer: fix the popup
        const handleClick = (e) => {
          if (e.features && e.features.length > 0) {
            console.log(`🖱️ Clicked layer: ${layerId}`);
            
            // Remove any existing fixed popup
            if (fixedPopup) {
              fixedPopup.remove();
            }

            // Create a new fixed popup
            const coordinates = e.lngLat;
            const fixedPopupContent = createPopupContent(layerConfig, true);

            fixedPopup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              maxWidth: '300px'
            })
            .setLngLat(coordinates)
            .setHTML(fixedPopupContent)
            .addTo(map);

            // Add fixed popup styling
            fixedPopup.on('open', () => {
              const popupElement = fixedPopup.getElement();
              if (popupElement) {
                popupElement.querySelector('.mapboxgl-popup-content').classList.add('popup-fixed');
              }
            });

            // Handle fixed popup close
            fixedPopup.on('close', () => {
              isPopupFixed = false;
              fixedPopup = null;
            });

            isPopupFixed = true;

            // Remove the hover popup if it exists
            popup.remove();
          }
        };

        // Attach event listeners
        map.on('mouseenter', layerId, handleMouseEnter);
        map.on('mouseleave', layerId, handleMouseLeave);
        map.on('click', layerId, handleClick);
      });
    };

    // Wait for style to load
    const onStyleLoad = () => {
      console.log('🎨 Map style loaded, waiting for layers...');
      // Add a small delay to ensure all layers are fully loaded
      setTimeout(() => {
        console.log('⏰ Initializing hover events after delay');
        initializeHoverEvents();
      }, 1000);
    };

    if (map.isStyleLoaded()) {
      console.log('✅ Style already loaded');
      setTimeout(() => {
        initializeHoverEvents();
      }, 500);
    } else {
      console.log('⏳ Waiting for style to load...');
      map.on('style.load', onStyleLoad);
    }

    // Cleanup
    return () => {
      map.off('style.load', onStyleLoad);
      Object.values(LAYER_CONFIG).forEach(layerConfig => {
        const layerId = layerConfig.id;
        map.off('mouseenter', layerId);
        map.off('mouseleave', layerId);
        map.off('click', layerId);
      });
      clearHoverState();
      popup.remove();
      if (fixedPopup) {
        fixedPopup.remove();
      }
    };
  }, [mapLoaded]); // Run when map loads

  const translations = {
    tr: {
      delete: 'Sil',
      confirmDelete: 'Bu metin kutusunu silmek istediğinizden emin misiniz?'
    },
    en: {
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this text box?'
    }
  };

  const t = translations[language];

  const handleDeleteTextBox = (e, textBoxId) => {
    e.stopPropagation();
    if (window.confirm(t.confirmDelete)) {
      onDeleteTextBox(textBoxId);
      setSelectedTextBox(null);
    }
  };

  const handleTextBoxMarkerClick = (textBox) => {
    setSelectedTextBox(textBox);
    if (onTextBoxClick) {
      onTextBoxClick(textBox);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        mapStyle={getStyleUrl()}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Text Box Markers */}
        {showTextBoxes && textBoxes && textBoxes.map((textBox) => (
          <Marker
            key={textBox.id}
            longitude={textBox.coords.lng}
            latitude={textBox.coords.lat}
            anchor="center"
            onClick={() => handleTextBoxMarkerClick(textBox)}
          >
            <div
              className="bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <MessageSquare size={16} />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
