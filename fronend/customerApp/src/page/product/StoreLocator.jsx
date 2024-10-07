// src/components/StoreLocator.js

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
})

const storeLocations = [
  {
    id: 1,
    name: 'Cửa Hàng 1',
    address: '123 Đường A, Thành phố X',
    position: [21.028511, 105.804817], 
  },
  {
    id: 2,
    name: 'Cửa Hàng 2',
    address: '456 Đường B, Thành phố Y',
    position: [10.762622, 106.660172], 
  },
  {
    id: 3,
    name: 'Cửa Hàng 3',
    address: '789 Đường C, Thành phố Z',
    position: [16.047079, 108.20623],
  },
  
]

const StoreLocator = () => {
  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Store Locator</h2>
      <div className="w-full h-96 md:h-[600px]">
        <MapContainer
          center={[21.028511, 105.804817]} 
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {storeLocations.map(store => (
            <Marker key={store.id} position={store.position}>
              <Popup>
                <strong>{store.name}</strong>
                <br />
                {store.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default StoreLocator
