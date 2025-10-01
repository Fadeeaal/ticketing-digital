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
            <Dropdown
              id="activity_type"
              label="Tipe Aktivitas"
              v-model="formData.activity_type"
              :options="activityTypeOptions"
              :required="true"
              placeholder="-- Pilih Tipe Aktivitas --"
              size="large"
              @change="onActivityTypeChange"
            />
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
              <FormInput
                id="driver_name"
                label="Nama Driver"
                v-model="formData.driver_name"
                :required="true"
                placeholder="Masukkan nama driver"
              />

              <FormInput
                id="nik"
                label="NIK"
                v-model="formData.nik"
                :required="true"
                placeholder="Contoh: 3201234567890123"
                :max-length="16"
                input-mode="numeric"
                validation-type="numbers"
              />

              <FormInput
                id="handphone_number"
                label="Nomor HP"
                v-model="formData.handphone_number"
                :required="true"
                placeholder="08xxxxxxxxxx"
                input-mode="numeric"
                validation-type="numbers"
              />
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
              <Dropdown
                id="vehicle"
                label="Jenis Kendaraan"
                v-model="formData.vehicle"
                :options="vehicleList.map(p => ({ value: p.name, label: p.name }))"
                :required="true"
                placeholder="-- Pilih Jenis Kendaraan --"
              />

              <!-- Plat Nomor menggunakan komponen LicensePlate -->
              <LicensePlate
                label="Plat Nomor"
                :letters1="formData.license_plate_letters1"
                :numbers="formData.license_plate_numbers"
                :letters2="formData.license_plate_letters2"
                :required="true"
                @update:letters1="formData.license_plate_letters1 = $event"
                @update:numbers="formData.license_plate_numbers = $event"
                @update:letters2="formData.license_plate_letters2 = $event"
              />
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
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Principal -->
              <Dropdown
                id="principal"
                label="Principal"
                v-model="formData.principal"
                :options="principalList.map(p => ({ value: p.name, label: p.name }))"
                :disabled="formData.activity_type !== 'true' || isLoadingPrincipals" 
                :disabled-note="formData.activity_type === 'false' ? '(Dinonaktifkan untuk Outbound)' : ''"
                placeholder="-- Pilih Principal --"
              />

              <!-- Vendor -->
              <Dropdown
                id="vendor"
                label="Vendor"
                v-model="formData.vendor"
                :options="vendorList.map(p => ({ value: p.name, label: p.name }))"
                :disabled="formData.activity_type !== 'true'"
                :disabled-note="formData.activity_type === 'false' ? '(Dinonaktifkan untuk Outbound)' : ''"
                placeholder="-- Pilih Vendor --"
              />

              <FormInput
                id="receiver"
                label="Perusahaan Penerima"
                v-model="formData.receiver"
                :required="formData.activity_type === 'false'"
                :disabled="formData.activity_type !== 'false'"
                :disabled-note="formData.activity_type === 'true' ? '(Dinonaktifkan untuk Inbound)' : ''"
                placeholder= "Contoh : PT Astro"
              />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '../components/InputField.vue'
import Dropdown from '../components/Dropdown.vue'
import LicensePlate from '../components/LicensePlate.vue'
import convex from '../convex'
import { api } from '../../../backend/convex/_generated/api'

const router = useRouter();

const vehicleList = ref<{ _id: string, name: string }[]>([]);
const principalList = ref<{ _id: string, name: string }[]>([]);
const vendorList = ref<{ _id: string, name: string }[]>([]);
const isLoadingPrincipals = ref(true);

const formData = reactive({
  activity_type: '',
  driver_name: '',
  nik: '',
  handphone_number: '',
  license_plate_letters1: '',
  license_plate_numbers: '',
  license_plate_letters2: '',
  vehicle: '',
  principal: '',
  vendor: '',
  receiver: '',
  sj_available: false,
  ktp_available: false,
  sim_available: false
})

// Options data untuk setiap dropdown
const activityTypeOptions = [
  { value: 'true', label: 'Inbound' },
  { value: 'false', label: 'Outbound' }
]

const fetchVendors = async () => {
  try {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;

    const httpBase = convexUrl.replace('.convex.cloud', '.convex.site');
    const response = await fetch(`${httpBase}/api/vendors`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil data vendor: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    vendorList.value = Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    console.error("Gagal mengambil data vendor:", error);
    vendorList.value = [];
  } finally {
    isLoadingPrincipals.value = false;
  }
};

const fetchPrincipals = async () => {
  try {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;

    const httpBase = convexUrl.replace('.convex.cloud', '.convex.site');
    const response = await fetch(`${httpBase}/api/principals`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil data principal: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    principalList.value = Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    console.error("Gagal mengambil data principal:", error);
    principalList.value = [];
  } finally {
    isLoadingPrincipals.value = false;
  }
};

const fetchVehicles = async () => {
  try {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;

    const httpBase = convexUrl.replace('.convex.cloud', '.convex.site');
    const response = await fetch(`${httpBase}/api/vehicles`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil data vehicle: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    vehicleList.value = Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    console.error("Gagal mengambil data vehicle:", error);
    vehicleList.value = [];
  } finally {
    isLoadingPrincipals.value = false;
  }
};

const isSubmitting = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')
const createdTicket = ref(null)

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
      vehicle: formData.vehicle,
      principal: formData.principal,
      vendor: formData.vendor,
      receiver: formData.receiver,
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
    if (activityTypeBoolean && !formData.principal && !formData.vendor) {
      throw new Error('Principal atau vendor wajib diisi untuk aktivitas Inbound')
    }

    // Validate vendor for outbound
    if (!activityTypeBoolean && !formData.receiver) {
      throw new Error('Penerima wajib diisi untuk aktivitas Outbound')
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
      result = await convex.mutation(api.tickets.createTicket, submitData)
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
    formData.vehicle = ''
    formData.principal = ''
    formData.vendor = ''
  formData.receiver = ''
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

onMounted(() => {
  fetchPrincipals();
  fetchVehicles();
  fetchVendors();
});
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