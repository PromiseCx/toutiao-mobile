<template>
  <div class="user-profile">
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <input type="file" hidden ref="file" @change="onFileChange" />

    <van-cell
      title="头像"
      is-link
      center
      class="photo-cell"
      @click="$refs.file.click()"
    >
      <van-image class="avator" fit="cover" round :src="user.photo">
      </van-image>
    </van-cell>

    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    ></van-cell>

    <van-popup
      style="height: 100%"
      v-model="isUpdateNameShow"
      position="bottom"
    >
      <update-name
        @close="isUpdateNameShow = false"
        v-model="user.name"
        v-if="isUpdateNameShow"
      ></update-name>
    </van-popup>

    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      ></update-gender>
    </van-popup>

    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      ></update-birthday>
    </van-popup>

    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfileAPI } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";

export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null,
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfileAPI();
        this.user = data.data;
      } catch (error) {
        this.$toast("获取失败！");
      }
    },
    onFileChange() {
      const file = this.$refs.file.files[0];
      this.img = window.URL.createObjectURL(file);
      this.isUpdatePhotoShow = true;

      // 如果选了同一个文件的话不会触发change事件，每次使用完毕后，都要把它的value清空
      this.$refs.file.value = "";
    },
  },
};
</script>

<style scoped lang="less">
.user-profile {
  .avator {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>