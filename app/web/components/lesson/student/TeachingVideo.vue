<template>
  <div class="teaching-video">
    <div class="teaching-video-course">
      <el-row>
        <el-col :sm="8">
          <div class="box" @click="goLesson(8)">
            <img src="@/assets/lessonImg/teaching-video_2.png" alt="">
            <p>{{$t('lesson.animationsLesson')}}</p>
          </div>
        </el-col>
        <el-col :sm="8">
          <div class="box" @click="goLesson(8)">
            <img src="@/assets/lessonImg/teaching-video_1.png" alt="">
            <p>{{$t('lesson.programmingLesson')}}</p>
          </div>
        </el-col>
        <el-col :sm="8">
          <div class="box" @click="goLesson(8)">
            <img src="@/assets/lessonImg/teaching-video_3.png" alt="">
            <p>{{$t('lesson.CADLesson')}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TeachingVideo',
  data() {
    return {}
  },
  methods: {
    goLesson(index) {
      return this.$router.push(`/student/allteachingvideo/animate`)
    }
  }
}
</script>

<style lang="scss">
.teaching-video {
  &-course {
    .box {
      padding: 20px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
  }
}
</style>

