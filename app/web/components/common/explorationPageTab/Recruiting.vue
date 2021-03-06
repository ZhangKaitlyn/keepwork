<template>
  <div class="recruiting" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in recruitmentData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="recruitingCount > perPage">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="recruitingCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from '../ProjectCell'
import _ from 'lodash'
import { EsAPI } from '@/api'
import TabMixin from './TabMixin'

export default {
  name: 'Recruiting',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      recruitongProjects: [],
      loading: true
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
    this.loading = false
  },
  computed: {
    recruitingCount() {
      return _.get(this.recruitongProjects, 'total', 0)
    },
    recruitmentData() {
      let hits = _.get(this.recruitongProjects, 'hits', [])
      return _.map(hits, i => {
        return {
          id: i.id,
          extra: { imageUrl: i.cover, videoUrl: i.video  },
          name: i.name,
          name_title: this.searchKeyResult(i),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { username: i.username, portrait: i.user_portrait || '' },
          updatedAt: i.updated_time,
          createdAt: i.created_time,
          type: i.type,
          privilege: i.recruiting ? 1 : 2
        }
      })
    }
  },
  methods: {
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await EsAPI.projects
          .getProjects({
            page: targetPage,
            per_page: this.perPage,
            recruiting: true,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(res => {
            this.recruitongProjects = res
          })
          .catch(err => console.error(err))
        this.loading = false
        this.$emit('getAmount', this.recruitingCount)
      })
    },
    searchKeyResult(i) {
      if (i.highlight) {
        let name = _.get(i.highlight, 'name', i.name)
        return name.join().replace(/<span>/g, `<span class="red">`)
      }
      return i.name
    }
  },
  components: {
    ProjectCell
  }
}
</script>

