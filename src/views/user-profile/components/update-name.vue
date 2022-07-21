<template>
  <div class="update-name">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>

    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfileAPI } from "@/api/user";

export default {
  name: "UpdateName",
  data() {
    return {
      // 注意不能让输入框直接绑定value，因为会直接修改prop里的数据，会报错
      localName: this.value,
    };
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message:'保存中...',
        forbidClick:true,
        duration:0
      })
      try {
        const localName = this.localName;
        if (!localName.length) {
          this.$toast("用户昵称不能为空！");
          return;
        }

        await updateUserProfileAPI({
          name: localName,
        });
        this.$emit("input", localName);
        this.$emit("close");
        this.$toast("更新用户昵称成功！");
      } catch (error) {
        this.$toast("更新昵称失败！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>