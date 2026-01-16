<template>
  <ElDialog
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    width="860px"
    align-center
    class="menu-dialog"
    @closed="handleClosed"
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="width > 640 ? 12 : 24"
      :gutter="20"
      label-width="100px"
      :show-reset="false"
      :show-submit="false"
    >
      <template #type>
        <ElRadioGroup v-model="form.menu_type" :disabled="isEdit">
          <ElRadioButton value="directory" label="directory">目录</ElRadioButton>
          <ElRadioButton value="menu" label="menu">菜单</ElRadioButton>
          <ElRadioButton value="button" label="button">按钮</ElRadioButton>
        </ElRadioGroup>
      </template>
    </ArtForm>

    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import { ElIcon, ElTooltip, ElMessage } from 'element-plus'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import type { FormItem } from '@/components/core/forms/art-form/index.vue'
  import ArtForm from '@/components/core/forms/art-form/index.vue'
  import { useWindowSize } from '@vueuse/core'
  import { fetchCreateMenu, fetchUpdateMenu } from '@/api/system/menu'

  const { width } = useWindowSize()

  type MenuListItem = Api.SystemManage.MenuListItem
  type MenuType = Api.SystemManage.MenuType

  /**
   * 创建带 tooltip 的表单标签
   */
  const createLabelTooltip = (label: string, tooltip: string) => {
    return () =>
      h('span', { class: 'flex items-center' }, [
        h('span', label),
        h(
          ElTooltip,
          {
            content: tooltip,
            placement: 'top'
          },
          () => h(ElIcon, { class: 'ml-0.5 cursor-help' }, () => h(QuestionFilled))
        )
      ])
  }

  interface Props {
    visible: boolean
    editData?: MenuListItem | null
    type?: 'add' | 'edit'
    parentId?: number
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'add',
    editData: null,
    parentId: 0
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()

  // Flattened form data for the UI
  const form = reactive({
    id: 0,
    parent_id: 0,
    menu_type: 'menu' as MenuType,
    menu_name: '',
    route: '',
    permission_code: '',
    icon: '',
    sort_order: 1,
    status: true
  })

  const rules = reactive<FormRules>({
    menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    route: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
  })

  /**
   * 表单项配置
   */
  const formItems = computed<FormItem[]>(() => {
    const baseItems: FormItem[] = [{ label: '菜单类型', key: 'type', span: 24 }]
    const switchSpan = width.value < 640 ? 12 : 6

    const commonItems: FormItem[] = [
      { label: '菜单名称', key: 'menu_name', type: 'input', props: { placeholder: '菜单名称' } },
      {
        label: '排序',
        key: 'sort_order',
        type: 'number',
        props: { min: 0, style: { width: '100%' } }
      },
      {
        label: '是否启用',
        key: 'status',
        type: 'switch',
        span: switchSpan,
        props: { activeValue: true, inactiveValue: false }
      }
    ]

    if (form.menu_type === 'button') {
      // Button
      return [
        ...baseItems,
        ...commonItems,
        {
          label: '权限标识',
          key: 'permission_code',
          type: 'input',
          props: { placeholder: '如：system:user:add' }
        }
      ]
    }

    // Directory, Menu
    return [
      ...baseItems,
      ...commonItems,
      { label: '路由地址', key: 'route', type: 'input', props: { placeholder: '如：user' } },
      { label: '图标', key: 'icon', type: 'input', props: { placeholder: '如：ri:settings-line' } },
      {
        label: '权限标识',
        key: 'permission_code',
        type: 'input',
        props: { placeholder: '如：system:user:list' }
      }
    ]
  })

  const isEdit = computed(() => props.type === 'edit')

  const dialogTitle = computed(() => {
    return isEdit.value ? '编辑菜单' : '新增菜单'
  })

  /**
   * 重置表单数据
   */
  const resetForm = (): void => {
    formRef.value?.reset()
    Object.assign(form, {
      id: 0,
      parent_id: 0,
      menu_type: 'menu',
      menu_name: '',
      route: '',
      permission_code: '',
      icon: '',
      sort_order: 1,
      status: true
    })
  }

  /**
   * 加载表单数据
   */
  const loadFormData = (): void => {
    if (isEdit.value && props.editData) {
      // Map API data to form
      Object.assign(form, props.editData)
    } else {
      // Add mode
      form.parent_id = props.parentId || 0
    }
  }

  /**
   * 提交表单
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      if (isEdit.value) {
        await fetchUpdateMenu(form)
      } else {
        await fetchCreateMenu(form)
      }

      ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`)
      emit('submit')
      handleCancel()
    } catch {
      // Validation error
    }
  }

  /**
   * 取消操作
   */
  const handleCancel = (): void => {
    emit('update:visible', false)
  }

  /**
   * 对话框关闭后的回调
   */
  const handleClosed = (): void => {
    resetForm()
  }

  /**
   * 监听对话框显示状态
   */
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        nextTick(() => {
          loadFormData()
        })
      }
    }
  )
</script>
