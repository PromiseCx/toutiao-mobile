<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    :loading="loading"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollowAPI, deleteFollowAPI } from "@/api/user";

export default {
  name: "FollowUSer",
  // 自定义v-model 的数据名称，默认为：value，input
  model: {
    prop: "isFollowed",
    event: "update-is_followed",
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onFollow() {
      this.loading = true;
      try {
        if (this.isFollowed) {
          await deleteFollowAPI(this.userId);
        } else {
          /**
           * ??  400 bad request ??
           * 自己不能关注自己 会报出400错误
           */
          await addFollowAPI({ userId: this.userId });
          this.$toast("关注成功！");
        }

        this.$emit("update-is_followed", !this.isFollowed);
      } catch (err) {
        console.log(err);
        let message = "操作失败，请重试！";
        if (err.response && err.response.status === 400) {
          message = "操作失败，用户不能自己关注自己！";
        }
        this.$toast(message);
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>