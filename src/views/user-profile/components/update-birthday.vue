<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm='onConfirm'
    />
  </div>
</template>

<script>
import {updateUserProfileAPI} from "@/api/user"
import dayjs from "dayjs"

export default {
  name: "UpdateBirthday",
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods:{
    async onConfirm() {
        this.$toast.loading({
            message:"更新中...",
            forbidClick:true,
            duration:0
        });
        try {
            const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD');

             await updateUserProfileAPI({
                birthday:currentDate
           });
           this.$emit('input',currentDate);
           this.$emit('close');
           this.$toast.success('更新生日成功！');
        } catch (error) {
            this.$toast('更新生日失败！');
        }
    },
  }
};
</script>

<style scoped lang="less">
</style>