
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { Globe, Users, Camera, Edit3, MapPin, Volume2, Languages } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import MapControls from "../components/atlas/MapControls";
import ContributionPanel from "../components/atlas/ContributionPanel";
import DrawingTools from "../components/atlas/DrawingTools";
import DrawingCanvas from "../components/atlas/DrawingCanvas"; // New import
import LayerControlPanel from "../components/atlas/LayerControlPanel";
import MediaPlayer from "../components/atlas/MediaPlayer";
import LanguageToggle from "../components/atlas/LanguageToggle";
import ContributionMarkers from "../components/atlas/ContributionMarkers";
import DrawingLayer from "../components/atlas/DrawingLayer";
import WorkshopMediaMarkers from "../components/atlas/WorkshopMediaMarkers";
import LocationPicker from "../components/atlas/LocationPicker";
import AdminUploadPanel from "../components/atlas/AdminUploadPanel";
import EnhancedMediaPlayer from "../components/atlas/EnhancedMediaPlayer";
import SearchPanel from "../components/atlas/SearchPanel";
import UIScaleControl from "../components/atlas/UIScaleControl";
import InteractiveMapLayers from "../components/atlas/InteractiveMapLayers";
import TextBoxPanel from "../components/atlas/TextBoxPanel";
import TextBoxMarkers from "../components/atlas/TextBoxMarkers";
import TextBoxPicker from "../components/atlas/TextBoxPicker";
import TextBoxToggle from "../components/atlas/TextBoxToggle";
import MapView3D from "../components/atlas/MapView3D";
import MapView2D from "../components/atlas/MapView2D";
import AdminManagementPanel from "../components/atlas/AdminManagementPanel";
import { Drawing, TextBox, generateSequentialId, User } from "../api/entities";

