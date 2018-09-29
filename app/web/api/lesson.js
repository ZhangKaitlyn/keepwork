/*doc
---
title: API
name: Lesson API
category: API
---
*/
import createEndpoint from './common/endpoint'

export const endpoint = createEndpoint({
  baseURL: process.env.LESSON_API_PREFIX
})

export const { get, post, put, 'delete': deleteMethod } = endpoint

export const admin = {}

export const packages = {
  create: async ({ newPackageData }) => post('packages', newPackageData),
  update: async ({ updatingPackageData }) => put(`packages/${updatingPackageData.id}`, updatingPackageData),
  getUserPackages: async () => get('packages'),
  getHotsPackages: async () => get('packages/hots'),
  packagesList: async ({ perPage, page }) => get(`packages/search?x-per-page=${perPage}&x-page=${page}&x-order=auditAt-desc`),
  packageDetail: async ({ packageId }) => get(`packages/${packageId}/detail`),
  subscribe: async ({ packageId }) => post(`packages/${packageId}/subscribe`),
  getTaughtPackages: async () => get('packages/teach'),
  audit: async ({ packageId, state }) => post(`packages/${packageId}/audit`, { state }),
  release: async ({ packageDetail }) => put(`packages/${packageDetail.id}`, packageDetail),
  destroy: async ({ packageId }) => deleteMethod(`packages/${packageId}`),
  addLesson: async ({ packageId, lessonId }) => post(`packages/${packageId}/lessons`, { lessonId }),
  removeLesson: async ({ packageId, lessonId }) => {
    return deleteMethod(`packages/${packageId}/lessons?lessonId=${lessonId}`)
  },
  getLessonList: async ({ packageId }) => get(`packages/${packageId}/lessons`)
}

export const lessons = {
  create: async ({ newLessonData }) => post('lessons', newLessonData),
  update: async ({ updatingData }) => put(`lessons/${updatingData.id}`, updatingData),
  release: async ({ id, content }) => post(`lessons/${id}/contents`, { content }),
  getUserLessons: async () => get('lessons'),
  lessonContent: async ({ lessonId }) => get(`lessons/${lessonId}/contents`),
  lessonDetail: async ({ lessonId }) => get(`lessons/${lessonId}/detail`),
  lessonDetailByUrl: async ({ url }) => get(`lessons/detail?url=${url}`),
  rewardCoin: async ({ id }) => post(`learnRecords/${id}/reward`),
  isReward: async ({ packageId, lessonId }) => get(`learnRecords/isReward?packageId=${packageId}&lessonId=${lessonId}`),
  destroy: async ({ lessonId }) => deleteMethod(`lessons/${lessonId}`),
  lessonContentByVersion: async ({ lessonId, version = 1 }) =>
    get(`lessons/${lessonId}/contents?version=${version}`),
  getSkills: async ({ lessonId }) => get(`lessons/${lessonId}/skills`),
  learnRecords: async ({ lessonId }) => get(`lessons/${lessonId}/learnRecords`)
}

export const users = {
  getUserDetail: () => get('users'),
  userSubscribes: args => get(`users/${args.userId}/subscribes`),
  userSkills: args => get(`users/${args.userId}/skills`),
  toBeTeacher: ({ userId, key, config }) =>
    post(`users/${userId}/teacher`, { key }, config),
  getTeachingRecords: async () => get('packages'),
  setNickname: ({ nickname, id }) => put(`users/${id}`, { nickname }),
  uploadSelfLearnRecords: (id, payload) => put(`learnRecords/${id}`, payload),
  createLearnRecords: payload => post('learnRecords', payload)
}

export const classrooms = {
  join: payload => post('classrooms/join', payload),
  begin: ({ payload, config }) => post('classrooms', payload, config),
  leave: () => post('classrooms/quit'),
  getTeachingListing: async () => get('classrooms'),
  currentClass: () => get('classrooms/current'),
  learnRecordsById: id => get(`learnRecords/${id}`),
  getClassroomById: id => get(`classrooms/${id}`),
  dismiss: ({ classId, config }) =>
    put(`classrooms/${classId}/dismiss`, null, config),
  learnRecords: ({ classId, config }) =>
    get(`classrooms/${classId}/learnRecords`, null, config),
  uploadLearnRecords: ({ classId, learnRecords }) =>
    put(`learnRecords/${classId}`, { extra: learnRecords }),
  getClassroomLearnRecords: id => get(`classrooms/${id}/learnRecords`),
  modifyClassroomLearnRecords: ({ id, learnRecordsArr }) => put(`classrooms/${id}/learnRecords`, learnRecordsArr),
  isValidKey: key => get(`classrooms/valid?key=${key}`)
}

export const subjects = {
  getAllSubjects: () => get('subjects')
}

export const emails = {
  sendEmails: ({ to, subject, html }) => post('emails', { to, subject, html })
}

export const skills = {
  getAllSkills: () => get('skills')
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms,
  emails,
  skills,
  subjects
}

export default lesson
