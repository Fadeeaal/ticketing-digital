<template>
  <div class="space-y-2">
    <label :for="id" class="block font-semibold text-slate-700 text-sm">
      {{ label }}
      <span v-if="required && !disabled" class="text-red-500 font-bold"> *</span>
      <span v-if="disabledNote" class="text-slate-400 text-xs"> {{ disabledNote }}</span>
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :required="required && !disabled"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :inputmode="inputMode"
      @input="handleInput"
      class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#6c366a] focus:ring-4 focus:ring-purple-100 hover:border-purple-300 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500"
    />
  </div>
  
</template>

<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: string
  type?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  inputMode?: 'text' | 'none' | 'email' | 'search' | 'tel' | 'url' | 'numeric' | 'decimal'
  validationType?: 'numbers' | 'letters' | 'none'
  disabledNote?: string
}

type Emits = (e: 'update:modelValue', value: string) => void

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  placeholder: '',
  maxLength: undefined,
  inputMode: 'text',
  validationType: 'none',
  disabledNote: ''
})

const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  // Apply validation based on type
  if (props.validationType === 'numbers') {
    value = value.replace(/\D/g, '')
  } else if (props.validationType === 'letters') {
    value = value.replace(/[^A-Za-z]/g, '').toUpperCase()
  }

  // Update the input value if validation changed it
  if (target.value !== value) {
    target.value = value
  }

  emit('update:modelValue', value)
}
</script>