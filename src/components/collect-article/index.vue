<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{ collected: value }"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>

<script>
import { addCollectAPI, deleteCollectAPI } from "@/api/article";

export default {
  name: "CollectArticle",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    articleId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onCollect() {
      this.loading = true;
      try {
        if (this.value) {
          await deleteCollectAPI(this.articleId);
        } else {
          await addCollectAPI(this.articleId);
        }

        // 自定义事件修改数据，不是立即的
        this.$emit("input", !this.value);
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏");
      } catch (error) {
        this.$toast("操作失败请重试！");
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>