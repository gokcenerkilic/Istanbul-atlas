
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Edit3, Palette, Save, Trash2, Play, Square, MousePointer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawing } from "@/api/entities";

export default function DrawingTools({ 
  isOpen, 
  onClose, 
  isDrawingMode, 
  setIsDrawingMode, 
  language,
  onDrawingComplete,
  onClearDrawings,
  scale
}) {
  const [drawingData, setDrawingData] = useState({
    name: '',
    description: '',
    contributor_name: '',
    category: 'coastline',
    style: {
      color: '#ff6b6b',
      weight: 3,
      opacity: 0.8
    }
  });
  const [allPaths, setAllPaths] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Prevent panel from closing while in drawing mode
  const handleClose = () => {
    if (isDrawingMode) {
      // If in drawing mode, stop drawing first
      setIsDrawingMode(false);
    }
    // Always keep panel open if drawing mode was active
    // Only close if user explicitly wants to close and not in drawing mode
    if (!isDrawingMode) {
      onClose();
    }
  };

  const translations = {
    tr: {
      title: "Çizim Araçları",
      subtitle: "Harita üzerinde çizim yapın",
      name: "Çizim Adı",
      description: "Açıklama",
      contributor: "Adınız",
      category: "Kategori",
      color: "Renk",
      thickness: "Kalınlık",
      opacity: "Şeffaflık",
      save: "Kaydet",
      clear: "Temizle",
      startDrawing: "Çizime Başla",
      stopDrawing: "Çizimi Bitir",
      drawingActive: "Çizim Modu Aktif",
      drawingInstructions: "Tıklayıp sürükleyerek çizgi çizin. Birden fazla çizgi çizebilirsiniz.",
      pathsDrawn: "çizgi çizildi",
      categories: {
        coastline: "Kıyı Çizgisi",
        infrastructure: "Altyapı",
        erosion: "Erozyon",
        development: "Gelişim",
        other: "Diğer"
      }
    },
    en: {
      title: "Drawing Tools",
      subtitle: "Draw on the map",
      name: "Drawing Name",
      description: "Description",
      contributor: "Your Name",
      category: "Category",
      color: "Color",
      thickness: "Thickness",
      opacity: "Opacity",
      save: "Save",
      clear: "Clear",
      startDrawing: "Start Drawing",
      stopDrawing: "Stop Drawing",
      drawingActive: "Drawing Mode Active",
      drawingInstructions: "Click and drag to draw lines. You can draw multiple lines.",
      pathsDrawn: "lines drawn",
      categories: {
        coastline: "Coastline",
        infrastructure: "Infrastructure",
        erosion: "Erosion",
        development: "Development",
        other: "Other"
      }
    }
  };

  const t = translations[language];

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

  const handleDrawingComplete = (pathCoordinates) => {
    const newPath = {
      coordinates: pathCoordinates.map(latlng => [latlng.lat, latlng.lng]),
      style: { ...drawingData.style }
    };
    setAllPaths(prev => [...prev, newPath]);
    
    // Call the parent callback if provided
    if (onDrawingComplete) {
      onDrawingComplete(pathCoordinates);
    }
  };

  const handlePathsUpdate = (updatedPaths) => {
    setAllPaths(updatedPaths);
  };

  const handleStartDrawing = () => {
    setIsDrawingMode(true);
  };

  const handleStopDrawing = () => {
    setIsDrawingMode(false);
  };

  const handleSave = async () => {
    if (!drawingData.name.trim()) {
      alert(language === 'tr' ? 'Lütfen çizim için bir ad girin' : 'Please enter a name for the drawing');
      return;
    }

    if (allPaths.length === 0) {
      alert(language === 'tr' ? 'Lütfen önce bir şeyler çizin' : 'Please draw something first');
      return;
    }

    setIsSaving(true);
    try {
      // Combine all paths into one drawing
      const combinedCoordinates = allPaths.flatMap(path => path.coordinates);
      
      await Drawing.create({
        ...drawingData,
        coordinates: combinedCoordinates,
        language
      });
      
      // Reset form and drawings
      setDrawingData({
        name: '',
        description: '',
        contributor_name: '',
        category: 'coastline',
        style: {
          color: '#ff6b6b',
          weight: 3,
          opacity: 0.8
        }
      });
      setAllPaths([]);
      setIsDrawingMode(false);
      
      alert(language === 'tr' ? 'Çizim başarıyla kaydedildi!' : 'Drawing saved successfully!');
    } catch (error) {
      console.error('Error saving drawing:', error);
      alert(language === 'tr' ? 'Çizim kaydedilirken hata oluştu' : 'Error saving drawing');
    }
    setIsSaving(false);
  };

  const handleClear = () => {
    setAllPaths([]);
    if (onClearDrawings) {
      onClearDrawings();
    }
  };

  // Update style for existing paths when user changes style
  const handleStyleChange = (styleUpdate) => {
    const newStyle = { ...drawingData.style, ...styleUpdate };
    setDrawingData({ ...drawingData, style: newStyle });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top right' }}
          className="absolute right-6 top-6 bottom-6 w-80 z-40"
        >
          <Card className="h-full bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    {t.title}
                    {isDrawingMode && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded ml-2">
                        ✏️ Aktif
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-green-100 text-sm mt-1">{t.subtitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Drawing Control */}
                <div className="flex gap-2">
                  {!isDrawingMode ? (
                    <Button
                      onClick={handleStartDrawing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {t.startDrawing}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopDrawing}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      {t.stopDrawing}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClear}
                    disabled={allPaths.length === 0}
                    title={t.clear}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Drawing Status */}
                {isDrawingMode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800 font-medium">
                      <MousePointer className="w-4 h-4 animate-pulse" />
                      {t.drawingActive}
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      {t.drawingInstructions}
                    </p>
                  </div>
                )}

                {allPaths.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    <strong>{allPaths.length}</strong> {t.pathsDrawn}
                  </div>
                )}

                <div>
                  <Input
                    placeholder={t.name}
                    value={drawingData.name}
                    onChange={(e) => setDrawingData({...drawingData, name: e.target.value})}
                    className="border-gray-200"
                  />
                </div>

                <div>
                  <Textarea
                    placeholder={t.description}
                    value={drawingData.description}
                    onChange={(e) => setDrawingData({...drawingData, description: e.target.value})}
                    rows={3}
                    className="border-gray-200"
                  />
                </div>

                <div>
                  <Input
                    placeholder={t.contributor}
                    value={drawingData.contributor_name}
                    onChange={(e) => setDrawingData({...drawingData, contributor_name: e.target.value})}
                    className="border-gray-200"
                  />
                </div>

                <div>
                  <Select
                    value={drawingData.category}
                    onValueChange={(value) => setDrawingData({...drawingData, category: value})}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder={t.category} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.categories).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Style Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{t.color}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          drawingData.style.color === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleStyleChange({ color })}
                      />
                    ))}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {t.thickness}: {drawingData.style.weight}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={drawingData.style.weight}
                      onChange={(e) => handleStyleChange({ weight: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {t.opacity}: {Math.round(drawingData.style.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={drawingData.style.opacity}
                      onChange={(e) => handleStyleChange({ opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSaving || !drawingData.name.trim() || allPaths.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...') : t.save}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
