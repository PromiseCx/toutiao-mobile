<template>
  <div class="update-photo">
    <img :src="img" alt="img" class="img" ref="img" />

    <div class="toorbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { upateUserPhotoAPI } from "@/api/user";

export default {
  name: "UpdatePhoto",
  data() {
    return {
      cropper: null,
    };
  },
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
  methods: {
    onConfirm() {
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const formDate = new FormData();
        formDate.append("photo", blob);
        const { data } = await upateUserPhotoAPI(formDate);
        this.$emit('close');
        this.$emit('update-photo',data.data.photo);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toorbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}

.img {
  display: block;
  max-width: 100%;
}
</style>>

