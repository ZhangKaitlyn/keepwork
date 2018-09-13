let emptyData = {
  imgLoop: {
    data: []
  }
}

export default [
  // style 0
  {
    data: {
      // 定义mod根div的样式
      root: {
        position: 'relative',
        overflow: 'hidden',
        zoom: 1
      }
    },
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        imgLoop: { height: '150px' }
      }
    },
    cover: ''
  },

  // style 1
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: ''
  }
]
