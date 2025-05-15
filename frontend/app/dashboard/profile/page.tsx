"use client"

import { useState } from "react"
import Image from "next/image"
import { User, Mail, Phone, MapPin, Edit } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Andi Wijaya",
    email: "andi.wijaya@example.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Sudirman No. 123, Jakarta Selatan",
    bio: "Saya adalah profesional yang bekerja di bidang teknologi dan membutuhkan jasa perbaikan rumah yang berkualitas.",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    publicProfile: true,
    showOnlineStatus: true,
  })

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profil Saya</h1>
          <p className="text-gray-600">Kelola informasi profil dan preferensi akun Anda</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Informasi Profil</h2>
          <p className="text-gray-500 text-sm mb-6">Informasi dasar tentang akun Anda</p>

          <div className="flex items-center mb-6">
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border border-gray-200"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span>{profile.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span>{profile.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span>{profile.phone}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span>{profile.address}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <div className="border border-gray-300 rounded-md p-3">
                <p>{profile.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Preferensi</h2>
          <p className="text-gray-500 text-sm mb-6">Atur preferensi akun Anda</p>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Notifikasi</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={() => togglePreference("emailNotifications")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>SMS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={() => togglePreference("smsNotifications")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Push Notification</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={() => togglePreference("pushNotifications")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Privasi</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Profil Publik</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.publicProfile}
                      onChange={() => togglePreference("publicProfile")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Tampilkan Status Online</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.showOnlineStatus}
                      onChange={() => togglePreference("showOnlineStatus")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
