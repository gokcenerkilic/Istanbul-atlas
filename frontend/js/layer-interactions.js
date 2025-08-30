// Layer interaction functionality
function initializeLayerInteractions(map) {
    let hoveredFeatureId = null;
    let fixedPopup = null;
    let isPopupFixed = false;
    let currentLayer = null;
    
    // Create a popup instance for hover
    const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
    });
    
    // Initialize interactions for all layers
    Object.values(LAYER_CONFIG).forEach(layerConfig => {
        initializeLayerEvents(map, layerConfig, popup);
    });
    
    function initializeLayerEvents(map, layerConfig, popup) {
        const layerId = layerConfig.id;
        
        // Update layer paint properties for hover effects
        map.setPaintProperty(layerId, 'line-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            layerConfig.highlightColor,
            layerConfig.originalColor
        ]);
        
        map.setPaintProperty(layerId, 'line-width', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            layerConfig.highlightWidth,
            layerConfig.originalWidth
        ]);
        
        // Mouse enter: highlight the feature and show popup
        map.on('mouseenter', layerId, (e) => {
            // Don't show hover popup if there's already a fixed popup
            if (isPopupFixed) return;
            
            if (e.features.length > 0) {
                // Clear previous hover state
                clearHoverState(map);
                
                // Set new hover state
                hoveredFeatureId = e.features[0].id;
                currentLayer = layerConfig;
                map.setFeatureState(
                    { source: layerConfig.source, sourceLayer: layerConfig.sourceLayer, id: hoveredFeatureId },
                    { hover: true }
                );
                
                // Show popup
                const coordinates = e.lngLat;
                const properties = e.features[0].properties;
                
                const popupContent = createPopupContent(layerConfig, properties, false);
                
                popup.setLngLat(coordinates)
                    .setHTML(popupContent)
                    .addTo(map);
            }
        });
        
        // Mouse leave: remove highlight and popup (only if not fixed)
        map.on('mouseleave', layerId, () => {
            // Don't remove popup if it's fixed
            if (isPopupFixed) return;
            
            // Remove hover state
            clearHoverState(map);
            
            // Remove popup
            popup.remove();
        });
        
        // Click on layer: fix the popup
        map.on('click', layerId, (e) => {
            if (e.features.length > 0) {
                // Remove any existing fixed popup
                if (fixedPopup) {
                    fixedPopup.remove();
                }
                
                // Create a new fixed popup
                const coordinates = e.lngLat;
                const properties = e.features[0].properties;
                
                const fixedPopupContent = createPopupContent(layerConfig, properties, true);
                
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
        });
    }
    
    // Helper function to clear hover state
    function clearHoverState(map) {
        if (hoveredFeatureId !== null && currentLayer) {
            map.setFeatureState(
                { source: currentLayer.source, sourceLayer: currentLayer.sourceLayer, id: hoveredFeatureId },
                { hover: false }
            );
        }
        hoveredFeatureId = null;
        currentLayer = null;
    }
}

// Create popup content (reusable function for all layers)
function createPopupContent(layerConfig, properties, isFixed) {
    const subtitle = isFixed ? `${layerConfig.category} Area - Click X to close` : 'Click to pin this popup';
    const title = isFixed ? `${layerConfig.name} (Pinned)` : layerConfig.name;
    const indicator = isFixed ? '' : '<div class="popup-click-indicator"></div>';
    
    // Try to get custom content, fallback to default
    const customContent = getLayerContent(layerConfig.id);
    
    return `
        ${indicator}
        <div class="popup-header">
            <h3 class="popup-title">${title}</h3>
            <p class="popup-subtitle">${subtitle}</p>
        </div>
        <div class="popup-image">
            ${customContent.image ? 
                `<img src="../data/popup-content/images/${customContent.image.url}" alt="${customContent.image.alt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` :
                'Placeholder Image<br>[Your content will go here]'
            }
        </div>
        <p class="popup-description">
            ${customContent.description}
            ${customContent.additionalInfo ? 
                `<br><br><strong>Details:</strong><br>
                ${Object.entries(customContent.additionalInfo).map(([key, value]) => 
                    `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
                ).join('<br>')}` : 
                ''
            }
        </p>
    `;
}

// Function to get layer-specific content (placeholder for now)
function getLayerContent(layerId) {
    // This will be populated with your actual content
    const defaultContent = {
        A1: {
            description: "Administrative Area 1 - Information about this administrative region will be displayed here once you upload your content.",
            additionalInfo: { type: "Administrative Zone", status: "Active" }
        },
        A2: {
            description: "Administrative Area 2 - Information about this administrative region will be displayed here once you upload your content.",
            additionalInfo: { type: "Administrative Zone", status: "Active" }
        },
        D1: {
            description: "Development District 1 - Information about this development area will be displayed here once you upload your content.",
            additionalInfo: { type: "Development Zone", phase: "Planning" }
        },
        D2: {
            description: "Development District 2 - Information about this development area will be displayed here once you upload your content.",
            additionalInfo: { type: "Development Zone", phase: "Construction" }
        },
        G1: {
            description: "Green Zone 1 - Information about this green area will be displayed here once you upload your content.",
            additionalInfo: { type: "Green Space", protection: "High" }
        },
        G2: {
            description: "Green Zone 2 - Information about this green area will be displayed here once you upload your content.",
            additionalInfo: { type: "Green Space", protection: "Medium" }
        },
        GCL1: {
            description: "Green Coastline 1 - Information about this coastal green area will be displayed here once you upload your content.",
            additionalInfo: { type: "Coastal Green", access: "Public" }
        },
        R1: {
            description: "Residential Area 1 - Information about this residential region will be displayed here once you upload your content.",
            additionalInfo: { type: "Residential Zone", density: "Medium" }
        }
    };
    
    return defaultContent[layerId] || {
        description: `Information about ${layerId} will be displayed here once you upload your content.`,
        additionalInfo: { type: "Coastline Area" }
    };
}