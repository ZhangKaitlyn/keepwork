<template>
  <el-row :gutter="0" type='flex' class="full-height editor-page-container" @mousemove.native="dragMouseMove" @mouseup.native="dragMouseUp">
    <el-col id="managerWin" class="manager-win" v-show="isManagerShow">     
      <el-row class="toolbar">
        <el-button-group>
          <el-tooltip :content="$t('editor.files')">
            <el-button id="file-manager-button" class="iconfont icon-list_directory" :class='{"el-button--primary": activeManagePaneComponentName=="FileManager"}' @click="changeView('FileManager')"></el-button>
          </el-tooltip>
          <!-- <el-button class="btn-bigfile" :class='{"el-button--primary": activeManagePaneComponentName=="ModPropertyManager"}' @click="changeView('ModPropertyManager')"></el-button> -->
          <el-tooltip v-if='activePage && hasOpenedFiles' :content="$t('tips.mod')">
            <el-button class="iconfont icon-module" :class='{"el-button--primary": activeManagePaneComponentName=="ModsList"}' @click="changeView('ModsList')"></el-button>
          </el-tooltip>
          <el-tooltip v-if='activePage && hasOpenedFiles' :content="$t('common.myWebDisk')">
            <el-button class='iconfont icon-upload' @click="openSkyDriveManagerDialog"></el-button>
          </el-tooltip>
          <!-- <el-button class="btn-search" :class='{"el-button--primary": activeManagePaneComponentName=="Search"}' @click="changeView('Search')"></el-button> -->
        </el-button-group>
        <sky-drive-manager-dialog :show='showSkyDrive' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
      </el-row>
      <el-scrollbar wrap-class="manager-content-box el-row" view-class="manager-content-inner" :native="false">
        <keep-alive>
          <component :is='activeManagePaneComponentName' v-bind='activeManagePaneComponentProps' v-keep-scroll-position></component>
        </keep-alive>
      </el-scrollbar>
    </el-col>
    <div class="col-between flex-order-one" v-show="isManagerShow"></div>
    <el-col id="previewWin" v-show="!isWelcomeShow && isPreviewShow" class="preview-win" :style="setPreviewWinStyle">
      <el-row class="toolbar">
        <!-- <el-button-group>
          <el-button class="iconfont icon-computer" title="电脑"></el-button>
          <el-button class="iconfont icon-phone" title="手机"></el-button>
        </el-button-group> -->
        <!-- <el-button-group>
          <el-button class="btn-scale" title="缩小"></el-button>
          <el-button class="btn-enlarge" title="放大"></el-button>
        </el-button-group> -->
        <el-button-group>
          <!-- <el-button class="btn-adaptive" title="自适应"></el-button> -->
          <!-- <el-button class="iconfont icon-new_open_window" title="新窗口打开" @click='showPreview'></el-button> -->
          <el-tooltip :content="$t('editor.preview')">
            <el-button class="iconfont icon-new_open_window" @click='showPreview'></el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>
      <iframe id="frameViewport" src="/vp" style="height: 100%; width: 100%; background: #fff" />
      <iframe-dialog></iframe-dialog>
      <div class='mouse-event-backup' v-show="resizeWinParams.isResizing"></div>
      <!-- <editor-viewport></editor-viewport> -->
      <el-dialog class="multiple-text-dialog" :title="$t('card.paragraph')" :visible="isMultipleTextDialogShow" top='6vh' :before-close="handleMultipleTextDialogClose" @open='initMarkdownModDatas'>
        <el-input type='textarea' resize='none' :placeholder="$t('field.' + editingMarkdownModDatas.key)" v-model='editingMarkdownModDatas.content'></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleMultipleTextDialogClose('save')">{{$t('common.confirmButtonText')}}</el-button>
        </span>
      </el-dialog>
    </el-col>
    <div class="col-between editor-resizer flex-order-two" v-show="!isWelcomeShow && isPreviewShow && isCodeShow" @mousedown="resizeCol($event, 'previewWinWidth', 'codeWinWidth')"></div>
    <el-col id="codeWin" v-show="!isWelcomeShow && isCodeShow" class="code-win" :style="setCodeWinStyle">
      <el-row class="toolbar">
        <el-scrollbar wrap-class="toolbar" :native="false">
          <el-col class="toolbar-content">
            <div class="zenmode-icon" v-if="isZenMode">
              <img :src="require('@/assets/img/zen.png')" />
              <!-- tooltip can not shoe in fullscreen -->
              <!-- <el-tooltip :content="$t('editor.zenModeTips')">
                <i class="iconfont icon-help"></i>
              </el-tooltip> -->
            </div>
            <div class="toolbar-content_left">
              <el-button-group>
                <el-tooltip :content="$t('editor.title') + '1'">
                  <el-button class="iconfont icon-h1" @click="insertHeadline(1)"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('editor.title') + '2'">
                  <el-button class="iconfont icon-h2" @click="insertHeadline(2)"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('editor.title') + '3'">
                  <el-button class="iconfont icon-h3" @click="insertHeadline(3)"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('editor.bold')">
                  <el-button class="iconfont icon-thickening" @click="setFontStyle('bold')"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('editor.italic')">
                  <el-button class="iconfont icon-incline" @click="setFontStyle('italic')"></el-button>
                </el-tooltip>
              </el-button-group>
              <el-button-group>
                <!-- <el-button class="iconfont icon-sequence_1" title="无序列表"></el-button>
              <el-button class="iconfont icon-sequence_" title="有序列表"></el-button>
              <el-button class="iconfont icon-reference" title="引用内容"></el-button> -->
                <!-- <el-button class="iconfont icon-table" title="表格"></el-button> -->
                <el-tooltip :content="$t('editor.horizontalDiv')">
                  <el-button class="iconfont icon-code_division_line" @click="insertLine"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('editor.code')">
                  <el-button class="iconfont icon-code" @click="insertCode"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('editor.link')">
                  <el-button class="iconfont icon-link_" @click="insertLink"></el-button>
                </el-tooltip>
              </el-button-group>
              <el-button-group v-if="!isZenMode" :style='isDisplayButton'>
                <el-tooltip :content="$t('tips.mod')">
                  <el-button class="iconfont icon-module" @click="addModToMarkdown"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
            <el-button-group class="fullScreenBtn">
              <el-button :title='$t("tips.ShowZenMode")' :icon="fullscreenIcon" circle @click="openZenMode"></el-button>
            </el-button-group>
          </el-col>
        </el-scrollbar>
      </el-row>
      <editor-markdown ref='codemirror' @insertBigfile='insertBigfile'></editor-markdown>
    </el-col>
    <el-col v-if="isWelcomeShow" class="guid-col">
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="21">
          <editor-welcome></editor-welcome>
        </el-col>
      </el-row>
      <div class="guid-help">
        <a href="https://keepwork.com/official/help/index" target="_blank">{{$t('editor.help')}}</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import { gConst } from '@/lib/global'
