<template>
  <el-dialog
    v-if='show'
    :title="title"
    class="skydrive-manager-dialog"
    :class="{'skydrive-manager-dialog-media-mode': mediaLibrary}"
    :close-on-click-modal="false"
    :visible.sync="show" width="960px"
    :before-close="handleClose"
    :append-to-body='true'
  >
    <sky-drive ref='skyDriveManager' :isSiteMode='isSiteMode' :mediaLibrary='mediaLibrary' :isVideoTabShow='isVideoTabShow' :insertable='insertable' @close='handleClose'></sky-drive>
  </el-dialog>
</template>

<script>
import SkyDriveManager from './SkyDriveManager'

export default {
  name: 'SkyDriveManagerDialog',
  props: {
    isSiteMode: {
      validator: function (value) {
        return [true, false, undefined].indexOf(value) !== -1
      }
    },
    show: Boolean,
    mediaLibrary: Boolean,
    isVideoTabShow: Boolean,
    insertable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: this.mediaLibrary ? this.$t('skydrive.mediaLibrary') : this.$t('skydrive.skyDrive')
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    handleClose(event) {
      let { uploadingFiles } = this.$refs.skyDriveManager
      let that = this
      let uploadingFileIndex = _.findIndex(uploadingFiles, ['state', 'doing'])
      if (uploadingFileIndex >= 0) {
        this.$confirm(this.$t('skydrive.fileUploading'), this.$t('editor.closeDialogTitle'), {
          confirmButtonText: this.$t('common.Sure'),
          cancelButtonText: this.$t('common.Cancel'),
          type: 'warning'
        }).then(() => {
          that.$emit('close', event)
        }).catch(() => {});
      }else{
        this.$emit('close', event)
      }
    }
  },
  components: {
    'sky-drive': SkyDriveManager,
  }
}
</script>

<style lang="scss">
.skydrive-manager-dialog-media-mode {
  >.el-dialog {
    border-radius: 10px;
    overflow: hidden;
    .el-dialog__header {
      padding: 35px 35px 10px;
      background: #E8E8E8;
    }
    .el-dialog__body {
      padding: 30px 35px;
    }
    .el-loading-mask {
      left: -35px;
      right: -35px;
    }
  }
}
</style>
