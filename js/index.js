// var stringApi = "https://www.googleapis.com/youtube/v3/videos?id=jeqH4eMGjhY&key=AIzaSyANA-PVMLlG5IqehQGLNi5zQDzjnDNAe0U&part=snippet&";
var videoURL = "https://www.youtube.com/embed/"
var stringApi = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=UUMUnInmOkrWN4gof9KlhNmQ&key=AIzaSyANA-PVMLlG5IqehQGLNi5zQDzjnDNAe0U&maxResults=6";
var channelAPI = "https://www.googleapis.com/youtube/v3/channels?part=snippet&key=AIzaSyANA-PVMLlG5IqehQGLNi5zQDzjnDNAe0U&id="

var video_screen = new Vue({
    el: "#mainScreen",
    data: {
        getVideoList: '',
        nowVideoItem: {}, //此時的影片
        playVideoList: [], //影片播放清單
        channelImage: "1", //目前頻道照片
    },
    created: function() {
        //初始化
        this.fetchFirstData();
    },
    methods: {
        fetchFirstData: function() {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open("get", stringApi);
            xhr.onload = function() {
                self.getVideoList = JSON.parse(xhr.responseText);

                //取出影片列表itemList
                self.getVideoList = self.getVideoList.items;

                //對影片相關資料做處理
                self.getVideoList.forEach(element => {
                    //預先製作好影片的url路徑
                    element.url = videoURL + element.contentDetails.videoId;
                    //預先製作好title樣式，並限制title長度
                    var getTitle = element.snippet.title;
                    if (getTitle.length >= 28) {
                        element.titleCaption = getTitle.substr(0, 28) + "..."; //(起始位置，取多長)
                    } else {
                        element.titleCaption = getTitle;
                    }
                    //預先做好titleDate
                    var date = new Date(element.contentDetails.videoPublishedAt);
                    element.titleDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + (date.getDate()) + "日";
                });

                //取出第一個影片
                self.nowVideoItem = self.getVideoList[0];
                //把第一個使用過的影片去除
                self.getVideoList.splice(0, 1);
                self.playVideoList = self.getVideoList;

                //抓頻道照片
                self.findImage();
            };
            xhr.send();
        },
        //抓頻道照片
        findImage: function() {
            var xhr = new XMLHttpRequest();
            // console.log(this);
            var self = this;
            var getChannelId = self.nowVideoItem.snippet.channelId;
            xhr.open("get", channelAPI + getChannelId);
            xhr.onload = function() {
                var getChannelDetail = JSON.parse(xhr.responseText);
                this.channelImage = getChannelDetail.items[0].snippet.thumbnails.medium.url;
                console.log("成功", this);
            };
            xhr.send();
        },
        //交換影片事件
        selectedEvent: function(selectedItem) {
            //得到要交換的影片
            var getPreVideoItem = this.nowVideoItem;
            this.nowVideoItem = selectedItem;
            this.playVideoList.splice(this.playVideoList.indexOf(selectedItem), 1, getPreVideoItem);
        },

    }
});


// 將 Vue 實體掛載至新生成的節點
// vm.$mount(el);