import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faArrowsRotate, faPlus, faPrint, 
    faTicket, faLocationDot, faClock, 
    faEye, faPencil } from '@fortawesome/free-solid-svg-icons'
import { faTruck, faFile, faBuilding, faUser, faCircleCheck } from '@fortawesome/free-regular-svg-icons'


// Masukkan ke library
library.add(faUser, faArrowsRotate, faPlus, faPrint, 
    faTicket, faBuilding, faTruck, faCircleCheck, 
    faLocationDot, faClock, faEye, faPencil, faFile)

const app = createApp(App)

// Register global komponen FontAwesome
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router).mount('#app')