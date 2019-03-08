//app.js
App({
  onLaunch: function () {
    //调用微信的login方法会返回code
    wx.login({
      success: function (res) {
        var openid = wx.getStorageSync("openid")
        if (openid) {
          getApp().globalData.openid = openid;
          getInfoByOpenid(openid);
        } else {
          var appid = "wx38d556595a60a0c5";
          var secret = "b1168f20709b6bbf3645c7f9664956e7";
          var code = res.code;
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            success: function (res) {
              openid = res.data.openid;
              getApp().globalData.openid = openid;
              //把用户的openid保存到本地
              wx.setStorageSync('openid', openid);
              getInfoByOpenid(openid);
            }
          })
        }
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    bikeNo: 10000008,
    openid: "",
    status: 0,
    balance: 0, //余额
    userInfo: null
  }
})

function getInfoByOpenid(openid) {
  wx.request({
    url: "http://localhost:8888/phoneNum/" + openid,
    success: function (res) {
      var user = res.data;
      if (user) {
        var phoneNum = user.phoneNum;
        var status = user.status;
        getApp().globalData.phoneNum = phoneNum;
        getApp().globalData.status = status;
        //把用户的openid保存到本地
        wx.setStorageSync('phoneNum', phoneNum);
        wx.setStorageSync('status', status);
      }
    }
  })
}
