<template>
  <div class="space-y-2">
    <label :for="id" class="block font-semibold text-slate-700 text-sm">
      {{ label }}
      <span v-if="required && !disabled" class="text-red-500 font-bold"> *</span>
      <span v-if="disabledNote" class="text-slate-400 text-xs"> {{ disabledNote }}</span>
    </label>
    <div class="relative group">
      <select
        :id="id"
        :value="modelValue"
        :required="required && !disabled"
        :disabled="disabled"
        @change="handleChange"
        class="w-full border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500 bg-white appearance-none"
        :class="size === 'large' ? 'px-5 py-4 text-lg font-medium shadow-sm pr-14' : 'px-4 py-3 pr-12'"
      >
        <option value="">{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <!-- Custom arrow icon; edit this SVG to change arrow style -->
      <div
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 group-focus-within:text-[#6c366a]"
        :class="disabled ? 'text-slate-400' : ''"
        aria-hidden="true"
      >
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  id: string
  label: string
  modelValue: string
  options: Option[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  disabledNote?: string
  size?: 'normal' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  placeholder: '-- Pilih --',
  disabledNote: '',
  size: 'normal'
})

const emit = defineEmits<Emits>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  emit('update:modelValue', value)
  emit('change', value)
}
</script>