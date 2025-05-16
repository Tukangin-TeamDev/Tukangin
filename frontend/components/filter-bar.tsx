'use client';

import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Star, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

export interface ActiveFilter {
  type: string;
  value: string;
}

interface FilterBarProps {
  filters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  onCategoryChange?: (category: string) => void;
}

export function FilterBar({ filters = [], onFilterChange, onCategoryChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(filters);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minRating, setMinRating] = useState(4.5);
  const [selectedCategory, setSelectedCategory] = useState('equipment');
  const [selectedLocation, setSelectedLocation] = useState('Jakarta Pusat');

  // Update local state when props change
  useEffect(() => {
    setActiveFilters(filters);
  }, [filters]);

  // Category options
  const categoryOptions: FilterOption[] = [
    { id: 'all', label: 'Semua', selected: false },
    { id: 'electrical', label: 'Kelistrikan', selected: false },
    { id: 'home', label: 'Rumah', selected: false },
    { id: 'plumbing', label: 'Ledeng', selected: false },
    { id: 'equipment', label: 'Peralatan', selected: true },
    { id: 'security', label: 'Keamanan', selected: false },
  ];

  // Location options
  const locationOptions = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
  ];

  // Popular filter presets
  const filterPresets = [
    { name: 'Termurah', filters: { category: 'all', rating: 0, priceMax: 200000 } },
    { name: 'Terdekat', filters: { location: 'Jakarta Pusat' } },
    { name: 'Rating Tertinggi', filters: { rating: 4.8 } },
    { name: 'Tersedia Sekarang', filters: { available: true } },
  ];

  const removeFilter = (filter: ActiveFilter) => {
    const updatedFilters = activeFilters.filter(f => f.value !== filter.value);
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);

    // Reset the corresponding filter control
    if (filter.type === 'category') {
      setSelectedCategory('all');
      if (onCategoryChange) onCategoryChange('all');
      updateCategorySelection('all');
    } else if (filter.type === 'location') {
      setSelectedLocation('');
    } else if (filter.type === 'price') {
      setPriceRange([0, 1000000]);
    } else if (filter.type === 'rating') {
      setMinRating(0);
    }
  };

  const resetFilters = () => {
    setActiveFilters([]);
    setPriceRange([0, 1000000]);
    setMinRating(0);
    setSelectedCategory('all');
    setSelectedLocation('');
    if (onCategoryChange) onCategoryChange('all');
    onFilterChange([]);
  };

  const updateCategorySelection = (categoryId: string) => {
    // Update the selected property for all category options
    categoryOptions.forEach(option => {
      option.selected = option.id === categoryId;
    });

    // Update active filters
    const existingCategoryFilter = activeFilters.findIndex(f => f.type === 'category');
    const updatedFilters = [...activeFilters];

    if (categoryId === 'all') {
      // Remove category filter if "all" is selected
      if (existingCategoryFilter !== -1) {
        updatedFilters.splice(existingCategoryFilter, 1);
        setActiveFilters(updatedFilters);
        onFilterChange(updatedFilters);
      }
    } else {
      // Add or update category filter
      const selectedCategory = categoryOptions.find(c => c.id === categoryId);
      if (selectedCategory) {
        if (existingCategoryFilter !== -1) {
          updatedFilters[existingCategoryFilter] = {
            type: 'category',
            value: selectedCategory.label,
          };
        } else {
          updatedFilters.push({ type: 'category', value: selectedCategory.label });
        }
        setActiveFilters(updatedFilters);
        onFilterChange(updatedFilters);
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) onCategoryChange(categoryId);
    updateCategorySelection(categoryId);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = e.target.value;
    setSelectedLocation(location);

    // Update active filters
    const existingLocationFilter = activeFilters.findIndex(f => f.type === 'location');
    const updatedFilters = [...activeFilters];

    if (location === '') {
      // Remove location filter if empty
      if (existingLocationFilter !== -1) {
        updatedFilters.splice(existingLocationFilter, 1);
      }
    } else {
      // Add or update location filter
      if (existingLocationFilter !== -1) {
        updatedFilters[existingLocationFilter] = { type: 'location', value: location };
      } else {
        updatedFilters.push({ type: 'location', value: location });
      }
    }

    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);

    // Format price for display
    const formattedPrice = `Rp${value[0].toLocaleString()} - Rp${value[1].toLocaleString()}`;

    // Update active filters
    const existingPriceFilter = activeFilters.findIndex(f => f.type === 'price');
    const updatedFilters = [...activeFilters];

    if (existingPriceFilter !== -1) {
      updatedFilters[existingPriceFilter] = { type: 'price', value: formattedPrice };
    } else {
      updatedFilters.push({ type: 'price', value: formattedPrice });
    }

    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleRatingChange = (value: number[]) => {
    const rating = value[0];
    setMinRating(rating);

    // Update active filters
    const existingRatingFilter = activeFilters.findIndex(f => f.type === 'rating');
    const updatedFilters = [...activeFilters];

    if (existingRatingFilter !== -1) {
      updatedFilters[existingRatingFilter] = { type: 'rating', value: `${rating}+` };
    } else {
      updatedFilters.push({ type: 'rating', value: `${rating}+` });
    }

    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const applyFilters = () => {
    // Notify parent of all active filters
    onFilterChange(activeFilters);
    // Close filter panel on mobile after applying
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const applyPreset = (preset: (typeof filterPresets)[0]) => {
    let updatedFilters = [...activeFilters];

    // Remove existing filters that conflict with the preset
    if (preset.filters.category) {
      updatedFilters = updatedFilters.filter(f => f.type !== 'category');
      if (preset.filters.category !== 'all') {
        const categoryOption = categoryOptions.find(c => c.id === preset.filters.category);
        if (categoryOption) {
          updatedFilters.push({ type: 'category', value: categoryOption.label });
        }
        setSelectedCategory(preset.filters.category);
        if (onCategoryChange) onCategoryChange(preset.filters.category);
      } else {
        setSelectedCategory('all');
        if (onCategoryChange) onCategoryChange('all');
      }
    }

    if (preset.filters.location) {
      updatedFilters = updatedFilters.filter(f => f.type !== 'location');
      updatedFilters.push({ type: 'location', value: preset.filters.location });
      setSelectedLocation(preset.filters.location);
    }

    if (preset.filters.rating !== undefined) {
      updatedFilters = updatedFilters.filter(f => f.type !== 'rating');
      updatedFilters.push({ type: 'rating', value: `${preset.filters.rating}+` });
      setMinRating(preset.filters.rating);
    }

    if (preset.filters.priceMax) {
      updatedFilters = updatedFilters.filter(f => f.type !== 'price');
      const formattedPrice = `Rp0 - Rp${preset.filters.priceMax.toLocaleString()}`;
      updatedFilters.push({ type: 'price', value: formattedPrice });
      setPriceRange([0, preset.filters.priceMax]);
    }

    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : i < rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Filter Pencarian</h2>
        </div>

        {/* Quick filter presets */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {filterPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              {preset.name === 'Termurah' && <span className="text-green-500 text-xs">Rp</span>}
              {preset.name === 'Terdekat' && <MapPin className="h-3 w-3 text-blue-500" />}
              {preset.name === 'Rating Tertinggi' && (
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-400" />
              )}
              {preset.name === 'Tersedia Sekarang' && <Clock className="h-3 w-3 text-purple-500" />}
              {preset.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap"
        >
          {showFilters ? (
            <>
              <span>Sembunyikan Filter</span>
              <ChevronDown className="h-4 w-4 transform rotate-180 transition-transform" />
            </>
          ) : (
            <>
              <span>Tampilkan Filter</span>
              <ChevronDown className="h-4 w-4 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 items-center border-t border-gray-100 pt-3 bg-gray-50/50">
          <span className="text-xs font-medium text-gray-500">Filter aktif:</span>
          {activeFilters.map(filter => (
            <motion.div
              key={filter.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {filter.type === 'category' && (
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              )}
              {filter.type === 'location' && <MapPin className="h-3 w-3 text-blue-600 mr-1" />}
              {filter.type === 'price' && <span className="text-green-600 text-xs mr-1">Rp</span>}

              {filter.value}
              {filter.type === 'rating' && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 rounded-full hover:bg-blue-200 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
          <button
            onClick={resetFilters}
            className="text-sm text-red-500 hover:text-red-600 ml-1 px-2 py-0.5 hover:bg-red-50 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category filter */}
                <div>
                  <h3 className="font-medium mb-3 text-gray-700 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Kategori
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleCategoryClick(option.id)}
                        className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                          option.id === selectedCategory
                            ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        {option.id === selectedCategory && (
                          <CheckCircle2 className="h-3.5 w-3.5 absolute right-2 text-white" />
                        )}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location filter */}
                <div>
                  <h3 className="font-medium mb-3 text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    Lokasi
                  </h3>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Pilih Lokasi</option>
                      {locationOptions.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Price range filter */}
                <div>
                  <h3 className="font-medium mb-3 text-gray-700 flex items-center">
                    <span className="text-green-600 text-xs mr-2 font-bold">Rp</span>
                    Rentang Harga
                  </h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      max={1000000}
                      step={50000}
                      onValueChange={value => handlePriceChange(value as number[])}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">Rp</span>
                        <span>{priceRange[0].toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">Rp</span>
                        <span>{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating filter */}
                <div>
                  <h3 className="font-medium mb-3 text-gray-700 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-2" />
                    Rating Minimum
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Slider
                      value={[minRating]}
                      min={0}
                      max={5}
                      step={0.5}
                      onValueChange={value => handleRatingChange(value)}
                      className="mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">{renderStars(minRating)}</div>
                      <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-1.5">
                        <span className="text-lg font-semibold text-yellow-600">{minRating}</span>
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter actions */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-red-500 hover:text-red-600 font-medium transition-colors hover:bg-red-50 rounded-md"
                >
                  Reset Filter
                </button>
                <button
                  onClick={applyFilters}
                  className="ml-3 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
