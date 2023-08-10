import request from '@/utils/request';

export async function postAddress(val) {
  return request({
    url: '/faucet/nativeToken',
    method: 'post',
    data: {
      "net":"bxh",
      "address":val,
    }
  });
}