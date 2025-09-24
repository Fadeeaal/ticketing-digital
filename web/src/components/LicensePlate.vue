<template>
  <div class="space-y-2">
    <label for="license-letters1" class="block font-semibold text-slate-700 text-sm">
      {{ label }}
      <span v-if="required" class="text-red-500 font-bold"> *</span>
    </label>
    
    <!-- Grid layout untuk input horizontal -->
    <div class="grid grid-cols-3 gap-3">
      <!-- Huruf Pertama -->
      <div class="space-y-1">
        <input
          id="license-letters1"
          :value="letters1"
          type="text"
          :required="required"
          placeholder="B"
          maxlength="2"
          @input="handleLetters1Input"
          class="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-base text-center uppercase font-bold transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
        />
        <p class="text-xs text-purple-600 font-medium text-center">1-2 huruf</p>
      </div>
      
      <!-- Angka -->
      <div class="space-y-1">
        <input
          id="license-numbers"
          :value="numbers"
          type="text"
          :required="required"
          placeholder="1234"
          maxlength="4"
          @input="handleNumbersInput"
          inputmode="numeric"
          class="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-base text-center font-bold transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
        />
        <p class="text-xs text-purple-600 font-medium text-center">1-4 angka</p>
      </div>
      
      <!-- Huruf Kedua -->
      <div class="space-y-1">
        <input
          id="license-letters2"
          :value="letters2"
          type="text"
          :required="required"
          placeholder="ABC"
          maxlength="3"
          @input="handleLetters2Input"
          class="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-base text-center uppercase font-bold transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white"
        />
        <p class="text-xs text-purple-600 font-medium text-center">1-3 huruf</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  letters1: string
  numbers: string
  letters2: string
  required?: boolean
}

interface Emits {
  (e: 'update:letters1', value: string): void
  (e: 'update:numbers', value: string): void
  (e: 'update:letters2', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Plat Nomor',
  required: false
})

const emit = defineEmits<Emits>()

// Computed properties
const fullPlate = computed(() => {
  return props.letters1 + props.numbers + props.letters2
})

// Input handlers
const handleLetters1Input = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^A-Za-z]/g, '').toUpperCase()
  
  target.value = value
  emit('update:letters1', value)
}

const handleNumbersInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  
  target.value = value
  emit('update:numbers', value)
}

const handleLetters2Input = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^A-Za-z]/g, '').toUpperCase()
  
  target.value = value
  emit('update:letters2', value)
}
</script>