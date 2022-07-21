<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: value === 1 }"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>

<script>
import { addLikeAPI, deleteLikeAPI } from "@/api/article";

export default {
  name: "LikeArticle",
  data() {
    return {
      loading: false,
    };
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  methods: {
    async onCollect() {
      this.loading = true;
      try {
        let status = -1;
        if (this.value === 1) {
          await deleteLikeAPI(this.articleId);
        } else {
          await addLikeAPI(this.articleId);
          status = 1;
        }
        this.$emit("input", status);
        this.$toast.success(status === 1 ? "点赞成功" : "取消点赞");
      } catch (error) {
        this.$toast("操作失败，请重试！");
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>