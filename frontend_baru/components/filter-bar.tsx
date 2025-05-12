"use client"

import { useState } from "react"
import { Filter, X, ChevronDown, Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface FilterOption {
  id: string
  label: string
  selected: boolean
}

interface ActiveFilter {
  type: string
  value: string
}

export function FilterBar() {
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "category", value: "Peralatan" },
    { type: "location", value: "Jakarta Pusat" },
    { type: "price", value: "Rp0 - Rp1,000,000" },
    { type: "rating", value: "4.5+" },
  ])
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [minRating, setMinRating] = useState(4.5)

  // Category options
  const categoryOptions: FilterOption[] = [
    { id: "all", label: "Semua", selected: true },
    { id: "electrical", label: "Kelistrikan", selected: false },
    { id: "home", label: "Rumah", selected: false },
    { id: "plumbing", label: "Ledeng", selected: false },
    { id: "equipment", label: "Peralatan", selected: true },
    { id: "security", label: "Keamanan", selected: false },
  ]

  // Location options
  const locationOptions = ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"]

  const removeFilter = (filter: ActiveFilter) => {
    setActiveFilters(activeFilters.filter((f) => f.value !== filter.value))
  }

  const resetFilters = () => {
    setActiveFilters([])
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      option.selected
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full ${option.selected ? "bg-white" : "bg-blue-600"}`}></span>
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
                  defaultValue="Jakarta Pusat"
                  className="w-full p-2 pr-8 border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                  defaultValue={[0, 1000000]}
                  max={1000000}
                  step={50000}
                  onValueChange={(value) => setPriceRange(value as number[])}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>Rp0</span>
                  <span>Rp1,000,000</span>
                </div>
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <h3 className="font-medium mb-3">Rating Minimum</h3>
              <div className="flex items-center gap-2">
                <Slider
                  defaultValue={[4.5]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => setMinRating(value[0])}
                  className="flex-1"
                />
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-3 py-1 min-w-[70px]">
                  <span className="text-lg font-semibold text-blue-600">4.5</span>
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
          </div>
        </div>
      )}
    </div>
  )
}
