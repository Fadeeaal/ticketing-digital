<template>
  <div class="min-h-screen bg-gray-50 p-5 font-sans">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Logo Section (Left Side) -->
        <div class="lg:col-span-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8">
          <div class="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mb-6">
            <!-- Placeholder logo - ganti dengan logo perusahaan -->
            <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">PT TICKETING DIGITAL</h2>
          <p class="text-gray-600 text-center">Sistem Manajemen Inbound Kendaraan</p>
        </div>

        <!-- Form Section (Right Side) -->
        <div class="lg:col-span-2">
          <div class="text-center mb-8">
            <h1 class="text-gray-800 mb-2 text-3xl font-bold">Form Ticketing</h1>
            <p class="text-gray-500 text-base">Silakan isi ticketing agar inbound diproses</p>
          </div>

          <form @submit.prevent="submitTicket" class="bg-white p-8 rounded-xl shadow-lg">
            <!-- Form Grid - 2 Columns -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <!-- Nama Driver -->
              <div>
                <label for="driver_name" class="block mb-2 font-semibold text-gray-700 text-sm">Nama Driver *</label>
                <input
                  id="driver_name"
                  v-model="formData.driver_name"
                  type="text"
                  required
                  placeholder="Masukkan nama driver"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                />
              </div>

              <!-- NIK -->
              <div>
                <label for="nik" class="block mb-2 font-semibold text-gray-700 text-sm">NIK *</label>
                <input
                  id="nik"
                  v-model="formData.nik"
                  type="text"
                  required
                  placeholder="Contoh: 3201234567890123"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  maxlength="16"
                  @input="onlyNumbers($event, 'nik')"
                  inputmode="numeric"
                />
              </div>

              <!-- Nomor HP -->
              <div>
                <label for="handphone_number" class="block mb-2 font-semibold text-gray-700 text-sm">Nomor HP *</label>
                <input
                  id="handphone_number"
                  v-model="formData.handphone_number"
                  type="text"
                  required
                  placeholder="08xxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  @input="onlyNumbers($event, 'handphone_number')"
                  inputmode="numeric"
                />
              </div>

              <!-- Jenis Kendaraan -->
              <div>
                <label for="truck_type" class="block mb-2 font-semibold text-gray-700 text-sm">Jenis Kendaraan *</label>
                <input
                  id="truck_type"
                  v-model="formData.truck_type"
                  type="text"
                  required
                  placeholder="Contoh: Mitsubishi Canter"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                />
              </div>
            </div>

            <!-- Plat Nomor - 3 Kotak Terpisah (Span 2 Columns) -->
            <div class="mb-6">
              <label class="block mb-2 font-semibold text-gray-700 text-sm">Plat Nomor *</label>
              <div class="grid grid-cols-3 gap-3 max-w-md">
                <div>
                  <input
                    v-model="formData.license_plate_letters1"
                    type="text"
                    required
                    placeholder="B"
                    maxlength="2"
                    @input="onlyLetters($event, 'license_plate_letters1')"
                    class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-center uppercase transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  />
                  <p class="text-xs text-gray-500 mt-1 text-center">1-2 huruf</p>
                </div>
                <div>
                  <input
                    v-model="formData.license_plate_numbers"
                    type="text"
                    required
                    placeholder="1234"
                    maxlength="4"
                    @input="onlyNumbers($event, 'license_plate_numbers')"
                    inputmode="numeric"
                    class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-center transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  />
                  <p class="text-xs text-gray-500 mt-1 text-center">1-4 angka</p>
                </div>
                <div>
                  <input
                    v-model="formData.license_plate_letters2"
                    type="text"
                    required
                    placeholder="ABC"
                    maxlength="3"
                    @input="onlyLetters($event, 'license_plate_letters2')"
                    class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-center uppercase transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  />
                  <p class="text-xs text-gray-500 mt-1 text-center">1-3 huruf</p>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">Preview: {{ licensePlatePreview }}</p>
            </div>

            <!-- Nama Perusahaan (Full Width) -->
            <div class="mb-6">
              <label for="principal" class="block mb-2 font-semibold text-gray-700 text-sm">Nama Perusahaan *</label>
              <input
                id="principal"
                v-model="formData.principal"
                type="text"
                required
                placeholder="PT ABC"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              />
            </div>

            <!-- Document Verification Section -->
            <div class="my-8 p-6 bg-slate-50 border-2 border-slate-200 rounded-lg">
              <h3 class="text-gray-800 mb-2 text-lg font-semibold">Verifikasi Dokumen</h3>
              <p class="text-slate-600 text-sm mb-5">SJ wajib, dan minimal salah satu dari KTP atau SIM harus tersedia</p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="flex items-center cursor-pointer text-sm text-gray-700 font-medium relative pl-9">
                    <input
                      type="checkbox"
                      v-model="formData.sj_available"
                      class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                      required
                    />
                    <span class="absolute left-0 h-5 w-5 bg-white border-2 border-gray-300 rounded transition-all duration-200 peer-hover:border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 after:content-[''] after:absolute after:hidden after:left-1.5 after:top-0.5 after:w-1.5 after:h-2.5 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                    Surat Jalan (SJ)
                  </label>
                </div>

                <div>
                  <label class="flex items-center cursor-pointer text-sm text-gray-700 font-medium relative pl-9">
                    <input
                      type="checkbox"
                      v-model="formData.ktp_available"
                      class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                    />
                    <span class="absolute left-0 h-5 w-5 bg-white border-2 border-gray-300 rounded transition-all duration-200 peer-hover:border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 after:content-[''] after:absolute after:hidden after:left-1.5 after:top-0.5 after:w-1.5 after:h-2.5 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                    KTP
                  </label>
                </div>

                <div>
                  <label class="flex items-center cursor-pointer text-sm text-gray-700 font-medium relative pl-9">
                    <input
                      type="checkbox"
                      v-model="formData.sim_available"
                      class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                    />
                    <span class="absolute left-0 h-5 w-5 bg-white border-2 border-gray-300 rounded transition-all duration-200 peer-hover:border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 after:content-[''] after:absolute after:hidden after:left-1.5 after:top-0.5 after:w-1.5 after:h-2.5 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                    SIM
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full py-4 bg-blue-500 text-white border-none rounded-lg text-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Memproses...' : 'Buat Tiket' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5" @click="closeModal">
      <div class="bg-white p-8 rounded-xl text-center max-w-sm w-full shadow-2xl" @click.stop>
        <div class="w-15 h-15 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">✓</div>
        <h2 class="mb-5 text-gray-800">Tiket Berhasil Dibuat!</h2>
        <button @click="closeModal" class="py-3 px-6 bg-blue-500 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-600">Tutup</button>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="errorMessage" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5" @click="clearError">
      <div class="bg-white p-8 rounded-xl text-center max-w-sm w-full shadow-2xl" @click.stop>
        <div class="w-15 h-15 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">✗</div>
        <h2 class="mb-5 text-gray-800">Terjadi Kesalahan</h2>
        <p class="mb-5 text-gray-600">{{ errorMessage }}</p>
        <button @click="clearError" class="py-3 px-6 bg-blue-500 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-600">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import convex from '../convex'

