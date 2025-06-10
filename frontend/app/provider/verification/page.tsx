'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

type FileUpload = {
  id: string;
  file: File | null;
  preview: string | null;
  error: string | null;
};

export default function ProviderVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [identityCard, setIdentityCard] = useState<FileUpload>({
    id: 'identity-card',
    file: null,
    preview: null,
    error: null,
  });

  const [selfieWithID, setSelfieWithID] = useState<FileUpload>({
    id: 'selfie',
    file: null,
    preview: null,
    error: null,
  });

  const [businessLicense, setBusinessLicense] = useState<FileUpload>({
    id: 'business-license',
    file: null,
    preview: null,
    error: null,
  });

  const [certificatesOrSkills, setCertificatesOrSkills] = useState<FileUpload>({
    id: 'certificates',
    file: null,
    preview: null,
    error: null,
  });

  // Handle file upload
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileState: React.Dispatch<React.SetStateAction<FileUpload>>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFileState(prev => ({
        ...prev,
        file: null,
        preview: null,
        error: 'Format file tidak valid. Mohon unggah gambar (JPG, PNG)',
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileState(prev => ({
        ...prev,
        file: null,
        preview: null,
        error: 'Ukuran file terlalu besar. Maksimal 5MB',
      }));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setFileState(prev => ({
      ...prev,
      file,
      preview: previewUrl,
      error: null,
    }));
  };

  // Clean up preview URLs on unmount
  const cleanupPreviews = () => {
    if (identityCard.preview) URL.revokeObjectURL(identityCard.preview);
    if (selfieWithID.preview) URL.revokeObjectURL(selfieWithID.preview);
    if (businessLicense.preview) URL.revokeObjectURL(businessLicense.preview);
    if (certificatesOrSkills.preview) URL.revokeObjectURL(certificatesOrSkills.preview);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required files
    if (!identityCard.file) {
      setIdentityCard(prev => ({ ...prev, error: 'KTP/Identitas wajib diunggah' }));
      return;
    }

    if (!selfieWithID.file) {
      setSelfieWithID(prev => ({ ...prev, error: 'Foto selfie wajib diunggah' }));
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Simulate API call for submitting verification documents
      await new Promise(resolve => setTimeout(resolve, 2000));

      // API call successful
      cleanupPreviews();
      setSubmissionSuccess(true);

      // In real implementation, would upload files to Supabase Storage
      // and create verification record in the database
    } catch (error) {
      console.error('Verification submission failed:', error);
      setSubmissionError('Terjadi kesalahan saat mengirim dokumen. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message after submission
  if (submissionSuccess) {
    return (
      <div className="flex min-h-screen bg-gray-50 py-8">
        <div className="mx-auto w-full max-w-2xl px-4">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-3 text-2xl font-bold text-gray-900">
                Verifikasi Berhasil Dikirim!
              </h1>
              <p className="mb-6 text-gray-600">
                Dokumen verifikasi Anda telah berhasil dikirim. Tim kami akan memeriksanya dalam 1-3
                hari kerja. Anda akan menerima notifikasi via email setelah proses verifikasi
                selesai.
              </p>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="inline-block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-all hover:bg-blue-700"
                >
                  Kembali ke Dasbor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verifikasi Penyedia Jasa</h1>
            <p className="text-sm text-gray-600">
              Lengkapi proses verifikasi untuk menjadi penyedia jasa di Tukangin
            </p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Kembali ke Dashboard
          </Link>
        </div>

        {submissionError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            <div className="flex items-center">
              <AlertTriangle className="mr-3 h-5 w-5" />
              <p>{submissionError}</p>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-4 rounded-lg bg-blue-50 p-4">
            <div className="rounded-full bg-blue-100 p-2">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 text-base font-medium text-gray-900">Verifikasi Diperlukan</h2>
              <p className="text-sm text-gray-600">
                Untuk menjaga keamanan dan kepercayaan pengguna, kami memerlukan dokumen verifikasi
                identitas. Data Anda disimpan dengan aman dan tidak akan dibagikan kepada pihak
                ketiga.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* KTP Upload */}
            <div>
              <label
                htmlFor={identityCard.id}
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Foto KTP / Kartu Identitas <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                {identityCard.preview ? (
                  <div className="relative">
                    <Image
                      src={identityCard.preview}
                      alt="Preview KTP"
                      width={300}
                      height={200}
                      className="h-auto max-w-full rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIdentityCard({
                          id: identityCard.id,
                          file: null,
                          preview: null,
                          error: null,
                        })
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 p-6">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor={identityCard.id}
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Unggah KTP</span>
                          <input
                            id={identityCard.id}
                            name={identityCard.id}
                            type="file"
                            className="sr-only"
                            onChange={e => handleFileChange(e, setIdentityCard)}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, maksimal 5MB</p>
                    </div>
                  </div>
                )}
                {identityCard.error && (
                  <p className="mt-1 text-sm text-red-600">{identityCard.error}</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Pastikan KTP/Kartu identitas tidak kedaluwarsa dan semua informasi jelas terlihat
              </p>
            </div>

            {/* Selfie dengan KTP */}
            <div>
              <label
                htmlFor={selfieWithID.id}
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Foto Selfie dengan KTP <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                {selfieWithID.preview ? (
                  <div className="relative">
                    <Image
                      src={selfieWithID.preview}
                      alt="Preview Selfie"
                      width={300}
                      height={200}
                      className="h-auto max-w-full rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelfieWithID({
                          id: selfieWithID.id,
                          file: null,
                          preview: null,
                          error: null,
                        })
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 p-6">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor={selfieWithID.id}
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Unggah Selfie</span>
                          <input
                            id={selfieWithID.id}
                            name={selfieWithID.id}
                            type="file"
                            className="sr-only"
                            onChange={e => handleFileChange(e, setSelfieWithID)}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, maksimal 5MB</p>
                    </div>
                  </div>
                )}
                {selfieWithID.error && (
                  <p className="mt-1 text-sm text-red-600">{selfieWithID.error}</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Foto diri Anda dengan memegang KTP di samping wajah. Pastikan wajah dan KTP terlihat
                jelas
              </p>
            </div>

            {/* Surat Izin Usaha (Optional) */}
            <div>
              <label
                htmlFor={businessLicense.id}
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Surat Izin Usaha / SIUP (Opsional)
              </label>
              <div className="mt-1">
                {businessLicense.preview ? (
                  <div className="relative">
                    <Image
                      src={businessLicense.preview}
                      alt="Preview SIUP"
                      width={300}
                      height={200}
                      className="h-auto max-w-full rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessLicense({
                          id: businessLicense.id,
                          file: null,
                          preview: null,
                          error: null,
                        })
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 p-6">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor={businessLicense.id}
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Unggah SIUP</span>
                          <input
                            id={businessLicense.id}
                            name={businessLicense.id}
                            type="file"
                            className="sr-only"
                            onChange={e => handleFileChange(e, setBusinessLicense)}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, maksimal 5MB</p>
                    </div>
                  </div>
                )}
                {businessLicense.error && (
                  <p className="mt-1 text-sm text-red-600">{businessLicense.error}</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Jika Anda memiliki usaha dengan SIUP, mohon unggah dokumennya untuk meningkatkan
                kepercayaan pelanggan
              </p>
            </div>

            {/* Sertifikat/Bukti Keterampilan (Optional) */}
            <div>
              <label
                htmlFor={certificatesOrSkills.id}
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Sertifikat Keterampilan (Opsional)
              </label>
              <div className="mt-1">
                {certificatesOrSkills.preview ? (
                  <div className="relative">
                    <Image
                      src={certificatesOrSkills.preview}
                      alt="Preview Sertifikat"
                      width={300}
                      height={200}
                      className="h-auto max-w-full rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCertificatesOrSkills({
                          id: certificatesOrSkills.id,
                          file: null,
                          preview: null,
                          error: null,
                        })
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 p-6">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor={certificatesOrSkills.id}
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Unggah Sertifikat</span>
                          <input
                            id={certificatesOrSkills.id}
                            name={certificatesOrSkills.id}
                            type="file"
                            className="sr-only"
                            onChange={e => handleFileChange(e, setCertificatesOrSkills)}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, maksimal 5MB</p>
                    </div>
                  </div>
                )}
                {certificatesOrSkills.error && (
                  <p className="mt-1 text-sm text-red-600">{certificatesOrSkills.error}</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Unggah sertifikat keterampilan atau bukti pengalaman untuk meningkatkan kredibilitas
                profil Anda
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg className="mr-2 inline h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mengirimkan...
                  </>
                ) : (
                  'Kirim Dokumen Verifikasi'
                )}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500">
                Dengan mengirim dokumen ini, Anda menyetujui bahwa data Anda akan diverifikasi oleh
                tim Tukangin untuk memastikan keamanan dan kualitas layanan.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
