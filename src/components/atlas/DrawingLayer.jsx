import React, { useState, useEffect } from "react";
import { Polyline } from "react-leaflet";
import { Drawing } from "@/api/entities";

export default function DrawingLayer({ language }) {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const data = await Drawing.filter({ status: 'approved' });
      setDrawings(data.filter(drawing => drawing.coordinates && drawing.coordinates.length > 0));
    } catch (error) {
      console.error('Error loading drawings:', error);
    }
  };

  return (
    <>
      {drawings.map((drawing) => (
        <Polyline
          key={drawing.id}
          positions={drawing.coordinates}
          pathOptions={{
            color: drawing.style?.color || '#ff6b6b',
            weight: drawing.style?.weight || 3,
            opacity: drawing.style?.opacity || 0.8
          }}
        />
      ))}
    </>
  );
}