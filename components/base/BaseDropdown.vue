// components/base/BaseDropdown.vue

<script setup lang="ts">
// 1. Imports
import { computed, onBeforeUnmount, onMounted, nextTick, ref, useId } from 'vue'

// 2. Props & Emits
defineOptions({ inheritAttrs: false })

export interface DropdownOption {
  label: string
  value: string | number
  dataKey?: string | null
  style?: string
}

export interface DropdownGroup {
  label: string
  options: DropdownOption[]
}

interface Props {
  options?: DropdownOption[]
  groups?: DropdownGroup[]
  modelValue: string | number
  label: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [value: string | number, dataKey: string | null]
}>()

// 4. State
const isOpen = ref(false)
const direction = ref<'down' | 'up'>('down')
const triggerRef = ref<HTMLButtonElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const uid = useId().replace(/[^a-z0-9_-]/gi, '_')
const listId = `ddl-list-${uid}`

// 5. Computed

/** Flat list of all options, whether passed via groups or flat options prop */
const flatOptions = computed<DropdownOption[]>(() => {
  if (props.groups) return props.groups.flatMap(g => g.options)
  return props.options ?? []
})

const selectedLabel = computed(
  () => flatOptions.value.find(o => o.value === props.modelValue)?.label ?? '',
)

const selectedStyle = computed(
  () => flatOptions.value.find(o => o.value === props.modelValue)?.style,
)

// 6. Methods
function optionId(value: string | number): string {
  return `ddl-opt-${uid}-${String(value).replace(/[^a-z0-9]/gi, '_')}`
}

function open(): void {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    direction.value = spaceAbove > spaceBelow ? 'up' : 'down'
  }
  isOpen.value = true
  nextTick(() => {
    document.getElementById(optionId(props.modelValue))?.scrollIntoView({ block: 'nearest' })
    document.getElementById(optionId(props.modelValue))?.focus()
  })
}

function close(): void {
  isOpen.value = false
  triggerRef.value?.focus()
}

function toggle(): void {
  if (isOpen.value) close()
  else open()
}

function select(option: DropdownOption): void {
  emit('change', option.value, option.dataKey ?? null)
  isOpen.value = false
  triggerRef.value?.focus()
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    open()
  }
}

function handleOptionKeydown(event: KeyboardEvent, option: DropdownOption): void {
  const idx = flatOptions.value.findIndex(o => o.value === option.value)

  if (event.key === 'Escape') {
    close()
  }
  else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select(option)
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    const next = flatOptions.value[idx + 1]
    if (next) document.getElementById(optionId(next.value))?.focus()
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (idx > 0) {
      const prev = flatOptions.value[idx - 1]
      if (prev) document.getElementById(optionId(prev.value))?.focus()
    }
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    document.getElementById(optionId(flatOptions.value[0].value))?.focus()
  }
  else if (event.key === 'End') {
    event.preventDefault()
    document.getElementById(optionId(flatOptions.value[flatOptions.value.length - 1].value))?.focus()
  }
  else if (event.key === 'Tab') {
    isOpen.value = false
  }
}

function handleClickOutside(event: MouseEvent): void {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// 7. Lifecycle hooks
onMounted(() => {
  document.addEventListener('pointerdown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative" v-bind="$attrs">
    <button
      ref="triggerRef"
      type="button"
      :aria-label="label"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="listId"
      class="flex items-center gap-2 h-11 min-w-28 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-input text-sm text-left text-gray-900 cursor-pointer transition-colors hover:bg-gray-100 outline-tight-button"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <span class="grid flex-1 min-w-0">
        <!-- Invisible ghost labels — the widest one sets the trigger width -->
        <span
          v-for="opt in flatOptions"
          :key="opt.value"
          aria-hidden="true"
          class="invisible col-start-1 row-start-1 whitespace-nowrap"
          :style="opt.style"
        >{{ opt.label }}</span>
        <!-- Visible selected label on top -->
        <span class="col-start-1 row-start-1 truncate" :style="selectedStyle">{{ selectedLabel }}</span>
      </span>
      <svg
        class="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-150"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="isOpen"
        :id="listId"
        role="listbox"
        :aria-label="label"
        class="absolute z-50 w-max min-w-full bg-white border border-gray-200 rounded-input shadow-lg py-1"
        :class="direction === 'down' ? 'top-full mt-[1px]' : 'bottom-full mb-1'"
      >
        <!-- Grouped mode -->
        <template v-if="groups">
          <template v-for="group in groups" :key="group.label">
            <li
              role="presentation"
              class="px-3 pt-2 pb-1 text-xs font-semibold text-neutral-800 uppercase tracking-wide select-none"
            >
              {{ group.label }}
            </li>
            <li
              v-for="option in group.options"
              :id="optionId(option.value)"
              :key="option.value"
              role="option"
              :aria-selected="option.value === modelValue"
              tabindex="0"
              :style="option.style"
              class="pl-5 pr-3 min-h-[44px] flex items-center text-sm cursor-pointer focus:outline-none"
              :class="
                option.value === modelValue
                  ? 'bg-neutral-700 text-primary-100 font-medium'
                  : 'text-gray-900 hover:bg-gray-100 focus:bg-gray-100'
              "
              @click="select(option)"
              @keydown="handleOptionKeydown($event, option)"
            >
              {{ option.label }}
            </li>
          </template>
        </template>
        <!-- Flat mode -->
        <template v-else>
          <li
            v-for="option in flatOptions"
            :id="optionId(option.value)"
            :key="option.value"
            role="option"
            :aria-selected="option.value === modelValue"
            tabindex="0"
            :style="option.style"
            class="px-3 min-h-[44px] flex items-center text-sm cursor-pointer focus:outline-none"
            :class="
              option.value === modelValue
                ? 'bg-neutral-700 text-primary-100 font-medium'
                : 'text-gray-900 hover:bg-gray-300 focus:bg-gray-400'
            "
            @click="select(option)"
            @keydown="handleOptionKeydown($event, option)"
          >
            {{ option.label }}
          </li>
        </template>
      </ul>
    </Transition>
  </div>
</template>
