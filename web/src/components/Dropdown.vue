<template>
  <div class="space-y-2">
    <label :for="id" class="block font-semibold text-slate-700 text-sm">
      {{ label }}
      <span v-if="required && !disabled" class="text-red-500 font-bold"> *</span>
      <span v-if="disabledNote" class="text-slate-400 text-xs"> {{ disabledNote }}</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :required="required && !disabled"
      :disabled="disabled"
      @change="handleChange"
      class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500 bg-white"
      :class="size === 'large' ? 'px-5 py-4 text-lg font-medium shadow-sm' : ''"
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