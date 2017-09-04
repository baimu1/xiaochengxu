function parseLyric(lrc){
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
   // 页面的初始数据 
  data: {
     songList:[],  //歌曲列表
     songIdList:[],  //歌曲的ID列表
     scrollHeight:0, //scroll-view的高度是动态获取的
     size:5, //每页显示记录数
     offset:0, //从哪条记录开始
     type:1, //音乐类型的类别
     page:1, //初始页码
     song_id:0,
     music:{},
     playingMusicId:0,
     musicLrc:'',
     musicLineLrc:'',
     musicPercent: 0,
  },

 // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    that.audioCtx = wx.createAudioContext('myAudio'); //获取audio组件对象
    
    //解决scrollHeight 的高度问题
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight:res.windowHeight - 100
        })
      }
    })

    //加载Loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })
  
    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList', //接口地址
      data: {
       type:that.data.type,
       size:that.data.size,
       offset:that.data.offset
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        var idList = [];
        for (var i = 0; i < res.data.song_list.length;i++){
          idList.push(res.data.song_list[i].song_id);
        }

        //赋值数据
        that.setData({
          songIdList:idList,
          songList:res.data.song_list
        })

        wx.hideLoading()

        //下次就直接请求第二页
        that.data.page++;

        that.playIdMusic(that.data.songIdList[that.data.playingMusicId])
      }
    })

  },

  loadMore: function () {
    var that = this;
    //加载前加上loading状态显示
    wx.showLoading({
      title: '数据加载中',
    })

    //计算一个offset
    var newOffset = (that.data.page - 1) * that.data.size;

    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList', //仅为示例，并非真实的接口地址
      data: {
        type: that.data.type,
        size: that.data.size,
        offset: newOffset
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        //将id生成为array数组
        var idList = [];
        for (var i = 0; i < res.data.song_list.length; i++) {
          //在原来修改的data数据基础上进行数组的追加操作
          that.data.songList.push(res.data.song_list[i]);
          that.data.songIdList.push(res.data.song_list[i].song_id);
        }
        // 赋值数据
        that.setData({
          songIdList: that.data.songIdList,
          songList: that.data.songList
        })
        // console.log(that.data.songIdList);
        wx.hideLoading()

        that.data.page++;

      }
    })
  },

  playNextMusic: function (event) {
    // 播放下一首歌曲
    var that = this;
    var nextMusicPos = that.data.playingMusicId + 1;
    var nextMusicSongId = that.data.songIdList[nextMusicPos];
    that.playIdMusic(nextMusicSongId);
    that.setData({
      playingMusicId: nextMusicPos
    })

  },
  playIdMusic: function (songId) {
    // 播放指定的歌曲
    var that = this;
    var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + songId;
    wx.request({
      url: url,
      success: function (res) {
        that.setData({
          music: res.data
        });
        // 需不需要将歌曲的lrc歌词获取到？
        wx.request({
          url: res.data.songinfo.lrclink,
          success: function (res) {
            that.setData({
              musicLrc: parseLyric(res.data)
            })
            // parseLyric进行了歌词的解析
            that.audioCtx.play();

          }
        })
      }
    })


  },
  seek: function () {
    this.audioCtx.seek(300)
  },


  playMusic: function(event) {
    // 播放歌曲
    var that = this;
    var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + event.currentTarget.dataset.songid;
    wx.request({
      url: url,
      success: function (res) {
        that.setData({
          music: res.data
        });
        // 需不需要将歌曲的lrc歌词获取到？
        wx.request({
          url: res.data.songinfo.lrclink,
          success: function (res) {
            // console.log(res);
            that.setData({
              musicLrc: parseLyric(res.data)
            })      
          that.audioCtx.play();

          }
        })
      }
    })
  },
  changMusicLrc: function (event) {
    // 改变歌词
    var timePosition = Math.floor(event.detail.currentTime);
    var musicPercent = parseInt(event.detail.currentTime / event.detail.duration * 100);


    var that = this;
    that.setData({
      musicPercent: musicPercent,
      musicLineLrc: that.data.musicLrc[timePosition]
    })

  },

  tiao: function (e) {
    var dataId = e.currentTarget.id;
    console.log(dataId);
    wx.navigateTo({
      url: '/pages/musicdetail/musicdetail?id=' + dataId,

    })

  }

})