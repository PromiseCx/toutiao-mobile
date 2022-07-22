<template>
  <div class="cpmment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>
      <van-cell title="全部回复"></van-cell>
      <comment-list
        :source="comment.com_id"
        type="c"
        :list="commentList"
      ></comment-list>
    </div>

    <!-- add commentlist -->
    <div class="post-wrap">
      <van-button size="small" round class="post-btn" @click="isPostShow = true"
        >写评论</van-button
      >
      <van-popup v-model="isPostShow" position="bottom">
        <comment-post
          :target="comment.com_id"
          @post-success="onPostSuccess"
        ></comment-post>
      </van-popup>
    </div>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import CommentList from "./comment-list.vue";
import CommentPost from "./comment-post.vue";

export default {
  name: "CommentReply",
  data() {
    return {
      isPostShow: false,
      commentList: [],
    };
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onPostSuccess(data) {
      this.$emit("pdate-reply_count");
      this.isPostShow = false;
      this.commentList.unshift(data.new_obj);
    },
  },
};
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>