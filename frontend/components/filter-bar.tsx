"use client"

import { useState, useEffect } from "react"
import { Filter, X, ChevronDown, Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface FilterOption {
  id: string
  label: string
  selected: boolean
}

export interface ActiveFilter {
  type: string
  value: string
}

interface FilterBarProps {
  filters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  onCategoryChange?: (category: string) => void
}

export function FilterBar({ filters = [], onFilterChange, onCategoryChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(filters)
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [minRating, setMinRating] = useState(4.5)
  const [selectedCategory, setSelectedCategory] = useState("equipment")
  const [selectedLocation, setSelectedLocation] = useState("Jakarta Pusat")

  // Update local state when props change
  useEffect(() => {
    setActiveFilters(filters)
  }, [filters])

  // Category options
  const categoryOptions: FilterOption[] = [
    { id: "all", label: "Semua", selected: false },
    { id: "electrical", label: "Kelistrikan", selected: false },
    { id: "home", label: "Rumah", selected: false },
    { id: "plumbing", label: "Ledeng", selected: false },
    { id: "equipment", label: "Peralatan", selected: true },
    { id: "security", label: "Keamanan", selected: false },
  ]

  // Location options
  const locationOptions = ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"]

  const removeFilter = (filter: ActiveFilter) => {
    const updatedFilters = activeFilters.filter((f) => f.value !== filter.value)
    setActiveFilters(updatedFilters)
    onFilterChange(updatedFilters)
    
    // Reset the corresponding filter control
    if (filter.type === "category") {
      setSelectedCategory("all")
      if (onCategoryChange) onCategoryChange("all")
      updateCategorySelection("all")
    } else if (filter.type === "location") {
      setSelectedLocation("")
    } else if (filter.type === "price") {
      setPriceRange([0, 1000000])
    } else if (filter.type === "rating") {
      setMinRating(0)
    }
  }

  const resetFilters = () => {
    setActiveFilters([])
    setPriceRange([0, 1000000])
    setMinRating(0)
    setSelectedCategory("all")
    setSelectedLocation("")
    if (onCategoryChange) onCategoryChange("all")
    onFilterChange([])
  }
  
  const updateCategorySelection = (categoryId: string) => {
    // Update the selected property for all category options
    categoryOptions.forEach(option => {
      option.selected = option.id === categoryId
    })
    
    // Update active filters
    const existingCategoryFilter = activeFilters.findIndex(f => f.type === "category")
    const updatedFilters = [...activeFilters]
    
    if (categoryId === "all") {
      // Remove category filter if "all" is selected
      if (existingCategoryFilter !== -1) {
        updatedFilters.splice(existingCategoryFilter, 1)
        setActiveFilters(updatedFilters)
        onFilterChange(updatedFilters)
      }
    } else {
      // Add or update category filter
      const selectedCategory = categoryOptions.find(c => c.id === categoryId)
      if (selectedCategory) {
        if (existingCategoryFilter !== -1) {
          updatedFilters[existingCategoryFilter] = { type: "category", value: selectedCategory.label }
        } else {
          updatedFilters.push({ type: "category", value: selectedCategory.label })
        }
        setActiveFilters(updatedFilters)
        onFilterChange(updatedFilters)
      }
    }
  }
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (onCategoryChange) onCategoryChange(categoryId)
    updateCategorySelection(categoryId)
  }
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = e.target.value
    setSelectedLocation(location)
    
    // Update active filters
    const existingLocationFilter = activeFilters.findIndex(f => f.type === "location")
    const updatedFilters = [...activeFilters]
    
    if (location === "") {
      // Remove location filter if empty
      if (existingLocationFilter !== -1) {
        updatedFilters.splice(existingLocationFilter, 1)
      }
    } else {
      // Add or update location filter
      if (existingLocationFilter !== -1) {
        updatedFilters[existingLocationFilter] = { type: "location", value: location }
      } else {
        updatedFilters.push({ type: "location", value: location })
      }
    }
    
    setActiveFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    
    // Format price for display
    const formattedPrice = `Rp${value[0].toLocaleString()} - Rp${value[1].toLocaleString()}`
    
    // Update active filters
    const existingPriceFilter = activeFilters.findIndex(f => f.type === "price")
    const updatedFilters = [...activeFilters]
    
    if (existingPriceFilter !== -1) {
      updatedFilters[existingPriceFilter] = { type: "price", value: formattedPrice }
    } else {
      updatedFilters.push({ type: "price", value: formattedPrice })
    }
    
    setActiveFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const handleRatingChange = (value: number[]) => {
    const rating = value[0]
    setMinRating(rating)
    
    // Update active filters
    const existingRatingFilter = activeFilters.findIndex(f => f.type === "rating")
    const updatedFilters = [...activeFilters]
    
    if (existingRatingFilter !== -1) {
      updatedFilters[existingRatingFilter] = { type: "rating", value: `${rating}+` }
    } else {
      updatedFilters.push({ type: "rating", value: `${rating}+` })
    }
    
    setActiveFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const applyFilters = () => {
    // Notify parent of all active filters
    onFilterChange(activeFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Filter Pencarian</h2>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          {showFilters ? (
            <>
              <span>Sembunyikan Filter</span>
              <ChevronDown className="h-4 w-4 transform rotate-180" />
            </>
          ) : (
            <>
              <span>Tampilkan Filter</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.value}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {filter.value}
              {filter.type === "rating" && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
              <button onClick={() => removeFilter(filter)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-600 ml-1">
            Reset
          </button>
        </div>
      )}

      {/* Expanded filters */}
      {showFilters && (
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category filter */}
            <div>
              <h3 className="font-medium mb-3">Kategori</h3>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleCategoryClick(option.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      option.id === selectedCategory
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full ${option.id === selectedCategory ? "bg-white" : "bg-blue-600"}`}></span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location filter */}
            <div>
              <h3 className="font-medium mb-3">Lokasi</h3>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full p-2 pr-8 border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Lokasi</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Price range filter */}
            <div>
              <h3 className="font-medium mb-3">Rentang Harga</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  max={1000000}
                  step={50000}
                  onValueChange={(value) => handlePriceChange(value as number[])}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>Rp{priceRange[0].toLocaleString()}</span>
                  <span>Rp{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <h3 className="font-medium mb-3">Rating Minimum</h3>
              <div className="flex items-center gap-2">
                <Slider
                  value={[minRating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => handleRatingChange(value)}
                  className="flex-1"
                />
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-3 py-1 min-w-[70px]">
                  <span className="text-lg font-semibold text-blue-600">{minRating}</span>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter actions */}
          <div className="flex justify-end mt-6">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Reset Filter
            </button>
            <button
              onClick={applyFilters}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
