import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  isShowLoginDialog: false,
  excellentProjects: [],
  allProjects: [],
  projects: [],
  projectApplyList: [],
  usersProjects: [],
  memberList: [],
  projectsFavoriteState: [],
  projectsStarState: [],
  myProjects: [],
  myContributeProjects: [],
  projectApplyState: {},
  commentList: [],
  projectsType: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
