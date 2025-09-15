import { createApp } from 'vue'
import App from './App.vue'

// For now, just test the connection
console.log('Convex URL:', import.meta.env.VITE_CONVEX_URL)

createApp(App).mount('#app')