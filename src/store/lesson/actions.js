import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGE_DETAIL_SUCCESS
} = props

const actions = {
  async getUserDetail(context, { token }) {
    let { commit, rootGetters: { 'user/authRequestConfig': authRequestConfig } } = context
    let authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : authRequestConfig
    let userLessonInfo = await lesson.users.getUserDetail(null, authConfig)
    commit(GET_USER_INFO_SUCCESS, userLessonInfo)
  },
  async getPackageDetail(context, { packageId }) {
    let { commit, rootGetters: { 'user/authRequestConfig': config } } = context
    let detail = await lesson.packages.packageDetail({
      packageId,
      config
    })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async subscribePackage(context, { packageId }) {
    let { rootGetters: { 'user/authRequestConfig': config } } = context
    let subscribeResult = await lesson.packages.subscribe({
      packageId,
      config
    })
    return subscribeResult
  }
}

export default actions