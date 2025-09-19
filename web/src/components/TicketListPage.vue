<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 font-sans">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div>
              <img src="../assets/orbiz-logo.png" alt="Orbiz Logo" class="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 class="text-gray-800 text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                Daftar Ticket Hari Ini
              </h1>
              <p class="text-gray-500 text-lg font-medium mt-1">{{ currentDate }}</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="refreshTickets"
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
            >
              <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Memuat...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-gray-800 mb-1">{{ tickets.length }}</div>
              <div class="text-sm font-medium text-gray-500">Total Ticket</div>
            </div>
            <div class="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-blue-600 mb-1">{{ getTicketsByStatus(0).length }}</div>
              <div class="text-sm font-medium text-gray-500">Tiba di Lokasi</div>
            </div>
            <div class="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-orange-600 mb-1">{{ getTicketsByStatus(1).length + getTicketsByStatus(2).length }}</div>
              <div class="text-sm font-medium text-gray-500">Sedang Proses</div>
            </div>
            <div class="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-green-600 mb-1">{{ getTicketsByStatus(3).length }}</div>
              <div class="text-sm font-medium text-gray-500">Selesai</div>
            </div>
            <div class="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
          <div class="text-gray-500 text-lg font-medium">Memuat data ticket...</div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0" class="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
        <div class="flex flex-col items-center">
          <div class="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Belum Ada Ticket Hari Ini</h3>
          <p class="text-gray-500 text-lg mb-8 max-w-md">Belum ada ticket yang dibuat untuk hari ini</p>
          <button 
            @click="$router.push('/create-ticket')"
            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Buat Ticket Pertama
          </button>
        </div>
      </div>

      <!-- Tickets Table -->
      <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Daftar Ticket
          </h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Driver</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Kendaraan</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Perusahaan</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Dokumen</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Waktu</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">QR Code</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="ticket in tickets" :key="ticket._id" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <!-- Driver Info -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900">{{ ticket.driver?.name }}</div>
                      <div class="text-xs text-gray-500 mt-1">NIK: {{ ticket.driver?.nik }}</div>
                      <div class="text-xs text-gray-500">HP: {{ ticket.driver?.handphone_number }}</div>
                    </div>
                  </div>
                </td>

                <!-- Vehicle Info -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900">{{ ticket.license_plate }}</div>
                      <div class="text-xs text-gray-500 mt-1">{{ ticket.truck_type }}</div>
                    </div>
                  </div>
                </td>

                <!-- Company -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div class="text-sm font-medium text-gray-900">{{ ticket.principal }}</div>
                  </div>
                </td>

                <!-- Documents -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex flex-wrap gap-2">
                    <span v-if="ticket.sj_available" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                      SJ
                    </span>
                    <span v-if="ticket.ktp_available" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                      KTP
                    </span>
                    <span v-if="ticket.sim_available" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200">
                      SIM
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <span :class="getStatusClass(ticket.ticket_status)" class="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm border">
                    {{ getStatusText(ticket.ticket_status) }}
                  </span>
                </td>

                <!-- Time Info -->
                <td class="px-6 py-6 whitespace-nowrap text-sm text-gray-600">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-xs font-medium">Tiba: {{ ticket.arrival_time }}</span>
                    </div>
                    <div v-if="ticket.start_unloading_time" class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span class="text-xs font-medium">Mulai: {{ ticket.start_unloading_time }}</span>
                    </div>
                    <div v-if="ticket.finish_unloading_time" class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-xs font-medium">Selesai: {{ ticket.finish_unloading_time }}</span>
                    </div>
                    <div v-if="ticket.departure_time" class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span class="text-xs font-medium">Berangkat: {{ ticket.departure_time }}</span>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-6 whitespace-nowrap text-center">
                  <div class="flex justify-center">
                    <div class="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                      <qrcode-vue :value="`http://10.255.82.73:5173/scan?ticketId=${ticket._id}`" :size="96" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="errorMessage" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-5 backdrop-blur-sm" @click="clearError">
        <div class="bg-white p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl border border-gray-200 transform transition-all duration-300" @click.stop>
          <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 class="mb-4 text-xl font-bold text-gray-800">Terjadi Kesalahan</h2>
          <p class="mb-6 text-gray-600">{{ errorMessage }}</p>
          <button @click="clearError" class="py-3 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Tutup
          </button>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="successMessage" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-5 backdrop-blur-sm" @click="clearSuccess">
        <div class="bg-white p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl border border-gray-200 transform transition-all duration-300" @click.stop>
          <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="mb-4 text-xl font-bold text-gray-800">Berhasil</h2>
          <p class="mb-6 text-gray-600">{{ successMessage }}</p>
          <button @click="clearSuccess" class="py-3 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import convex from '../convex'
