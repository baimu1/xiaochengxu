
Page({
  // 页面的初始数据  
  data: {
    movieList:[],  //列表
    size: 5, //每页显示记录数
    offset: 0, //从哪条记录开始
    page: 1, //初始页码
    id: 0
  },

  // 生命周期函数--监听页面加载
 
  onLoad: function (options) {
    var that = this;  

    //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })

    wx.request({
      url: 'https://api.douban.com/v2/movie/in_theaters', //接口地址
      method:'post',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
    
        //赋值数据
        that.setData({
          movieList: res.data.subjects
        })
     
        wx.hideLoading()

        //下次就直接请求第二页
        that.data.page++;
      }
    })


  },
  lower:function(){

  }

})