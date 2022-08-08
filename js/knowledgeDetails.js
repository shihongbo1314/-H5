var theRequest;
$(function () {
    //从另一个html页面传来的值，在这里获取
    var url = window.location.search; //获取url中"?"符后的字串 ('?id=.....')
    $('body').append(window.location);
    theRequest = JSON.parse(localStorage.getItem('iframeData'));
    // 	延时加载
    window.setTimeout(initData, 50);
})

function initData() {
    var title = theRequest.typeName;
    $("#title").text(title);
    var searchUrl = "./" + theRequest.dataUrl;
    $("#iframeFile").attr("src", searchUrl);
}