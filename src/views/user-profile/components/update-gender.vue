<template>
  <div class="udpate-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfileAPI } from '@/api/user'

export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const localGender = this.localGender

        await updateUserProfileAPI({
          gender: localGender
        })
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('更新性别成功！')
      } catch (error) {
        this.$toast('更新性别失败！')
      }
    },
    onChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less">
</style>
