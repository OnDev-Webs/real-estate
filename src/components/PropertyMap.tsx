
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { Property } from '@/lib/data';
import { formatPrice } from '@/lib/data';

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
  const [popup, setPopup] = useState<Overlay | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize OpenLayers Map with Mumbai default center (For Indian properties)
    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([72.8777, 19.0760]), // Mumbai default center
        zoom: 11,
      }),
    });

    // Initialize Popup Overlay
    const olPopup = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -15],
    });
    olMap.addOverlay(olPopup);

    setMap(olMap);
    setPopup(olPopup);

    return () => olMap.setTarget('');
  }, []);

  useEffect(() => {
    if (!map || !popup || properties.length === 0) return;

    // Remove existing markers
    popup.setPosition(undefined);
    
    // Clear existing overlays except the popup
    const overlays = map.getOverlays().getArray().slice();
    for (let i = 0; i < overlays.length; i++) {
      if (overlays[i] !== popup) {
        map.removeOverlay(overlays[i]);
      }
    }

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

      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.innerHTML = '📍';
      markerElement.style.cursor = 'pointer';
      markerElement.style.fontSize = '24px';
      
      // Highlight selected property
      if (selectedPropertyId && property.id === selectedPropertyId) {
        markerElement.style.fontSize = '32px';
        markerElement.style.color = 'red';
      }

      const markerOverlay = new Overlay({
        element: markerElement,
        position: fromLonLat([propLng, propLat]),
        positioning: 'center-center',
      });

      map.addOverlay(markerOverlay);

      markerElement.addEventListener('click', () => {
        popupRef.current!.innerHTML = `
          <div class="p-2 bg-white rounded shadow-md text-sm">
            <h3 class="font-bold">${property.title}</h3>
            <p class="font-medium">${formatPrice(property.price)}</p>
            <p>${property.location.city}, ${property.location.state}</p>
          </div>
        `;
        popup.setPosition(fromLonLat([propLng, propLat]));

        if (onPropertySelect) {
          onPropertySelect(property.id);
        }
      });
      
      // Show popup for selected property
      if (selectedPropertyId && property.id === selectedPropertyId) {
        popupRef.current!.innerHTML = `
          <div class="p-2 bg-white rounded shadow-md text-sm">
            <h3 class="font-bold">${property.title}</h3>
            <p class="font-medium">${formatPrice(property.price)}</p>
            <p>${property.location.city}, ${property.location.state}</p>
          </div>
        `;
        popup.setPosition(fromLonLat([propLng, propLat]));
      }
    });
  }, [map, properties, popup, onPropertySelect, selectedPropertyId, singleProperty]);

  return (
    <div className="w-full h-full rounded-lg relative" style={{ minHeight: '400px' }}>
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ height: '100%', minHeight: '400px' }} />
      <div ref={popupRef} className="absolute bg-white p-2 rounded shadow-md hidden z-10" />
    </div>
  );
};

export default PropertyMap;
