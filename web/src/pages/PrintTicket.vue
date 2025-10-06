<template>
  <div class="min-h-screen bg-gray-100 text-black p-6 print:p-0 print:bg-white">
    <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg no-print mb-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-[#6c366a]">Preview Karcis</h1>
        <div class="flex gap-2">
          <button @click="printTicket" class="px-4 py-2 bg-[#6c366a] text-white rounded-lg font-semibold hover:bg-[#5a2d58]">
            🖨️ Print
          </button>
          <button @click="goBack" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50">
            ← Kembali
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 mb-2">Ukuran: 10cm x 15cm (Karcis)</p>
    </div>

    <div v-if="loading" class="text-center text-gray-500 no-print">Memuat data...</div>
    <div v-else-if="!ticket" class="text-center text-red-600 no-print">Ticket tidak ditemukan.</div>

    <div v-else class="ticket-container print:m-0">
      <div class="ticket-card">
        <div class="ticket-main">
          <div class="header">
            <h2 class="title">TICKET {{ getActivityType(ticket.activity_type) }}</h2>
          </div>
          
          <div class="license-plate-section">
            <div class="section-label">Perusahaan / Vendor</div>
            <p class="license-plate-text">{{ getCompany(ticket) }}</p>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <div class="section-label">Kendaraan</div>
              <p class="detail-value">{{ ticket.vehicle }}</p>
            </div>
            <div class="detail-item">
              <div class="section-label">Plat Nomor</div>
              <p class="detail-value">{{ ticket.license_plate }}</p>
            </div>
            <div class="detail-item">
              <div class="section-label">Tanggal Tiba</div>
              <p class="detail-value">{{ ticket.arrival_date }}</p>
            </div>
          </div>
          
          <div class="driver-section">
            <div class="section-label">DRIVER</div>
            <p class="driver-name">{{ ticket.driver?.name }}</p>
            <p class="driver-contact">
              NIK: {{ ticket.driver?.nik }} | HP: {{ ticket.driver?.handphone_number }}
            </p>
          </div>
          
          <div class="arrival-time">
            <div class="section-label">Waktu Tiba</div>
            <p class="time-value">{{ ticket.arrival_time || '-' }}</p>
          </div>
        </div>

        <div class="ticket-stub">
          <div class="stub-header">
            <p class="stub-label">TICKET ID</p>
            <p class="stub-id">{{ ticket._id.slice(-8).toUpperCase() }}</p>
          </div>
          <div class="stub-footer">
            <p>Simpan karcis ini dengan baik.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  if (v === true || v === 'true') return 'INBOUND'
  if (v === false || v === 'false') return 'OUTBOUND'
  return '-'
}

const printTicket = () => window.print()
const goBack = () => router.back()

onMounted(async () => {
  try {
    const id = route.params.id as string
    const result = await convex.query(api.tickets.getTicketById, { ticketId: id as Id<'tickets'> }) as Ticket | null
    if (result) {
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
    window.print()
  }
})
</script>

<style scoped>
/* Import a relaxed-but-assertive Google Font */
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap');

/* General screen styles */
.ticket-container {
  max-width: 10cm; /* Same as print width */
  margin: 0 auto;
}

/* NEW CARD LAYOUT */
.ticket-card {
  width: 10cm;
  height: 15cm;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  display: flex;
  font-family: 'Rubik', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Main content area (left side) */
.ticket-main {
  flex: 3;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  border-bottom: 2px solid #6c366a;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: #6c366a;
  letter-spacing: 2px;
  margin: 0;
}

.company {
  font-size: 12px;
  color: #555;
  font-weight: 600;
}

.section-label {
  font-size: 10px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

/* License Plate Styling */
.license-plate-section {
  text-align: center;
  margin: auto 0; /* Vertically centers the plate */
}

.license-plate-text {
  font-family: 'Times New Roman', Courier, monospace;
  font-size: 42px;
  font-weight: 900;
  color: #000;
  background: #f0f0f0;
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #ccc;
  letter-spacing: 2px;
  margin: 0;
}

/* Other details */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-item .detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.driver-section {
  border-top: 1px solid #eee;
  padding-top: 12px;
}
.driver-name {
  font-size: 16px;
  font-weight: 700;
}
.driver-contact {
  font-size: 11px;
  color: #666;
}

.arrival-time {
  text-align: center;
  margin-top: auto; /* Pushes to the bottom */
  padding-top: 12px;
  border-top: 1px dashed #ccc;
}
.time-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 18px;
  font-weight: 700;
  color: #000;
}

/* Stub area (right side) */
.ticket-stub {
  flex: 1;
  background: #f9f7f9;
  border-left: 2px dashed #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding: 16px 8px;
}

.stub-label {
  font-size: 10px;
  font-weight: 600;
  color: #6c366a;
}

.stub-id {
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.qr-placeholder {
  padding: 10px 0;
}
.qr-box {
  width: 80px;
  height: 80px;
  background: #fff;
  border: 1px solid #ddd;
  margin: 0 auto 8px auto;
  /* Simple placeholder content */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #aaa;
}
.qr-scan-text {
  font-size: 10px;
  font-weight: 600;
  color: #888;
  letter-spacing: 1px;
}

.stub-footer {
  font-size: 10px;
  color: #777;
  font-style: italic;
}


/* Print styles */
@media print {
  @page {
    size: 10cm 15cm;
    margin: 0;
  }
  body { margin: 0; padding: 0; }
  .no-print { display: none !important; }

  .ticket-container {
    width: 10cm;
    height: 15cm;
    margin: 0;
    padding: 0;
    page-break-after: always;
  }
  .ticket-card {
    width: 100%;
    height: 100%;
    box-shadow: none;
    border: 2px solid #000;
    border-radius: 0;
  }
  
  /* Ensure colors and backgrounds print */
  .ticket-main, .ticket-stub, .license-plate-text {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  }
}
</style>