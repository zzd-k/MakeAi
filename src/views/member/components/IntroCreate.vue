<template>
  <ElDialog v-model="visible" title="新建自我介绍" width="40%" @close="emitClose">
    <ElForm label-width="90px" class="space-y-3">
      <ElFormItem label="半身照片">
        <ElUpload :show-file-list="false" action="#" :on-success="handleAvatarSuccess">
          <img v-if="form.thumb" :src="form.thumb" class="w-24 h-32 object-cover" />
          <ElButton v-else size="small">上传图片</ElButton>
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="选择音频">
        <ElRadioGroup v-model="mode">
          <ElRadio label="upload">上传文件</ElRadio>
          <ElRadio label="tts">文本生成</ElRadio>
        </ElRadioGroup>
      </ElFormItem>

      <template v-if="mode === 'upload'">
        <ElUpload :limit="1" :show-file-list="true" action="#" />
      </template>

      <template v-else>
        <ElFormItem label="语言种类">
          <ElSelect v-model="form.lang" placeholder="选择语言" class="w-60">
            <ElOption label="普通话" value="zh" />
            <ElOption label="粤语" value="yue" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="人物音色">
          <ElSelect v-model="form.voice" placeholder="音色" class="w-60" />
        </ElFormItem>
        <ElFormItem label="语气风格">
          <ElSelect v-model="form.tone" placeholder="语气" class="w-60" />
        </ElFormItem>
        <ElFormItem label="介绍内容" required>
          <ElInput type="textarea" v-model="form.text" :rows="4" maxlength="400" show-word-limit />
        </ElFormItem>
      </template>
    </ElForm>
    <template #footer>
      <ElButton @click="visible = false">返回</ElButton>
      <ElButton type="primary" @click="handleSave">马上生成</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  const props = defineProps<{ visible: boolean }>()
  const emit = defineEmits(['update:visible', 'save'])
  const visible = useVModel(props, 'visible', emit)

  const mode = ref<'upload' | 'tts'>('upload')
  const form = reactive({ thumb: '', lang: '', voice: '', tone: '', text: '' })

  function handleAvatarSuccess(_: any, f: any) {
    form.thumb = URL.createObjectURL(f.raw)
  }
  function handleSave() {
    emit('save', {
      id: Date.now(),
      title: '新视频',
      thumb: form.thumb || 'https://placehold.co/300x180'
    })
    visible.value = false
  }
  function emitClose() {
    emit('update:visible', false)
  }
</script>
