import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import MenuLayout from '../Menu/MenuLayout'
import CategoryPage from '../Menu/CategoryPage'
import VarietiesPage from '../Menu/VarietiesPage'
import VarietyDetails from '../Menu/VarietyDetails'
import LoadingSpinner from '../Menu/Loadingspinner'

const Menu = () => {
  const { category, itemName } = useParams()
  const location = useLocation()
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVariety, setSelectedVariety] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState(null)
  const [dataVersion, setDataVersion] = useState(0) 

  const loadAllData = async () => {
    try {
      console.log('🔄 Menu component: Loading all data...')
      setLoading(true)
      setError(null)
      
      let apiData = []
      let adminData = []
      const deletedIds = JSON.parse(localStorage.getItem('deletedItems') || '[]')

      try {
        // UPDATED: Using Render backend URL
        const response = await fetch('https://food-app-fshp.onrender.com/api/food/all')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        if (result.success && result.data) {
          apiData = result.data
        } else if (Array.isArray(result)) {
          apiData = result
        }
      } catch (err) {
        console.error('Error fetching API data:', err)
        setError('Unable to connect to server. Loading offline data.')
      }

      try {
        const storedItems = JSON.parse(localStorage.getItem('menuItems') || '[]')
        adminData = storedItems.filter(item => item && item.name)
        console.log('📦 Loaded admin items from localStorage:', adminData.length)
      } catch (storageError) {
        console.error('Error loading localStorage:', storageError)
      }

      const combinedItems = [...apiData, ...adminData].filter(
        item => !deletedIds.includes(item._id) && !deletedIds.includes(item.id)
      )

      console.log('✅ Combined items:', {
        api: apiData.length,
        admin: adminData.length,
        total: combinedItems.length,
        deleted: deletedIds.length
      })

      setAllItems(combinedItems)
      setDataVersion(prev => prev + 1)
      
    } catch (err) {
      console.error('Error in loadAllData:', err)
      setError(err.message)

      const adminItems = JSON.parse(localStorage.getItem('menuItems') || '[]')
      setAllItems(adminItems)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    console.log('🎯 Setting up event listeners for Menu component')
    
    const handleDataUpdate = (event) => {
      console.log('🔄 Menu component caught event:', event.type, ' - Reloading data immediately!')
      loadAllData()
    }

    const events = [
      'menuItemsUpdated',
      'adminDataChanged', 
      'cartUpdate',
      'storage',
      'adminItemAdded',
      'adminItemEdited',
      'adminItemDeleted',
      'localStorageUpdate'
    ]

    events.forEach(event => {
      window.addEventListener(event, handleDataUpdate)
    })

    const handleStorageChange = (e) => {
      if (e.key === 'menuItems' || e.key === 'deletedItems') {
        console.log('💾 Storage change detected:', e.key)
        loadAllData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleDataUpdate)
      })
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('lastMenuUpdate')
      const currentTime = Date.now()
      
      if (lastUpdate && (currentTime - parseInt(lastUpdate)) < 5000) {
        console.log('⏰ Periodic check found recent update - reloading')
        loadAllData()
        localStorage.removeItem('lastMenuUpdate')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAddToCart = (variety, currentItem) => {
    if (!currentItem) {
      alert('Error: Item not found')
      return
    }

    const cartItem = {
      id: `${currentItem._id}-${variety._id}-${Date.now()}`,
      name: `${currentItem.name} - ${variety.name}`,
      price: variety.price,
      image: variety.image,
      description: variety.description,
      quantity: 1
    }

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
      existingCart.push(cartItem)
      localStorage.setItem('cart', JSON.stringify(existingCart))
      window.dispatchEvent(new Event('cartUpdate'))
      alert(`${variety.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding item to cart. Please try again.')
    }
  }

  const handleViewDetails = (variety) => {
    setSelectedVariety(variety)
    setShowDetails(true)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedVariety(null)
    document.body.style.overflow = 'auto'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (category && itemName) {
    const decodedItemName = decodeURIComponent(itemName)
    const currentItem = allItems.find(item => 
      item.name.toLowerCase() === decodedItemName.toLowerCase()
    )

    if (!currentItem) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Item Not Found</h2>
            <p className="text-gray-600 text-sm sm:text-base">"{decodedItemName}" not found in menu</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }

    return (
      <>
        <VarietiesPage 
          currentItem={currentItem}
          onViewDetails={handleViewDetails}
          onAddToCart={(variety) => handleAddToCart(variety, currentItem)}
        />
        {showDetails && currentItem && (
          <VarietyDetails 
            variety={selectedVariety}
            currentItem={currentItem}
            category={category}
            onClose={handleCloseDetails}
            onAddToCart={(variety) => handleAddToCart(variety, currentItem)}
          />
        )}
      </>
    )
  }

  if (category) {
    return <CategoryPage allItems={allItems} />
  }

  return <MenuLayout allItems={allItems} />
}

export default Menu