import EditorMarkdown from './EditorMarkdown'
import EditorWelcome from './EditorWelcome'
import ModPropertyManager from './ModPropertyManager'
import FileManager from './FileManager'
import ModsList from './ModsList'
import Search from './Search'
import PageSetting from './PageSetting'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import { mapGetters, mapActions } from 'vuex'
import IframeDialog from '@/components/common/IframeDialog'
import { setTimeout } from 'timers';

export default {
  name: 'Editor',
  data() {
    return {
      bodyWidth: document.body.clientWidth,
      managerWinWidth: 0,
      previewWinWidth: 50,
      codeWinWidth: 50,
      resizeWinParams: {
        mouseStartX: 0,
        isResizing: false,
        leftColWidthParam: '',
        rightColWidthParam: ''
      },
      gConst,
      editingMarkdownModDatas: {
        key: 'data',
        content: ''
      }
    }
  },
  created() {
    this.changeView('FileManager')
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', function(e) {
        _.throttle(function() {
          this.bodyWidth = document.body.clientWidth
        }, 1000)
      })
    })
  },
  components: {
    EditorMarkdown,
    EditorWelcome,
    ModPropertyManager,
    Search,
    ModsList,
    FileManager,
    PageSetting,
    SkyDriveManagerDialog,
    IframeDialog
  },
  computed: {
    ...mapGetters({
      activePage: 'activePage',
      activeMod: 'activeMod',
      preModKey: 'preModKey',
      activePageUrl: 'activePageUrl',
      personalSiteList: 'user/personalSiteList',
      activeManagePaneComponentName: 'activeManagePaneComponentName',
      activeManagePaneComponentProps: 'activeManagePaneComponentProps',
      showingCol: 'showingCol',
      activePageInfo: 'activePageInfo',
      isMultipleTextDialogShow: 'isMultipleTextDialogShow',
      activePropertyData: 'activePropertyData',
      hasOpenedFiles: 'hasOpenedFiles',
      showSkyDrive: 'showSkyDrive',
      showAngle: 'showAngle',
      isCodeShow: 'isCodeShow',
      isPreviewShow: 'isPreviewShow',
      isManagerShow: 'isManagerShow',
      isZenMode: 'isZenMode'
    }),
    isWelcomeShow() {
      return !this.activePageInfo.sitename
    },
    isDisplayButton() {
      if (this.isPreviewShow) {
        return this.generateStyleString({
          'display': 'inline-block'
        })
      } else {
        return this.generateStyleString({
          'display': 'none'
        })
      }
    },
    setPreviewWinStyle() {
      if(!this.showAngle) {
        return 'order: 3;'
      } else {
        return 'order: 5;'
      }
    },
    setCodeWinStyle() {
      if(!this.showAngle) {
        return 'order: 5;'
      } else {
        return 'order: 3;'
      }

    },
    showContent() {
      return this.isFullscreen ? this.$t('editor.fullScreen') : this.$t('editor.exitFullScreen')
    },
    fullscreenIcon() {
      return this.isManagerShow
        ? 'iconfont icon-full-screen_'
        : 'iconfont icon-full_screen_exit'
    }
  },
  methods: {
    ...mapActions({
      resetShowingCol: 'resetShowingCol',
      setIsMultipleTextDialogShow: 'setIsMultipleTextDialogShow',
      setActivePropertyData: 'setActivePropertyData',
      toggleSkyDrive: 'toggleSkyDrive'
    }),
    changeView(type) {
      this.$store.dispatch('setActiveManagePaneComponent', type)
    },
    openZenMode() {
      const dom = this.$el.querySelector('#codeWin')

      if (!dom) {
        return false
      }

      this.resetShowingCol({
        isZenMode: true
      })

      this.$fullscreen.toggle(dom, {
        wrap: false,
        fullscreenClass: 'zenmode',
        callback: (state) => {
          if (!state) {
            this.resetShowingCol({
              isZenMode: false
            })
            const vscroolbar = dom.querySelector(".CodeMirror-vscrollbar")
            // Is very strange. when I set display none, scroolbar is normally
            vscroolbar.style.display = 'none'
          }
        }
      })
    },
    generateStyleString(style) {
      let string = ''
      _.forEach(style, (value, key) => {
        string = string + key + ':' + value + ';'
      })

      return string
    },
    resizeCol(event, leftColWidthParam, rightColWidthParam) {
      if (!(event && event.clientX)) {
        return
      }
      this.resizeWinParams.isResizing = true
      this.resizeWinParams.mouseStartX = event.clientX
      this.resizeWinParams.leftColWidthParam = leftColWidthParam
      this.resizeWinParams.rightColWidthParam = rightColWidthParam
    },
    dragMouseMove(event) {
      if (!(this.resizeWinParams.isResizing && event && event.clientX)) {
        return
      }
      let mouseNowX = event.clientX
      let diffClientX = mouseNowX - this.resizeWinParams.mouseStartX
      let diffPercent = diffClientX / this.bodyWidth * 100
      this.resizeWinParams.mouseStartX = mouseNowX
      let leftColName = this.resizeWinParams.leftColWidthParam
      let rightColName = this.resizeWinParams.rightColWidthParam
      this[leftColName] = this[leftColName] + diffPercent
      this[rightColName] -= diffPercent
    },
    showPreview() {
      this.$emit('showPreview')
    },
    // showPage() {
    //   window.open(this.activePageUrl)
    // },
    dragMouseUp() {
      this.resizeWinParams.isResizing = false
      this.resizeWinParams.leftColWidthParam = ''
      this.resizeWinParams.rightColWidthParam = ''
    },
    setFontStyle(style) {
      this.$refs.codemirror.setFontStyle(style)
    },
    insertHeadline(level) {
      this.$refs.codemirror.insertHeadline(level)
    },
    insertCode() {
      this.$refs.codemirror.insertCode()
    },
    insertLine() {
      this.$refs.codemirror.insertLine()
    },
    insertLink() {
      this.$refs.codemirror.insertLink()
    },
    insertImage() {
      this.$refs.codemirror.insertFile()
    },
    addModToMarkdown() {
      this.$refs.codemirror.addMod()
    },
    openSkyDriveManagerDialog() {
      this.toggleSkyDrive({ showSkyDrive: true })
    },
    async insertBigfile({ file, url }) {
      if (!url) return
      let ext = file.ext || (file.filename || '').split('.').pop()
      let filename = file.filename || url
      const modContent = `
bigFile:
  src: >-
    ${url}
  ext: ${ext}
  filename: ${filename}
  size: ${file.size}
`
      const payload = {
        modName: 'ModBigFile',
        modContent
      }
      this.$refs.codemirror.updateActiveCursor()
      this.$store.dispatch('addBigFileToMarkdown', payload)
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.toggleSkyDrive({ showSkyDrive: false })
      this.insertBigfile({ file, url })
    },
    initMarkdownModDatas() {
      this.editingMarkdownModDatas = {
        content: this.activePropertyData.data,
        key: 'data'
      }
    },
    closeMultipleTextDialog() {
      this.setIsMultipleTextDialogShow({
        isShow: false
      })
    },
    saveMultipleTextDatas() {
      this.setActivePropertyData({
        data: {
          data: this.editingMarkdownModDatas.content
        }
      })
    },
    checkIsModified() {
      return (
        this.editingMarkdownModDatas.content !== this.activePropertyData.data
      )
    },
    handleMultipleTextDialogClose(type) {
      if (type === 'save') {
        this.saveMultipleTextDatas()
        this.closeMultipleTextDialog()
      } else {
        let isModified = this.checkIsModified()
        if (isModified) {
          let that = this
          this.$confirm(
            this.$t('editor.unSaveConfirm'),
            this.$t('editor.closeDialogTitle'),
            {
              confirmButtonText: that.$t('common.Sure'),
              cancelButtonText: that.$t('common.Cancel'),
              type: 'warning'
            }
          ).then(() => {
            this.closeMultipleTextDialog()
          })
        } else {
          this.closeMultipleTextDialog()
        }
      }
    }
  }
}
</script>

