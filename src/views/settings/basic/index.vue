<template>
  <div class="p-5">
    <div class="art-card p-6">
      <h3 class="text-lg font-semibold mb-6">{{ $t('pages.basicSettings.title') }}</h3>

      <ElForm :model="form" label-width="120px" class="max-w-3xl">
        <ElFormItem :label="$t('pages.basicSettings.servicePhone')">
          <ElInput
            v-model="form.servicePhone"
            :placeholder="$t('pages.basicSettings.placeholder')"
            style="max-width: 400px"
          />
        </ElFormItem>

        <ElFormItem :label="$t('pages.basicSettings.pointsRule')">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <ElInputNumber v-model="form.pointsRule" :min="1" :max="100" />
              <span class="text-g-600">{{ $t('pages.basicSettings.perTime') }}</span>
            </div>
            <span class="text-sm text-g-500">
              {{ $t('pages.basicSettings.pointsRuleDesc') }}
            </span>
          </div>
        </ElFormItem>

        <ElFormItem :label="$t('pages.basicSettings.siteName')">
          <ElInput
            v-model="form.siteName"
            :placeholder="$t('pages.basicSettings.placeholder')"
            style="max-width: 400px"
          />
          <div class="text-sm text-g-500 mt-2">
            {{ $t('pages.basicSettings.siteNameDesc') }}
          </div>
        </ElFormItem>

        <ElFormItem :label="$t('pages.basicSettings.siteDescription')">
          <ElInput
            v-model="form.siteDescription"
            type="textarea"
            :rows="6"
            :placeholder="$t('pages.basicSettings.placeholder')"
            style="max-width: 600px"
          />
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" size="large" @click="handleSave">{{
            $t('pages.basicSettings.save')
          }}</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'

  defineOptions({ name: 'BasicSetting' })

  const { t: $t } = useI18n()

  interface SettingForm {
    servicePhone: string
    pointsRule: number
    siteName: string
    siteDescription: string
  }

  const form = reactive<SettingForm>({
    servicePhone: '',
    pointsRule: 1,
    siteName: '',
    siteDescription: ''
  })

  const handleSave = () => {
    console.log('保存设置', form)
    ElMessage.success($t('pages.basicSettings.saveSuccess'))
  }
</script>
