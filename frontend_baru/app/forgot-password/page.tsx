"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { validateEmail } from "@/lib/validation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError("")

    // Validate email
    if (!email) {
      setEmailError("Email tidak boleh kosong")
      return
    } else if (!validateEmail(email)) {
      setEmailError("Format email tidak valid")
      return
    }

    // Simulate password reset request
    setIsLoading(true)

    try {
      // Here you would normally call your password reset API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset request failed:", error)
      setEmailError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke halaman login
                </Link>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Lupa Password</h1>
                  <p className="text-gray-500">Masukkan email Anda untuk menerima instruksi reset password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Masukkan E-mail"
                        className={`flex h-12 w-full rounded-xl border bg-white pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          emailError ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                        }`}
                      />
                    </div>
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center w-full h-12 px-4 py-2 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Memproses..." : "Kirim Instruksi Reset"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Email Terkirim</h1>
                <p className="text-gray-500">
                  Kami telah mengirimkan instruksi reset password ke <span className="font-medium">{email}</span>.
                  Silakan periksa kotak masuk email Anda.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full h-12 px-4 py-2 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Kembali ke Login
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                Tidak menerima email? Periksa folder spam atau{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-blue-600 hover:underline">
                  coba lagi
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
