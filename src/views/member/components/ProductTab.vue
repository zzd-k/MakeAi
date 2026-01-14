<template>
  <div class="space-y-4">
    <!-- 工具栏 -->
    <div class="flex items-center gap-2">
      <ElInput v-model="keyword" placeholder="请输入" style="width: 250px" />
      <ElButton type="primary" @click="page = 1">搜索</ElButton>
      <ElButton type="primary" @click="openDialog('create')">新增</ElButton>
      <ElButton @click="handleExport">导出</ElButton>
    </div>
    <!-- 表格 -->
    <ElTable :data="pageData" style="width: 100%" border>
      <ElTableColumn prop="id" label="id" width="80" />
      <ElTableColumn prop="title" label="标题" />
      <ElTableColumn label="封面" width="120">
        <template #default="{ row }"
          ><img :src="row.cover" class="w-16 h-10 object-cover"
        /></template>
      </ElTableColumn>
      <ElTableColumn prop="url" label="Url" />
      <ElTableColumn prop="desc" label="描述" />
      <ElTableColumn label="操作" width="180">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="handlePreview(row)">预览</ElButton>
          <ElButton type="success" link size="small" @click="openDialog('edit', row)"
            >编辑</ElButton
          >
          <ElButton type="danger" link size="small" @click="handleDelete(row)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- 分页 -->
    <div class="flex justify-end items-center gap-2">
      <span>共 {{ filterList.length }} 条</span>
      <ElSelect v-model="pageSize" style="width: 90px" size="small">
        <ElOption :value="10" label="10" />
        <ElOption :value="20" label="20" />
        <ElOption :value="50" label="50" />
      </ElSelect>
      <ElPagination
        small
        background
        layout="prev, pager, next"
        :total="filterList.length"
        :page-size="pageSize"
        v-model:current-page="page"
      />
    </div>

    <!-- 弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增产品' : '编辑产品'"
      width="40%"
    >
      <ElForm :model="dialogForm" label-width="80px">
        <ElFormItem label="标题"><ElInput v-model="dialogForm.title" class="w-60" /></ElFormItem>
        <ElFormItem label="封面">
          <ElUpload :show-file-list="false" action="#" :on-success="handleCoverSuccess">
            <img v-if="dialogForm.cover" :src="dialogForm.cover" class="w-24 h-14 object-cover" />
            <ElButton v-else size="small">上传</ElButton>
          </ElUpload>
        </ElFormItem>
        <ElFormItem label="Url"><ElInput v-model="dialogForm.url" class="w-60" /></ElFormItem>
        <ElFormItem label="描述"
          ><ElInput type="textarea" v-model="dialogForm.desc" class="w-60"
        /></ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveDialog">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  interface ProductItem {
    id: number
    title: string
    cover: string
    url: string
    desc: string
  }
  const props = defineProps<{ modelValue: ProductItem[] }>()
  const emit = defineEmits(['update:modelValue'])
  const keyword = ref('')
  const page = ref(1)
  const pageSize = ref(10)
  const dialogVisible = ref(false)
  const dialogMode = ref<'create' | 'edit'>('create')
  const dialogForm = ref<ProductItem>({ id: 0, title: '', cover: '', url: '', desc: '' })

  const list = computed(() => props.modelValue)
  const filterList = computed(() =>
    keyword.value ? list.value.filter((p) => p.title.includes(keyword.value)) : list.value
  )
  const pageData = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filterList.value.slice(start, start + pageSize.value)
  })

  function update(val: ProductItem[]) {
    emit('update:modelValue', val)
  }
  function openDialog(mode: 'create' | 'edit', row?: ProductItem) {
    dialogMode.value = mode
    dialogForm.value = row ? { ...row } : { id: 0, title: '', cover: '', url: '', desc: '' }
    dialogVisible.value = true
  }
  function handleCoverSuccess(_: any, f: any) {
    dialogForm.value.cover = URL.createObjectURL(f.raw)
  }

  function saveDialog() {
    if (dialogMode.value === 'create') {
      update([...list.value, { ...dialogForm.value, id: Date.now() }])
    } else {
      const idx = list.value.findIndex((p) => p.id === dialogForm.value.id)
      if (idx > -1) {
        list.value[idx] = { ...dialogForm.value }
        update([...list.value])
      }
    }
    dialogVisible.value = false
  }
  function handleDelete(row: ProductItem) {
    update(list.value.filter((p) => p.id !== row.id))
  }
  function handlePreview(row: ProductItem) {
    window.open(row.url, '_blank')
  }
  function handleExport() {
    console.log('export', list.value)
  }
</script>
