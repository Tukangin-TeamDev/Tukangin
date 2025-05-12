import Link from "next/link"
import { Copyright } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-purple-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Tukangin</h3>
            <p className="text-gray-800 mb-4">
              Platform terpercaya untuk menghubungkan pelanggan dengan jasa tukang profesional
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-medium mb-6">Layanan</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Perbaikan Listrik
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Servis AC
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Renovasi Rumah
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Tukang Ledeng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  DLL
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xl font-medium mb-6">Perusahaan</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xl font-medium mb-6">Bantuan</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-blue-600">
                  Bantuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-300 flex flex-col md:flex-row justify-center md:justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Copyright className="h-5 w-5 mr-2 text-gray-600" />
            <p className="text-gray-800">2025 Tukangin. All right reserved</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-800 hover:text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link href="#" className="text-gray-800 hover:text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className="text-gray-800 hover:text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
