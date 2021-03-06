<template>
  <div class="project-cell">
    <div v-if="project.extra.videoUrl" class="project-cell-cover" @click="goProjectDetail(project)">
      <video class="project-cell-cover-img" controls="controls" :src="project.extra.videoUrl"></video>
      <div class="video-mask"></div>
    </div>
    <div v-else class="project-cell-cover" @click="goProjectDetail(project)"><img class="project-cell-cover-img" :src="project.extra.imageUrl || project_default_cover" alt=""></div>
    <h4 class="project-cell-title" @click="goProjectDetail(project)" :title="project.name"><span class="text" v-html="project.name_title || project.name"></span><span class="recruitment" v-if="project.privilege & 1">{{$t("explore.recruiting")}}</span></h4>
    <div class="project-cell-like">
      <i class="iconfont icon-browse_fill"></i>
      <span>{{project.visit}}</span>
      <i class="iconfont icon-like-fill"></i>
      <span>{{project.star}}</span>
      <i class="iconfont icon-message_fill"></i>
      <span>{{project.comment}}</span>
    </div>
    <div class="project-cell-author">
      <a :href="`/u/${project.user.username}`" target="_blank" class="project-cell-author-name" @click="toUserProfilePage(project.user.username)">
        <img :src="(project.user && project.user.portrait) || default_portrait" alt="portrait">
        <span class="username" :title="project.user.username">{{project.user && project.user.username}}</span>
      </a>
      <div class="project-cell-author-time">{{relativeTime(project.createdAt)}}</div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import project_default_cover from '@/assets/pblImg/project_default_cover.png'
import default_portrait from '@/assets/img/default_portrait.png'

export default {
  name: 'ProjectCell',
  props: {
    project: {
      type: Object,
      default() {
        return {
          user: {}
        }
      }
    }
  },
  data() {
    return {
      project_default_cover: project_default_cover,
      default_portrait: default_portrait
    }
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    }
  },
  methods: {
    goProjectDetail(project) {
      window.open(`/pbl/project/${project.id}/`)
    },
    relativeTime(time) {
      const offset = moment().utcOffset()
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time)
        .utcOffset(offset)
        .fromNow()
    }
  }
}
</script>

<style lang='scss'>
.project-cell {
  width: 290px;
  padding: 16px 16px 8px;
  margin: 0 auto 16px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fff;
  transition: all 200ms ease-in;
  &:hover {
    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
    transition: all 200ms ease-in;
  }
  &-cover {
    width: 100%;
    height: 143px;
    cursor: pointer;
    position: relative;
    &-img {
      width: 100%;
      height: 143px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
    }
    .video-mask {
      width: 100%;
      height: 143px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &-title {
    font-size: 14px;
    margin: 10px 0;
    line-height: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    .red {
      color: red;
    }
    .text {
      display: inline-block;
      max-width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 20px;
    }
    .recruitment {
      display: inline-block;
      background: #ef5936;
      border-radius: 10px;
      color: #fff;
      margin-left: 4px;
      padding: 0 8px;
      font-size: 11px;
      height: 20px;
    }
  }
  &-like {
    font-size: 12px;
    color: #909399;
  }
  &-author {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    padding-top: 12px;
    &-name {
      flex: 1;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #303133;
      &:hover {
        color: #2397f3;
      }
      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 8px;
      }
      .username {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &-time {
      width: 120px;
      text-align: right;
    }
  }
}
@media screen and (max-width: 768px) {
  .project-cell {
    width: 100%;
    max-width: 230px;
    padding: 4px;
    font-size: 12px;
    border: none;
    &-cover {
      width: 100%;
      height: 90px;
      &-img {
        width: 100%;
        height: 90px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
    &-title {
      font-size: 12px;
    }
    &-author {
      font-size: 12px;
      &-name {
        .username {
          width: 50px;
        }
      }
    }
  }
}
</style>
