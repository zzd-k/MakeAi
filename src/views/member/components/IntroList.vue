<template>
  <ElDialog
    v-model="visible"
    title="添加自我介绍"
    width="70%"
    @close="emit('update:visible', false)"
  >
    <ElButton type="primary" class="mb-4" @click="createVisible = true">新建</ElButton>
    <ElRow :gutter="20">
      <ElCol v-for="item in list" :key="item.id" :span="6">
        <ElCard shadow="hover">
          <div class="relative">
            <img :src="item.thumb" class="w-full h-36 object-cover" />
            <ElIcon class="absolute inset-0 m-auto text-white text-3xl"><VideoPlay /></ElIcon>
          </div>
          <div class="mt-2 text-sm">{{ item.title }}</div>
        </ElCard>
      </ElCol>
    </ElRow>
    <div class="flex justify-end mt-4">
      <ElPagination
        background
        small
        layout="prev, pager, next"
        :total="list.length"
        :page-size="8"
      />
    </div>
    <IntroCreate v-model:visible="createVisible" @save="list.push($event)" />
  </ElDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { VideoPlay } from '@element-plus/icons-vue'
  import IntroCreate from './IntroCreate.vue'

  interface IntroItem {
    id: number
    title: string
    thumb: string
  }
  const props = defineProps<{ visible: boolean }>()
  const emit = defineEmits(['update:visible'])
  const visible = useVModel(props, 'visible', emit)

  const createVisible = ref(false)
  const list = ref<IntroItem[]>([
    { id: 1, title: 'Untitled Video', thumb: 'https://placehold.co/300x180' }
  ])
</script>