const formData = reactive({
  driver_name: '',
  nik: '',
  handphone_number: '',
  license_plate_letters1: '',
  license_plate_numbers: '',
  license_plate_letters2: '',
  truck_type: '',
  principal: '',
  sj_available: false,
  ktp_available: false,
  sim_available: false
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')
const createdTicket = ref(null)

// Computed property untuk preview plat nomor
const licensePlatePreview = computed(() => {
  const { license_plate_letters1, license_plate_numbers, license_plate_letters2 } = formData
  if (!license_plate_letters1 && !license_plate_numbers && !license_plate_letters2) {
    return 'Contoh: B 1234 ABC'
  }
  return `${license_plate_letters1} ${license_plate_numbers} ${license_plate_letters2}`.trim()
})

// Computed property untuk gabungan plat nomor lengkap
const fullLicensePlate = computed(() => {
  return `${formData.license_plate_letters1}${formData.license_plate_numbers}${formData.license_plate_letters2}`
})

const submitTicket = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''

    // Gabungkan plat nomor dan hanya kirim field yang diterima backend
    const submitData = {
      driver_name: formData.driver_name,
      nik: formData.nik,
      handphone_number: formData.handphone_number,
      license_plate: fullLicensePlate.value,
      truck_type: formData.truck_type,
      principal: formData.principal,
      sj_available: formData.sj_available,
      ktp_available: formData.ktp_available,
      sim_available: formData.sim_available
    }

    console.log('Form data:', submitData) // Debug log

    // Validate all documents are checked
    if (!formData.sj_available || (!formData.ktp_available && !formData.sim_available)) {
      throw new Error('Dokumen SJ wajib tersedia, dan setidaknya salah satu dari KTP atau SIM harus tersedia sebelum melanjutkan')
    }

    // Validate license plate parts
    if (!formData.license_plate_letters1 || !formData.license_plate_numbers || !formData.license_plate_letters2) {
      throw new Error('Plat nomor harus diisi lengkap (huruf-angka-huruf)')
    }

    // Test connection first
    console.log('Convex URL:', import.meta.env.VITE_CONVEX_URL)

    // Call Convex mutation with direct HTTP call as fallback
    let result
    try {
      // Try direct API call first
      const response = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/create-ticket`.replace('.convex.cloud', '.convex.site'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Server error')
      }
      
      result = data.data
    } catch (fetchError) {
      console.error('Direct API failed, trying Convex client:', fetchError)
      // Fallback to Convex client
      result = await convex.mutation('tickets:createTicket', submitData)
    }
    
    createdTicket.value = result
    showSuccess.value = true
    
    // Reset form
    formData.driver_name = ''
    formData.nik = ''
    formData.handphone_number = ''
    formData.license_plate_letters1 = ''
    formData.license_plate_numbers = ''
    formData.license_plate_letters2 = ''
    formData.truck_type = ''
    formData.principal = ''
    formData.sj_available = false
    formData.ktp_available = false
    formData.sim_available = false

  } catch (error: unknown) {
    console.error('Submit error:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Gagal membuat tiket. Silakan coba lagi.'
    } else {
      errorMessage.value = 'Gagal membuat tiket. Silakan coba lagi.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  showSuccess.value = false
  createdTicket.value = null
}

const clearError = () => {
  errorMessage.value = ''
}

const onlyNumbers = (event: Event, field: string) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '') // Hapus semua karakter selain angka
  
  if (field === 'nik') {
    formData.nik = value
  } else if (field === 'handphone_number') {
    formData.handphone_number = value
  } else if (field === 'license_plate_numbers') {
    formData.license_plate_numbers = value
  }
  
  target.value = value // Update input value
}

const onlyLetters = (event: Event, field: string) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^A-Za-z]/g, '').toUpperCase() // Hapus semua karakter selain huruf dan ubah ke uppercase
  
  if (field === 'license_plate_letters1') {
    formData.license_plate_letters1 = value
  } else if (field === 'license_plate_letters2') {
    formData.license_plate_letters2 = value
  }
  
  target.value = value // Update input value
}
</script>