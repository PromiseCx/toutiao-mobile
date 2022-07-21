// 存储用户相关得请求模块
import request from "@/utils/request";

// axios内部，会将参数对象转成json字符串格式发给后台，
// axios内部，会自动携带参数（headers）里，Content-type：'applicatin/json'自动设置
export const loginAPI = data => request({
    url: "/v1_0/authorizations",
    method: "post",
    data
})

export const getAllChannelsAPI = () => request({
    url: '/v1_0/channels',
    method: 'get'
})


// 接口访问限制，一分钟只能发送一次
export const sendSmsAPI = mobile => request({
    url: `/v1_0/sms/codes/${mobile}`,
    method: "get",
})

export const getUserInfoAPI = () => request({
    url: "/v1_0/user",
    method: "get",
})

export const getUserChannelsAPI = () => request({
    url: "/v1_0/user/channels",
    method: "GET"

})

export const addFollowAPI = ({userId}) => request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
        target:userId
    }
})

export const deleteFollowAPI = target => request({
    url: `/v1_0/user/followings/${target}`,
    method: "DELETE"
})


export const getUserProfileAPI = target=>request({
    url:'/v1_0/user/profile',
    method:"get"
})

export const updateUserProfileAPI=data=>request({
    url:"v1_0/user/profile",
    method:"patch",
    data
})

export const upateUserPhotoAPI = data=>request({
    url:'/v1_0/user/photo',
    method:'patch',
    data
})

