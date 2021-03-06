import Vue from 'vue'

const GET_WEBSITE_CONTENT_SUCCESS = 'GET_WEBSITE_CONTENT_SUCCESS'
const GET_WEBSITE_CONFIG_SUCCESS = 'GET_WEBSITE_CONFIG_SUCCESS'

export const props = {
  GET_WEBSITE_CONTENT_SUCCESS,
  GET_WEBSITE_CONFIG_SUCCESS
}

const mutations = {
  [GET_WEBSITE_CONTENT_SUCCESS](state, { fullPath, section, modList, content }) {
    Vue.set(state, 'websiteContents', {
      ...state.websiteContents,
      [fullPath]: {
        ...state.websiteContents[fullPath],
        modList,
        content
      }
    })
  },
  [GET_WEBSITE_CONFIG_SUCCESS](state, { projectName, config }) {
    Vue.set(state, 'websiteConfigs', {
      ...state.websiteConfigs,
      [projectName]: config
    })
  }
}

export default mutations
