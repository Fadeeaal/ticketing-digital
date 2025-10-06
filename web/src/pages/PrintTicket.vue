<template>
  <div class="min-h-screen bg-gray-100 text-black p-6 print:p-0 print:bg-white">
    <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg no-print mb-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-[#6c366a]">Preview Karcis (Thermal)</h1>
        <div class="flex gap-2">
          <button @click="printTicket" class="px-4 py-2 bg-[#6c366a] text-white rounded-lg font-semibold hover:bg-[#5a2d58]">
            🖨️ Print
          </button>
          <button @click="goBack" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50">
            ← Kembali
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 mb-2">Ukuran: 58mm x 210mm (Thermal)</p>
    </div>

    <div v-if="loading" class="text-center text-gray-500 no-print">Memuat data...</div>
    <div v-else-if="!ticket" class="text-center text-red-600 no-print">Ticket tidak ditemukan.</div>

    <div v-else class="ticket-container print:m-0">
      <div class="ticket-card">
        <div class="qr-section">
          <div class="qr-box-wrapper">
            <qrcode-vue v-if="ticket && ticket.ticket_status < 3" :value="getQRUrl(ticket._id, ticket.ticket_status)" :size="170" level="H" />
            <div v-else class="qr-box-placeholder">--</div>
          </div>
          <p class="qr-scan-text">SCAN UNTUK UPDATE</p>
          <p class="ticket-id">ID: {{ ticket._id.slice(-8).toUpperCase() }}</p>
        </div>

        <div class="header">
          <h2 class="title">{{ getActivityType(ticket.activity_type) }} TICKET</h2>
        </div>
        
        <div class="info-group">
          <div class="section-label">Perusahaan / Vendor</div>
          <p class="info-value-large">{{ getCompany(ticket) }}</p>
        </div>

        <div class="info-group">
          <div class="section-label">Plat Nomor</div>
          <p class="info-value-medium">{{ ticket.license_plate }}</p>
        </div>
        <div class="info-group">
          <div class="section-label">Jenis Kendaraan</div>
          <p class="info-value">{{ ticket.vehicle }}</p>
        </div>

        <div class="info-group driver-info">
          <div class="section-label">Driver</div>
          <p class="info-value-driver">{{ ticket.driver?.name }}</p>
          <p class="info-value-small">NIK: {{ ticket.driver?.nik }}</p>
          <p class="info-value-small">HP: {{ ticket.driver?.handphone_number }}</p>
        </div>
        
        <div class="info-group time-info">
          <div class="section-label">Tanggal Tiba</div>
          <p class="info-value-medium">{{ ticket.arrival_date }}</p>
        </div>
        <div class="info-group time-info">
          <div class="section-label">Waktu Tiba</div>
          <p class="info-value-medium">{{ ticket.arrival_time || '-' }}</p>
        </div>

        <div class="footer-text">
          <p>Terima kasih atas kerja samanya.</p>
          <p>Simpan karcis ini dengan baik.</p>
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
import QrcodeVue from 'qrcode.vue'

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

// Generate QR URL similar to TicketDetail modal
const getQRUrl = (ticketId: string, currentStatus: number): string => {
  const nextStep = currentStatus + 1
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin
  return `${baseUrl}/scan?ticketId=${ticketId}&step=${nextStep}`
}

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
/* Import a clear, readable Google Font for thermal prints */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Rubik:wght@400;500;700;900&display=swap');

/* General screen styles */
.ticket-container {
  max-width: 5.8cm; /* Thermal paper width */
  margin: 0 auto;
}

.ticket-card {
  width: 5.8cm; /* Fixed width for thermal print */
  min-height: 21cm; /* Minimum height, content will expand */
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px; /* Softer edges */
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05); /* Lighter shadow */
  display: flex;
  flex-direction: column;
  padding: 0; /* No padding on the card itself */
  font-family: 'Rubik', sans-serif;
  color: #333;
}

/* Common Styles for Info Sections */
.header, .qr-section, .info-group, .footer-text {
  padding: 8px 12px; /* Consistent padding left/right */
  text-align: center;
}

/* QR Code Section - Top Priority */
.qr-section {
  background: #fff;
  padding-top: 65px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ccc;
}
.qr-box-wrapper {
  width: 150px; /* QR size */
  height: 150px; /* QR size */
  margin: 0 auto 8px auto;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white; /* Ensure white background for QR */
  border-radius: 4px;
}
.qr-box-placeholder {
  font-size: 16px;
  color: #999;
  font-weight: bold;
}
.qr-scan-text {
  font-size: 10px;
  font-weight: 700;
  color: #6c366a;
  margin-top: 4px;
  letter-spacing: 0.5px;
}
.ticket-id {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #555;
  margin-top: 6px;
}

/* Ticket Header */
.header {
  border-bottom: 1px solid #eee;
  padding-top: 12px;
  padding-bottom: 8px;
}
.title {
  font-size: 16px;
  font-weight: 900;
  color: #6c366a;
  letter-spacing: 1.5px;
  margin: 0;
  text-transform: uppercase;
}

/* General Info Groups */
.info-group {
  padding: 8px 12px;
  text-align: center;
  border-bottom: 1px dashed #eee;
}
.info-group:last-of-type {
  border-bottom: none; /* No border for the last one */
}

.section-label {
  font-size: 9px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  display: block; /* Ensures it takes full width */
}

.info-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin: 0;
}
.info-value-small {
  font-size: 11px;
  font-weight: 400;
  color: #555;
  margin: 0;
}
.info-value-medium {
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0;
  font-family: 'Roboto Mono', monospace;
}
.info-value-large {
  font-size: 22px; /* Very large for company name */
  font-weight: 900;
  color: #000;
  margin: 0;
  line-height: 1.2;
}
.info-value-driver {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
}

/* Highlight for Company */
.info-group.highlight {
  background: #fdf5e6; /* Soft yellow background */
  border-bottom: 1px solid #ffd700;
  padding: 10px 12px;
}

.driver-info {
  border-top: 1px dashed #ccc;
  padding-top: 10px;
}
.time-info {
  padding-top: 10px;
}


/* Footer Text */
.footer-text {
  font-size: 9px;
  color: #777;
  font-style: italic;
  padding-top: 10px;
  margin-top: auto; /* Push to bottom */
  border-top: 1px dashed #eee;
}
.footer-text p {
  margin: 0 0 2px 0;
}

/* Print styles for thermal paper */
@media print {
  @page {
    size: 58mm auto; /* Width fixed, height auto */
    margin: 0;
  }
  body {
    margin: 0;
    padding: 0;
  }
  .no-print {
    display: none !important;
  }

  .ticket-container {
    width: 58mm;
    margin: 0;
    padding: 0;
    page-break-after: always;
  }

  .ticket-card {
    width: 100%;
    min-height: unset; /* Let content define height */
    box-shadow: none;
    border: none; /* No border for actual thermal print */
    border-radius: 0;
    padding: 0;
  }

  /* Ensure colors and backgrounds print for thermal */
  .qr-section, .info-group.highlight {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
  }
}
</style>