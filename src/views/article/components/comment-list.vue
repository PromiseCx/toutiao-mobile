<template>

<!-- 

    只有list在可视范围内才会检查滚动位置触发onload事件

 -->

 <!-- 
    immediate-check 解决评论回复重复问题：
        当点击评论回复时，此时组件被创建会触发created生命周期函数发送一次onload事件，
        此时list组件也在可视范围内部，也会触发一次onlload事件，
        此时触发两次onload事件，所以评论回复会重复
  -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :immediate-check="false"
    :error="error"
    error-text="加载失败，请稍后再试！"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>
 
<script>
import { getCommentsAPI } from "@/api/comment";
import CommentItem from "./comment-item.vue";

export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 用来获取下一页数据的标记
      limit: 10,
      error: false,
    };
  },
  props: {
    source: {
      type: [Number, String],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      validator(value) {
        return ['a','c'].includes(value)
      },
      default: 'a'
    },
  },
  created() {
    // 当手动初始化onload不会初始化loading，也要手动开启loading
    this.loading = false;
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getCommentsAPI({
          type: this.type,
          source: this.source,
          offset: this.offset,
          limit: this.limit,
        });
        const { results } = data.data;
        this.list.push(...results);
        this.$emit("onload-success", data.data);

        this.loading = false;

        if (results.length) {
          this.offset = data.data.last_id;
        } else {
          this.finished = true;
        }
      } catch (error) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style>
</style>