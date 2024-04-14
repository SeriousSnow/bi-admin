import request from '@/utils/request'
import http from '@/utils/http'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}

export function getUserList(data) {
  return http({
    url: '/api/auth/user/list/page',
    method: 'post',
    data,
  })
}

export function setStatus(data) {
  return http({
    url: '/api/auth/user/changeStatus',
    method: 'post',
    data,
  })
}
