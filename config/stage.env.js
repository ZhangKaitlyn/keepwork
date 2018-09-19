'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const { i18nDomainLabel } = require('./i18n')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK: `"https://stage.keepwork.com"`,
  KEEPWORK_API_PREFIX: `"https://stage${i18nDomainLabel('-')}.keepwork.com/api/wiki/models"`,
  GITLAB_API_PREFIX: `"https://git-stage${i18nDomainLabel('-')}.keepwork.com"`,
  GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com"`,
  ES_GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/es"`,
  STORAGE_GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/storage/v0"`,
  LESSON_API_PREFIX: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/lesson/v0"`,
  ES_INDEX: `"www_pages_v1"`,
  ES_TYPE: `"pages"`,
  PARACRAFT: `"https://www.paracraft.cn"`,
  QQ_URL: `"http://wpa.qq.com"`,
  BOARD: `"https://stage.keepwork.com/wiki/wikieditor/board.stage.html?"`,
  PDF: `"https://keepwork.com/pdf"`,
  PACKAGE_GOOD_DETAIL: {
    APP_NAME: `"lessons"`,
    APP_GOODS_ID: 1
  },
  LESSON_VIP_DETAIL: {
    APP_NAME: `"LessonVIP"`,
    APP_GOODS_ID: 1
  }
})
