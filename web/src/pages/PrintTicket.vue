<template>
  <div class="min-h-screen bg-white text-black p-6 print:p-0">
    <div class="max-w-3xl mx-auto bg-white p-8 print:p-6 print:shadow-none shadow rounded-xl border border-gray-200">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 print:mb-4">
        <h1 class="text-2xl font-bold text-[#6c366a]">Ticket</h1>
        <div class="flex gap-2 no-print">
          <button @click="printTicket" class="px-4 py-2 border border-[#6c366a] text-[#6c366a] rounded-lg font-semibold">Print</button>
          <button @click="goBack" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold">Back</button>
        </div>
      </div>

      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-else-if="!ticket" class="text-red-600">Ticket not found.</div>

      <div v-else>
        <!-- Simple info block -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div class="text-sm text-gray-500">ID</div>
            <div class="font-semibold">{{ ticket._id }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Tanggal</div>
            <div class="font-semibold">{{ ticket.arrival_date }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Plat Nomor</div>
            <div class="font-semibold">{{ ticket.license_plate }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Jenis Truk</div>
            <div class="font-semibold">{{ ticket.vehicle }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Aktivitas</div>
            <div class="font-semibold">{{ getActivityType(ticket.activity_type) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Perusahaan</div>
            <div class="font-semibold">{{ getCompany(ticket) }}</div>
          </div>
          <div class="col-span-2">
            <div class="text-sm text-gray-500">Driver</div>
            <div class="font-semibold">
              {{ ticket.driver?.name }} • NIK: {{ ticket.driver?.nik }} • HP: {{ ticket.driver?.handphone_number }}
            </div>
          </div>
        </div>

        <!-- QR for status advance -->
        <div class="flex items-center justify-center my-8">
          <qrcode-vue :value="getQRUrl(ticket._id, ticket.ticket_status)" :size="160" />
        </div>

        <!-- Status timeline (compact) -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500">Tiba</div>
            <div class="font-semibold">{{ ticket.arrival_time || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Mulai Unloading</div>
            <div class="font-semibold">{{ ticket.start_unloading_time || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Selesai Unloading</div>
            <div class="font-semibold">{{ ticket.finish_unloading_time || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Berangkat</div>
            <div class="font-semibold">{{ ticket.departure_time || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// filepath: d:\my-project\ticketing-digital\web\src\pages\PrintTicket.vue
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import convex from '../convex'
import { api } from '../../../backend/convex/_generated/api'
import type { Id } from '../../../backend/convex/_generated/dataModel'
import type { Ticket } from '../interface/Ticket'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const ticket = ref<Ticket | null>(null)

const getCompany = (t: Ticket): string => {
  if (t.activity_type === true) return t.principal || t.vendor
  if (t.activity_type === false) return t.receiver
  return '-'
}
const getActivityType = (v: boolean | string): string => {
  if (v === true || v === 'true') return 'Inbound'
  if (v === false || v === 'false') return 'Outbound'
  return '-'
}
const getQRUrl = (ticketId: string, currentStatus: number): string => {
  const nextStep = currentStatus + 1
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin
  return `${baseUrl}/scan?ticketId=${ticketId}&step=${nextStep}`
}

const printTicket = () => window.print()
const goBack = () => router.back()

onMounted(async () => {
  try {
    const id = route.params.id as string
    const result = await convex.query(api.tickets.getTicketById, { ticketId: id as Id<'tickets'> }) as Ticket | null
    if (result) {
      // Ensure principal, vendor, receiver are always strings
      ticket.value = {
        ...result,
        principal: result.principal ?? '',
        vendor: result.vendor ?? '',
        receiver: result.receiver ?? '',
        driver: result.driver ?? { _id: '', name: '', nik: '', handphone_number: '' },
      }
    } else {
      ticket.value = null
    }
  } finally {
    loading.value = false
    await nextTick()
    // auto print when data ready
    window.print()
  }
})
</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
  .shadow, .shadow-xl, .shadow-2xl { box-shadow: none !important; }
  .border { border-color: #000 !important; }
  body { background: #fff !important; }
}
</style>