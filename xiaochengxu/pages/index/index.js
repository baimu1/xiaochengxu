//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img.pconline.com.cn/images/bbs4/200911/9/1257739367445.jpg',
      'http://p4.so.qhimgs1.com/t014c8d4037e7a9956a.jpg',
      'http://img.ivsky.com/img/bizhi/201007/28/tianyuan-008.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular:true,

    scrollTop: 100,

    movieList:[], //电影列表
    songList: [],  //歌曲列表
    newList: [],  //列表
    size: 5, //每页显示记录数
    offset: 0, //从哪条记录开始
    type: 1, //音乐类型的类别
    },
   
  

  //电影
  onReady: function (options) {
    var that = this;
    //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: 'https://api.douban.com/v2/movie/in_theaters', //接口地址
      method: 'post',
      data: {
        // type: that.data.type,
        // size: that.data.size,
        // offset: that.data.offset
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)

        //赋值数据
        that.setData({
          movieList: res.data.subjects
        })
      }
    })

    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList', //接口地址
      data: {
        type: that.data.type,
        size: 5,
        offset: that.data.offset
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)

        //赋值数据
        that.setData({
          songList: res.data.song_list
        })
      }
    })

    wx.request({
      url: 'http://www.imooc.com/course/ajaxlist', //接口地址
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        //赋值数据
        that.setData({
          newList: res.data.list
        })

        wx.hideLoading()
      }
    })


    
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;

    //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })

    

    wx.hideLoading()
   
  }
   
})