<style scoped>
.editor-page-container {
  background-color: #cdd4db;
  padding: 17px 0;
}
.full-height {
  height: 100%;
}
.manager-win,
.preview-win,
.code-win {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
.manager-win {
  order: 1;
  flex-basis: 460px;
  flex-shrink: 0;
}
.manager-content-box {
  flex: 1;
  background-color: #fff;
  overflow-y: auto;
}
.col-between {
  flex-basis: 17px;
  flex-shrink: 0;
  background-color: #cdd4db;
}
.flex-order-one {
  order: 2;
}
.flex-order-two {
  order: 4;
}
.editor-resizer {
  cursor: col-resize;
}
.editor-resizer:hover {
  background-color: #d9eafb;
}
#frameViewport {
  border: none;
}
.mouse-event-backup {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 122;
}

.manager-win .el-button,
.code-win .el-button {
  width: 50px;
  height: 40px;
}
.code-win .el-button.is-circle {
  width: 40px;
  border-radius: 50%;
  padding: 0;
}
.code-win .is-circle .iconfont {
  font-size: 18px;
}
.manager-win .el-button-group .el-button--primary {
  border-color: #409eff;
}
.toolbar {
  background-color: #fff;
  padding: 9px 20px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  flex-shrink: 0;
}
.toolbar-content {
  min-width: 500px;
  margin: 0 auto; 
}
.toolbar-content_left {
  display: inline-block;
  vertical-align: middle
}
.toolbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f5f5;
}
.toolbar::-webkit-scrollbar-track {
  border-radius: 0px;
  background-color: #f5f5f5;
}
.toolbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.toolbar .fullScreenBtn {
  float: right;
}
.toolbar .fullScreenBtn .el-button {
  border-radius: 4px;
}
.iconfont {
  padding: 0;
  width: 50px;
  height: 40px;
  font-size: 27px;
}
.code-win .iconfont {
  font-size: 16px;
}
.guid-col {
  order: 6;
  background: url('../../assets/img/background.png') no-repeat top right #fff;
  background-size: 45%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #48a3ff;
  position: relative;
}
.guid-col .guid-help {
  width: 56px;
  height: 56px;
  background-color: #ffa33e;
  border: solid 4px #ffc586;
  border-radius: 50%;
  line-height: 56px;
  justify-content: center;
  text-align: center;
  font-size: 17px;
  color: #fff;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.guid-col .guid-help a {
  color: #fff;
  text-decoration: none;
}
.guid-col .guid-help::before {
  content: '';
  width: 21px;
  height: 21px;
  background-color: rgba(202, 149, 91, 0.28);
  position: absolute;
  right: -16px;
  bottom: -16px;
  border-radius: 50%;
}
.guid-col h1 {
  margin: 0 0 36px 0;
  font-size: 46px;
}
.code-win-fullscreen {
  width: 100% !important;
  height: 100%;
  background-color: #cdd4dc;
  max-width: 1080px;
}
@media (max-width: 1920px) {
  .manager-win {
    flex-basis: 320px;
  }
}
</style>
<style lang="scss">
.zenmode {
  background-color: black;
  background-image: url('../../assets/img/cubes.png');

  .toolbar {
    width: 100%;
    margin: 0 auto!important;
    padding: 0;
    overflow: hidden;
    background-color: #1c1c1c;

    .el-scrollbar {
      width: 1080px;
      margin: 0 auto;
    }

    .toolbar-content {
      padding: 8px;

      .zenmode-icon {
        float: left;
        margin-top: 5px;

        img {
          vertical-align: middle;
        }

        i {
          color: #5e5e5e;
          vertical-align: middle;
        }
      }

      .toolbar-content_left {
        text-align: right;
        float: right;

        button {
          background-color: #1c1c1c;
          border-color: #303133;
        }

        button:hover {
          background-color: #333333;
          color: white;
        }

        button:active {
          color: white;
        }
      }
    }

    .fullScreenBtn {
      display: none;
    }
  }

  .kp-md-editor {
    width: 1080px;
    margin: 0 auto;

    .CodeMirror-vscrollbar::-webkit-scrollbar {
      width: 10px;
    }

    .CodeMirror-vscrollbar::-webkit-scrollbar-thumb{
      background: #3b3b3b;
      border-radius: 20px;
    }

    .CodeMirror-vscrollbar::-webkit-scrollbar-track {
      background: #1c1c1c;
      border-radius: 20px;
    }
  }
}

.manager-win {
  .el-scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: auto;
  }
  .manager-content-box {
    background-color: #fff;
  }
  .manager-content-inner {
    height: 100%;
  }
  
}

.el-tooltip__popper {
  font-size: 14px;
}

.multiple-text-dialog {
  .el-dialog {
    width: 1300px;
    max-width: 80vw;
  }
  .el-dialog__header {
    background-color: #3ba4ff;
    padding: 8px 30px;
  }
  .el-dialog__title {
    color: #fff;
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    top: 15px;
    right: 14px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .el-diaog__body {
    padding: 30px 0;
  }
  .el-textarea__inner {
    border: none;
    height: 640px;
    max-height: 70vh;
  }
  .el-button--primary {
    padding: 7px 45px;
  }
}
</style>
