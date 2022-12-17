<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          name="clear"
          slot="icon"
          v-show="isEdit && !fixedChannels.includes(channel.id)"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannelsAPI,
  addUserChannelAPI,
  deleteUserChannelAPI
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false,
      fixedChannels: [0]
    }
  },
  computed: {
    recommendChannels () {
      const channels = []
      this.allChannels.forEach((channel) => {
        const ret = this.myChannels.find((myChannels) => {
          return myChannels.id === channel.id
        })

        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    },
    ...mapState(['user'])
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannelsAPI()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('fail get Allchannels')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      // 未登录将数据存储到本地
      // 登录将数据请求接口放到线上
      if (this.user) {
        try {
          await addUserChannelAPI({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (error) {
          this.$toast('保存失败，请稍后再试！')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fixedChannels.includes(channel.id)) {
          return
        }

        // 根据计算属性会观测依赖数据的变化来自动计算数据，
        // 我的频道删除后会自动加入到推荐列表当中
        this.myChannels.splice(index, 1)

        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          await deleteUserChannelAPI(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        this.$toast('操作失败，请稍后再试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  .grid-item {
    width: 160px;
    height: 86px;

    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }

      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        z-index: 2;
        font-size: 30px;
        color: #cacaca;
      }
    }
  }

  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
