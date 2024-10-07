import React from 'react'
import AddBrandForm from '../components/forms/AddBrandForm'
import AddCategoryForm from '../components/forms/AddCategoryForm'
import AddVehicleForm from '../components/forms/AddVehicleForm'

const RelatedInformation = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl mb-6">Related Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AddBrandForm />
        <AddCategoryForm />
        <AddVehicleForm />
      </div>
    </div>
  )
}

export default RelatedInformation
