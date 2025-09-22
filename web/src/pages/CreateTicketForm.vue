<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 font-sans">
    <div class="max-w-full mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div>
            <img src="../assets/orbiz-logo.png" alt="Orbiz Logo" class="w-10 h-10 object-contain" />
          </div>
          <h1 class="text-slate-800 text-4xl font-bold tracking-tight bg-gradient-to-r from-[#6c366a] to-purple-600 bg-clip-text text-transparent">Form Ticketing</h1>
        </div>
        <p class="text-slate-600 text-lg font-medium">Silakan isi ticketing agar aktivitas diproses</p>
        <div class="w-24 h-1 bg-gradient-to-r from-[#6c366a] to-purple-600 rounded-full mx-auto mt-4"></div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
        <form @submit.prevent="submitTicket" class="p-8 lg:p-10">
          
          <!-- Activity Type Section -->
          <div class="mb-8">
            <label for="activity_type" class="block mb-3 font-bold text-[#6c366a] text-lg">
              Tipe Aktivitas *
            </label>
            <select
              id="activity_type"
              v-model="formData.activity_type"
              required
              class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-lg font-medium transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white shadow-sm"
              @change="onActivityTypeChange"
            >
              <option value="">-- Pilih Tipe Aktivitas --</option>
              <option value="true">Inbound</option>
              <option value="false">Outbound</option>
            </select>
          </div>

          <!-- Driver Information Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-[#6c366a] mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-[#6c366a] to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              Informasi Driver
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Nama Driver -->
              <div class="space-y-2">
                <label for="driver_name" class="block font-semibold text-slate-700 text-sm">Nama Driver *</label>
                <input
                  id="driver_name"
                  v-model="formData.driver_name"
                  type="text"
                  required
                  placeholder="Masukkan nama driver"
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                />
              </div>

              <!-- NIK -->
              <div class="space-y-2">
                <label for="nik" class="block font-semibold text-slate-700 text-sm">NIK *</label>
                <input
                  id="nik"
                  v-model="formData.nik"
                  type="text"
                  required
                  placeholder="Contoh: 3201234567890123"
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                  maxlength="16"
                  @input="onlyNumbers($event, 'nik')"
                  inputmode="numeric"
                />
              </div>

              <!-- Nomor HP -->
              <div class="space-y-2">
                <label for="handphone_number" class="block font-semibold text-slate-700 text-sm">Nomor HP *</label>
                <input
                  id="handphone_number"
                  v-model="formData.handphone_number"
                  type="text"
                  required
                  placeholder="08xxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                  @input="onlyNumbers($event, 'handphone_number')"
                  inputmode="numeric"
                />
              </div>
            </div>
          </div>

          <!-- Vehicle Information Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-[#6c366a] mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-[#6c366a] to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                </svg>
              </div>
              Informasi Kendaraan
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Jenis Kendaraan -->
              <div class="space-y-2">
                <label for="truck_type" class="block font-semibold text-slate-700 text-sm">Jenis Kendaraan *</label>
                <select
                  id="truck_type"
                  v-model="formData.truck_type"
                  required
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                >
                  <option value="">-- Pilih Jenis Kendaraan --</option>
                  <option value="Tipe A">Tipe A</option>
                  <option value="Tipe B">Tipe B</option>
                  <option value="Tipe C">Tipe C</option>
                  <option value="Tipe D">Tipe D</option>
                  <option value="Tipe E">Tipe E</option>
                </select>
              </div>

              <!-- Plat Nomor -->
              <div class="space-y-2">
                <label class="block font-semibold text-slate-700 text-sm">Plat Nomor *</label>
                <div class="grid grid-cols-3 gap-3">
                  <div class="space-y-1">
                    <input
                      v-model="formData.license_plate_letters1"
                      type="text"
                      required
                      placeholder="B"
                      maxlength="2"
                      @input="onlyLetters($event, 'license_plate_letters1')"
                      class="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-base text-center uppercase font-bold transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                    />
                    <p class="text-xs text-purple-600 font-medium text-center">1-2 huruf</p>
                  </div>
                  <div class="space-y-1">
                    <input
                      v-model="formData.license_plate_numbers"
                      type="text"
                      required
                      placeholder="1234"
                      maxlength="4"
                      @input="onlyNumbers($event, 'license_plate_numbers')"
                      inputmode="numeric"
                      class="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-base text-center font-bold transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                    />
                    <p class="text-xs text-purple-600 font-medium text-center">1-4 angka</p>
                  </div>
                  <div class="space-y-1">
                    <input
                      v-model="formData.license_plate_letters2"
                      type="text"
                      required
                      placeholder="ABC"
                      maxlength="3"
                      @input="onlyLetters($event, 'license_plate_letters2')"
                      class="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-base text-center uppercase font-bold transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
                    />
                    <p class="text-xs text-purple-600 font-medium text-center">1-3 huruf</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Company Information Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-[#6c366a] mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-[#6c366a] to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              Informasi Perusahaan
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Principal -->
              <div class="space-y-2">
                <label for="principal" class="block font-semibold text-slate-700 text-sm">
                  Principal 
                  <span v-if="formData.activity_type === 'true'" class="text-red-500 font-bold">*</span>
                  <span v-if="formData.activity_type === 'false'" class="text-slate-400 text-xs">(Dinonaktifkan untuk Outbound)</span>
                </label>
                <select
                  id="principal"
                  v-model="formData.principal"
                  :required="formData.activity_type === 'true'"
                  :disabled="formData.activity_type !== 'true'"
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500 bg-white"
                >
                  <option value="">-- Pilih Principal --</option>
                  <option value="PT ABC Logistics">PT ABC Logistics</option>
                  <option value="PT Maju Jaya Transport">PT Maju Jaya Transport</option>
                  <option value="PT Global Cargo">PT Global Cargo</option>
                  <option value="PT Sentosa Logistics">PT Sentosa Logistics</option>
                  <option value="PT Prima Express">PT Prima Express</option>
                </select>
              </div>

              <!-- Vendor -->
              <div class="space-y-2">
                <label for="vendor" class="block font-semibold text-slate-700 text-sm">
                  Vendor 
                  <span v-if="formData.activity_type === 'false'" class="text-red-500 font-bold">*</span>
                  <span v-if="formData.activity_type === 'true'" class="text-slate-400 text-xs">(Dinonaktifkan untuk Inbound)</span>
                </label>
                <select
                  id="vendor"
                  v-model="formData.vendor"
                  :required="formData.activity_type === 'false'"
                  :disabled="formData.activity_type !== 'false'"
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500 bg-white"
                >
                  <option value="">-- Pilih Vendor --</option>
                  <option value="PT XYZ Transport">PT XYZ Transport</option>
                  <option value="PT Delta Logistics">PT Delta Logistics</option>
                  <option value="PT Omega Express">PT Omega Express</option>
                  <option value="PT Beta Cargo">PT Beta Cargo</option>
                  <option value="PT Gamma Transport">PT Gamma Transport</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Document Verification Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-[#6c366a] mb-2 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-[#6c366a] to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              Verifikasi Dokumen
            </h3>
            <p class="text-slate-600 font-medium mb-6">SJ wajib, dan minimal salah satu dari KTP atau SIM harus tersedia</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-[#6c366a] transition-colors duration-200 hover:shadow-lg">
                <label class="flex items-center cursor-pointer text-sm text-slate-700 font-medium relative pl-10">
                  <input
                    type="checkbox"
                    v-model="formData.sj_available"
                    class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                    required
                  />
                  <span class="absolute left-0 h-6 w-6 bg-white border-2 border-purple-300 rounded-lg transition-all duration-200 peer-hover:border-[#6c366a] peer-checked:bg-[#6c366a] peer-checked:border-[#6c366a] after:content-[''] after:absolute after:hidden after:left-1.5 after:top-1 after:w-1.5 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                  <span class="ml-1">📄 Surat Jalan (SJ)</span>
                </label>
              </div>

              <div class="p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-[#6c366a] transition-colors duration-200 hover:shadow-lg">
                <label class="flex items-center cursor-pointer text-sm text-slate-700 font-medium relative pl-10">
                  <input
                    type="checkbox"
                    v-model="formData.ktp_available"
                    class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                  />
                  <span class="absolute left-0 h-6 w-6 bg-white border-2 border-purple-300 rounded-lg transition-all duration-200 peer-hover:border-[#6c366a] peer-checked:bg-[#6c366a] peer-checked:border-[#6c366a] after:content-[''] after:absolute after:hidden after:left-1.5 after:top-1 after:w-1.5 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                  <span class="ml-1">🆔 KTP</span>
                </label>
              </div>

              <div class="p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-[#6c366a] transition-colors duration-200 hover:shadow-lg">
                <label class="flex items-center cursor-pointer text-sm text-slate-700 font-medium relative pl-10">
                  <input
                    type="checkbox"
                    v-model="formData.sim_available"
                    class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                  />
                  <span class="absolute left-0 h-6 w-6 bg-white border-2 border-purple-300 rounded-lg transition-all duration-200 peer-hover:border-[#6c366a] peer-checked:bg-[#6c366a] peer-checked:border-[#6c366a] after:content-[''] after:absolute after:hidden after:left-1.5 after:top-1 after:w-1.5 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                  <span class="ml-1">🚗 SIM</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full py-4 px-6 bg-gradient-to-r from-[#6c366a] to-purple-600 hover:from-purple-700 hover:to-[#6c366a] text-white border-none rounded-xl text-lg font-bold cursor-pointer transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {{ isSubmitting ? '⏳ Memproses...' : 'Buat Tiket' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-fade-in" @click="closeModal">
      <div class="bg-white p-8 rounded-3xl text-center max-w-md w-full shadow-2xl border border-purple-200 transform animate-scale-in" @click.stop>
        <div class="w-20 h-20 bg-gradient-to-r from-[#6c366a] to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">✓</div>
        <h2 class="mb-4 text-slate-800 text-2xl font-bold">Tiket Berhasil Dibuat!</h2>
        <p class="text-slate-600 mb-6">Tiket telah berhasil disimpan dalam sistem</p>
        <button @click="closeModal" class="py-3 px-8 bg-gradient-to-r from-[#6c366a] to-purple-600 hover:from-purple-700 hover:to-[#6c366a] text-white border-none rounded-xl font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">Tutup</button>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="errorMessage" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-fade-in" @click="clearError">
      <div class="bg-white p-8 rounded-3xl text-center max-w-md w-full shadow-2xl border border-purple-200 transform animate-scale-in" @click.stop>
        <div class="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">✗</div>
        <h2 class="mb-4 text-slate-800 text-2xl font-bold">Terjadi Kesalahan</h2>
        <p class="mb-6 text-slate-600 bg-red-50 p-4 rounded-xl border border-red-100">{{ errorMessage }}</p>
        <button @click="clearError" class="py-3 px-8 bg-gradient-to-r from-[#6c366a] to-purple-600 hover:from-purple-700 hover:to-[#6c366a] text-white border-none rounded-xl font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import convex from '../convex'

const router = useRouter();
const showToast = ref(false)

const formData = reactive({
  activity_type: '',
  driver_name: '',
  nik: '',
  handphone_number: '',
  license_plate_letters1: '',
  license_plate_numbers: '',
  license_plate_letters2: '',
  truck_type: '',
  principal: '',
  vendor: '',
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

// Handle activity type change
const onActivityTypeChange = () => {
  // Reset principal dan vendor ketika activity type berubah
  if (formData.activity_type === 'true') { // Inbound
    formData.vendor = ''
  } else if (formData.activity_type === 'false') { // Outbound
    formData.principal = ''
  }
}

const submitTicket = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''

    // Convert activity_type to boolean
    const activityTypeBoolean = formData.activity_type === 'true'

    // Prepare submit data
    const submitData = {
      activity_type: activityTypeBoolean,
      driver_name: formData.driver_name,
      nik: formData.nik,
      handphone_number: formData.handphone_number,
      license_plate: fullLicensePlate.value,
      truck_type: formData.truck_type,
      principal: formData.principal,
      vendor: formData.vendor,
      sj_available: formData.sj_available,
      ktp_available: formData.ktp_available,
      sim_available: formData.sim_available
    }

    // Validate all documents are checked
    if (!formData.sj_available || (!formData.ktp_available && !formData.sim_available)) {
      throw new Error('Dokumen SJ wajib tersedia, dan setidaknya salah satu dari KTP atau SIM harus tersedia sebelum melanjutkan')
    }

    // Validate license plate parts
    if (!formData.license_plate_letters1 || !formData.license_plate_numbers || !formData.license_plate_letters2) {
      throw new Error('Plat nomor harus diisi lengkap (huruf-angka-huruf)')
    }

    // Validate activity type selection
    if (!formData.activity_type) {
      throw new Error('Tipe aktivitas harus dipilih')
    }

    // Validate principal for inbound
    if (activityTypeBoolean && !formData.principal) {
      throw new Error('Principal wajib diisi untuk aktivitas Inbound')
    }

    // Validate vendor for outbound
    if (!activityTypeBoolean && !formData.vendor) {
      throw new Error('Vendor wajib diisi untuk aktivitas Outbound')
    }

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
    formData.activity_type = ''
    formData.driver_name = ''
    formData.nik = ''
    formData.handphone_number = ''
    formData.license_plate_letters1 = ''
    formData.license_plate_numbers = ''
    formData.license_plate_letters2 = ''
    formData.truck_type = ''
    formData.principal = ''
    formData.vendor = ''
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
  router.push('/')
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

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>