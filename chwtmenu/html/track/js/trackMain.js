$(function() {
	// getRegion()
	// 点击城市名称查询该城市数据
	// $("#sliderSegmentedControl").on("click", "label", function() {
	// var data = $(this).data("data");
	// getData(data);
	// })
	showData()
})
// 查询区域
// function getRegion() {
//
// $("#sliderSegmentedControl>div").empty();
// $
// .ajax({
// url :
// "https://www.sdmscenter.com//wechat/sdtq/listConventionalForecastRegion.do",
// dataType : "json",
// success : function(res) {
// if (res.state == 1001) {
//						
// var dataArray = res.data
// if (dataArray != null) {
// var sortData = getMinSort(dataArray);
// sortData.reverse();
// for (var i = sortData.length - 1; i >= 0; i--) {
// if (sortData[i]["name"] == "省气象台") {
// sortData[i]["name"] = "山东省";
// }
// if (i == sortData.length - 1) {
// var labelObj = $("<label class='mui-control-item mui-active'>"
// + sortData[i]["name"] + "</label>");
// } else {
// var labelObj = $("<label class='mui-control-item'>"
// + sortData[i]["name"] + "</label>");
// }
//
// labelObj.data("data", sortData[i]);
// $("#sliderSegmentedControl>div").append(
// labelObj);
// }
// $("#sliderSegmentedControl>div label").eq(0)
// .click();
//
// }
// }
// }
// })
// }
function showData() {
	mui.showLoading();
	$('.weui-cell-third').empty();
	$.ajax({
		url : BASEPATH + "data/product/get",
		data : {
			regionId : "1",
			pageSize : "20",
			pageCurrent : "0",
			sendType : "2"
		},
		dataType : "json",
		success : function(res) {

			if (res.state == 1) {
				var dataArray = res.records
				if (dataArray != null) {
					for (var i = 0; i < dataArray.length; i++) {
						console.log(dataArray[i])
						var datatime = dataArray[i].time;
						if (datatime != null) {
							dataArray[i].timeStr = datatime.substring(0, 4)
									+ "年" + datatime.substring(4, 6) + "月"
									+ datatime.substring(6, 8) + "日"
									+ datatime.substring(8, 10) + "时发布"	
						}
						
						 if (dataArray[i].imgs != null) {
				                var imgStr = dataArray[i].imgs.split(",")
				                for (let ii = 0; ii < imgStr.length; ii++) {
				                  imgStr[ii] = BASEPATH_IMAGE_PATH + dataArray[i]["prefix"]+imgStr[ii]
				                }
				                dataArray[i].imgpath = imgStr;
				          
						 }
						 var divObj = $("<div class='weui-cell-list'><div class='weui-cell-line'>"
								 +"<div class='weui-cell-circle'><div></div></div>"
								 +"<div class='infobox'><div class='arrow'></div><div class='contentlsit'>"
								 +"<div class='weui-cell-content'><div class='weui-cell-username floarLeft'>"+dataArray[i]["name"]+"</div></div>"
								 +"<div class='contentlsit-line'></div>"
								 +"<div class='weui-cell-event floarLeft'>山东省</div>"
								 +"<div class='weui-cell-time floarLeft'>"+dataArray[i]["timeStr"]+"</div>"
								 +"</div></div></div></div>")	
						 
						 var nextDiv = $("<div class='weui-cell-imglist'></div>");
						 for(var j=0;j<dataArray[i]["imgpath"].length;j++){
							 var nextImg=$("<img class='weui-cell-img' src='"+dataArray[i]["imgpath"][j]+"'  data-preview-src='' data-preview-group='1'>")         
							 nextDiv.append(nextImg);
						 }
						 divObj.find(".weui-cell-time").append(nextDiv);
						 $('.weui-cell-third').append(divObj);
					}

				}
			}
			mui.hideLoading();
		}
	})
}
