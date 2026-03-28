// 获取 Token
export function getToken() {
  return localStorage.getItem('token')
}

// 设置 Token
export function setToken(token) {
  localStorage.setItem('token', token)
}

// 删除 Token（退出登录）
export function removeToken() {
  localStorage.removeItem('token')
}