<template>
  <div class="edit-project">
    <el-tabs v-if="isLoginUserEditable" class="edit-project-tabs container" v-model="activeName" type="card" v-loading='isLoading'>
      <el-tab-pane name="editing" class="edit-project-tabs-pane">
        <span slot="label">{{$t('project.setting')}}</span>
        <project-editing :originPrivilege='originPrivilege' :originVisibility='originVisibility' :originalProjectDetail='pblProjectDetail'></project-editing>
      </el-tab-pane>
      <el-tab-pane name="members" class="edit-project-tabs-pane">
        <span slot="label">{{$t('project.members')}}</span>
        <project-members :projectDetail='pblProjectDetail' :projectId='projectId' class="edit-project-members"></project-members>
      </el-tab-pane>
    </el-tabs>
    <p v-else>不好意思，没有编辑权限。。。</p>
  </div>
</template>
<script>
import ProjectEditing from './common/ProjectEditing'
import ProjectMembers from './common/ProjectMembers'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'EditProject',
  props: {
    pblProjectDetail: {
      type: Object,
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      activeName: 'editing'
    }
  },
  computed: {
    originPrivilege() {
      return _.get(this.pblProjectDetail, 'privilege')
    },
    originVisibility() {
      return _.get(this.pblProjectDetail, 'visibility')
    },
    projectId() {
      return _.get(this.$route, 'params.id')
    }
  },
  components: {
    ProjectEditing,
    ProjectMembers
  }
}
</script>
<style lang="scss">
.edit-project {
  background-color: #f5f5f5;
  padding: 24px 0;
  &-header {
    margin-bottom: 24px;
  }
  &-tabs {
    background-color: #fff;
    border: 1px solid #e8e8e8;
    &-pane {
      min-height: 400px;
    }
    .el-tabs__header {
      padding-left: 18px;
      margin-bottom: 24px;
    }
    .el-tabs__nav-wrap .el-tabs__item:last-child,
    .el-tabs__nav-wrap .el-tabs__item:nth-child(2) {
      padding: 0 6px;
    }
    .el-tabs__item {
      padding: 0 6px;
      height: 56px;
      line-height: 56px;
      span {
        color: #909399;
        display: inline-block;
        padding: 0 18px;
        height: 24px;
        line-height: 24px;
        border-radius: 24px;
      }
    }
    .el-tabs__item.is-active {
      span {
        color: #fff;
        background-color: #2296f3;
      }
    }
  }
  &-tabs > .el-tabs__header .el-tabs__nav,
  &-tabs > .el-tabs__header .el-tabs__item,
  &-tabs > .el-tabs__header .el-tabs__item.is-active {
    border: none;
  }
  &-members {
    padding: 0 24px 24px 24px;
  }
}

@media (max-width: 768px) {
  .edit-project {
    &-tabs {
      .el-tabs__content {
        overflow: auto;
      }
    }
  }
}
</style>
