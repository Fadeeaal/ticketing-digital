<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h2 class="text-2xl font-bold mb-4">Update Status Ticket</h2>
    <!-- Jika ticketId dari URL, tampilkan info dan proses otomatis -->
    <div v-if="ticketIdFromUrl" class="text-center">
      <div class="mb-2">Ticket ID: <span class="font-mono">{{ ticketIdFromUrl }}</span></div>
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
    <!-- Jika tidak ada ticketId di URL, tampilkan scanner -->
    <div v-else>
      <qrcode-stream @decode="onDecode" @init="onInit" class="mb-4" />
      <div v-if="scanResult" class="mt-4 text-center">
        <div class="mb-2">Ticket ID: <span class="font-mono">{{ scanResult }}</span></div>
        <button
          @click="processScan(scanResult)"
          :disabled="processing"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ processing ? 'Memproses...' : 'Update Status Ticket' }}
        </button>
        <div v-if="successMessage" class="mt-2 text-green-600">{{ successMessage }}</div>
        <div v-if="errorMessage" class="mt-2 text-red-600">{{ errorMessage }}</div>
      </div>
      <div v-if="errorMessage && !scanResult" class="text-red-600 mt-4">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useRoute, useRouter } from 'vue-router'
import convex from '../convex'
import { api } from '../../../backend/convex/_generated/api'
import type { Id } from '../../../backend/convex/_generated/dataModel'

const scanResult = ref('')
const processing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const route = useRoute()
const router = useRouter()
const ticketIdFromUrl = ref('')

// Simpan status scan terakhir per ticketId di localStorage
function getScanCount(ticketId: string): number {
  return Number(localStorage.getItem('scan-count-' + ticketId) || 0)
}
function setScanCount(ticketId: string, count: number) {
  localStorage.setItem('scan-count-' + ticketId, String(count))
}

const onDecode = (result: string) => {
  scanResult.value = result
  errorMessage.value = ''
  successMessage.value = ''
}

const onInit = (promise: Promise<void>) => {
  promise.catch(() => {
    errorMessage.value = 'Kamera tidak bisa diakses'
  })
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
    successMessage.value = `Status berhasil diupdate: ${action.replace('-', ' ')}`
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
onMounted(() => {
  const urlTicketId = (route.query.ticketId as string) || ''
  if (urlTicketId) {
    ticketIdFromUrl.value = urlTicketId
    processScan(urlTicketId)
  }
})
</script>