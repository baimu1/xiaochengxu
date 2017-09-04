// pages/newdetail/newdetail.js
Page({
  data: {
    newList:'',  //列表
  },

  // 生命周期函数--监听页面加载
  
  onLoad: function (options) {

   //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })
    
    console.log(options)
    this.setData({
      newList: JSON.parse(options.detail)
    })
    console.log(this.data.newList, 2)

     wx.hideLoading()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})