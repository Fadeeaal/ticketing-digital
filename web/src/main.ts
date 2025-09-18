import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// For now, just test the connection
console.log('Convex URL:', import.meta.env.VITE_CONVEX_URL)

createApp(App)
  .use(router)
  .mount('#app')


