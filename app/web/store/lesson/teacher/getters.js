import _ from 'lodash'

const getters = {
  teacherPackageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  isShowHint: state => state.isShowHint,
  lessonData: state => state.lessonData,
  lessonDetail: state => state.lessonDetail,
  classroom: state => state.classroom,
  isBeInClass: (
    state,
    { classId, classroom },
    rootState,
    { 'lesson/userinfo': userinfo }
  ) => !!classId && classroom.userId === userinfo.id,
  isClassIsOver: (state, { classroom }) => classroom.state === 2,
  classroomId: (state, { classroom }) => classroom.key || '',
  learnRecords: state => state.learnRecords || null,
  classroomQuiz: state => state.classroomQuiz,
  userPackages: state => state.userPackages,
  userLessons: state => state.userLessons,
  packageLessons: state => state.packageLessons,
  classId: (state, { classroom }) => classroom.id,
  classroomLearnRecord: status => status.classroomLearnRecord
}

export default getters
