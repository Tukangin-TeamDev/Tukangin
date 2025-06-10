'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronRight, MapPin, Info, Clock, DollarSign, Briefcase } from 'lucide-react';

// Step type untuk proses onboarding
type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
};

export default function ProviderOnboardingPage() {
  // State untuk active step
  const [activeStepId, setActiveStepId] = useState<string>('service-info');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Service Type options
  const serviceTypes = [
    { id: 'electrical', name: 'Listrik', icon: '⚡' },
    { id: 'plumbing', name: 'Pipa Air', icon: '🚿' },
    { id: 'ac-repair', name: 'Servis AC', icon: '❄️' },
    { id: 'home-repair', name: 'Renovasi Rumah', icon: '🏠' },
    { id: 'cleaning', name: 'Jasa Kebersihan', icon: '🧹' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'painting', name: 'Pengecatan', icon: '🖌️' },
    { id: 'moving', name: 'Jasa Pindahan', icon: '📦' },
    { id: 'other', name: 'Lainnya', icon: '🛠️' },
  ];

  // Form data state
  const [formData, setFormData] = useState({
    // Informasi Layanan
    serviceType: '',
    serviceTitle: '',
    serviceDescription: '',
    customServiceType: '',

    // Lokasi Layanan
    serviceAreas: [],
    customServiceArea: '',
    maxDistance: 10,

    // Keahlian dan Pengalaman
    yearsExperience: '',
    skillLevel: 'intermediate',
    specializations: [],
    customSpecialization: '',
    certifications: [],

    // Tarif dan Ketersediaan
    baseRate: '',
    rateUnit: 'hourly', // hourly, daily, fixed
    isNegotiable: true,
    availableDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    availableTimeStart: '08:00',
    availableTimeEnd: '17:00',
  });

  // Buat array steps untuk onboarding
  const steps: OnboardingStep[] = [
    {
      id: 'service-info',
      title: 'Informasi Layanan',
      description: 'Detail tentang layanan yang Anda tawarkan',
      icon: <Info className="h-5 w-5" />,
      completed: !!formData.serviceTitle && !!formData.serviceDescription && !!formData.serviceType,
    },
    {
      id: 'service-area',
      title: 'Area Layanan',
      description: 'Lokasi di mana Anda dapat menyediakan layanan',
      icon: <MapPin className="h-5 w-5" />,
      completed: formData.serviceAreas.length > 0,
    },
    {
      id: 'experience',
      title: 'Keahlian & Pengalaman',
      description: 'Pengalaman dan spesialisasi Anda',
      icon: <Briefcase className="h-5 w-5" />,
      completed: !!formData.yearsExperience && formData.specializations.length > 0,
    },
    {
      id: 'availability',
      title: 'Tarif & Ketersediaan',
      description: 'Tarif dan waktu ketersediaan Anda',
      icon: <Clock className="h-5 w-5" />,
      completed: !!formData.baseRate && formData.rateUnit,
    },
  ];

  // Handler untuk update form data
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler untuk checkbox changes (availability)
  const handleAvailabilityChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: {
        ...prev.availableDays,
        [day]: !prev.availableDays[day as keyof typeof prev.availableDays],
      },
    }));
  };

  // Handler untuk array fields (service areas, specializations)
  const handleArrayFieldAdd = (field: string, value: string) => {
    if (!value.trim()) return;

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], value.trim()],
      [`custom${field.charAt(0).toUpperCase() + field.slice(1, -1)}`]: '',
    }));
  };

  const handleArrayFieldRemove = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index),
    }));
  };

  // Handler untuk step navigation
  const navigateToStep = (stepId: string) => {
    setActiveStepId(stepId);
  };

  const goToNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStepId);
    if (currentIndex < steps.length - 1) {
      setActiveStepId(steps[currentIndex + 1].id);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStepId);
    if (currentIndex > 0) {
      setActiveStepId(steps[currentIndex - 1].id);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmissionSuccess(true);
      // In real implementation, you would send the form data to your backend
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If form is successfully submitted
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mb-4 text-2xl font-bold">
                Selamat! Profil Penyedia Jasa Anda Sudah Lengkap
              </h1>
              <p className="mb-8 text-gray-600">
                Informasi yang Anda berikan telah disimpan. Pelanggan sekarang dapat melihat profil
                dan layanan Anda.
              </p>
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-white hover:bg-blue-700"
                >
                  Buka Dashboard
                </Link>
                <Link
                  href="/provider/services/new"
                  className="block w-full rounded-lg border border-blue-600 px-5 py-3 text-center text-blue-600 hover:bg-blue-50"
                >
                  Tambah Layanan Baru
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Lengkapi Profil Penyedia Jasa</h1>
            <p className="text-gray-600">
              Berikan informasi lebih detail tentang layanan yang Anda tawarkan
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Sidebar Steps */}
            <div className="space-y-1">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex cursor-pointer items-center rounded-lg p-3 ${
                    activeStepId === step.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => navigateToStep(step.id)}
                >
                  <div
                    className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      step.completed
                        ? 'bg-blue-600 text-white'
                        : activeStepId === step.id
                          ? 'border-2 border-blue-600 text-blue-600'
                          : 'border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {step.completed ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-sm font-medium ${
                        activeStepId === step.id ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Form Area */}
            <div className="rounded-xl bg-white p-6 shadow-lg md:col-span-3">
              <form onSubmit={handleSubmit}>
                {/* Service Information */}
                {activeStepId === 'service-info' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Informasi Layanan</h2>
                    <p className="text-sm text-gray-500">
                      Berikan detail tentang jasa yang Anda tawarkan
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Jenis Layanan <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {serviceTypes.map(type => (
                            <div
                              key={type.id}
                              onClick={() => updateFormData('serviceType', type.id)}
                              className={`flex cursor-pointer items-center rounded-lg border p-3 hover:border-blue-500 ${
                                formData.serviceType === type.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <span className="mr-2 text-xl">{type.icon}</span>
                              <span className="text-sm">{type.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {formData.serviceType === 'other' && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Jenis Layanan Kustom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.customServiceType}
                            onChange={e => updateFormData('customServiceType', e.target.value)}
                            placeholder="Contoh: Jasa Taman, Jasa Teknisi, dll"
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required={formData.serviceType === 'other'}
                          />
                        </div>
                      )}

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Judul Layanan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.serviceTitle}
                          onChange={e => updateFormData('serviceTitle', e.target.value)}
                          placeholder="Contoh: Jasa Perbaikan Listrik Rumah Tangga"
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Deskripsi Layanan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.serviceDescription}
                          onChange={e => updateFormData('serviceDescription', e.target.value)}
                          rows={4}
                          placeholder="Jelaskan dengan detail layanan yang Anda tawarkan. Cantumkan keunggulan dan spesifikasi jasa Anda."
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Minimal 50 karakter, maksimal 1000 karakter
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Area */}
                {activeStepId === 'service-area' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Area Layanan</h2>
                    <p className="text-sm text-gray-500">
                      Tentukan lokasi di mana Anda dapat menyediakan layanan
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Area Layanan <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={formData.customServiceArea}
                            onChange={e => updateFormData('customServiceArea', e.target.value)}
                            placeholder="Contoh: Jakarta Selatan, Tangerang"
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayFieldAdd('serviceAreas', formData.customServiceArea)
                            }
                            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                          >
                            Tambah
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Tambahkan area atau kota tempat Anda bisa memberikan layanan
                        </p>
                      </div>

                      {/* Display added service areas */}
                      {formData.serviceAreas.length > 0 && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Area Terdaftar:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formData.serviceAreas.map((area: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800"
                              >
                                <MapPin className="mr-1 h-3 w-3" />
                                {area}
                                <button
                                  type="button"
                                  onClick={() => handleArrayFieldRemove('serviceAreas', index)}
                                  className="ml-2 text-blue-800 hover:text-blue-900"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Jarak Maksimum (km)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={formData.maxDistance}
                          onChange={e => updateFormData('maxDistance', parseInt(e.target.value))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>1 km</span>
                          <span>{formData.maxDistance} km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience & Skills */}
                {activeStepId === 'experience' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Keahlian & Pengalaman</h2>
                    <p className="text-sm text-gray-500">
                      Informasi tentang pengalaman dan keahlian Anda
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Pengalaman (Tahun) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.yearsExperience}
                          onChange={e => updateFormData('yearsExperience', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        >
                          <option value="">Pilih Lama Pengalaman</option>
                          <option value="< 1">Kurang dari 1 tahun</option>
                          <option value="1-3">1-3 tahun</option>
                          <option value="3-5">3-5 tahun</option>
                          <option value="5-10">5-10 tahun</option>
                          <option value="10+">Lebih dari 10 tahun</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Tingkat Keahlian <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'beginner', label: 'Pemula' },
                            { id: 'intermediate', label: 'Menengah' },
                            { id: 'expert', label: 'Ahli' },
                          ].map(level => (
                            <div
                              key={level.id}
                              onClick={() => updateFormData('skillLevel', level.id)}
                              className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-center hover:border-blue-500 ${
                                formData.skillLevel === level.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <span className="text-sm">{level.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Spesialisasi <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={formData.customSpecialization}
                            onChange={e => updateFormData('customSpecialization', e.target.value)}
                            placeholder="Contoh: Instalasi Listrik, Perbaikan Kabel, dll"
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayFieldAdd('specializations', formData.customSpecialization)
                            }
                            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                          >
                            Tambah
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Tambahkan keahlian khusus yang Anda miliki
                        </p>
                      </div>

                      {/* Display added specializations */}
                      {formData.specializations.length > 0 && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Spesialisasi Terdaftar:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formData.specializations.map(
                              (specialization: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                                >
                                  {specialization}
                                  <button
                                    type="button"
                                    onClick={() => handleArrayFieldRemove('specializations', index)}
                                    className="ml-2 text-green-800 hover:text-green-900"
                                  >
                                    &times;
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rates & Availability */}
                {activeStepId === 'availability' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Tarif & Ketersediaan</h2>
                    <p className="text-sm text-gray-500">
                      Tentukan tarif dan waktu ketersediaan Anda
                    </p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Tarif Dasar <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500">Rp</span>
                            </div>
                            <input
                              type="number"
                              value={formData.baseRate}
                              onChange={e => updateFormData('baseRate', e.target.value)}
                              placeholder="100000"
                              className="w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Jenis Tarif <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.rateUnit}
                            onChange={e => updateFormData('rateUnit', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          >
                            <option value="hourly">Per Jam</option>
                            <option value="daily">Per Hari</option>
                            <option value="fixed">Tarif Tetap</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="negotiable"
                          checked={formData.isNegotiable}
                          onChange={() => updateFormData('isNegotiable', !formData.isNegotiable)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="negotiable" className="ml-2 text-sm text-gray-700">
                          Tarif dapat dinegosiasikan
                        </label>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Ketersediaan Hari
                        </label>
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                          {[
                            { id: 'monday', label: 'Senin' },
                            { id: 'tuesday', label: 'Selasa' },
                            { id: 'wednesday', label: 'Rabu' },
                            { id: 'thursday', label: 'Kamis' },
                            { id: 'friday', label: 'Jumat' },
                            { id: 'saturday', label: 'Sabtu' },
                            { id: 'sunday', label: 'Minggu' },
                          ].map(day => (
                            <div
                              key={day.id}
                              onClick={() => handleAvailabilityChange(day.id)}
                              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2 text-center hover:border-blue-500 ${
                                formData.availableDays[
                                  day.id as keyof typeof formData.availableDays
                                ]
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <span className="text-xs">{day.label}</span>
                              {formData.availableDays[
                                day.id as keyof typeof formData.availableDays
                              ] && <Check className="h-4 w-4 text-blue-600" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Jam Mulai
                          </label>
                          <input
                            type="time"
                            value={formData.availableTimeStart}
                            onChange={e => updateFormData('availableTimeStart', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Jam Selesai
                          </label>
                          <input
                            type="time"
                            value={formData.availableTimeEnd}
                            onChange={e => updateFormData('availableTimeEnd', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    disabled={activeStepId === steps[0].id}
                  >
                    Sebelumnya
                  </button>

                  {activeStepId !== steps[steps.length - 1].id ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Selanjutnya
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Memproses...' : 'Selesai'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
