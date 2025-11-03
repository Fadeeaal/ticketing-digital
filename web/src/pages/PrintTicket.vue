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
      <p class="text-sm text-gray-500 mb-2">Ukuran: 58mm x ~70mm (Thermal)</p>
    </div>

    <div v-if="loading" class="text-center text-gray-500 no-print">Memuat data...</div>
    <div v-else-if="!ticket" class="text-center text-red-600 no-print">Ticket tidak ditemukan.</div>

    <div v-else class="ticket-container print:m-0">
      <div class="ticket-card">
        <div class="qr-section">
          <div class="qr-box-wrapper">
            <qrcode-vue v-if="ticket && ticket.ticket_status < 3" :value="getQRUrl(ticket._id, ticket.ticket_status)" :size="100" level="H" />
            <div v-else class="qr-box-placeholder">--</div>
          </div>
        </div>

        <div class="header">
          <h2 class="title">{{ getActivityType(ticket.activity_type) }} TICKET</h2>
        </div>
        
        <div class="info-group">
          <p class="info-value-large">{{ getCompany(ticket) }}</p>
        </div>

        <div class="info-group">
          <p class="info-value-medium">{{ ticket.license_plate }}</p>
        </div>

        <div class="info-group driver-info">
          <p class="info-value-driver">{{ ticket.driver?.name }}</p>
        </div>
        
        <div class="info-group time-info">
          <div class="section-label">Tanggal dan Waktu Tiba</div>
          <p class="info-value-medium">{{ ticket.arrival_date }} - {{ ticket.arrival_time }}</p>
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
    // TAMBAH DELAY UNTUK MEMASTIKAN QR CODE TERENDER
    setTimeout(() => {
      window.print()
    }, 500)
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
  width: 5.8cm; 
  min-height: unset; /* HILANGKAN BATASAN TINGGI 21CM */
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px; 
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  padding: 0;
  font-family: 'Rubik', sans-serif;
  color: #333;
}

/* Common Styles for Info Sections - PADDING DIKURANGI */
.header, .qr-section, .info-group, .footer-text {
  padding: 4px 12px; /* Vertikal dikurangi dari 8px ke 4px */
  text-align: center;
}

/* QR Code Section - PENGURANGAN SPASI QR */
.qr-section {
  background: #fff;
  padding-top: 30px; /* Ditambahkan margin atas */
  padding-bottom: 15px; /* Dikurangi dari 10px */
  border-bottom: 1px dashed #ccc;
}
.qr-box-wrapper {
  width: 70px; /* Ukuran QR dikurangi drastis dari 150px */
  height: 70px; /* Ukuran QR dikurangi drastis dari 150px */
  margin: 0 auto 4px auto;
  margin-bottom: 5px; /* Dikurangi dari 30px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 4px;
}
.qr-box-placeholder {
  font-size: 16px;
  color: #999;
  font-weight: bold;
}
.qr-scan-text {
  font-size: 8px; /* Dikurangi dari 10px */
  font-weight: 700;
  color: #6c366a;
  margin-top: 2px; /* Dikurangi dari 4px */
  letter-spacing: 0.5px;
}
.ticket-id {
  font-family: 'Roboto Mono', monospace;
  font-size: 10px; /* Dikurangi dari 12px */
  font-weight: 700;
  color: #555;
  margin-top: 2px; /* Dikurangi dari 6px */
}

/* Ticket Header */
.header {
  border-bottom: 1px solid #eee;
  padding-top: 6px; /* Dikurangi dari 12px */
  padding-bottom: 4px; /* Dikurangi dari 8px */
}
.title {
  font-size: 14px; /* Dikurangi dari 16px */
  font-weight: 900;
  color: #6c366a;
  letter-spacing: 1px; /* Dikurangi dari 1.5px */
  margin: 0;
  text-transform: uppercase;
}

/* General Info Groups */
.info-group {
  padding: 4px 12px; /* Vertikal dikurangi dari 8px ke 4px */
  text-align: center;
  border-bottom: 1px dashed #eee;
}
.info-group:last-of-type {
  border-bottom: none;
}

.section-label {
  font-size: 8px; /* Dikurangi dari 9px */
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.3px; /* Dikurangi dari 0.5px */
  margin-bottom: 0px; /* Dikurangi dari 2px */
  display: block;
}

.info-value {
  font-size: 11px; /* Dikurangi dari 13px */
  font-weight: 500;
  color: #333;
  margin: 0;
}
.info-value-small {
  font-size: 9px; /* Dikurangi dari 11px */
  font-weight: 400;
  color: #555;
  margin: 0;
}
.info-value-medium {
  font-size: 12px; /* Dikurangi dari 15px */
  font-weight: 700;
  color: #000;
  margin: 0;
  font-family: 'Roboto Mono', monospace;
}
.info-value-large {
  font-size: 16px; /* Dikurangi drastis dari 22px */
  font-weight: 900;
  color: #000;
  margin: 0;
  line-height: 1.1; /* Dikurangi dari 1.2 */
}
.info-value-driver {
  font-size: 11px; /* Dikurangi dari 14px */
  font-weight: 700;
  color: #333;
  margin: 0 0 2px 0; /* Dikurangi dari 4px */
}

/* Highlight for Company (Optional, tapi padding dikurangi) */
.info-group.highlight {
  background: #fdf5e6;
  border-bottom: 1px solid #ffd700;
  padding: 6px 12px; /* Dikurangi dari 10px */
}

.driver-info {
  border-top: 1px dashed #ccc;
  padding-top: 6px; /* Dikurangi dari 10px */
}
.time-info {
  padding-top: 6px; /* Dikurangi dari 10px */
}


/* Footer Text */
.footer-text {
  font-size: 8px; /* Dikurangi dari 9px */
  color: #777;
  font-style: italic;
  padding-top: 6px; /* Dikurangi dari 10px */
  margin-top: auto;
  border-top: 1px dashed #eee;
}
.footer-text p {
  margin: 0; /* Margin bawah 2px dihilangkan */
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
    min-height: unset; /* PENTING: MEMASTIKAN TINGGI MENGGUNAKAN AUTO/KONTEN */
    box-shadow: none;
    border: none;
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