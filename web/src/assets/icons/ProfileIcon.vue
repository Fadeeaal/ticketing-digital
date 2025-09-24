<template>
  <svg 
    :class="iconClasses"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      :stroke-width="strokeWidth" 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom'
  color?: 'primary' | 'blue' | 'purple' | 'gray' | 'white' | 'custom'
  strokeWidth?: number | string
  customClass?: string
  hoverEffect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  strokeWidth: 2,
  customClass: '',
  hoverEffect: true
})

// Size classes mapping
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  custom: ''
}

// Color classes mapping
const colorClasses = {
  primary: 'text-[#6c366a]',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  gray: 'text-slate-600',
  white: 'text-white',
  custom: ''
}

// Hover effect classes
const hoverClasses = {
  primary: 'group-hover:text-[#6c366a]',
  blue: 'group-hover:text-blue-700',
  purple: 'group-hover:text-purple-700',
  gray: 'group-hover:text-slate-700',
  white: 'group-hover:text-gray-200',
  custom: ''
}

// Computed class string
const iconClasses = computed(() => {
  const classes = [
    sizeClasses[props.size],
    colorClasses[props.color],
    'transition-colors duration-200'
  ]
  
  if (props.hoverEffect && props.color !== 'custom') {
    classes.push(hoverClasses[props.color])
  }
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  return classes.filter(Boolean).join(' ')
})
</script>