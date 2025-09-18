import { createRouter, createWebHistory } from 'vue-router'
import CreateTicketForm from '../components/CreateTicketForm.vue'
import TicketListPage from '../components/TicketListPage.vue'
import ScanTicketStatus from '../components/ScanTicketStatus.vue'

const routes = [
  {
    path: '/',
    name: 'CreateTicket',
    component: CreateTicketForm
  },
  { path: '/scan', component: ScanTicketStatus },
  {
    path: '/tickets',
    name: 'TicketList',
    component: TicketListPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router