import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// === Font Awesome Setup ===
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUser, faArrowsRotate, faPlus } from '@fortawesome/free-solid-svg-icons'

// Masukkan ke library
library.add(faUser, faArrowsRotate, faPlus)

const app = createApp(App)

// Register global komponen FontAwesome
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router).mount('#app')