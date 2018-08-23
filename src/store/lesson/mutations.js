import Vue from 'vue'

const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS'
const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const GET_USER_PACKAGES_SUCCESS = 'GET_USER_PACKAGES_SUCCESS'
const GET_ALL_SUBJECTS_SUCCESS = 'GET_ALL_SUBJECTS_SUCCESS'

export const props = {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_USER_PACKAGES_SUCCESS,
  GET_ALL_SUBJECTS_SUCCESS
}

const mutations = {
  [GET_USER_INFO_SUCCESS](state, userDetailInfo) {
    Vue.set(state, 'userinfo', userDetailInfo)
  },
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'packagesDetail', {
      ...state.packagesDetail,
      [detail.id]: detail
    })
  },
  [GET_USER_PACKAGES_SUCCESS](state, { userPackages }) {
    Vue.set(state, 'userPackages', userPackages)
  },
  [GET_ALL_SUBJECTS_SUCCESS](state, { subjects }) {
    Vue.set(state, 'subjects', subjects)
  }
}

export default mutations