// --- Mapbox Configuration Updated & Refined ---
const MAPBOX_USERNAME = "gokcenerkilic";
const MAPBOX_STYLE_ID = "cm7et6tk1003o01qpfltz19qs";
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZ29rY2VuZXJraWxpYyIsImEiOiJjbWVtdzR3cHkwd3o1MmtvbGJqYTFqa2s3In0.Mc_XAHqv1rpTz6BuZndegQ";
// ---------------------------------------------

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Atlas() {
  const [language, setLanguage] = useState('tr');
  const [activePanel, setActivePanel] = useState(null);
  const [activeLayer, setActiveLayer] = useState('custom_atlas'); // 'satellite' or 'custom_atlas'
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isLocationMode, setIsLocationMode] = useState(false);
  const [contributionCoords, setContributionCoords] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentDrawings, setCurrentDrawings] = useState([]); // New state for interactive drawings
  const [mapCenter, setMapCenter] = useState([41.0, 29.0]); // Updated center
  const [mapZoom, setMapZoom] = useState(10); // Updated zoom
  const [searchResults, setSearchResults] = useState(null);
  const [uiScale, setUiScale] = useState(1.0);
  const [isTextBoxMode, setIsTextBoxMode] = useState(false);
  const [textBoxes, setTextBoxes] = useState([]);
  const [textBoxCoords, setTextBoxCoords] = useState(null);
  const [showTextBoxes, setShowTextBoxes] = useState(true);
  const [is3DView, setIs3DView] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const translations = {
    tr: {
      title: "İstanbul Kıyı Çizgisi Atlası",
      subtitle: "İstanbul kıyı çizgisinin interaktif haritası ve katılımcı arşivi",
      contribute: "Katkıda Bulun",
      draw: "Çizim Yap",
      media: "Medya",
      layers: "Katmanlar",
      about: "Hakkında",
      textBox: "Metin Kutusu",
      showTextBoxes: "Metin Kutularını Göster",
      hideTextBoxes: "Metin Kutularını Gizle",
      textBoxCount: "metin kutusu"
    },
    en: {
      title: "Istanbul Coastline Atlas",
      subtitle: "Interactive map and participatory archive of Istanbul's coastlines",
      contribute: "Contribute",
      draw: "Draw",
      media: "Media",
      layers: "Layers",
      about: "About",
      textBox: "Text Box",
      showTextBoxes: "Show Text Boxes",
      hideTextBoxes: "Hide Text Boxes",
      textBoxCount: "text boxes"
    }
  };

  const t = translations[language];

  const handleLocationSelect = useCallback((coords) => {
    setContributionCoords(coords);
    setIsLocationMode(false);
  }, []);
  
  const handleContributionPanelOpen = () => {
    setActivePanel('contribute');
    setContributionCoords(null); // Reset coords when panel opens
  };

  const handleContributionPanelClose = () => {
    setActivePanel(null);
    setIsLocationMode(false);
  };

  const handleDrawingComplete = useCallback(async (pathCoordinates) => {
    console.log('Drawing completed:', pathCoordinates);
    
    try {
      // Generate sequential ID for the drawing
      const drawingId = await generateSequentialId(Drawing, 'DRW');
      
      // Save drawing to database
      await Drawing.create({
        drawingId,
        title: `Drawing ${drawingId}`,
        description: '',
        contributor_name: 'Anonymous',
        coordinates: pathCoordinates.map(coord => ({
          lat: coord.lat,
          lng: coord.lng
        })),
        style: {
          color: '#ff6b6b',
          weight: 3,
          opacity: 0.8
        },
        status: 'pending',
        created_date: new Date()
      });
      
      console.log(`✅ Drawing saved with ID: ${drawingId}`);
      
      // Add to local state for immediate display
      setCurrentDrawings(prev => [...prev, pathCoordinates]);
    } catch (error) {
      console.error('Error saving drawing:', error);
      alert('Error saving drawing. Please try again.');
    }
    
    setIsDrawingMode(false);
    setActivePanel(null);
  }, []);

  const handleClearDrawings = useCallback(() => {
    setCurrentDrawings([]); // Clear all drawings from state
  }, []);

  // Prevent closing drawing panel while in drawing mode
  const handleDrawingToolsClose = () => {
    if (isDrawingMode) {
      setIsDrawingMode(false);
    }
    // Keep panel open if there are unsaved drawings
    setActivePanel(null);
  };

  const handleSearchResultClick = (result) => {
    // Pan map to search result location
    setMapCenter([result.lat, result.lng]);
    setMapZoom(16);
    
    // Close search panel and show result
    setActivePanel(null);
    if (result.data.type === 'media') {
      setSelectedMedia(result.data);
    }
  };

  const handleTextBoxLocationSelect = useCallback((coords) => {
    setTextBoxCoords(coords);
  }, []);

  const handleSaveTextBox = useCallback((textBox) => {
    setTextBoxes(prev => {
      const updatedTextBoxes = [...prev, textBox];
      // Store in localStorage for persistence
      localStorage.setItem('atlasTextBoxes', JSON.stringify(updatedTextBoxes));
      return updatedTextBoxes;
    });
    setTextBoxCoords(null);
    setIsTextBoxMode(false);
    setActivePanel(null);
  }, []);

  const handleTextBoxClick = useCallback((textBox) => {
    // Pan to text box location
    setMapCenter([textBox.coords.lat, textBox.coords.lng]);
    setMapZoom(15);
  }, []);

  const handleDeleteTextBox = useCallback((textBoxId) => {
    setTextBoxes(prev => {
      const updatedTextBoxes = prev.filter(tb => tb.id !== textBoxId);
      // Update localStorage
      localStorage.setItem('atlasTextBoxes', JSON.stringify(updatedTextBoxes));
      return updatedTextBoxes;
    });
  }, []);

  // Load text boxes from localStorage on mount
  useEffect(() => {
    const savedTextBoxes = localStorage.getItem('atlasTextBoxes');
    if (savedTextBoxes) {
      try {
        setTextBoxes(JSON.parse(savedTextBoxes));
      } catch (error) {
        console.error('Error loading text boxes:', error);
      }
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
              </div>
              <p className="text-gray-200 text-sm md:text-base max-w-md">
                {t.subtitle}
              </p>
            </div>
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </div>

      {/* Map Container - Conditional Rendering for 2D/3D */}
      {!is3DView ? (
        <MapView2D 
          center={mapCenter}
          zoom={mapZoom}
          activeLayer={activeLayer}
          language={language}
          textBoxes={textBoxes}
          showTextBoxes={showTextBoxes}
          onTextBoxClick={handleTextBoxClick}
          onDeleteTextBox={handleDeleteTextBox}
          isDrawingMode={isDrawingMode}
          onDrawingComplete={handleDrawingComplete}
          isLocationMode={isLocationMode}
          onLocationSelect={(coords) => setContributionCoords(coords)}
          isTextBoxMode={isTextBoxMode}
          onTextBoxLocationSelect={handleTextBoxLocationSelect}
        />
      ) : (
        <MapView3D 
          center={mapCenter}
          zoom={mapZoom}
          activeLayer={activeLayer}
          language={language}
          textBoxes={textBoxes}
          showTextBoxes={showTextBoxes}
          onTextBoxClick={handleTextBoxClick}
          onDeleteTextBox={handleDeleteTextBox}
          onMediaClick={setSelectedMedia}
        />
      )}

      {/* Map Controls */}
      <MapControls 
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        onContributeClick={handleContributionPanelOpen}
        isDrawingMode={isDrawingMode}
        setIsDrawingMode={setIsDrawingMode}
        language={language}
        is3DView={is3DView}
        setIs3DView={setIs3DView}
        onAdminClick={() => setShowAdminPanel(true)}
      />

      {/* Side Panels */}
      <ContributionPanel 
        isOpen={activePanel === 'contribute'}
        onClose={handleContributionPanelClose}
        language={language}
        isLocationMode={isLocationMode}
        setIsLocationMode={setIsLocationMode}
        coords={contributionCoords}
        scale={uiScale}
      />
      
      <LayerControlPanel
        isOpen={activePanel === 'layers'}
        onClose={() => setActivePanel(null)}
        language={language}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        scale={uiScale}
      />

      <DrawingTools 
        isOpen={activePanel === 'draw'}
        onClose={handleDrawingToolsClose}
        isDrawingMode={isDrawingMode}
        setIsDrawingMode={setIsDrawingMode}
        language={language}
        onDrawingComplete={handleDrawingComplete} // Pass the handler for completion
        onClearDrawings={handleClearDrawings}     // Pass the clear drawings handler
        scale={uiScale}
      />

      <AdminUploadPanel
        isOpen={activePanel === 'upload'}
        onClose={() => setActivePanel(null)}
        language={language}
        scale={uiScale}
      />

      <SearchPanel
        isOpen={activePanel === 'search'}
        onClose={() => setActivePanel(null)}
        language={language}
        onResultClick={handleSearchResultClick}
        scale={uiScale}
      />

      <TextBoxPanel
        isOpen={activePanel === 'textbox'}
        onClose={() => {
          setActivePanel(null);
          setIsTextBoxMode(false);
          setTextBoxCoords(null);
        }}
        language={language}
        isLocationMode={isTextBoxMode}
        setIsLocationMode={setIsTextBoxMode}
        coords={textBoxCoords}
        onSaveTextBox={handleSaveTextBox}
        scale={uiScale}
      />

      {/* Enhanced Media Player Modal */}
      {selectedMedia && (
        <EnhancedMediaPlayer 
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          language={language}
          scale={uiScale}
        />
      )}

      {/* Footer Info */}
      <div className="absolute bottom-4 left-4 z-50 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{language === 'tr' ? 'Topluluk destekli proje' : 'Community-supported project'}</span>
        </div>
      </div>
      
      {/* Text Box Toggle Control */}
      {textBoxes.length > 0 && (
        <TextBoxToggle
          showTextBoxes={showTextBoxes}
          setShowTextBoxes={setShowTextBoxes}
          textBoxCount={textBoxes.length}
          language={language}
        />
      )}
      
      <UIScaleControl scale={uiScale} setScale={setUiScale} language={language} />
      
      {/* Admin Management Panel */}
      {showAdminPanel && (
        <AdminManagementPanel
          language={language}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}
