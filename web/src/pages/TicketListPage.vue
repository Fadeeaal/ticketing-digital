<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6 font-sans">
    <div class="max-w-full mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div>
              <img src="../assets/orbiz-logo.png" alt="Orbiz Logo" class="w-20 h-20 object-contain" />
            </div>
            <div>
              <h1 class="text-gray-800 text-3xl font-bold bg-gradient-to-r from-[#6c366a] to-purple-600 bg-clip-text text-transparent">
                Daftar Ticket Hari Ini
              </h1>
              <p class="text-gray-500 text-lg font-medium mt-1">{{ currentDate }}</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="refreshTickets"
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-[#6c366a] to-purple-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-[#6c366a] disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
            >
              <font-awesome-icon v-if="!loading" :icon="['fas', 'arrows-rotate']" class="w-4 h-4" />
              <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Memuat...' : 'Refresh' }}
            </button>

            <button 
              @click="addTickets"
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
            >
              <font-awesome-icon v-if="!loading" :icon="['fas', 'plus']" class="w-5 h-5" />
              <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Memuat...' : 'Add Ticket' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-[#6c366a] cursor-pointer"
          :class="selectedCard === 'all' ? 'border-2 border-[#6c366a]' : ''"
          @click="clearFilter"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-[#6c366a] mb-1">{{ allTickets.length }}</div>
              <div class="text-sm font-medium text-gray-500">Total Ticket</div>
            </div>
            <div class="p-3 bg-gradient-to-br from-purple-100 to-[#6c366a]/20 rounded-xl">
              <svg class="w-6 h-6 text-[#6c366a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div
          class="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-400 cursor-pointer"
          :class="selectedCard === '0' ? 'border-2 border-blue-400' : ''"
          @click="applyFilterStatus(0)"
        >
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
        
        <div
          class="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-orange-400 cursor-pointer"
          :class="selectedCard === '1-2' ? 'border-2 border-orange-400' : ''"
          @click="applyFilterStatuses([1,2])"
        >
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
        
        <div
          class="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-green-400 cursor-pointer"
          :class="selectedCard === '3' ? 'border-2 border-green-400' : ''"
          @click="applyFilterStatus(3)"
        >
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
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-16 text-center border border-purple-100">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#6c366a] mb-6"></div>
          <div class="text-gray-500 text-lg font-medium">Memuat data ticket...</div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0" class="bg-white rounded-2xl shadow-lg p-16 text-center border border-purple-100">
        <div class="flex flex-col items-center">
          <div class="p-6 bg-gradient-to-br from-purple-100 to-[#6c366a]/20 rounded-full mb-6">
            <svg class="w-16 h-16 text-[#6c366a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Belum Ada Ticket Hari Ini</h3>
          <p class="text-gray-500 text-lg mb-8 max-w-md">Belum ada ticket yang dibuat untuk hari ini</p>
        </div>
      </div>

      <!-- Tickets Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
        <div class="px-8 py-6 bg-gradient-to-r from-[#6c366a] to-purple-600 border-b border-purple-200">
          <h2 class="text-xl font-bold text-white flex items-center gap-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Daftar Ticket
            <span
              v-if="activeFilterLabel"
              class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/40 text-white"
            >
              {{ activeFilterLabel }}
            </span>
          </h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-purple-50 to-[#6c366a]/10">
              <tr>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Driver</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Kendaraan</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Aktivitas</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Perusahaan</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Dokumen</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-[#6c366a] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="ticket in tickets" :key="ticket._id" class="hover:bg-gradient-to-r hover:from-purple-50 hover:to-[#6c366a]/5 transition-all duration-200 group">
                <!-- Driver Info -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-[#6c366a]/20 group-hover:to-purple-200 rounded-xl transition-all duration-200">
                      <ProfileIcon color="blue" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 group-hover:text-[#6c366a] transition-colors duration-200">{{ ticket.driver?.name }}</div>
                      <div class="text-xs text-gray-500 mt-1">NIK: {{ ticket.driver?.nik }}</div>
                      <div class="text-xs text-gray-500">HP: {{ ticket.driver?.handphone_number }}</div>
                    </div>
                  </div>
                </td>

                <!-- Vehicle Info -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-gradient-to-br from-green-100 to-green-200 group-hover:from-[#6c366a]/20 group-hover:to-purple-200 rounded-xl transition-all duration-200">
                      <svg class="w-6 h-6 text-green-600 group-hover:text-[#6c366a] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 group-hover:text-[#6c366a] transition-colors duration-200">{{ ticket.license_plate }}</div>
                      <div class="text-xs text-gray-500 mt-1">{{ ticket.vehicle }}</div>
                    </div>
                  </div>
                </td>

                <!-- Activity Type -->
                <td class="px-6 py-6 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900 group-hover:text-[#6c366a] transition-colors duration-200">{{ getActivityType(ticket.activity_type) }}</div>
                </td>

                <!-- Company -->
                <td class="px-6 py-6 whitespace-nowrap text-center">
                  <div class="text-sm font-medium text-gray-900 group-hover:text-[#6c366a] transition-colors duration-200">{{ getCompany(ticket) }}</div>
                </td>

                <!-- Documents -->
                <td class="px-6 py-6 whitespace-nowrap text-center">
                  <div class="inline-flex flex-wrap gap-2 justify-center">
                    <span v-if="ticket.sj_available" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                      SJ
                    </span>
                    <span v-if="ticket.ktp_available" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                      KTP
                    </span>
                    <span v-if="ticket.sim_available" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#6c366a]/20 to-purple-200 text-[#6c366a] border border-purple-200">
                      SIM
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-6 whitespace-nowrap text-center">
                  <span :class="getStatusClass(ticket.ticket_status)" class="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm border">
                    {{ getStatusText(ticket.ticket_status) }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="px-6 py-6 whitespace-nowrap text-center">
                  <button 
                    @click="openTicketModal(ticket)"
                    class="px-4 py-2 bg-gradient-to-r from-[#6c366a] to-purple-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-[#6c366a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Ticket Detail Modal Component -->
      <TicketDetailModal 
        :ticket="selectedTicket" 
        @close="closeTicketModal" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProfileIcon from '../assets/icons/ProfileIcon.vue'
import convex from '../convex'
import TicketDetailModal from '../pages/modal/TicketDetail.vue'
import type { Ticket } from '../interface/Ticket'
import { api } from '../../../backend/convex/_generated/api'

const tickets = ref<Ticket[]>([])
const allTickets = ref<Ticket[]>([])
const loading = ref(true)
const errorMessage = ref('')
const selectedTicket = ref<Ticket | null>(null)
const activeFilterLabel = ref('')
const selectedCard = ref<'all' | '0' | '1-2' | '3'>('all')

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const getCompany = (ticket: Ticket): string => {
  if (ticket.activity_type === true) return ticket.principal || ticket.vendor
  if (ticket.activity_type === false) return ticket.receiver
  return 'Status Tidak Diketahui'
}

const getActivityType = (status: boolean | string): string => {
  if (status === true || status === 'true') return 'Inbound'
  if (status === false || status === 'false') return 'Outbound'
  return 'Status Tidak Diketahui'
}

const loadTodayTickets = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Ambil data ticket hari ini langsung dari Convex API (tanpa fetch URL)
    const result = await convex.query(api.tickets.listTodayTickets, {})
    const mapped = (result as Ticket[]).map((ticket: Ticket) => ({
      ...ticket,
      principal: ticket.principal ?? ''
    }))
    allTickets.value = mapped
    tickets.value = mapped
    activeFilterLabel.value = ''
    selectedCard.value = 'all'

  } catch (error: unknown) {
    console.error('Failed to load tickets:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data ticket'
  } finally {
    loading.value = false
  }
}

const refreshTickets = () => {
  loadTodayTickets()
}

const addTickets = () => {
  window.location.href = '/create-ticket'
}

const getTicketsByStatus = (status: number) => {
  return allTickets.value.filter((ticket: Ticket) => ticket.ticket_status === status)
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
    3: 'bg-gradient-to-r from-[#6c366a]/20 to-purple-200 text-[#6c366a] border-purple-300'
  }
  return statusClasses[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
}

const openTicketModal = (ticket: Ticket) => {
  selectedTicket.value = ticket
}

const closeTicketModal = () => {
  selectedTicket.value = null
}

onMounted(() => {
  loadTodayTickets()
})

// Gunakan arrival_date dari data yang sudah dimuat (server-side) agar tidak bentrok timezone
const currentArrivalDateAsDDMMYYYY = () => {
  if (allTickets.value.length > 0 && allTickets.value[0].arrival_date) {
    // arrival_date format: DD-MM-YYYY → convert ke DDMMYYYY
    const parts = String(allTickets.value[0].arrival_date).split('-')
    if (parts.length === 3) {
      return `${parts[0]}${parts[1]}${parts[2]}`
    }
  }
  // Fallback: compute dari client (mungkin tidak match jika timezone server berbeda)
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = String(d.getFullYear())
  return `${dd}${mm}${yyyy}`
}

const applyFilterStatus = async (status: number) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const date = currentArrivalDateAsDDMMYYYY()
    const result = await convex.query(api.tickets.listTicketsByStatusAndDate, { status, date })
    tickets.value = (result as Ticket[]).map((t: Ticket) => ({ ...t, principal: t.principal ?? '' }))
    activeFilterLabel.value = labelForStatus(status)
    selectedCard.value = String(status) as '0' | '3'
  } catch (error: unknown) {
    console.error('Failed to filter tickets:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memfilter ticket'
  } finally {
    loading.value = false
  }
}

const applyFilterStatuses = async (statuses: number[]) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const date = currentArrivalDateAsDDMMYYYY()
    const [res1, res2] = await Promise.all([
      convex.query(api.tickets.listTicketsByStatusAndDate, { status: statuses[0], date }),
      convex.query(api.tickets.listTicketsByStatusAndDate, { status: statuses[1], date })
    ])
    const merged = [...(res1 as Ticket[]), ...(res2 as Ticket[])]
    const seen = new Set<string>()
    tickets.value = merged
      .filter((t: Ticket) => (seen.has(t._id) ? false : (seen.add(t._id), true)))
      .map((t: Ticket) => ({ ...t, principal: t.principal ?? '' }))
    activeFilterLabel.value = 'Status: Sedang Proses'
    selectedCard.value = '1-2'
  } catch (error: unknown) {
    console.error('Failed to filter tickets:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memfilter ticket'
  } finally {
    loading.value = false
  }
}

const clearFilter = () => {
  loadTodayTickets()
  selectedCard.value = 'all'
}

function labelForStatus(status: number): string {
  if (status === 0) return 'Status: Tiba di Lokasi'
  if (status === 1) return 'Status: Sedang Unloading'
  if (status === 2) return 'Status: Selesai Unloading'
  if (status === 3) return 'Status: Selesai'
  return `Status: ${status}`
}
</script>