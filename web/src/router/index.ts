import { createRouter, createWebHistory } from 'vue-router'
import CreateTicketForm from '../pages/CreateTicketForm.vue'
import TicketListPage from '../pages/TicketListPage.vue'
import ScanTicketStatus from '../pages/ScanTicketStatus.vue'
import EditTicketForm from '../pages/EditTicketForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/list-tickets'
  },
  {
    path: '/create-ticket',
    name: 'CreateTicket',
    component: CreateTicketForm
  },
  { 
    path: '/scan', 
    component: ScanTicketStatus 
  },
  {
    path: '/list-tickets',
    name: 'TicketList',
    component: TicketListPage
  },
  {
    path: '/edit-ticket/:id',
    name: 'EditTicket',
    component: EditTicketForm
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router