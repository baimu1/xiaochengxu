
Page({
  // 页面的初始数据  
  data: {
    newList: [],  //列表
    scrollHeight: 0,
    size: 0, //每页显示记录数
    offset: 0, //从哪条记录开始
    type: 1, //音乐类型的类别
    page: 1, //初始页码
    dataId:0,
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
  
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
    var that = this;
    
    //解决scrollHeight 的高度问题
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight 
        })
      }
    })

    //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: 'http://www.imooc.com/course/ajaxlist', //接口地址
      data: {
        type: that.data.type,
        size: that.data.size,
        offset: that.data.offset
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
        // //下次就直接请求第二页
        // that.data.page++;
      }
    })
  },


  loadMore: function (options) {
    var that = this;
    console.log(111111)
    
    that.setData({
      page: ++that.data.page
    })
    //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })

    wx.request({
      url: 'http://www.imooc.com/course/ajaxlist', //接口地址
      data: {
        type: that.data.type,
        size: that.data.size,
        offset: that.data.offset,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data);
        for (var i = 0; i < res.data.list.length;i++){
           that.data.newList.push(res.data.list[i]);
        }
   
        //赋值数据
        that.setData({
          newList: that.data.newList
        })
       

        wx.hideLoading()

      }
    })


  },

  tiao: function (e) {
    // console.log(this);
    // console.log(event)
    var detailId = e.currentTarget.id
    console.log(detailId)
    for (var i = 0; i < this.data.newList.length; i++) {
      if (detailId == this.data.newList[i].id) {
        var detail = this.data.newList[i];
      }
    }
    console.log(detail)
    wx.navigateTo({
      url: '/pages/newdetail/newdetail?detail=' + JSON.stringify(detail)
    })




  }



})