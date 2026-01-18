<template>
  <ElDialog v-model="visible" title="新建AI自我介绍" width="40%" @close="emitClose">
    <ElForm label-width="90px" class="space-y-3">
      <ElFormItem label="半身照片">
        <ElUpload :show-file-list="false" action="#" :before-upload="handleBeforeUpload">
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
        <ElFormItem label="音频文件">
          <ElUpload
            :limit="1"
            :show-file-list="true"
            action="#"
            accept="audio/*"
            :before-upload="handleAudioUpload"
            :file-list="audioFileList"
          >
            <ElButton size="small" type="primary">选择音频文件</ElButton>
          </ElUpload>
        </ElFormItem>
      </template>

      <template v-else>
        <ElFormItem label="语言种类">
          <ElSelect v-model="form.lang" placeholder="选择语言" class="w-60">
            <ElOption label="普通话" value="zh" />
            <ElOption label="粤语" value="yue" />
            <ElOption label="英语" value="en" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="人物音色">
          <ElSelect v-model="form.voice" placeholder="音色" class="w-60">
            <ElOption label="男声1" value="male1" />
            <ElOption label="男声2" value="male2" />
            <ElOption label="女声1" value="female1" />
            <ElOption label="女声2" value="female2" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="语气风格">
          <ElSelect v-model="form.tone" placeholder="语气" class="w-60">
            <ElOption label="专业" value="professional" />
            <ElOption label="友好" value="friendly" />
            <ElOption label="热情" value="enthusiastic" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="介绍内容" required>
          <ElInput
            type="textarea"
            v-model="form.text"
            :rows="4"
            maxlength="400"
            show-word-limit
            placeholder="请输入自我介绍内容"
          />
        </ElFormItem>
        <ElFormItem label="调整语速">
          <div class="w-full">
            <ElSlider v-model="form.speed" :min="0.5" :max="2" :step="0.1" :show-tooltip="true" />
            <div class="text-sm text-gray-500 mt-1">{{ form.speed }}x</div>
          </div>
        </ElFormItem>
        <ElFormItem label="调整语调">
          <div class="w-full">
            <ElSlider v-model="form.pitch" :min="-10" :max="10" :step="1" :show-tooltip="true" />
            <div class="text-sm text-gray-500 mt-1">{{ form.pitch }}</div>
          </div>
        </ElFormItem>
        <ElFormItem>
          <ElButton size="small" @click="handlePreview">
            <ArtSvgIcon icon="ri:play-circle-line" class="mr-1" />
            试读
          </ElButton>
        </ElFormItem>
      </template>
    </ElForm>
    <template #footer>
      <ElButton @click="visible = false">返回</ElButton>
      <ElButton type="primary" @click="handleSave" :loading="loading">{{
        loading ? '生成中...' : '马上生成'
      }}</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { createMeeting, uploadRecordAudio } from '@/api/records'
  import { startAnalysis, fetchAnalysisResult } from '@/api/analysis'
  import { ElMessage } from 'element-plus'
  import type { UploadFile } from 'element-plus'

  const props = defineProps<{ visible: boolean }>()
  const emit = defineEmits(['update:visible', 'save'])
  const visible = useVModel(props, 'visible', emit)

  const mode = ref<'upload' | 'tts'>('upload')
  const loading = ref(false)
  const audioFile = ref<File | null>(null)
  const audioFileList = ref<UploadFile[]>([])

  const form = reactive({
    thumb: '',
    lang: 'zh',
    voice: 'male1',
    tone: 'professional',
    text: '',
    speed: 1,
    pitch: 0
  })

  function handleBeforeUpload(file: File) {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      ElMessage.error('只能上传图片文件!')
      return false
    }
    form.thumb = URL.createObjectURL(file)
    return false
  }

  function handleAudioUpload(file: File) {
    const isAudio = file.type.startsWith('audio/')
    if (!isAudio) {
      ElMessage.error('只能上传音频文件!')
      return false
    }
    audioFile.value = file
    audioFileList.value = [{ name: file.name, url: '' } as UploadFile]
    return false
  }

  async function handleSave() {
    try {
      loading.value = true

      if (mode.value === 'upload') {
        // 上传音频文件模式
        if (!audioFile.value) {
          ElMessage.warning('请选择音频文件')
          return
        }

        // 1. 创建会议记录
        const meeting = await createMeeting({
          title: 'AI自我介绍',
          description: 'AI自我介绍'
        })

        // 2. 上传音频文件
        const formData = new FormData()
        formData.append('file', audioFile.value)
        await uploadRecordAudio(meeting.id, formData)

        // 3. 开始AI分析
        await startAnalysis(meeting.id)

        // 4. 等待分析结果（轮询）
        const result = await pollAnalysisResult(meeting.id)

        emit('save', {
          id: meeting.id,
          title: 'AI自我介绍',
          thumb: form.thumb || 'https://placehold.co/300x180',
          audioUrl: result.audio_url,
          transcript: result.transcript
        })

        ElMessage.success('AI自我介绍生成成功！')
      } else {
        // TTS文本生成模式
        if (!form.text.trim()) {
          ElMessage.warning('请输入介绍内容')
          return
        }

        // TODO: 调用TTS接口生成音频
        ElMessage.info('TTS功能开发中')

        emit('save', {
          id: Date.now(),
          title: 'AI自我介绍',
          thumb: form.thumb || 'https://placehold.co/300x180',
          text: form.text
        })
      }

      visible.value = false
    } catch (error: any) {
      console.error('生成AI自我介绍失败:', error)
      ElMessage.error(error?.message || '生成失败，请重试')
    } finally {
      loading.value = false
    }
  }

  // 轮询分析结果
  async function pollAnalysisResult(recordId: number, maxAttempts = 30): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 等待2秒

      try {
        const result = await fetchAnalysisResult(recordId)
        if (result && result.status === 'completed') {
          return result
        }
      } catch (error) {
        console.log('等待分析完成...', i + 1)
      }
    }
    throw new Error('分析超时，请稍后查看')
  }

  function emitClose() {
    emit('update:visible', false)
  }

  // 试读功能
  function handlePreview() {
    if (!form.text.trim()) {
      ElMessage.warning('请先输入介绍内容')
      return
    }
    ElMessage.info('试读功能开发中...')
    // TODO: 调用TTS接口预览音频
  }
</script>
