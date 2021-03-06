const getCurrentEnv = () => {
  let env = null
  let currentEnv = process.env.KEEPWORK_API_PREFIX
  if (/release/.test(currentEnv)) {
    env = 'RELEASE'
  }
  if (/stage/.test(currentEnv)) {
    env = 'STAGE'
  }
  return env
}

const getUrl = ({
  protocol = 'paracraft',
  paramA = '',
  paramB = '',
  usertoken = '',
  link = ''
}) => {
  let env = getCurrentEnv()
  let actualUrl = env
    ? `protocol="${protocol}" paramA="${paramA}" paramB="${paramB}" usertoken="${usertoken}" env="${env}" cmd/loadworld ${link}`
    : `protocol="${protocol}" paramA="${paramA}" paramB="${paramB}" usertoken="${usertoken}" cmd/loadworld ${link}`
  let encodeUrl = encodeURIComponent(actualUrl)
  return `${protocol}://${encodeUrl}`
}

const getOpenUrl = ({
  protocol = 'paracraft',
  paramA = '',
  paramB = '',
  usertoken = ''
}) => {
  let env = getCurrentEnv()
  let actualUrl = env
    ? `protocol="${protocol}" paramA="${paramA}" paramB="${paramB}" usertoken="${usertoken}" env="${env}" `
    : `protocol="${protocol}" paramA="${paramA}" paramB="${paramB}" usertoken="${usertoken}"`
  let encodeUrl = encodeURIComponent(actualUrl)
  return `${protocol}://${encodeUrl}`
}
export default {
  getUrl,
  getOpenUrl
}
