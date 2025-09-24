<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h2 class="text-2xl font-bold mb-4">Update Status Ticket</h2>
    <!-- Jika ticketId dari URL, tampilkan info dan proses otomatis -->
    <div v-if="ticketIdFromUrl" class="text-center">
      <div v-if="loadingTicket" class="text-blue-600 mb-4">Memuat data ticket...</div>
      <div v-if="ticketData && !loadingTicket" class="mb-4 p-4 bg-white rounded-lg shadow border">
        <div class="text-lg font-semibold mb-2"> {{ ticketData.activity_type ? 'Inbound' : 'Outbound' }} </div>
        <div class="text-xl font-bold text-blue-600"> {{ getCompanyName(ticketData) }} </div>
        <div class="text-sm text-gray-600 mt-2"> Driver: {{ ticketData.driver?.name || 'N/A' }} </div>
        <div class="text-sm text-gray-600"> Plat: {{ ticketData.license_plate || 'N/A' }} </div>
      </div>
      <div v-if="processing" class="text-blue-600">Memproses...</div>
      <div v-if="successMessage" class="text-green-600">{{ successMessage }}</div>
      <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
      <button
        v-if="successMessage"
        @click="goToList"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Kembali ke Daftar Ticket
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import convex from '../convex'
import { api } from '../../../backend/convex/_generated/api'
import type { Id } from '../../../backend/convex/_generated/dataModel'

const processing = ref(false)
const loadingTicket = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const ticketData = ref<any>(null)
const route = useRoute()
const router = useRouter()
const ticketIdFromUrl = ref('')

// Helper function to get company name based on activity type
const getCompanyName = (ticket: any): string => {
  if (ticket.activity_type) { // Inbound
    return ticket.principal || 'Principal tidak tersedia'
  } else { // Outbound
    return ticket.vendor || 'Vendor tidak tersedia'
  }
}

// Fetch ticket data by ID
const fetchTicketData = async (ticketId: string) => {
  try {
    loadingTicket.value = true
    errorMessage.value = ''
    
    // Get all tickets and find the one with matching ID
    const allTickets = await convex.query(api.tickets.allTickets, {})
    const ticket = allTickets.find((t: any) => t._id === ticketId)
    
    if (!ticket) {
      throw new Error('Ticket tidak ditemukan!')
    }
    
    ticketData.value = ticket
  } catch (e: any) {
    errorMessage.value = e.message || 'Gagal memuat data ticket'
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
    const companyName = ticketData.value ? getCompanyName(ticketData.value) : 'Perusahaan'
    successMessage.value = `Status ${companyName} berhasil diupdate: ${action.replace('-', ' ')}`
    setScanCount(ticketId, scanCount)
  } catch (e: any) {
    errorMessage.value = e.message || 'Gagal update status'
    setScanCount(ticketId, scanCount - 1)
  } finally {
    processing.value = false
  }
}

const goToList = () => {
  router.push('/tickets')
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