<template>
  <div v-if="ticket" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-5 backdrop-blur-sm" @click="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-200 transform transition-all duration-300" @click.stop>
      <!-- Modal Header -->
      <div class="px-8 py-6 bg-gradient-to-r from-[#6c366a] to-purple-600 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Detail Ticket
          </h2>
          <div class="flex items-center gap-3">
            <!-- Edit Button - Only show if ticket status is 0 (not started) -->
            <button 
              v-if="ticket.ticket_status === 0"
              @click="editTicket"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center gap-2 text-white"
              title="Edit Ticket"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span class="text-sm">Edit</span>
            </button>
            <!-- Close Button -->
            <button @click="$emit('close')" class="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-8">
        <!-- QR Code Section -->
        <div class="text-center mb-8">
          <div v-if="ticket.ticket_status < 3" class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Scan QR Code untuk Update Status!</h3>
          </div>
          
          <div class="flex justify-center">
            <div v-if="ticket.ticket_status < 3" class="p-6 bg-gradient-to-br from-purple-50 to-[#6c366a]/10 rounded-2xl border-2 border-purple-200 shadow-lg">
              <qrcode-vue :value="getQRUrl(ticket._id, ticket.ticket_status)" :size="150" />
            </div>
            <div v-else class="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 text-green-600 font-bold text-lg">
              AKTIVITAS SUDAH SELESAI
            </div>
          </div>
        </div>

        <!-- Ticket Information -->
        <div class="space-y-6">
          <!-- Driver Information -->
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h4 class="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Informasi Driver
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-semibold text-blue-800">Nama:</span>
                <span class="ml-2 text-blue-700">{{ ticket.driver?.name }}</span>
              </div>
              <div>
                <span class="font-semibold text-blue-800">NIK:</span>
                <span class="ml-2 text-blue-700">{{ ticket.driver?.nik }}</span>
              </div>
              <div class="md:col-span-2">
                <span class="font-semibold text-blue-800">No. HP:</span>
                <span class="ml-2 text-blue-700">{{ ticket.driver?.handphone_number }}</span>
              </div>
            </div>
          </div>

          <!-- Vehicle Information -->
          <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h4 class="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
              </svg>
              Informasi Kendaraan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-semibold text-green-800">Plat Nomor:</span>
                <span class="ml-2 text-green-700">{{ ticket.license_plate }}</span>
              </div>
              <div>
                <span class="font-semibold text-green-800">Jenis Truk:</span>
                <span class="ml-2 text-green-700">{{ ticket.truck_type }}</span>
              </div>
            </div>
          </div>

          <!-- Activity Information -->
          <div class="bg-gradient-to-r from-[#6c366a]/10 to-purple-100 rounded-xl p-6 border border-purple-200">
            <h4 class="text-lg font-bold text-[#6c366a] mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Informasi Aktivitas
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-semibold text-[#6c366a]">Jenis Aktivitas:</span>
                <span class="ml-2 text-purple-700">{{ getActivityType(ticket.activity_type) }}</span>
              </div>
              <div>
                <span class="font-semibold text-[#6c366a]">Perusahaan:</span>
                <span class="ml-2 text-purple-700">{{ getCompany(ticket) }}</span>
              </div>
              <div>
                <span class="font-semibold text-[#6c366a]">Tanggal:</span>
                <span class="ml-2 text-purple-700">{{ ticket.arrival_date }}</span>
              </div>
              <div>
                <span class="font-semibold text-[#6c366a]">Status:</span>
                <span class="ml-2" :class="getStatusTextColor(ticket.ticket_status)">{{ getStatusText(ticket.ticket_status) }}</span>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <h4 class="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Dokumen yang Tersedia
            </h4>
            <div class="flex flex-wrap gap-3">
              <span v-if="ticket.sj_available" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                ✓ Surat Jalan (SJ)
              </span>
              <span v-if="ticket.ktp_available" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                ✓ KTP
              </span>
              <span v-if="ticket.sim_available" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#6c366a]/20 to-purple-200 text-[#6c366a] border border-purple-300">
                ✓ SIM
              </span>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Timeline Aktivitas
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="font-semibold text-gray-700">Waktu Tiba:</span>
                <span class="text-gray-600">{{ ticket.arrival_time || '-' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" :class="ticket.start_unloading_time ? 'bg-orange-500' : 'bg-gray-300'"></div>
                <span class="font-semibold text-gray-700">Mulai Unloading:</span>
                <span class="text-gray-600">{{ ticket.start_unloading_time || '-' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" :class="ticket.finish_unloading_time ? 'bg-purple-500' : 'bg-gray-300'"></div>
                <span class="font-semibold text-gray-700">Selesai Unloading:</span>
                <span class="text-gray-600">{{ ticket.finish_unloading_time || '-' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" :class="ticket.departure_time ? 'bg-green-500' : 'bg-gray-300'"></div>
                <span class="font-semibold text-gray-700">Waktu Berangkat:</span>
                <span class="text-gray-600">{{ ticket.departure_time || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import type { Ticket } from '../../interface/Ticket'

interface Props {
  ticket: Ticket | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

// Helper functions
const getCompany = (ticket: Ticket): string => {
  if (ticket.activity_type === true) return ticket.principal
  if (ticket.activity_type === false) return ticket.vendor
  return 'Status Tidak Diketahui'
}

const getActivityType = (status: boolean | string): string => {
  if (status === true || status === 'true') return 'Inbound'
  if (status === false || status === 'false') return 'Outbound'
  return 'Status Tidak Diketahui'
}

// Generate QR URL based on current status
const getQRUrl = (ticketId: string, currentStatus: number): string => {
  const nextStep = currentStatus + 1 // Next step to execute
  return `http://10.255.82.73:5173/scan?ticketId=${ticketId}&step=${nextStep}`
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

const getStatusTextColor = (status: number): string => {
  const statusColors: Record<number, string> = {
    0: 'text-gray-700 font-semibold',
    1: 'text-orange-700 font-semibold',
    2: 'text-blue-700 font-semibold',
    3: 'text-green-700 font-semibold'
  }
  return statusColors[status] || 'text-gray-700 font-semibold'
}

// Edit ticket function
const editTicket = () => {
  if (props.ticket) {
    emit('close') // Close the modal first
    router.push(`/edit-ticket/${props.ticket._id}`)
  }
}
</script>