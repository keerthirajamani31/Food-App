import React from 'react'

const Loadingspinner = () => {
  return (
    <div className="bg-gradient-to-br from-[#1a120b] via-[#2a1e1e] to-[#3e2b1d] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto"></div>
        <p className="text-amber-100 mt-4 text-lg">Loading menu...</p>
      </div>
    </div>
  )
}

export default Loadingspinner