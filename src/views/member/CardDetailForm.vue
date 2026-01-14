<template>
  <ElDialog :model-value="visible" :title="dialogTitle" width="80%" @close="emitClose">
    <ElTabs v-model="activeTab" class="mb-6">
      <ElTabPane label="基础设置" name="basic" />
      <ElTabPane label="联系方式" name="contact">
        <ContactTab v-model="form.contacts" />
      </ElTabPane>
      <ElTabPane label="产品" name="product" />
      <ElTabPane label="动态" name="trend" />
      <ElTabPane label="主题" name="theme" />
    </ElTabs>

    <!-- 基础设置 TAB -->
    <div v-show="activeTab === 'basic'" class="grid grid-cols-2 gap-10">
      <!-- 左列 -->
      <ElForm :model="form" label-width="100px" ref="formRef" class="flex flex-col gap-6">
        <!-- 称谓/职位/姓名 -->
        <div class="grid grid-cols-2 gap-4">
          <ElFormItem label="称谓">
            <ElInput v-model="form.title" placeholder="请输入" />
          </ElFormItem>
          <ElFormItem label="职位">
            <ElInput v-model="form.position" placeholder="请输入" />
          </ElFormItem>
          <ElFormItem label="中文姓氏">
            <ElInput v-model="form.lastNameZh" placeholder="请输入" />
          </ElFormItem>
          <ElFormItem label="中文名字">
            <ElInput v-model="form.firstNameZh" placeholder="请输入" />
          </ElFormItem>
          <ElFormItem label="英文姓氏">
            <ElInput v-model="form.lastNameEn" placeholder="请输入" />
          </ElFormItem>
          <ElFormItem label="英文名字">
            <ElInput v-model="form.firstNameEn" placeholder="请输入" />
          </ElFormItem>
        </div>
        <!-- 关于我 -->
        <ElFormItem label="关于我">
          <ElInput type="textarea" :rows="4" v-model="form.about" placeholder="请输入" />
        </ElFormItem>
        <!-- 公司信息 -->
        <div class="grid grid-cols-2 gap-4">
          <ElFormItem label="公司名称">
            <ElInput v-model="form.company" placeholder="公司名称" />
          </ElFormItem>
          <ElFormItem label="公司标志">
            <ElUpload :show-file-list="false" action="#" :on-success="handleLogoSuccess">
              <img
                v-if="form.companyLogo"
                :src="form.companyLogo"
                class="w-20 h-20 object-cover rounded"
              />
              <ElButton v-else size="small" type="primary">上传公司标志</ElButton>
            </ElUpload>
          </ElFormItem>
        </div>
        <!-- 行业类别 -->
        <ElFormItem label="行业类别" class="mb-4">
          <div class="flex flex-wrap gap-2 items-center">
            <ElTag
              v-for="(tag, idx) in form.industryTags"
              :key="tag + idx"
              closable
              @close="removeIndustry(idx)"
            >
              {{ tag }}
            </ElTag>
            <ElInput
              v-if="addIndustryInput"
              v-model="industryInput"
              size="small"
              class="w-28"
              @keyup.enter="confirmIndustry"
              @blur="confirmIndustry"
            />
            <ElButton v-else size="small" type="primary" @click="addIndustryInput = true"
              >添加</ElButton
            >
          </div>
        </ElFormItem>

        <!-- 职位 -->
        <ElFormItem label="职位">
          <div class="w-full">
            <div
              v-for="(p, idx) in form.positions"
              :key="idx"
              class="border border-g-200 rounded p-3 pr-10 mb-3 relative flex flex-col gap-2"
            >
              <ElButton
                type="text"
                class="absolute top-2 right-2"
                @click="form.positions.splice(idx, 1)"
                >×</ElButton
              >
              <ElInput v-model="p.title" placeholder="职位">
                <template #prepend>职位</template>
              </ElInput>
              <ElInput v-model="p.company" placeholder="公司">
                <template #prepend>公司</template>
              </ElInput>
            </div>
            <ElButton size="small" type="primary" @click="addPosition">添加</ElButton>
          </div>
        </ElFormItem>

        <!-- 合作伙伴 -->
        <ElFormItem label="合作伙伴">
          <div class="w-full">
            <div
              v-for="(c, idx) in form.partners"
              :key="idx"
              class="border border-g-200 rounded p-3 pr-10 mb-3 relative flex items-center gap-2"
            >
              <ElButton
                type="text"
                class="absolute top-2 right-2"
                @click="form.partners.splice(idx, 1)"
                >×</ElButton
              >
              <ElUpload
                :show-file-list="false"
                action="#"
                :on-success="(r, f) => updatePartnerLogo(idx, f)"
              >
                <img v-if="c.logo" :src="c.logo" class="w-10 h-10 object-cover rounded" />
                <ElButton v-else size="small">上传</ElButton>
              </ElUpload>
              <ElInput v-model="c.name" placeholder="合作伙伴名称" />
            </div>
            <ElButton size="small" type="primary" @click="addPartner">添加</ElButton>
          </div>
        </ElFormItem>

        <!-- 兴趣标签（固定 + 自定义） -->
        <ElFormItem label="兴趣标签">
          <div class="flex flex-wrap gap-2 items-center">
            <ElTag v-for="(tag, idx) in defaultInterests" :key="'d' + idx" type="info">
              {{ tag }}
            </ElTag>
            <ElTag
              v-for="(tag, idx) in form.interests"
              :key="'c' + idx"
              closable
              @close="removeInterest(idx)"
            >
              {{ tag }}
            </ElTag>
            <ElInput
              v-if="addInterestInput"
              v-model="interestInput"
              size="small"
              class="w-28"
              @keyup.enter="confirmInterest"
              @blur="confirmInterest"
            />
            <ElButton v-else size="small" type="primary" @click="addInterestInput = true"
              >添加</ElButton
            >
          </div>
        </ElFormItem>
      </ElForm>

      <!-- 右列 -->
      <div class="space-y-4">
        <p class="font-semibold">横版名片</p>
        <ElUpload
          class="w-full h-40 border border-dashed flex items-center justify-center"
          :show-file-list="false"
          action="#"
          :on-success="handleBannerSuccess"
        >
          <img v-if="form.banner" :src="form.banner" class="w-full h-full object-cover" />
          <ElIcon v-else><UploadFilled /></ElIcon>
        </ElUpload>
        <div class="space-x-3">
          <span class="font-semibold">自我介绍</span>
          <ElButton size="small" @click="handleAddIntroImg">添加照片</ElButton>
          <ElButton size="small" @click="handleAddIntroVideo">添加AI自我介绍</ElButton>
        </div>
      </div>
    </div>

    <template #footer>
      <ElButton @click="emitClose">取消</ElButton>
      <ElButton type="primary" @click="save">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { UploadFilled } from '@element-plus/icons-vue'
  import ContactTab from './components/ContactTab.vue'
  import { ElMessage } from 'element-plus'

  defineProps<{ visible: boolean; dialogTitle: string }>()
  const emit = defineEmits(['update:visible', 'save'])
  const activeTab = ref('basic')

  interface PositionItem {
    title: string
    company: string
  }
  interface PartnerItem {
    logo: string
    name: string
  }

  interface ContactItem {
    id: number
    type: string
    label: string
    value: string
    extra?: string
  }

  interface CardForm {
    title: string
    position: string
    lastNameZh: string
    firstNameZh: string
    lastNameEn: string
    firstNameEn: string
    about: string
    company: string
    companyLogo: string
    banner: string
    industryTags: string[]
    interests: string[]
    positions: PositionItem[]
    partners: PartnerItem[]
    contacts: ContactItem[]
  }

  const defaultInterests = [
    '旅行',
    '摄影',
    '阅读',
    '音乐',
    '电影',
    '美食',
    '烹饪',
    '健身',
    '瑜伽',
    '跑步',
    '登山',
    '游戏',
    '绘画',
    '书法',
    '手工艺',
    '园艺',
    '电竞',
    '动画',
    '收藏',
    '写作',
    '舞蹈',
    '唱歌',
    '乐器演奏',
    '户外探险',
    '滑雪',
    '钓鱼',
    '潜水',
    '科技',
    '程式设计',
    '宠物饲养'
  ]

  const form = reactive<CardForm>({
    title: '',
    position: '',
    lastNameZh: '',
    firstNameZh: '',
    lastNameEn: '',
    firstNameEn: '',
    about: '',
    company: '',
    companyLogo: '',
    banner: '',
    industryTags: [],
    interests: [],
    positions: [],
    partners: [],
    contacts: []
  })

  // tag inputs
  const addIndustryInput = ref(false)
  const industryInput = ref('')
  const confirmIndustry = () => {
    if (industryInput.value.trim()) form.industryTags.push(industryInput.value.trim())
    addIndustryInput.value = false
    industryInput.value = ''
  }
  const removeIndustry = (i: number) => form.industryTags.splice(i, 1)

  const addInterestInput = ref(false)
  const interestInput = ref('')
  const confirmInterest = () => {
    if (interestInput.value.trim()) form.interests.push(interestInput.value.trim())
    addInterestInput.value = false
    interestInput.value = ''
  }
  const removeInterest = (i: number) => form.interests.splice(i, 1)

  // lists
  const addPosition = () => form.positions.push({ title: '', company: '' })
  const addPartner = () => form.partners.push({ logo: '', name: '' })
  const updatePartnerLogo = (idx: number, file: any) => {
    form.partners[idx].logo = URL.createObjectURL(file.raw)
  }

  // uploads
  const handleLogoSuccess = (r: any, f: any) => {
    form.companyLogo = URL.createObjectURL(f.raw)
  }
  const handleBannerSuccess = (r: any, f: any) => {
    form.banner = URL.createObjectURL(f.raw)
  }

  const handleAddIntroImg = () => ElMessage.info('TODO 添加照片')
  const handleAddIntroVideo = () => ElMessage.info('TODO AI介绍')

  const save = () => {
    emit('save', JSON.parse(JSON.stringify(form)))
    emit('update:visible', false)
  }
  const emitClose = () => emit('update:visible', false)
</script>

<style scoped>
  .border-g-200 {
    border-color: #e5e7eb;
  }
</style>
