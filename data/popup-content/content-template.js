// Template for popup content data
// Replace this with your actual content for each layer

const POPUP_CONTENT = {
    R1: {
        title: "R1 Residential Region",
        image: {
            url: "r1-region.jpg", // Place your image in data/popup-content/images/
            alt: "R1 Residential Area View"
        },
        description: "Your detailed description of the R1 residential region goes here. This can include demographic information, housing details, or development plans.",
        additionalInfo: {
            coordinates: "29.0°N, 41.0°E",
            area: "2.5 km²",
            population: "15,000 residents",
            features: ["Modern housing", "Shopping centers", "Schools"]
        }
    },
    A1: {
        title: "A1 Administrative Area",
        image: {
            url: "a1-admin.jpg",
            alt: "A1 Administrative Building"
        },
        description: "Administrative zone A1 contains government offices and municipal services for the Istanbul coastline region.",
        additionalInfo: {
            type: "Government District",
            services: ["Municipal Office", "Planning Department", "Public Services"],
            established: "1985"
        }
    },
    A2: {
        title: "A2 Administrative Area",
        image: {
            url: "a2-admin.jpg",
            alt: "A2 Administrative Complex"
        },
        description: "Secondary administrative zone covering regional governance and public administration services.",
        additionalInfo: {
            type: "Regional Office",
            services: ["Regional Planning", "Environmental Office", "Tourism Board"],
            established: "1992"
        }
    },
    D1: {
        title: "D1 Development District",
        image: {
            url: "d1-development.jpg",
            alt: "D1 Development Area"
        },
        description: "Primary development zone for new coastal infrastructure and urban expansion projects.",
        additionalInfo: {
            phase: "Planning Stage",
            timeline: "2025-2030",
            projects: ["Marina expansion", "Commercial complex", "Waterfront promenade"]
        }
    },
    D2: {
        title: "D2 Development District",
        image: {
            url: "d2-development.jpg",
            alt: "D2 Construction Site"
        },
        description: "Active construction zone for residential and commercial development along the coastline.",
        additionalInfo: {
            phase: "Under Construction",
            completion: "2027",
            projects: ["Residential towers", "Shopping mall", "Public park"]
        }
    },
    G1: {
        title: "G1 Green Zone",
        image: {
            url: "g1-green.jpg",
            alt: "G1 Green Space"
        },
        description: "Protected green space along the coastline, featuring native vegetation and wildlife habitats.",
        additionalInfo: {
            protection: "High Priority",
            area: "3.2 km²",
            features: ["Native flora", "Bird watching", "Walking trails"],
            established: "1978"
        }
    },
    G2: {
        title: "G2 Green Zone",
        image: {
            url: "g2-green.jpg",
            alt: "G2 Park Area"
        },
        description: "Secondary green zone with recreational facilities and community gardens.",
        additionalInfo: {
            protection: "Medium Priority",
            area: "1.8 km²",
            features: ["Community gardens", "Playground", "Picnic areas"],
            visitors: "50,000 annually"
        }
    },
    GCL1: {
        title: "GCL1 Green Coastline",
        image: {
            url: "gcl1-coastline.jpg",
            alt: "GCL1 Coastal Green Area"
        },
        description: "Coastal green corridor combining environmental protection with public access to the waterfront.",
        additionalInfo: {
            type: "Coastal Conservation",
            length: "4.5 km",
            features: ["Beach access", "Dune protection", "Marine life", "Cycling path"],
            status: "Protected Area"
        }
    }
};

// Function to get content for a specific layer
function getLayerContent(layerId) {
    return POPUP_CONTENT[layerId] || {
        title: `${layerId} Region`,
        image: {
            url: "placeholder.jpg",
            alt: "Region View"
        },
        description: `Content for ${layerId} region will be added soon.`,
        additionalInfo: {
            type: "Coastline Area",
            status: "Information pending"
        }
    };
}

// Function to update content for a specific layer
function updateLayerContent(layerId, newContent) {
    POPUP_CONTENT[layerId] = { ...POPUP_CONTENT[layerId], ...newContent };
}