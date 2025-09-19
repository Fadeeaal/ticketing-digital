<template>
  <div class="min-h-screen bg-gray-50 p-5 font-sans">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <img src="../assets/orbiz-logo.png" alt="Orbiz Logo" class="w-12 h-12 object-contain" />
          <div>
            <h1 class="text-gray-800 text-3xl font-bold">Daftar Ticket Hari Ini</h1>
            <p class="text-gray-500">{{ currentDate }}</p>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="refreshTickets"
            :disabled="loading"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200"
          >
            {{ loading ? 'Memuat...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-gray-800">{{ tickets.length }}</div>
          <div class="text-sm text-gray-500">Total Ticket</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-blue-600">{{ getTicketsByStatus(0).length }}</div>
          <div class="text-sm text-gray-500">Tiba di Lokasi</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-orange-600">{{ getTicketsByStatus(1).length + getTicketsByStatus(2).length }}</div>
          <div class="text-sm text-gray-500">Sedang Proses</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-green-600">{{ getTicketsByStatus(3).length }}</div>
          <div class="text-sm text-gray-500">Selesai</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Memuat data ticket...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Ticket Hari Ini</h3>
        <p class="text-gray-500 mb-4">Belum ada ticket yang dibuat untuk hari ini</p>
        <button 
          @click="$router.push('/create-ticket')"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Buat Ticket Pertama
        </button>
      </div>

      <!-- Tickets Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kendaraan</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ticket in tickets" :key="ticket._id" class="hover:bg-gray-50">
                <!-- Driver Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ ticket.driver?.name }}</div>
                  <div class="text-sm text-gray-500">NIK: {{ ticket.driver?.nik }}</div>
                  <div class="text-sm text-gray-500">HP: {{ ticket.driver?.handphone_number }}</div>
                </td>

                <!-- Vehicle Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ ticket.license_plate }}</div>
                  <div class="text-sm text-gray-500">{{ ticket.truck_type }}</div>
                </td>

                <!-- Company -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ ticket.principal }}</div>
                </td>

                <!-- Documents -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex space-x-2">
                    <span v-if="ticket.sj_available" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      SJ
                    </span>
                    <span v-if="ticket.ktp_available" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      KTP
                    </span>
                    <span v-if="ticket.sim_available" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      SIM
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(ticket.ticket_status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(ticket.ticket_status) }}
                  </span>
                </td>

                <!-- Time Info -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Tiba: {{ ticket.arrival_time }}</div>
                  <div v-if="ticket.start_unloading_time">Mulai: {{ ticket.start_unloading_time }}</div>
                  <div v-if="ticket.finish_unloading_time">Selesai: {{ ticket.finish_unloading_time }}</div>
                  <div v-if="ticket.departure_time">Berangkat: {{ ticket.departure_time }}</div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                    <qrcode-vue :value="`http://10.255.82.73:5173/scan?ticketId=${ticket._id}`" :size="96" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="errorMessage" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5" @click="clearError">
        <div class="bg-white p-8 rounded-xl text-center max-w-sm w-full shadow-2xl" @click.stop>
          <div class="w-15 h-15 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">!</div>
          <h2 class="mb-5 text-gray-800">Terjadi Kesalahan</h2>
          <p class="mb-5 text-gray-600">{{ errorMessage }}</p>
          <button @click="clearError" class="py-3 px-6 bg-blue-500 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-600">Tutup</button>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="successMessage" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5" @click="clearSuccess">
        <div class="bg-white p-8 rounded-xl text-center max-w-sm w-full shadow-2xl" @click.stop>
          <div class="w-15 h-15 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">✓</div>
          <h2 class="mb-5 text-gray-800">Berhasil</h2>
          <p class="mb-5 text-gray-600">{{ successMessage }}</p>
          <button @click="clearSuccess" class="py-3 px-6 bg-blue-500 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-600">Tutup</button>
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
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-orange-100 text-orange-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-green-100 text-green-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
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