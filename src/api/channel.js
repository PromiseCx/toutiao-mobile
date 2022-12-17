import request from '@/utils/request'

export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

export const addUserChannelAPI = channel => request({
  url: '/v1_0/user/channels',
  method: 'PATCH',
  data: {
    channels: [channel]
  }
})

export const deleteUserChannelAPI = channelId => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'delete'

})
