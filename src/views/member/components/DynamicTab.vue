<template>
  <ProductTab :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
  import ProductTab from './ProductTab.vue'
  interface ProductItem {
    id: number
    title: string
    cover: string
    url: string
    desc: string
  }

  const props = defineProps<{ modelValue: ProductItem[] }>()
  const emit = defineEmits<{ (e: 'update:modelValue', value: ProductItem[]): void }>()

  const { modelValue } = toRefs(props)
</script>
