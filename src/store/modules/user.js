import {login, logout, getInfo, getRegulatorInfo} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
import Cookies from "js-cookie";

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      regulator: {},
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            setToken(res.token)
            this.token = res.token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            const user = res.user
            const userId = res.user.userId
            if (res.user.roles[0].roleId === 100){
              getRegulatorInfo({
                userId: userId
              }).then(res => {
                if (res.code == 200){
                  Cookies.set("regulator",JSON.stringify(res.regulator));

                  //  获取当前的机构地址
                  // var regulator = JSON.parse(Cookies.get("regulator"));
                  // console.log(regulator)
                }
              })
            }
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.avatar = avatar;
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            Cookies.remove("regulator")
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useUserStore
