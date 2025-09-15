<template>
  <div class="convex-test">
    <h2>Convex Connection Test</h2>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else class="success">
      <p>✅ Connected to Convex!</p>
      <p>Found {{ tickets.length }} tickets</p>
      
      <div v-if="tickets.length > 0">
        <h3>Tickets:</h3>
        <ul>
          <li v-for="ticket in tickets" :key="ticket._id">
            {{ ticket.title }} - ${{ ticket.price }}
          </li>
        </ul>
      </div>
    </div>

    <div class="actions">
      <button @click="addTestTicket" :disabled="loading">
        Add Test Ticket
      </button>
      <button @click="refreshTickets" :disabled="loading">
        Refresh
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import convex from '../convex'
import { api } from '../../../backend/convex/_generated/api'
import type { Ticket } from '../interface/tickets'

const tickets = ref<Ticket[]>([])
const loading = ref(true)
const error = ref('')

const loadTickets = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Correct way to call Convex query
    const result = await convex.query(api.tickets.list)
    tickets.value = result || []
    
    console.log('✅ Convex connection successful!', result)
  } catch (err: any) {
    error.value = err.message
    console.error('❌ Convex connection failed:', err)
  } finally {
    loading.value = false
  }
}

const addTestTicket = async () => {
  try {
    loading.value = true
    
    // Correct way to call Convex mutation
    // Format date as YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const eventDate = `${yyyy}-${mm}-${dd}`;

    await convex.mutation(api.tickets.create, {
      title: `Test Ticket ${eventDate}`,
      description: 'This is a test ticket',
      price: 25.00,
      eventDate
    })
    
    await loadTickets() // Refresh the list
  } catch (err: any) {
    error.value = err.message
    console.error('❌ Failed to add ticket:', err)
  }
}

const refreshTickets = () => {
  loadTickets()
}

onMounted(() => {
  loadTickets()
})
</script>

<style scoped>
.convex-test {
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin: 20px;
}

.error {
  color: red;
  padding: 10px;
  background: #fee;
  border-radius: 4px;
}

.success {
  color: green;
  padding: 10px;
  background: #efe;
  border-radius: 4px;
}

.actions {
  margin-top: 20px;
}

button {
  margin-right: 10px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>