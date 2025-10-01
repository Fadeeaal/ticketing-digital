<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6 font-sans flex items-center justify-center">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#6c366a] to-purple-600 bg-clip-text text-transparent">
          Update Status Ticket
        </h2>
        <p class="text-slate-600 mt-2">Scan QR untuk memperbarui status secara otomatis</p>
        <div class="w-24 h-1 bg-gradient-to-r from-[#6c366a] to-purple-600 rounded-full mx-auto mt-4"></div>
      </div>

      <!-- Content Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
        <div class="p-6 md:p-8">
          <!-- Jika ticketId dari URL, tampilkan info dan proses otomatis -->
          <div v-if="ticketIdFromUrl">
            <!-- Loading ticket -->
            <div v-if="loadingTicket" class="flex items-center gap-3 text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
              <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Memuat data ticket...
            </div>

            <!-- Ticket Info -->
            <div v-if="ticketData && !loadingTicket" class="mb-6">
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                     :class="ticketData.activity_type ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-orange-100 text-orange-800 border border-orange-200'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="ticketData.activity_type" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  {{ ticketData.activity_type ? 'Inbound' : 'Outbound' }}
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl border border-purple-100 bg-purple-50/50">
                  <div class="text-xs text-gray-500">Perusahaan</div>
                  <div class="text-base md:text-lg font-bold text-[#6c366a]">{{ getCompanyName(ticketData) }}</div>
                </div>
                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div class="text-xs text-gray-500">Plat Nomor</div>
                  <div class="text-base md:text-lg font-semibold text-gray-800">{{ ticketData.license_plate || 'N/A' }}</div>
                </div>
                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70 md:col-span-2">
                  <div class="text-xs text-gray-500">Driver</div>
                  <div class="text-base md:text-lg font-semibold text-gray-800">
                    {{ ticketData.driver?.name || 'N/A' }}
                    <span class="text-xs text-gray-500">• NIK: {{ ticketData.driver?.nik || '-' }} • HP: {{ ticketData.driver?.handphone_number || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Processing state -->
            <div v-if="processing" class="flex items-center gap-2 text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
              <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Memproses...
            </div>

            <!-- Success -->
            <div v-if="successMessage" class="mt-4 p-4 rounded-xl border-2 border-green-200 bg-green-50 text-green-800">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">✓</div>
                <div class="flex-1">
                  <div class="font-semibold">Berhasil!</div>
                  <div class="text-sm">{{ successMessage }}</div>
                </div>
              </div>
              <button @click="goToList" class="mt-4 w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-[#6c366a] to-purple-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-[#6c366a] transition-all shadow">
                Kembali ke Daftar Ticket
              </button>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="mt-4 p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-800">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">✗</div>
                <div class="flex-1">
                  <div class="font-semibold">Terjadi Kesalahan</div>
                  <div class="text-sm">{{ errorMessage }}</div>
                </div>
              </div>
              <button @click="goToList" class="mt-4 w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-[#6c366a] to-purple-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-[#6c366a] transition-all shadow">
                Kembali ke Daftar Ticket
              </button>
            </div>
          </div>

          <!-- Empty URL state -->
          <div v-else class="text-center py-10">
            <div class="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-[#6c366a]/20 mb-4 flex items-center justify-center">
              <svg class="w-8 h-8 text-[#6c366a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Tidak ada Ticket ID</h3>
            <p class="text-gray-600">Silakan akses halaman ini melalui QR Code tiket untuk memperbarui status.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import convex from '../convex'
import { api } from '../../../backend/convex/_generated/api'
import type { Id } from '../../../backend/convex/_generated/dataModel'
import type { Ticket } from '../interface/Ticket'

const processing = ref(false)
const loadingTicket = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const ticketData = ref<Ticket | null>(null)
const route = useRoute()
const router = useRouter()
const ticketIdFromUrl = ref('')

// Helper function to get company name based on activity type
const getCompanyName = (ticket: Ticket): string => {
  if (ticket.activity_type) { // Inbound
    return ticket.principal || ticket.vendor || 'Perusahaan tidak tersedia'
  } else { // Outbound
    return ticket.receiver || 'Vendor tidak tersedia'
  }
}

// Fetch ticket data by ID
const fetchTicketData = async (ticketId: string) => {
  try {
    loadingTicket.value = true
    errorMessage.value = ''
    
    // Get all tickets and find the one with matching ID
    const allTickets = await convex.query(api.tickets.allTickets, {})
    const list = allTickets as Ticket[]
    const ticket = list.find((t: Ticket) => t._id === ticketId)
    
    if (!ticket) {
      throw new Error('Ticket tidak ditemukan!')
    }
    
    ticketData.value = ticket
  } catch (e: unknown) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal memuat data ticket'
    ticketData.value = null
  } finally {
    loadingTicket.value = false
  }
}

// Simpan status scan terakhir per ticketId di localStorage
function getScanCount(ticketId: string): number {
  return Number(localStorage.getItem('scan-count-' + ticketId) || 0)
}
function setScanCount(ticketId: string, count: number) {
  localStorage.setItem('scan-count-' + ticketId, String(count))
}

const processScan = async (ticketId: string) => {
  if (!ticketId) return
  processing.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Hitung scan ke berapa
  let scanCount = getScanCount(ticketId)
  scanCount += 1

  // Map scan ke status
  const actionMap = {
    1: 'start-unloading',
    2: 'finish-unloading',
    3: 'driver-departure'
  } as const
  const action = actionMap[scanCount as 1|2|3]

  if (!action) {
    errorMessage.value = 'Ticket sudah selesai semua prosesnya!'
    processing.value = false
    return
  }
  
  // Map ke mutation convex
  const mutationMap = {
    'start-unloading': api.tickets.setStartUnloadingTime,
    'finish-unloading': api.tickets.setFinishUnloadingTime,
    'driver-departure': api.tickets.setDriverDepartureTime
  }
  
  try {
    await convex.mutation(mutationMap[action], { ticketId: ticketId as Id<"tickets"> })
    
    // Update success message dengan nama perusahaan
    successMessage.value = `Status berhasil diupdate menjadi ${action.replace('-', ' ')}`
    setScanCount(ticketId, scanCount)
  } catch (e: unknown) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal update status'
    setScanCount(ticketId, scanCount - 1)
  } finally {
    processing.value = false
  }
}

const goToList = () => {
  router.push('/list-tickets')
}

// Jika ada ticketId di URL, langsung proses otomatis
onMounted(async () => {
  const urlTicketId = (route.query.ticketId as string) || ''
  if (urlTicketId) {
    ticketIdFromUrl.value = urlTicketId
    await fetchTicketData(urlTicketId)
    if (ticketData.value) {
      processScan(urlTicketId)
    }
  }
})
</script>