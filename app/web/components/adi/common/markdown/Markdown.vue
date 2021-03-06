<template>
  <div :class="getClass">
    <vue-markdown
      :toc="true"
      :source="validData"
      :postrender="postrender"
      toc-anchor-link-symbol=""
      toc-anchor-class="iconfont icon-link_"
      />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'
import preset from 'jss-preset-default'

export default {
  name: 'AdiMarkdown',
  mixins: [compBaseMixin],
  computed: {
    getClass() {
      let className = 'comp-space'
      let style = {
        [className]: {
          'margin-top': this.options.space && this.options.space.webMarginTop + '!important',
          'margin-bottom': this.options.space && this.options.space.webMarginBottom + '!important',
          'padding-top': this.options.space && this.options.space.webPaddingTop + '!important',
          'padding-bottom': this.options.space && this.options.space.webPaddingBottom + '!important'
        },
        '@media only screen and (max-width: 767px)': {
          [className]: {
            'margin-top': this.options.space && this.options.space.mobileMarginTop + '!important',
            'margin-bottom': this.options.space && this.options.space.mobileMarginBottom + '!important',
            'padding-top': this.options.space && this.options.space.mobilePaddingTop + '!important',
            'padding-bottom': this.options.space && this.options.space.mobilePaddingBottom + '!important'
          }
        }
      }

      if (!this.sheet) {
        this.sheet = jss.createStyleSheet(style)
        this.sheet.attach()
      }

      return 'markdown-body comp-markdown ' + this.sheet.classes[className]
    },
    validData() {
      let isEmpty = !(this.properties.data && this.properties.data.trim())
      if (isEmpty && this.options.emptyAutoSizeInput ) return this.$t(this.options.emptyAutoSizeInput)
      return this.properties.data
    }
  },
  methods: {
    stripScripts(htmlData) {
      var div = document.createElement('div');
      div.innerHTML = htmlData;
      var scripts = div.getElementsByTagName('script');
      var i = scripts.length;
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
      }
      return div.innerHTML;
    },
    postrender(htmlData) {
      if (!this.options.enableScript) htmlData = this.stripScripts(htmlData)
      return htmlData
    }
  },
  components: {
    VueMarkdown
  }
}
</script>

<style lang="scss">
@import '~github-markdown-css/github-markdown.css';
@import '~highlight.js/styles/atom-one-light.css';

.comp-markdown {
  color: unset;
  font-size: unset;

  p {
    word-wrap: break-word;
  }

  .icon-link_:before{
    width: 100px;
    height: 100px;
    font-size: 20px;
    margin-left: -23px;
    opacity: 0;
  }

  .icon-link_:hover:before{
    opacity: 1;
  }

  .icon-link_:hover{
    text-decoration: none;
  }

  h1,h2,h3,h4,h5,h6{
    &:hover{
      .icon-link_:before{
        opacity: 1;
      }
    }
  }
}
</style>

