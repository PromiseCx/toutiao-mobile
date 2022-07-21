<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost" :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addCommentAPI } from "@/api/comment";
export default {
  name: "CommentPost",
  components: {},
  inject: {
    articleId: {
      type: [Number, String],
      default: null,
    },
  },
  props: {
    target: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true, // 禁用背景点击
        duration: 0, // 0 表示持续展示
      });
      try {
        const { data } = await addCommentAPI({
          target: this.target,
          content: this.message,
          art_id: this.articleId?this.articleId:null,
        });
        this.message = "";
        this.$emit("post-success", data.data);
        this.$toast("发布成功！");
      } catch (error) {
        this.$toast("操作失败，请重试！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
