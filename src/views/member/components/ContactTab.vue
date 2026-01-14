<template>
  <div class="flex gap-8">
    <!-- 左侧字段选择 -->
    <div class="bg-blue-100 p-5 w-56 rounded space-y-4">
      <template v-for="group in grouped" :key="group.name">
        <p class="font-semibold mb-1">{{ group.name }}</p>
        <div class="flex flex-wrap gap-2 mb-2">
          <ElButton
            v-for="item in group.items"
            :key="item.type"
            plain
            size="small"
            @click="addContact(item)"
            >{{ item.label }}</ElButton
          >
        </div>
      </template>
    </div>

    <!-- 右侧动态条目 -->
    <div class="flex-1 space-y-6">
      <div
        v-for="c in contactsLocal"
        :key="c.id"
        class="border border-g-200 rounded p-4 pr-10 relative space-y-3"
      >
        <ElButton type="text" class="absolute top-2 right-2" @click="removeContact(c.id)"
          >×</ElButton
        >

        <!-- 电话独立布局 -->
        <template v-if="c.type === 'phone'">
          <ElInput v-model="c.value" placeholder="电话" />
          <ElSelect v-model="c.extra" placeholder="选择类型" class="w-40">
            <ElOption label="Work" value="Work" />
            <ElOption label="Home" value="Home" />
            <ElOption label="Mobile" value="Mobile" />
          </ElSelect>
        </template>

        <!-- 其它类型通用输入 -->
        <template v-else>
          <ElInput v-model="c.value" :placeholder="getMeta(c.type).placeholder || c.label">
            <template v-if="getMeta(c.type).prefix" #prepend>{{ getMeta(c.type).prefix }}</template>
          </ElInput>
          <!-- Twitter 等需要显示文本的情况 -->
          <ElInput v-if="c.type === 'twitter'" v-model="c.extra" placeholder="显示文本" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface PaletteItem {
    group: '通讯' | '社交'
    label: string
    type: string
  }
  interface ContactItem {
    id: number
    type: string
    label: string
    value: string
    extra?: string
  }

  const props = defineProps<{ modelValue: ContactItem[] }>()
  const emit = defineEmits(['update:modelValue'])

  /* -------- palette -------- */
  const palette: PaletteItem[] = [
    { group: '通讯', label: '电话', type: 'phone' },
    { group: '通讯', label: '邮箱', type: 'email' },
    { group: '通讯', label: '网址', type: 'website' },
    { group: '通讯', label: 'WhatsApp', type: 'whatsapp' },
    { group: '通讯', label: '微信', type: 'wechat' },
    { group: '通讯', label: 'Telegram', type: 'telegram' },
    { group: '通讯', label: 'Discord', type: 'discord' },
    { group: '通讯', label: 'Line', type: 'line' },
    { group: '通讯', label: 'Skype', type: 'skype' },
    { group: '通讯', label: '地址', type: 'address' },
    { group: '社交', label: 'Twitter', type: 'twitter' },
    { group: '社交', label: 'Facebook', type: 'facebook' },
    { group: '社交', label: 'Instagram', type: 'instagram' },
    { group: '社交', label: 'Snapchat', type: 'snapchat' },
    { group: '社交', label: 'LinkedIn', type: 'linkedin' },
    { group: '社交', label: 'Pinterest', type: 'pinterest' },
    { group: '社交', label: 'Tiktok', type: 'tiktok' }
  ]

  const grouped = computed(() => [
    { name: '通讯', items: palette.filter((p) => p.group === '通讯') },
    { name: '社交', items: palette.filter((p) => p.group === '社交') }
  ])

  /* -------- meta (placeholder / prefix) -------- */
  const fieldMeta: Record<string, { placeholder?: string; prefix?: string }> = {
    email: { placeholder: 'example@example.com' },
    website: { placeholder: 'www.example.com' },
    twitter: { prefix: 'https://twitter.com/@' },
    facebook: { prefix: 'https://facebook.com/' },
    instagram: { prefix: 'https://instagram.com/' }
  }
  function getMeta(type: string) {
    return fieldMeta[type] || {}
  }

  /* -------- state -------- */
  const contactsLocal = computed<ContactItem[]>({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  function addContact(item: PaletteItem) {
    contactsLocal.value.push({
      id: Date.now(),
      type: item.type,
      label: item.label,
      value: '',
      extra: ''
    })
  }
  function removeContact(id: number) {
    const idx = contactsLocal.value.findIndex((c) => c.id === id)
    if (idx > -1) contactsLocal.value.splice(idx, 1)
  }
</script>

<style scoped></style>
