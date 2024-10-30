// src/components/ProductDetail/Specification.js
import React from 'react'

export default function Specification({ specification }) {
  if (!specification || typeof specification !== 'object') {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-4">Specification</h3>
        <p>Không có thông số kỹ thuật.</p>
      </div>
    )
  }

  // Lọc bỏ các trường liên quan đến ảnh (nếu có)
  const filteredSpecs = Object.entries(specification).filter(([key, _]) => {
    const lowerKey = key.toLowerCase()
    return !lowerKey.includes('image') && !lowerKey.includes('img')
  })

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Specification</h3>
      {filteredSpecs.length > 0 ? (
        <table className="table-auto w-full">
          <tbody>
            {filteredSpecs.map(([key, value], index) => (
              <tr key={index} className="border-b">
                <td className="py-2 font-medium capitalize">{key}</td>
                <td className="py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có thông số kỹ thuật.</p>
      )}
    </div>
  )
}
