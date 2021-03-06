<template>
  <div class="profile-project">
    <div class="container">
      <div class="profile-project-sidebar hidden-sm-and-down">
        <user-basic-msg class="profile-project-sidebar-item" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-basic-msg>
      </div>
      <div class="profile-project-main">
        <el-tabs class="profile-project-tabs profile-project-main-item" v-model="activeName" v-loading='isLoading'>
          <el-tab-pane disabled>
            <a slot='label' class="profile-project-tabs-operate" href="/pbl/project/new" target="_blank" type="primary">{{$t("project.newProject")}}</a>
          </el-tab-pane>
          <el-tab-pane name="created">
            <span slot='label'>{{$t('profile.createdProjects')}}</span>
            <div v-if="!isCreatedEmpty" class="profile-project-list">
              <project-cell class="profile-project-list-item" v-for="(project, index) in nowProfileCreatedProjects" :key="index" :project='project'></project-cell>
            </div>
            <div v-if="isCreatedEmpty" class="profile-project-empty">
              <img src="@/assets/img/default_project.png" alt="">
              <div class="profile-project-empty-info">{{$t("profile.noProjectsToShow")}}</div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="joined">
            <span slot='label'>{{$t('profile.contributedProjects')}}</span>
            <div v-if="!isJoinedEmpty" class="profile-project-list">
              <project-cell class="profile-project-list-item" v-for="(project, index) in nowProfileJoinedProjects" :key="index" :project='project'></project-cell>
            </div>
            <div v-if="isJoinedEmpty" class="profile-project-empty">
              <div class="profile-project-empty-info">{{$t("profile.noContributedProjectsToShow")}}</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from '@/components/common/ProjectCell'
import UserBasicMsg from './common/UserBasicMsg'
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'ProfileProject',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.initProjectsData()
  },
  data() {
    return {
      isLoading: false,
      activeName: 'created'
    }
  },
  computed: {
    ...mapGetters({
      loginUserId: 'user/userId',
      createdProjects: 'profile/createdProjects',
      joinedProjects: 'profile/joinedProjects'
    }),
    isLoginUserEditable() {
      return this.loginUserId === this.nowProfileUserId
    },
    isCreatedType() {
      return this.activeName === 'created'
    },
    isJoinedType() {
      return this.activeName === 'joined'
    },
    nowProfileUserId() {
      return this.nowUserDetail.id
    },
    nowProfileCreatedProjects() {
      return this.createdProjects({ userId: this.nowProfileUserId })
    },
    nowProfileJoinedProjects() {
      return this.joinedProjects({ userId: this.nowProfileUserId })
    },
    isCreatedEmpty() {
      return !Boolean(this.nowProfileCreatedProjects && this.nowProfileCreatedProjects.length)
    },
    isJoinedEmpty() {
      return !Boolean(this.nowProfileJoinedProjects && this.nowProfileJoinedProjects.length)
    }
  },
  methods: {
    ...mapActions({
      profileGetUserCreatedProjects: 'profile/getUserCreatedProjects',
      profileGetUserJoinedProjects: 'profile/getUserJoinedProjects'
    }),
    async initProjectsData() {
      let userId = this.nowProfileUserId
      this.isLoading = true
      this.isCreatedType ? await this.profileGetUserCreatedProjects({ userId }) : await this.profileGetUserJoinedProjects({ userId })
      this.isLoading = false
    }
  },
  components: {
    ProjectCell,
    UserBasicMsg
  }
}
</script>
<style lang="scss">
.profile-project {
  padding-top: 24px;
  & > .container {
    display: flex;
  }
  &-sidebar {
    width: 272px;
    margin-right: 28px;
    &-item {
      background-color: #fff;
      margin-bottom: 24px;
    }
  }
  &-main {
    flex: 1;
    min-width: 0;
    &-item {
      background-color: #fff;
      margin-bottom: 24px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
    }
  }
  &-tabs {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__nav-wrap {
      padding: 10px 16px;
      &::after {
        height: 1px;
        background-color: #e8e8e8;
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      font-size: 14px;
      color: #909399;
      padding: 0 2px;
      & > span {
        display: inline-block;
        padding: 5px 18px;
        line-height: 1;
      }
    }
    .el-tabs__item.is-disabled {
      position: absolute;
      right: 16px;
      top: 2px;
    }
    .el-tabs__item.is-active {
      & > span {
        background-color: #2397f3;
        color: #fff;
        border-radius: 24px;
      }
    }
    &-operate {
      background-color: #2397f3;
      color: #fff;
      text-decoration: none;
      font-size: 14px;
      padding: 6px 16px;
      border-radius: 4px;
    }
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: -1px;
    & &-item {
      margin: 0;
      border-radius: 0;
      width: 33.3%;
    }
    & &-item:nth-child(3n + 1) {
      border-width: 0 0 1px 0;
    }
    & &-item:nth-child(3n + 2) {
      border-width: 0 1px 1px 1px;
    }
    & &-item:nth-child(3n) {
      border-width: 0 0 1px 0;
    }
  }
  &-empty {
    text-align: center;
    padding: 44px 0 48px;
    &-info {
      font-size: 14px;
      color: #909399;
      margin-top: 36px;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .profile-project {
    padding-top: 8px;
    &-main {
      &-item {
        border-radius: 0;
        border: none;
      }
    }
    &-tabs {
      .el-tabs__nav-wrap {
        padding: 6px 0;
      }
      .el-tabs__nav {
        display: flex;
        width: 100%;
        justify-content: space-evenly;
      }
      .el-tabs__item {
        height: 28px;
        line-height: 28px;
      }
      .el-tabs__item.is-active {
        & > span {
          padding: 7px 30px;
          border-radius: 28px;
        }
      }
      .el-tabs__item.is-disabled {
        display: none;
      }
    }
    &-list {
      justify-content: space-between;
      padding: 12px 8px;
      & &-item {
        width: 50%;
        padding: 4px 8px;
        .recruitment {
          display: none;
        }
      }
    }
  }
}
</style>
