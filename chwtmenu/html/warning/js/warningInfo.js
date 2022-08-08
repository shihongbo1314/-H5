var theRequest;
$(function() {
	//从另一个html页面传来的值，在这里获取
    var url =window.location.search; //获取url中"?"符后的字串 ('?id=.....')
    $('body').append(window.location);
    theRequest = JSON.parse(localStorage.getItem('iframeData'));
// 	延时加载
    window.setTimeout(initData, 100);
})

function initData(){
	console.log(theRequest)
//    var type=theRequest["预警类型"]+theRequest["预警级别"]+"预警";
    $(".m-signal-type").html(theRequest["HEADLINE"]);
    
//    var time=theRequest["发布日期"];
//    time = time.substr(0, 4) + "年" + time.substr(4, 2) + "月" + time.substr(6, 2) + "日  "+ time.substr(8, 2) + ":" + time.substr(10, 2)+"发布";
    $(".m-signal-time").html(theRequest["SENDTIME"]+"发布");
//    
//    var content=theRequest["预警内容"];
    $(".m-signal-content").html(theRequest["MESSAGE"]+"发布");
   
//    var guid=theRequest["防御指南"];
//    $(".m-signal-guid").html(guid);
//    
    var title1=theRequest.HEADLINE.split("[")[0]
	var title2=title1.split("发布")[1]
	var title3=title2.split("预警")[0]
	var imageUrl=""
	if(title3.indexOf("雷电大风")!=-1){
		imageUrl="../../img/yjImgStr/elseyj.png"
	}else{
		imageUrl="../../img/yjImgStr/"+title3+"_small.png"
	}
    $(".yjImg").attr("src",imageUrl);
}
