// src/components/ProductDetail/Description.js
import React from 'react'

export default function Description({ description }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Description</h3>
      <p>{description}</p>
    </div>
  )
}
