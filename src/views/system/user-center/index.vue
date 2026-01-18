<!-- 个人中心页面 -->
<template>
  <div class="w-full h-full p-0 bg-transparent border-none shadow-none">
    <div class="relative flex-b mt-2.5 max-md:block max-md:mt-1">
      <div class="w-112 mr-5 max-md:w-full max-md:mr-0">
        <div class="art-card-sm relative p-9 pb-6 overflow-hidden text-center">
          <img class="absolute top-0 left-0 w-full h-50 object-cover" src="@imgs/user/bg.webp" />
          <div class="relative z-10 mt-30 mx-auto w-20 h-20">
            <img
              class="w-full h-full object-cover border-2 border-white rounded-full cursor-pointer"
              :src="userInfo?.avatar || '@imgs/user/avatar.webp'"
              @click="handleAvatarClick"
            />
            <input
              ref="avatarInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              @click="handleAvatarClick"
            >
              <ArtSvgIcon icon="ri:camera-line" class="text-white text-2xl" />
            </div>
          </div>
          <h2 class="mt-5 text-xl font-normal">{{ userInfo?.username || '未设置' }}</h2>
          <p class="mt-5 text-sm">{{ userInfo?.nickname || '暂无个人简介' }}</p>

          <div class="w-75 mx-auto mt-7.5 text-left">
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:mail-line" class="text-g-700" />
              <span class="ml-2 text-sm">{{ userInfo?.email || '未设置邮箱' }}</span>
            </div>
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:user-3-line" class="text-g-700" />
              <span class="ml-2 text-sm">用户ID: {{ userInfo?.id }}</span>
            </div>
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:calendar-line" class="text-g-700" />
              <span class="ml-2 text-sm">注册时间: {{ formatDate(userInfo?.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-hidden max-md:w-full max-md:mt-3.5">
        <div class="art-card-sm">
          <h1 class="p-4 text-xl font-normal border-b border-g-300">基本设置</h1>

          <ElForm
            :model="form"
            class="box-border p-5"
            ref="formRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <ElFormItem label="用户名" prop="username">
              <ElInput v-model="form.username" :disabled="!isEdit" />
            </ElFormItem>

            <ElFormItem label="昵称" prop="nickname">
              <ElInput v-model="form.nickname" :disabled="!isEdit" />
            </ElFormItem>

            <ElFormItem label="邮箱" prop="email">
              <ElInput v-model="form.email" :disabled="!isEdit" />
            </ElFormItem>

            <div class="flex-c justify-end [&_.el-button]:!w-27.5">
              <ElButton
                v-if="!isEdit"
                type="primary"
                class="w-22.5"
                v-ripple
                @click="isEdit = true"
              >
                编辑
              </ElButton>
              <template v-else>
                <ElButton class="w-22.5" @click="handleCancel">取消</ElButton>
                <ElButton
                  type="primary"
                  class="w-22.5"
                  v-ripple
                  @click="handleSave"
                  :loading="saveLoading"
                >
                  保存
                </ElButton>
              </template>
            </div>
          </ElForm>
        </div>

        <div class="art-card-sm my-5">
          <h1 class="p-4 text-xl font-normal border-b border-g-300">更改密码</h1>

          <ElForm
            :model="pwdForm"
            class="box-border p-5"
            ref="pwdFormRef"
            :rules="pwdRules"
            label-width="86px"
            label-position="top"
          >
            <ElFormItem label="当前密码" prop="old_password">
              <ElInput
                v-model="pwdForm.old_password"
                type="password"
                :disabled="!isEditPwd"
                show-password
                placeholder="请输入当前密码"
              />
            </ElFormItem>

            <ElFormItem label="新密码" prop="new_password">
              <ElInput
                v-model="pwdForm.new_password"
                type="password"
                :disabled="!isEditPwd"
                show-password
                placeholder="请输入新密码"
              />
            </ElFormItem>

            <ElFormItem label="确认新密码" prop="confirm_password">
              <ElInput
                v-model="pwdForm.confirm_password"
                type="password"
                :disabled="!isEditPwd"
                show-password
                placeholder="请再次输入新密码"
              />
            </ElFormItem>

            <div class="flex-c justify-end [&_.el-button]:!w-27.5">
              <ElButton
                v-if="!isEditPwd"
                type="primary"
                class="w-22.5"
                v-ripple
                @click="isEditPwd = true"
              >
                编辑
              </ElButton>
              <template v-else>
                <ElButton class="w-22.5" @click="handleCancelPwd">取消</ElButton>
                <ElButton
                  type="primary"
                  class="w-22.5"
                  v-ripple
                  @click="handleSavePwd"
                  :loading="pwdLoading"
                >
                  保存
                </ElButton>
              </template>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { fetchUserMe, updateUserMe, uploadUserAvatar, updateUserPassword } from '@/api/user'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'

  defineOptions({ name: 'UserCenter' })

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const saveLoading = ref(false)
  const pwdLoading = ref(false)
  const formRef = ref<FormInstance>()
  const pwdFormRef = ref<FormInstance>()
  const avatarInputRef = ref<HTMLInputElement>()
  const userInfo = ref<Api.User.Me | null>(null)

  /**
   * 用户信息表单
   */
  const form = reactive({
    username: '',
    nickname: '',
    email: ''
  })

  /**
   * 密码修改表单
   */
  const pwdForm = reactive({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
  })

  /**
   * 密码表单验证规则
   */
  const pwdRules = reactive<FormRules>({
    old_password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    new_password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
    ],
    confirm_password: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== pwdForm.new_password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  })

  /**
   * 获取用户信息
   */
  const fetchUserInfo = async () => {
    try {
      const data = await fetchUserMe()
      userInfo.value = data
      // 填充表单
      form.username = data.username
      form.nickname = data.nickname || ''
      form.email = data.email || ''
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  }

  /**
   * 保存用户信息
   */
  const handleSave = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      saveLoading.value = true
      try {
        const data = await updateUserMe({
          username: form.username,
          nickname: form.nickname || undefined,
          email: form.email || undefined
        })
        userInfo.value = data
        isEdit.value = false
        ElMessage.success('保存成功')
      } catch (error) {
        console.error('保存失败:', error)
      } finally {
        saveLoading.value = false
      }
    })
  }

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    isEdit.value = false
    // 恢复原始数据
    if (userInfo.value) {
      form.username = userInfo.value.username
      form.nickname = userInfo.value.nickname || ''
      form.email = userInfo.value.email || ''
    }
  }

  /**
   * 保存密码
   */
  const handleSavePwd = async () => {
    if (!pwdFormRef.value) return

    await pwdFormRef.value.validate(async (valid) => {
      if (!valid) return

      pwdLoading.value = true
      try {
        await updateUserPassword({
          old_password: pwdForm.old_password,
          new_password: pwdForm.new_password
        })
        isEditPwd.value = false
        // 清空表单
        pwdForm.old_password = ''
        pwdForm.new_password = ''
        pwdForm.confirm_password = ''
        ElMessage.success('密码修改成功')
      } catch (error) {
        console.error('密码修改失败:', error)
      } finally {
        pwdLoading.value = false
      }
    })
  }

  /**
   * 取消密码编辑
   */
  const handleCancelPwd = () => {
    isEditPwd.value = false
    pwdForm.old_password = ''
    pwdForm.new_password = ''
    pwdForm.confirm_password = ''
    pwdFormRef.value?.clearValidate()
  }

  /**
   * 点击头像触发文件选择
   */
  const handleAvatarClick = () => {
    avatarInputRef.value?.click()
  }

  /**
   * 处理头像文件选择
   */
  const handleAvatarChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件')
      return
    }

    // 验证文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过5MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // 上传头像
      const url = await uploadUserAvatar(formData)

      // 更新用户信息
      if (userInfo.value) {
        userInfo.value.avatar = url
      }

      ElMessage.success('头像上传成功')

      // 清空input，允许重复选择同一文件
      target.value = ''
    } catch (error) {
      console.error('头像上传失败:', error)
      ElMessage.error('头像上传失败')
    }
  }

  /**
   * 格式化日期
   */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  onMounted(() => {
    fetchUserInfo()
  })
</script>
