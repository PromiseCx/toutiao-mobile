<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item,index)"
    >
      <van-icon name="close" v-show="isDeleteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  data() {
    return {
      isDeleteShow: false,
    };
  },
  /**
   * prop 数据 只读属性
   * 1.如果是普通数据（数字，字符串，布尔值）绝对不能修改，修改了也不会传给父组件
   * 2.如果是引用类型数据，可以修改但不可以重新赋值
   */
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  methods:{
    onSearchItemClick(item,index) {
      if(this.isDeleteShow) {
        // 删除状态
        this.searchHistories.splice(index,1);
      }else {
        // 非删除状态
        this.$emit('search',item);
      }
    }
  }
};
</script>

<style scoped lang="less">
</style>