import QrcodeVue from 'qrcode.vue'
import type { Ticket } from '../interface/Ticket'

const tickets = ref<Ticket[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const actionLoading = reactive<Record<string, boolean>>({})
import { api } from '../../../backend/convex/_generated/api'
import type { Id } from '../../../backend/convex/_generated/dataModel'

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const loadTodayTickets = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Debug logs
    let finalUrl = `${import.meta.env.VITE_CONVEX_URL}/api/tickets/today`.replace('.convex.cloud', '.convex.site')

    // Fallback: try different endpoint if today fails
    let response = await fetch(finalUrl)
    
    // If today endpoint fails, try all endpoint and filter manually
    if (!response.ok) {
      finalUrl = `${import.meta.env.VITE_CONVEX_URL}/api/tickets/all`.replace('.convex.cloud', '.convex.site')
      response = await fetch(finalUrl)
    }
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Response data:', data)
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to load tickets')
    }
    
    tickets.value = data.data
    
  } catch (error: any) {
    console.error('Failed to load tickets:', error)
    errorMessage.value = error.message || 'Gagal memuat data ticket'
  } finally {
    loading.value = false
  }
}

const refreshTickets = () => {
  loadTodayTickets()
}

const getTicketsByStatus = (status: number) => {
  return tickets.value.filter((ticket: Ticket) => ticket.ticket_status === status)
}

const getStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: 'Tiba di Lokasi',
    1: 'Sedang Unloading',
    2: 'Selesai Unloading',
    3: 'Inbound selesai'
  }
  return statusMap[status] || 'Status Tidak Diketahui'
}

const getStatusClass = (status: number): string => {
  const statusClasses: Record<number, string> = {
    0: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300',
    1: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300',
    2: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
    3: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300'
  }
  return statusClasses[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
}

const updateTicketStatus = async (ticketId: string, action: string) => {
  try {
    actionLoading[ticketId] = true
    errorMessage.value = ''

    // Map actions to Convex mutations
    const mutationMap: Record<string, any> = {
      'start-unloading': api.tickets.setStartUnloadingTime,
      'finish-unloading': api.tickets.setFinishUnloadingTime,
      'driver-departure': api.tickets.setDriverDepartureTime
    }

    const mutationFn = mutationMap[action]
    if (!mutationFn) {
      throw new Error('Invalid action: ' + action)
    }

    // Use Convex client instead of fetch to avoid CORS
    const result = await convex.mutation(mutationFn, { ticketId: ticketId as Id<"tickets"> })
    
    console.log('Mutation result:', result)

    successMessage.value = 'Status berhasil diupdate'
    
    // Refresh tickets list
    await loadTodayTickets()
    
  } catch (error: any) {
    console.error('Failed to update ticket status:', error)
    errorMessage.value = error.message || 'Gagal mengupdate status ticket'
  } finally {
    actionLoading[ticketId] = false
  }
}

const clearError = () => {
  errorMessage.value = ''
}

const clearSuccess = () => {
  successMessage.value = ''
}

onMounted(() => {
  loadTodayTickets()
})
</script>