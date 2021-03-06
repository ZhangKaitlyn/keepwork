<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="new-issue-dialog">
    <div class="new-issue">
      <div class="title">{{$t('project.createNewIssueTitle')}}</div>
      <div class="sketch">
        <div class="sketch-box">
          <div class="sketch-box-tag" :class="{'sketch-box-tag-en': isEn}">{{$t("project.title")}}</div>
          <div class="sketch-box-content">
            <el-input size="medium" v-model="issueTitle" :placeholder='$t("project.pleaseInputTitle")'></el-input>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag" :class="{'sketch-box-tag-en': isEn}">{{$t('project.labels')}}</div>
          <div class="sketch-box-content" v-loading='isTagLoading'>
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleCloseTag(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" maxlength="40" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{$t('project.newLabel')}}</el-button>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag" :class="{'sketch-box-tag-en': isEn}">{{$t('project.asignees')}}</div>
          <div class="sketch-box-content">
            <div class="player">
              <img v-for="(member,index) in assignedMembers" :key="index" class="player-portrait" :src="member.portrait || default_portrait" alt="">
              <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start">
                <span class="el-dropdown-link">
                  <span class="assigns-btn"></span>
                </span>
                <el-dropdown-menu slot="dropdown" class="new-issue-assign">
                  <el-dropdown-item v-if="memberList.length == 0">{{$t('project.noOtherMembers')}}</el-dropdown-item>
                  <el-dropdown-item v-for="member in memberList" :key="member.id" :command="member.userId"><i :class="['icofont',{'el-icon-check': isAssigned(member)}]"></i><img class="member-portrait" :src="member.portrait || default_portrait" alt="">{{member.nickname || member.username}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag" :class="{'sketch-box-tag-en': isEn}">{{$t('project.write')}}</div>
          <div class="sketch-box-content">
            <el-input type="textarea" :rows="4" v-model="descriptionText" :placeholder="$t('project.writeAComment')"></el-input>
          </div>
        </div>
      </div>
      <div class="finish">
        <el-button size="medium" :loading="cretateIssueLoading" type="primary" @click="finishedCreateIssue" :disabled="!issueTitle || !descriptionText">{{$t('project.submitIssue')}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { locale } from '@/lib/utils/i18n'
import { keepwork } from '@/api'
import _ from 'lodash'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapActions, mapGetters } from 'vuex'
import default_portrait from '@/assets/img/default_portrait.png'
import Vue from 'vue'

export default {
  name: 'NewIssue',
  props: {
    show: Boolean,
    projectId: {
      required: true
    }
  },
  data() {
    return {
      issueTitle: '',
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      descriptionText: '',
      default_portrait: default_portrait,
      assignedMembers: [],
      cretateIssueLoading: false,
      isTagLoading: false
    }
  },
  async mounted() {
    await this.getProjectMember({
      objectId: this.projectId,
      objectType: 5
    })
  },
  computed: {
    ...mapGetters({
      pblProjectMemberList: 'pbl/projectMemberList'
    }),
    isEn() {
      return locale === 'en-US'
    },
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectId })
    },
    assignMembersId() {
      let arrId = []
      _.map(this.assignedMembers, ({ userId }) => {
        arrId.push(userId)
      })
      return arrId.join('|')
    }
  },
  methods: {
    ...mapActions({
      getProjectIssues: 'pbl/getProjectIssues',
      getProjectMember: 'pbl/getProjectMember'
    }),
    handleCloseTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm() {
      let inputValue = this.inputValue
      let isExistTagIndex = _.findIndex(
        this.dynamicTags,
        tag => tag === inputValue
      )
      if (isExistTagIndex !== -1) {
        this.$message({
          showClose: true,
          message: '该标签已存在',
          type: 'error'
        })
        return
      }
      this.isTagLoading = true
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: inputValue
      }).catch()
      this.isTagLoading = false
      if (sensitiveResult && sensitiveResult.length > 0) {
        return
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose() {
      this.$emit('close')
    },
    handleCommand(userId) {
      _.forEach(this.memberList, member => {
        if (member.userId === userId) {
          if (this.assignedMembers.length == 0) {
            return this.assignedMembers.push(member)
          }
          let i
          for (i = 0; i < this.assignedMembers.length; ++i) {
            if (this.assignedMembers[i].userId === userId) {
              break
            }
          }
          if (i === this.assignedMembers.length) {
            return this.assignedMembers.push(member)
          }
          this.assignedMembers.splice(i, 1)
        }
      })
    },
    async finishedCreateIssue() {
      this.cretateIssueLoading = true
      this.$nextTick(async () => {
        let sensitiveResult = await checkSensitiveWords({
          checkedWords: [this.issueTitle, this.descriptionText]
        }).catch()
        if (sensitiveResult && sensitiveResult.length > 0) {
          this.cretateIssueLoading = false
          return
        }
        let payload = {
          objectType: 5,
          objectId: this.projectId,
          title: this.issueTitle,
          content: this.descriptionText,
          tags: this.dynamicTags.join('|'),
          assigns: this.assignMembersId
        }
        await keepwork.issues
          .createIssue(payload)
          .then(res => {
            this.getProjectIssues({
              objectId: this.projectId,
              objectType: 5,
              'x-per-page': 25,
              'x-page': 1,
              'x-order': 'createdAt-desc'
            })
            this.handleClose()
            this.cretateIssueLoading = false
          })
          .catch(err => console.error(err))
      })
    },
    isAssigned(member) {
      return this.assignedMembers.indexOf(member) !== -1 ? true : false
    }
  }
}
</script>
<style lang="scss">
.new-issue-dialog {
  .el-dialog {
    max-width: 600px;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 6px 20px;
    }
  }

  .new-issue {
    margin: 0 auto;
    background: #fff;
    .title {
      line-height: 60px;
      font-size: 16px;
      color: #303133;
      padding-left: 4px;
      font-weight: bold;
      border-bottom: 1px solid #e8e8e8;
      max-width: 600px;
      margin-bottom: 12px;
    }
    .sketch {
      padding-left: 6px;
      &-box {
        display: flex;
        line-height: 60px;
        max-width: 600px;
        &-tag {
          width: 52px;
          font-size: 14px;
          color: #909399;
          &-en {
            width: 80px;
          }
        }
        &-content {
          flex: 1;
          .el-tag + .el-tag {
            margin-left: 10px;
          }
          .input-new-tag {
            margin-bottom: 4px;
            display: inline-block;
            width: 60px;
            height: 20px;
            padding: 0;
            .el-input__inner {
              padding: 0 8px;
            }
          }
          .player {
            line-height: 38px;
            margin-bottom: 8px;
            &-portrait {
              width: 36px;
              height: 36px;
              margin: 8px 6px 0 0;
              border-radius: 50%;
              border: 1px solid #e8e8e8;
            }
            .assigns-btn {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 1px solid #e8e8e8;
              display: inline-block;
              position: relative;
              margin-top: 8px;
              &::after {
                content: "";
                height: 16px;
                width: 1px;
                background: #6e6d6d;
                position: absolute;
                left: 17px;
                top: 10px;
              }
              &::before {
                content: "";
                height: 1px;
                width: 16px;
                background: #6e6d6d;
                position: absolute;
                left: 10px;
                top: 17px;
              }
            }
          }
        }
      }
    }
    .finish {
      padding: 24px 68px;
    }
  }
}
.new-issue-assign {
  .member-portrait {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
  }
}
@media screen and (max-width: 768px) {
  .new-issue-dialog {
    .el-dialog {
      width: 90%;
    }
  }
}
</style>

