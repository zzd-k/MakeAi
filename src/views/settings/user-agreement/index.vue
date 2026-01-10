<template>
  <div class="p-5">
    <div class="art-card p-6">
      <h3 class="text-lg font-semibold mb-6">{{ $t('pages.userAgreement.title') }}</h3>

      <div class="max-w-4xl">
        <!-- 富文本编辑器区域 -->
        <div class="border border-g-200 rounded-lg overflow-hidden">
          <Toolbar
            style="border-bottom: 1px solid var(--art-gray-200)"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>

        <!-- 保存按钮 -->
        <div class="mt-6">
          <ElButton type="primary" size="large" @click="handleSave">{{
            $t('pages.userAgreement.save')
          }}</ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { useI18n } from 'vue-i18n'
  import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

  defineOptions({ name: 'UserAgreementSetting' })

  const { t: $t } = useI18n()

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef<IDomEditor>()

  // 内容 HTML
  const valueHtml = ref('')

  // 模式
  const mode = 'default' // 或 'simple'

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      'headerSelect',
      '|',
      'bold',
      'italic',
      'underline',
      'through',
      'color',
      'bgColor',
      '|',
      'fontSize',
      'fontFamily',
      'lineHeight',
      '|',
      'bulletedList',
      'numberedList',
      'todo',
      '|',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyJustify',
      '|',
      'insertLink',
      'insertImage',
      'insertTable',
      'codeBlock',
      'divider',
      '|',
      'undo',
      'redo',
      '|',
      'fullScreen'
    ]
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: $t('pages.userAgreement.placeholder'),
    MENU_CONF: {
      // 配置上传图片
      uploadImage: {
        // 自定义上传
        async customUpload(file: File, insertFn: any) {
          // 这里可以实现图片上传到服务器的逻辑
          // 暂时使用本地预览
          const reader = new FileReader()
          reader.onload = (e) => {
            const url = e.target?.result as string
            insertFn(url, file.name, url)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }

  const handleSave = () => {
    console.log('保存协议', valueHtml.value)
    ElMessage.success($t('pages.userAgreement.saveSuccess'))
  }
</script>

<style scoped>
  /* 编辑器样式优化 */
  :deep(.w-e-toolbar) {
    background-color: var(--art-gray-50) !important;
    border: none !important;
  }

  :deep(.w-e-text-container) {
    background-color: var(--el-bg-color) !important;
  }

  :deep(.w-e-text-placeholder) {
    color: var(--el-text-color-placeholder) !important;
  }

  /* 深色模式适配 */
  html.dark :deep(.w-e-toolbar) {
    background-color: var(--art-gray-800) !important;
  }

  html.dark :deep(.w-e-bar-item button) {
    color: var(--art-gray-300) !important;
  }

  html.dark :deep(.w-e-bar-item button:hover) {
    background-color: var(--art-gray-700) !important;
  }

  html.dark :deep(.w-e-select-list) {
    background-color: var(--art-gray-800) !important;
    border-color: var(--art-gray-700) !important;
  }

  html.dark :deep(.w-e-select-list ul li) {
    color: var(--art-gray-300) !important;
  }

  html.dark :deep(.w-e-select-list ul li:hover) {
    background-color: var(--art-gray-700) !important;
  }

  html.dark :deep(.w-e-text-container [data-slate-editor]) {
    color: var(--art-gray-200) !important;
  }

  html.dark :deep(.w-e-bar-divider) {
    background-color: var(--art-gray-700) !important;
  }
</style>
