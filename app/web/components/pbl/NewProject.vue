<template>
  <div class="new-project container">
    <div class="new-project-step-0" v-show="nowStep === 0">
      <h1 class="new-project-title">新建项目</h1>
      <p class="new-project-info">在项目里去创造你的作品吧</p>
      <div class="new-project-name">
        <label for="projectName" class="new-project-label">项目名称</label>
        <el-input id="projectName" v-model="newProjectData.name"></el-input>
      </div>
      <div class="new-project-type">
        <label for="projectName" class="new-project-label">项目类型</label>
        <div class="new-project-type-box">
          <div class="new-project-type-item" :class="{'active iconfont': projectType.type === newProjectData.type}" v-for="(projectType, index) in projectTypes" :key="index" @click='selectProjectType(projectType.type)'>
            <img class="new-project-type-item-cover" :src="projectType.type === newProjectData.type ?projectType.activeIconImgSrc:projectType.iconImgSrc" alt="">
            <p class="new-project-type-item-label">{{projectType.label}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="new-project-step-1" v-show="nowStep === 1">
      <website-binder @confirmSiteId='handleConfirmSiteId'></website-binder>
    </div>
    <el-button :loading="isCreating" v-show="isFinishShow" type="primary" :disabled="isNameEmpty" @click="createNewProject">完成创建</el-button>
    <el-button v-show="isNextShow" type="primary" :disabled="isNameEmpty" @click="goNextStep">下一步</el-button>
    <el-button v-show="isPrevShow" type="primary" @click="goPrevStep">上一步</el-button>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import WebsiteBinder from './common/WebsiteBinder'
export default {
  name: 'NewProject',
  data() {
    return {
      isCreating: false,
      nowStep: 0,
      webFinishStepCount: 1,
      projectTypes: [
        {
          type: 1,
          label: 'Paracraft',
          iconImgSrc: require('@/assets/pblImg/project_paracraft.png'),
          activeIconImgSrc: require('@/assets/pblImg/project_paracraft_active.png')
        },
        {
          type: 0,
          label: '网站',
          iconImgSrc: require('@/assets/pblImg/project_web.png'),
          activeIconImgSrc: require('@/assets/pblImg/project_web_active.png')
        }
      ],
      newProjectData: {
        name: '',
        privilege: 165,
        visibility: 0,
        type: 1,
        description: '',
        siteId: null
      }
    }
  },
  computed: {
    isNameEmpty() {
      let { name } = this.newProjectData
      return !name || name.length == 0
    },
    isWebType() {
      return this.newProjectData.type === 0
    },
    isFinishShow() {
      return !this.isWebType
    },
    isNextShow() {
      return this.isWebType && this.nowStep !== this.webFinishStepCount
    },
    isPrevShow() {
      return this.isWebType && this.nowStep === this.webFinishStepCount
    }
  },
  methods: {
    ...mapActions({
      pblCreateNewProject: 'pbl/createNewProject'
    }),
    selectProjectType(type) {
      this.newProjectData.type = type
    },
    handleConfirmSiteId({ siteId }) {
      this.isWebType && siteId && (this.newProjectData.siteId = siteId)
      this.createNewProject()
    },
    async createNewProject() {
      this.isCreating = true
      await this.pblCreateNewProject(this.newProjectData)
        .then(projectDetail => {
          this.isCreating = false
          this.$message({
            type: 'success',
            message: '项目创建成功'
          })
          let projectId = projectDetail.id
          projectId && this.$router.push(`/project/${projectId}`)
        })
        .catch(error => {
          console.error(error)
        })
    },
    goPrevStep() {
      this.nowStep--
    },
    goNextStep() {
      this.nowStep++
    }
  },
  components: {
    WebsiteBinder
  }
}
</script>
<style lang="scss">
.new-project {
  padding-top: 55px;
  &-title {
    font-size: 24px;
    color: #303133;
    margin: 0 0 10px 0;
  }
  &-info {
    font-size: 14px;
    color: #909399;
    margin: 10px 0 30px;
  }
  &-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 15px;
    display: block;
  }
  &-type {
    &-box {
      display: flex;
    }
    &-item {
      width: 168px;
      height: 168px;
      border: 1px solid #e8e8e8;
      text-align: center;
      margin: 0 20px 25px 0;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
      &-cover {
        padding: 40px 36px 0;
      }
      &-label {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 16px;
        color: #909399;
        margin: 0;
        font-size: 14px;
      }
    }
    &-item:last-child {
      margin: 0 0 25px 0;
    }
    &-item.active {
      border: 2px solid #2397f3;
      box-shadow: 0 0 8px 3px rgba(35, 151, 243, 0.2);
    }
    &-item.active::before {
      content: '\E600';
      color: #fff;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #2397f3;
      position: absolute;
      right: -6px;
      top: -8px;
      text-align: left;
      padding-left: 7px;
      line-height: 36px;
      box-sizing: border-box;
      font-size: 14px;
    }
  }
  &-name {
    margin-bottom: 24px;
  }
  .el-input {
    width: 600px;
  }
}
</style>