
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Property } from '@/lib/data';
import { formatPrice } from '@/lib/data';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPropertySelect?: (propertyId: string) => void;
  singleProperty?: boolean;
}

const PropertyMap = ({ properties, selectedPropertyId, onPropertySelect, singleProperty = false }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize OpenLayers Map with Mumbai default center (For Indian properties)
    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      view: new View({
        center: fromLonLat([72.8777, 19.0760]), // Mumbai default center
        zoom: 11,
      }),
    });

    // Initialize Popup Overlay
    const popupOverlay = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -15],
    });
    olMap.addOverlay(popupOverlay);

    setMap(olMap);

    return () => {
      olMap.setTarget('');
    };
  }, []);

  useEffect(() => {
    if (!map || properties.length === 0) return;

    // Clear existing vector layers
    map.getLayers().getArray()
      .filter(layer => layer instanceof VectorLayer)
      .forEach(layer => map.removeLayer(layer));

    // Create a vector source for markers
    const vectorSource = new VectorSource();
    
    // Create a vector layer
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
    
    map.addLayer(vectorLayer);

    // If single property, zoom to it
    if (singleProperty && properties.length === 1) {
      const property = properties[0];
      const { lat, lng } = property.location || {};
      
      if (lat && lng) {
        const view = map.getView();
        view.setCenter(fromLonLat([lng, lat]));
        view.setZoom(15); // Closer zoom for single property
      }
    }

    // Add markers for all properties
    properties.forEach((property) => {
      const { lat, lng } = property.location || {};
      
      // Default coordinates for Mumbai if none provided
      const propLat = lat || 19.0760;
      const propLng = lng || 72.8777;

      // Create marker feature
      const markerFeature = new Feature({
        geometry: new Point(fromLonLat([propLng, propLat])),
        property: property
      });

      // Set marker style
      const markerStyle = new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: selectedPropertyId && property.id === selectedPropertyId ? 1.0 : 0.7,
        })
      });

      markerFeature.setStyle(markerStyle);
      vectorSource.addFeature(markerFeature);

      // Show popup for selected property
      if (selectedPropertyId && property.id === selectedPropertyId) {
        const overlay = map.getOverlayById('popup') as Overlay;
        if (overlay) {
          popupRef.current!.innerHTML = `
            <div class="p-2 bg-white rounded shadow-md text-sm">
              <h3 class="font-bold">${property.title}</h3>
              <p class="font-medium">${formatPrice(property.price)}</p>
              <p>${property.location.city}, ${property.location.state}</p>
            </div>
          `;
          overlay.setPosition(fromLonLat([propLng, propLat]));
        }
      }
    });

    // Add click event to map
    const mapClickHandler = map.on('click', (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const property = (feature as any).get('property');
        if (property && onPropertySelect) {
          onPropertySelect(property.id);
          
          // Show popup
          const { lat, lng } = property.location || {};
          const propLat = lat || 19.0760;
          const propLng = lng || 72.8777;
          
          popupRef.current!.innerHTML = `
            <div class="p-2 bg-white rounded shadow-md text-sm">
              <h3 class="font-bold">${property.title}</h3>
              <p class="font-medium">${formatPrice(property.price)}</p>
              <p>${property.location.city}, ${property.location.state}</p>
            </div>
          `;
          
          const overlay = map.getOverlayById('popup') as Overlay;
          if (overlay) {
            overlay.setPosition(fromLonLat([propLng, propLat]));
          }
          
          return true; // Stop further processing
        }
        return false;
      });
    });

    return () => {
      map.un('click', mapClickHandler.listener);
    };
  }, [map, properties, onPropertySelect, selectedPropertyId, singleProperty]);

  return (
    <div className="w-full h-full rounded-lg relative" style={{ minHeight: '400px' }}>
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ height: '100%', minHeight: '400px' }} />
      <div ref={popupRef} className="absolute bg-white p-2 rounded shadow-md hidden z-10" />
    </div>
  );
};

export default PropertyMap;
