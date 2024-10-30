// src/components/ProductDetail/CompatibleVehicles.js
import React from 'react'

export default function CompatibleVehicles({ vehicles }) {
  if (!vehicles || vehicles.length === 0) {
    return <p>Không có xe tương thích nào.</p>
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Các Loại Xe Có Thể Gắn Được</h3>
      <div className="flex flex-wrap gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="w-1/4 p-4 border border-gray-200 rounded">
           
            <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-32 object-cover rounded" />
            <h4 className="mt-2 text-lg font-medium">{vehicle.name}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
