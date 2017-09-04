function parseLyric(lrc) {
  var lyrics = lrc.split("\n");
  var lrcObj = {};
  for (var i = 0; i < lyrics.length; i++) {
    var lyric = decodeURIComponent(lyrics[i]);
    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    var timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    var clause = lyric.replace(timeReg, '');
    for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
      var t = timeRegExpArr[k];
      var min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1));
      var time = min * 60 + sec;
      lrcObj[time] = clause;
    }
  }
  return lrcObj;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detail:[],
    musicLrc:'',
    scrollHeight: 0,
  },
  // 生命周期函数--监听页面加载
   
  onLoad: function (options) {
     var that = this;
     console.log(options);
     var id = options.id;

     that.audioCtx = wx.createAudioContext('myAudio'); //获取audio组件对象
     that.audioCtx.play();
     //解决scrollHeight 的高度问题
     wx.getSystemInfo({
       success: function (res) {
         that.setData({
           scrollHeight: res.windowHeight - 100
         })
       }
     })
     
     //加载Loading状态显示
     wx.showLoading({
       title: '数据加载中',
     })
    var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + id;
     wx.request({
       url: url,
       success: function (res) {
         console.log(res.data.songinfo);
         that.setData({
           detail: res.data.songinfo
         })

         // 需不需要将歌曲的lrc歌词获取到？
         wx.request({
           url: res.data.songinfo.lrclink,
           success: function (res) {
             console.log(parseLyric(res.data))
             that.setData({
               musicLrc: parseLyric(res.data)
             })
           }
         })
         that.audioCtx.play();
         wx.hideLoading()
       }
     })

  }
 
})