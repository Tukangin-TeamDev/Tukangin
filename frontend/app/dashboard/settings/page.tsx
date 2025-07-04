'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Bell,
  Lock,
  CreditCard,
  Languages,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Smartphone,
  Mail,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingSections: SettingSection[] = [
    {
      id: 'notifications',
      title: 'Notifikasi',
      icon: <Bell className="h-5 w-5" />,
      description: 'Atur preferensi notifikasi',
      items: [
        {
          id: 'email',
          title: 'Email',
          description: 'Terima notifikasi melalui email',
        },
        {
          id: 'push',
          title: 'Push Notification',
          description: 'Terima notifikasi langsung di perangkat Anda',
        },
        {
          id: 'sms',
          title: 'SMS',
          description: 'Terima notifikasi melalui SMS',
        },
      ],
    },
    {
      id: 'security',
      title: 'Keamanan',
      icon: <Lock className="h-5 w-5" />,
      description: 'Kelola keamanan akun Anda',
      items: [
        {
          id: 'password',
          title: 'Ubah Password',
          description: 'Perbarui password akun Anda',
        },
        {
          id: '2fa',
          title: 'Verifikasi Dua Faktor',
          description: 'Tambahkan lapisan keamanan ekstra',
        },
        {
          id: 'devices',
          title: 'Perangkat Aktif',
          description: 'Kelola perangkat yang terhubung ke akun Anda',
        },
      ],
    },
    {
      id: 'payment',
      title: 'Pembayaran',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Kelola metode pembayaran',
      items: [
        {
          id: 'methods',
          title: 'Metode Pembayaran',
          description: 'Tambah atau hapus metode pembayaran',
        },
        {
          id: 'history',
          title: 'Riwayat Pembayaran',
          description: 'Lihat riwayat transaksi Anda',
        },
        {
          id: 'invoices',
          title: 'Faktur',
          description: 'Unduh faktur pembayaran',
        },
      ],
    },
    {
      id: 'language',
      title: 'Bahasa & Wilayah',
      icon: <Languages className="h-5 w-5" />,
      description: 'Atur preferensi bahasa dan wilayah',
      items: [
        {
          id: 'language',
          title: 'Bahasa',
          description: 'Pilih bahasa yang digunakan',
        },
        {
          id: 'region',
          title: 'Wilayah',
          description: 'Atur wilayah dan zona waktu',
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privasi',
      icon: <Shield className="h-5 w-5" />,
      description: 'Kelola pengaturan privasi',
      items: [
        {
          id: 'data',
          title: 'Data Saya',
          description: 'Kelola data pribadi Anda',
        },
        {
          id: 'visibility',
          title: 'Visibilitas Profil',
          description: 'Atur siapa yang dapat melihat profil Anda',
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {settingSections.map(section => (
          <div key={section.id} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">{section.icon}</div>
                <div className="text-left">
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`}
              />
            </button>

            {activeSection === section.id && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <LogOut className="h-5 w-5" />
            </div>
            <button className="font-medium text-red-600">Keluar</button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Kontak Dukungan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-gray-500">support@tukangin.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Telepon</h3>
              <p className="text-sm text-gray-500">+62 812-3456-7890</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full text-purple-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Pusat Bantuan</h3>
              <p className="text-sm text-gray-500">Kunjungi FAQ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
