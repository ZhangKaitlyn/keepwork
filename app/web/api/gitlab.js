import axios from 'axios'
import _ from 'lodash'

export const showRawForGuest = async (
  rawBaseUrl,
  // dataSourceUsername,
  projectName,
  path
) => {
  path = path
    .split('/')
    .filter(i => i)
    .join('/')
  projectName =
    projectName ||
    path
      .split('/')
      .splice(0, 2)
      .join('/')
  projectName = encodeURIComponent(projectName)
  path = encodeURIComponent(path)
  let url = `${rawBaseUrl}/projects/${projectName}/files/${path}`
  let res = await axios.get(url)
  let content = _.get(res, 'data.content', '')
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export default {
  showRawForGuest
}
