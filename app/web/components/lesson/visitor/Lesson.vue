<template>
  <div class="lesson-wrap" v-loading="isLoading">
    <LessonStudentStatus v-if="isBeInClassroom && !isLoading" :isVisitor="true" :classKey="classKey" />
    <LessonHeader :data="lessonHeaderData" :isVisitor="true" />
    <LessonSummary v-if="isShowSummary" />
    <LessonWrap v-show="!isShowSummary" v-for="mod in lessonMain" :key="mod.key" :mod="mod" :isVisitor="true" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from '../common/LessonWrap'
import LessonHeader from '../common/LessonHeader'
import LessonSummary from '@/components/lesson/student/LessonStudentSummary'
import LessonStudentStatus from '@/components/lesson/student/LessonStudentStatus'
export default {
  name: 'Visitor',
  components: {
    LessonWrap,
    LessonHeader,
    LessonSummary,
    LessonStudentStatus
  },
  data() {
    return {
      isRefresh: false,
      _interval: null,
      isLoading: false,
      classKey: ''
    }
  },
  created() {
    this.switchSummary(false)
  },
  async mounted() {
    if (!this.visitorInfo.token) {
      return this.$router.push({ name: 'StudentCenter' })
    }
    this.isLoading = true
    const { key = '', token, id, nickname = '', device } = this.$route.query
    this.classKey = key
    this.saveVisitorInfo({ classId: id, key, token, nickname, name: nickname })
    if (device && device.toLowerCase() === 'paracraft') {
      this.switchDevice('p')
    }
    let { packageId, lessonId } = this.$route.params
    packageId = Number(packageId)
    lessonId = Number(lessonId)
    await this.getLessonContent({ lessonId, packageId }).catch(e =>
      console.error(e)
    )
    window.document.title = this.lessonName
    if (id && token) {
      await this.resumeVisitorLearnRecords(id)
    }
    this.resetUrl()
    this.isLoading = false
    // window.addEventListener('storage', this.handleStorageEvent, false)
  },
  destroyed() {
    clearTimeout(this._interval)
    this.clearVisitorInfo()
    // window.removeEventListener('storage', this.handleStorageEvent, false)
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      clearLearnRecordsId: 'lesson/student/clearLearnRecordsId',
      clearLessonData: 'lesson/student/clearLessonData',
      switchSummary: 'lesson/student/switchSummary',
      changeStatus: 'lesson/student/changeStatus',
      saveVisitorInfo: 'lesson/student/saveVisitorInfo',
      clearVisitorInfo: 'lesson/student/clearVisitorInfo',
      uploadVisitorLearnRecords: 'lesson/student/uploadVisitorLearnRecords',
      resumeVisitorLearnRecords: 'lesson/student/resumeVisitorLearnRecords',
      switchDevice: 'lesson/student/switchDevice'
    }),
    resetUrl() {
      history.replaceState(
        '',
        '',
        this.$router.resolve({
          path: this.$route.path
        }).href
      )
    }
    // handleStorageEvent() {
    //   let refresh = localStorage.getItem('refresh')
    //   if (Boolean(refresh)) {
    //     localStorage.setItem('refresh', false)
    //     this.$router.push({ name: 'StudentCenter' })
    //   }
    // }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/student/lessonDetail',
      lessonQuizDone: 'lesson/student/lessonQuizDone',
      isShowSummary: 'lesson/student/isShowSummary',
      visitorInfo: 'lesson/student/visitorInfo'
    }),
    isBeInClassroom() {
      return this.visitorInfo.classId && this.visitorInfo.token
    },
    currentClassroomId() {
      return _.get(this.userinfo, 'extra.classroomId', '')
    },
    lesson() {
      return this.lessonDetail.modList || []
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    lessonHeaderData() {
      return this.lessonDetail.lesson || {}
    },
    lessonName() {
      return this.lessonHeaderData.lessonName || 'KeepWork'
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    }
  }
}
</script>

<style lang="scss">
.lesson-wrap {
  counter-reset: no;
  padding-bottom: 20px;
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
.add-package-confirm {
  &.icon-BOOK:before {
    font-size: 100px;
    color: #909399;
  }
}
</style>

