import React, { useRef, useEffect, useState } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl, GeolocateControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MessageSquare } from 'lucide-react';
import { Drawing, Contribution, WorkshopMedia } from '@/api/entities';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZ29rY2VuZXJraWxpYyIsImEiOiJjbWVtdzR3cHkwd3o1MmtvbGJqYTFqa2s3In0.Mc_XAHqv1rpTz6BuZndegQ";
const MAPBOX_USERNAME = "gokcenerkilic";
const MAPBOX_STYLE_ID = "cm7et6tk1003o01qpfltz19qs";

export default function MapView3D({ 
  center, 
  zoom, 
  activeLayer,
  language,
  onMapLoad,
  textBoxes,
  showTextBoxes,
  onTextBoxClick,
  onDeleteTextBox,
  onMediaClick
}) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: center[1],
    latitude: center[0],
    zoom: Math.max(zoom, 15), // Ensure minimum zoom of 15 to see buildings
    pitch: 45, // 3D tilt angle (45 degrees is optimal for buildings)
    bearing: -17.6 // Slight rotation for better perspective
  });

  const [terrainEnabled, setTerrainEnabled] = useState(true);
  const [buildingsEnabled, setBuildingsEnabled] = useState(true);
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [hoveredDrawing, setHoveredDrawing] = useState(null);

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

  // Load drawings
  useEffect(() => {
    const loadDrawings = async () => {
      try {
        const data = await Drawing.filter({ status: 'approved' });
        setDrawings(data.filter(drawing => drawing.coordinates && drawing.coordinates.length > 0));
      } catch (error) {
        console.error('Error loading drawings:', error);
      }
    };
    loadDrawings();
  }, []);

  // Load contributions
  useEffect(() => {
    const loadContributions = async () => {
      try {
        const data = await Contribution.filter({ status: 'approved' });
        setContributions(data);
      } catch (error) {
        console.error('Error loading contributions:', error);
      }
    };
    loadContributions();
  }, [language]);

  // Load workshop media
  useEffect(() => {
    const loadWorkshopMedia = async () => {
      try {
        const data = await WorkshopMedia.list('-created_date');
        setMediaItems(data.filter(item => item.latitude && item.longitude));
      } catch (error) {
        console.error('Error loading workshop media:', error);
      }
    };
    loadWorkshopMedia();
  }, []);

  // Add hover interactions for drawing lines
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    const handleMouseMove = (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: drawings.map(d => `drawing-layer-${d.id}`)
      });

      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        const feature = features[0];
        const drawingId = feature.properties.id;
        const drawing = drawings.find(d => d.id === drawingId);
        
        if (drawing && !hoveredDrawing) {
          setHoveredDrawing({
            drawing,
            lngLat: e.lngLat
          });
        }
      } else {
        map.getCanvas().style.cursor = '';
        if (hoveredDrawing) {
          setHoveredDrawing(null);
        }
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      setHoveredDrawing(null);
    };

    map.on('mousemove', handleMouseMove);
    map.on('mouseleave', handleMouseLeave);

    return () => {
      map.off('mousemove', handleMouseMove);
      map.off('mouseleave', handleMouseLeave);
    };
  }, [drawings, hoveredDrawing]);

  // Enable 3D terrain and buildings when map loads
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      
      const onStyleLoad = () => {
        // Add 3D terrain
        if (!map.getSource('mapbox-dem')) {
          map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          });
        }
        
        if (terrainEnabled) {
          map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        }

        // Add 3D buildings
        if (!map.getLayer('3d-buildings')) {
          const layers = map.getStyle().layers;
          const labelLayerId = layers.find(
            (layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
          )?.id;

          map.addLayer(
            {
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 15,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            },
            labelLayerId
          );
        }

        if (buildingsEnabled) {
          map.setLayoutProperty('3d-buildings', 'visibility', 'visible');
        } else {
          map.setLayoutProperty('3d-buildings', 'visibility', 'none');
        }

        if (onMapLoad) {
          onMapLoad(map);
        }
      };

      map.on('style.load', onStyleLoad);

      return () => {
        map.off('style.load', onStyleLoad);
      };
    }
  }, [terrainEnabled, buildingsEnabled, onMapLoad]);

  const translations = {
    tr: {
      terrain: 'Arazi',
      buildings: 'Binalar',
      delete: 'Sil',
      confirmDelete: 'Bu metin kutusunu silmek istediğinizden emin misiniz?'
    },
    en: {
      terrain: 'Terrain',
      buildings: 'Buildings',
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

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={getStyleUrl()}
        antialias={true}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        
        {/* Text Box Markers */}
        {showTextBoxes && textBoxes && textBoxes.map((textBox) => (
          <Marker
            key={textBox.id}
            longitude={textBox.coords.lng}
            latitude={textBox.coords.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedTextBox(textBox);
              if (onTextBoxClick) {
                onTextBoxClick(textBox);
              }
            }}
          >
            <div 
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            >
              <MessageSquare 
                style={{ 
                  color: 'white', 
                  width: '18px', 
                  height: '18px' 
                }} 
              />
            </div>
          </Marker>
        ))}
        
        {/* Text Box Popup */}
        {selectedTextBox && (
          <Popup
            longitude={selectedTextBox.coords.lng}
            latitude={selectedTextBox.coords.lat}
            anchor="bottom"
            onClose={() => setSelectedTextBox(null)}
            closeOnClick={false}
            maxWidth="300px"
          >
            <div className="p-2 min-w-[200px] max-w-[300px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 flex-1">
                  {selectedTextBox.title}
                </h3>
                {onDeleteTextBox && (
                  <button
                    onClick={(e) => handleDeleteTextBox(e, selectedTextBox.id)}
                    className="ml-2 p-1.5 rounded-md hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                    title={t.delete}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {selectedTextBox.content}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {new Date(selectedTextBox.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </Popup>
        )}
        
        {/* Drawing Lines (Red Lines) with Hover Popup */}
        {drawings.map((drawing) => {
          const geojson = {
            type: 'Feature',
            properties: {
              id: drawing.id,
              title: drawing.title || 'Drawing',
              description: drawing.description
            },
            geometry: {
              type: 'LineString',
              coordinates: drawing.coordinates.map(coord => [coord[1], coord[0]])
            }
          };
          
          return (
            <Source key={`drawing-${drawing.id}`} id={`drawing-${drawing.id}`} type="geojson" data={geojson}>
              <Layer
                id={`drawing-layer-${drawing.id}`}
                type="line"
                paint={{
                  'line-color': drawing.style?.color || '#ff6b6b',
                  'line-width': drawing.style?.weight || 3,
                  'line-opacity': drawing.style?.opacity || 0.8
                }}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                }}
              />
            </Source>
          );
        })}
        
        {/* Contribution Markers */}
        {contributions.map((contribution) => (
          <Marker
            key={`contribution-${contribution.id}`}
            longitude={contribution.longitude}
            latitude={contribution.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedContribution(contribution);
            }}
          >
            <div 
              style={{
                backgroundColor: '#3b82f6',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            />
          </Marker>
        ))}
        
        {/* Contribution Popup */}
        {selectedContribution && (
          <Popup
            longitude={selectedContribution.longitude}
            latitude={selectedContribution.latitude}
            anchor="bottom"
            onClose={() => setSelectedContribution(null)}
            closeOnClick={false}
            maxWidth="300px"
          >
            <div className="p-3 min-w-64">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {selectedContribution.title}
              </h3>
              {selectedContribution.description && (
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {selectedContribution.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedContribution.category}
                </span>
                {selectedContribution.contributor_name && (
                  <span>{selectedContribution.contributor_name}</span>
                )}
              </div>
            </div>
          </Popup>
        )}
        
        {/* Workshop Media Markers */}
        {mediaItems.map((media) => (
          <Marker
            key={`media-${media.id}`}
            longitude={media.longitude}
            latitude={media.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              if (onMediaClick) {
                onMediaClick(media);
              }
            }}
          >
            <div 
              style={{
                backgroundColor: media.media_type === 'audio' ? '#8b5cf6' : '#f59e0b',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '8px',
                color: 'white'
              }}
            >
              {media.media_type === 'audio' ? '♪' : '📷'}
            </div>
          </Marker>
        ))}
        
        {/* Hover Popup for Drawing Lines */}
        {hoveredDrawing && (
          <Popup
            longitude={hoveredDrawing.lngLat.lng}
            latitude={hoveredDrawing.lngLat.lat}
            anchor="bottom"
            onClose={() => setHoveredDrawing(null)}
            closeButton={false}
            closeOnClick={false}
            maxWidth="300px"
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-base text-gray-900 mb-1">
                {hoveredDrawing.drawing.title || 'Drawing'}
              </h3>
              {hoveredDrawing.drawing.description && (
                <p className="text-sm text-gray-600">
                  {hoveredDrawing.drawing.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {language === 'tr' ? 'Detaylar için tıklayın' : 'Click for details'}
              </p>
            </div>
          </Popup>
        )}
      </Map>

      {/* 3D Controls Overlay */}
      <div className="absolute bottom-24 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={terrainEnabled}
              onChange={(e) => {
                setTerrainEnabled(e.target.checked);
                const map = mapRef.current?.getMap();
                if (map) {
                  if (e.target.checked) {
                    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                  } else {
                    map.setTerrain(null);
                  }
                }
              }}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">{t.terrain}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={buildingsEnabled}
              onChange={(e) => {
                setBuildingsEnabled(e.target.checked);
                const map = mapRef.current?.getMap();
                if (map) {
                  const layer = map.getLayer('3d-buildings');
                  if (layer) {
                    map.setLayoutProperty(
                      '3d-buildings',
                      'visibility',
                      e.target.checked ? 'visible' : 'none'
                    );
                  }
                }
              }}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">{t.buildings}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
