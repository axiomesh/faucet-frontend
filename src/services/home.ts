import request from '@/utils/request';

export async function postAddress(val: string) {
  return request({
    url: '/faucet/nativeToken',
    method: 'post',
    data: {
      net:"axm",
      address:val,
    }
  });
}


export async function directClaim(val: string) {
  return request({
    url: '/faucet/directClaim',
    method: 'post',
    data: {
      net:"aries",
      address:val,
    }
  });
}

export async function tweetClaim(val: string, url: string) {
  return request({
    url: '/faucet/tweetClaim',
    method: 'post',
    data: {
      net:"aries",
      address:val,
      tweetUrl: url,
    }
  });
}

// /faucet/preCheck

export async function preCheck(val: string) {
  return request({
    url: '/faucet/preCheck',
    method: 'post',
    data: {
      net:"aries",
      address:val,
    }
  });
}
