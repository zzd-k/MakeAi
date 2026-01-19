<!-- 系统logo -->
<template>
  <div class="flex-cc">
    <img :style="logoStyle" :src="logoSrc" alt="logo" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import MakeAIlogo from '@imgs/common/MakeAIlogo.png'
  import whitelogo from '@imgs/common/whitelogo.png'

  defineOptions({ name: 'ArtLogo' })

  interface Props {
    /** logo 大小 */
    size?: number | string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 36
  })

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  const logoStyle = computed(() => ({ width: `${props.size}px` }))

  // 根据主题切换 logo
  const logoSrc = computed(() => {
    return isDark.value ? whitelogo : MakeAIlogo
  })
</script>
