$(function() {
	getData()
})
// 查询数据
function getData() {
	mui.showLoading();
	//爱山东
//	var signurl = 'https://' + urldomaincreatesign;//签名接口地址
//	var gatewayurl = 'https://' + urldomaingateway;//网关接口地址
//	var appid="chwtscpub";//应用唯一标识
//	var fromport="0";//端口来源”0”：PC；”1”：APP；”2”：支付宝；”3”：微信
//	var interfaceid="fwzxchwtshzscxjk"//功能类型-生活指数
//	var interfacecontent={"regionCode":"370102"};//接口参数
//	vaildInterfacefn(appid, interfaceid, interfacecontent, fromport, signurl, gatewayurl).then(value => {
//				var moduleResult = value
//				console.log("bgy",moduleResult)
//				if(moduleResult == false) {//失败返回
//					return;
//				}else{//接口成功返回
//					
//				}
//	})
	$.ajax({
		url :BASEPATH + "data/life-index/get",
		data : {
			regionCode : "370102",
		},
		success : function(res) {
			if (res.state == 1) {
				var dataArray = res.records;
				if (JSON.stringify(dataArray) != "{}") {
					showData(dataArray)

				} else {
					showNothing()
				}
			} else {
				showNothing()
			}
			mui.hideLoading();

		},
		error : function(data) {
			showNothing()
			mui.hideLoading();
		}
	})

}
// 显示数据
function showData(dataArray) {
	var todayArray = [];
	if (JSON.stringify(dataArray) != "{}") {
		if (dataArray["airConditioner"].length == 0) {
			var newdataArray1 = [ {
				"time" : dataArray["human"][0]["time"],
				"proposal" : "-",
				"level" : "-"
			}, {
				"time" : dataArray["human"][1]["time"],
				"proposal" : "-",
				"level" : "-"
			}, {
				"time" : dataArray["human"][2]["time"],
				"proposal" : "-",
				"level" : "-"
			} ]
			dataArray["airConditioner"] = newdataArray1
		}
		if (dataArray["heatstroke"].length == 0) {
			var newdataArray2 = [ {
				"time" : dataArray["human"][0]["time"],
				"proposal" : "-",
				"level" : "-"
			}, {
				"time" : dataArray["human"][1]["time"],
				"proposal" : "-",
				"level" : "-"
			}, {
				"time" : dataArray["human"][2]["time"],
				"proposal" : "-",
				"level" : "-"
			} ]
			dataArray["heatstroke"] = newdataArray2
		}

		for ( var key in dataArray) {
			if (dataArray[key].length != 0) {
				for (var i = dataArray[key].length - 1; i >= 0; i--) {
					dataArray[key][i].type = key
					todayArray.push(dataArray[key][i])
				}
			}
		}
		$("#sliderSegmentedControl").empty();
		if (todayArray.length != 0) {
			var newArray = sortArr(todayArray, "time")
			var item_width = "33.33%";
			newArray.reverse()
			var ultimate=[];
			for (var i = 0; i < 3; i++) {
				ultimate.push(newArray[i])
			}
			ultimate.reverse()
			for (var i = 0; i < ultimate.length; i++) {
				var timeData = ultimate[i][0]["time"]
				timeData = timeData.substring(4, 6) + "/"
						+ timeData.substring(6, 8)
				var dayData = ""
				var timeStr = timeData.substring(0, 4)
						+ timeData.substring(4, 6) + timeData.substring(6, 8)
						
					if(i==0){
						dayData = "今天"
					}else if(i==1){
						dayData = "明天"
					}else if(i==2){
						dayData = "后天"
					}
						
				

				if (i == 0) {
					var labelObj = $('<div class="control-item-inline" style="width:'
							+ item_width
							+ '">'
							+ '<div class="mui-control-item mui-active">'
							+ '<div class="data">'
							+ dayData
							+ '</div>'
							+ '<div class="time">'
							+ timeData
							+ '</div>'
							+ '<div class="line"><p></p>'
							+ '</div></div></div>');
				} else {
					var labelObj = $('<div class="control-item-inline" style="width:'
							+ item_width
							+ '">'
							+ '<div class="mui-control-item">'
							+ '<div class="data">'
							+ dayData
							+ '</div>'
							+ '<div class="time">'
							+ timeData
							+ '</div>'
							+ '<div class="line"><p></p>'
							+ '</div></div></div>');

				}
				labelObj.data("data", ultimate[i]);
				$("#sliderSegmentedControl").append(labelObj);
			}
			showLayout(ultimate[0])
			$("#sliderSegmentedControl").on("click", ".control-item-inline",
					function() {
						var data = $(this).data("data");
						showLayout(data)
					})
		} else {
			showNothing()
		}

	} else {
		showNothing()
	}
}

// 生活指数布局
function showLayout(dataArray) {
	$(".index-details-one>ul").empty();
	$(".index-details-two>ul").empty();
	$(".index-details-three>ul").empty();
	for (var i = 0; i < dataArray.length; i++) {
		var indexType = "";// 指数类型
		var indexImg = ""// 指数图片
		dataArray[i].indexes = i

		if (dataArray[i]["type"] == "airDrying") {
			indexType = "晾晒指数";
			indexImg = "../../img/lifeindex/bask.png"

		} else if (dataArray[i]["type"] == "controlClothing") {
			indexType = "穿衣指数";
			indexImg = "../../img/lifeindex/dressing.png"

		} else if (dataArray[i]["type"] == "mountaineering") {
			indexType = "登山指数";
			indexImg = "../../img/lifeindex/mountain.png"

		} else if (dataArray[i]["type"] == "raingear") {
			indexType = "雨伞指数";
			indexImg = "../../img/lifeindex/umbrella.png"

		} else if (dataArray[i]["type"] == "fishing") {
			indexType = "垂钓指数";
			indexImg = "../../img/lifeindex/fishing.png"

		} else if (dataArray[i]["type"] == "human") {
			indexType = "舒适度指数";
			indexImg = "../../img/lifeindex/cosy.png"

		} else if (dataArray[i]["type"] == "clothes") {
			indexType = "着装厚度指数";
			indexImg = "../../img/lifeindex/thickness.png"

		} else if (dataArray[i]["type"] == "heatstroke") {
			indexType = "中暑指数";
			indexImg = "../../img/lifeindex/heatstroke.png"

		} else if (dataArray[i]["type"] == "airConditioner") {
			indexType = "空调开启指数";
			indexImg = "../../img/lifeindex/conditioner.png"
		} else {
			indexType = "其他指数";
			indexImg = "../../img/lifeindex/motion.png"
		}
		if (dataArray[i]["level"] == undefined) {
			dataArray[i]["level"] = "无"
			dataArray[i]["proposal"] = "暂无"

		}
		var bgcolor = "#F8F9FB";
		var li_onclick = ""
		if (dataArray[i]["level"] == "-") {
			bgcolor = "#F2F2F2";
			li_onclick = "pointer-events:none"
		} else {
			bgcolor = "#F8F9FB";
			li_onclick = ""
		}

		if (i <= 2) {
			var li_one = $('<li class="mui-table-view-cell  mui-col-xs-3" style="'
					+ li_onclick
					+ ';"><div class="index-view" style="background:'
					+ bgcolor
					+ '">'
					+ '<img src="'
					+ indexImg
					+ '">'
					+ '<p class="index-state">'
					+ dataArray[i]["level"]
					+ '</p>'
					+ '<p class="index-type">'
					+ indexType
					+ '</p></div></li>')
			li_one.data("data", dataArray[i]);
			$(".index-details-one>ul").append(li_one);
		} else if (i > 2 && i <= 5) {
			var li_two = $('<li class="mui-table-view-cell  mui-col-xs-3" style="'
					+ li_onclick
					+ ';"><div class="index-view" style="background:'
					+ bgcolor
					+ '">'
					+ '<img src="'
					+ indexImg
					+ '">'
					+ '<p class="index-state">'
					+ dataArray[i]["level"]
					+ '</p>'
					+ '<p class="index-type">'
					+ indexType
					+ '</p></div></li>')
			li_two.data("data", dataArray[i]);
			$(".index-details-two>ul").append(li_two);
		} else if (i > 5 && i <= 8) {
			var li_three = $('<li class="mui-table-view-cell  mui-col-xs-3" style="'
					+ li_onclick
					+ ';"><div class="index-view" style="background:'
					+ bgcolor
					+ '">'
					+ '<img src="'
					+ indexImg
					+ '">'
					+ '<p class="index-state">'
					+ dataArray[i]["level"]
					+ '</p>'
					+ '<p class="index-type">'
					+ indexType
					+ '</p></div></li>')
			li_three.data("data", dataArray[i]);
			$(".index-details-three>ul").append(li_three);
		}
	}

	$(".index-details-one>ul").on("click", "li", function() {
		$(".row-one").css('display', 'block');// 显示
		$(".row-two").css('display', 'none');// 隐藏
		$(".row-three").css('display', 'none');// 隐藏
		var data = $(this).data("data");
		$(".row-one>p").empty();
		$(".row-one>p").append(data.proposal);
		showStyle(data.indexes)
	})
	$(".index-details-two>ul").on("click", "li", function() {
		$(".row-one").css('display', 'none');// 隐藏
		$(".row-two").css('display', 'block');// 显示
		$(".row-three").css('display', 'none');// 隐藏

		var data = $(this).data("data");
		$(".row-two>p").empty();
		$(".row-two>p").append(data.proposal);
		showStyle(data.indexes)
	})
	$(".index-details-three>ul").on("click", "li", function() {
		$(".row-one").css('display', 'none');// 隐藏
		$(".row-two").css('display', 'none');// 隐藏
		$(".row-three").css('display', 'block');// 显示

		var data = $(this).data("data");
		$(".row-three>p").empty();
		$(".row-three>p").append(data.proposal);
		showStyle(data.indexes)
	})
	$(".index-details-one>ul>li").eq(0).click();
}
// 气泡框三角形样式
function showStyle(indexes) {
	if (indexes == 0 || indexes == 3 || indexes == 6) {
		$(".index-details>span.bot").css('margin-left', '10%');
	} else if (indexes == 1 || indexes == 4 || indexes == 7) {
		$(".index-details>span.bot").css('margin-left', '42%');// 隐藏
	} else if (indexes == 2 || indexes == 5 || indexes == 8) {
		$(".index-details>span.bot").css('margin-left', '78%');// 隐藏
	}
}
// 无数据页面
function showNothing() {
	$("#sliderSegmentedControl").empty();
	$(".index-details-one>ul").empty();
	$(".index-details-two>ul").empty();
	$(".index-details-three>ul").empty();
	var time = new Date();
	var today = DateGrid(time, "MMdd")
	var time1 = new Date(time.getTime() + 1000 * 60 * 60 * 24);
	var tomorrow1 = DateGrid(time1, "MM/dd")
	var time2 = new Date(time.getTime() + 1000 * 60 * 60 * 48);
	var tomorrow2 = DateGrid(time2, "MM/dd")
	var timeArray = [ {
		"timeData" : today,
		"dayData" : "今天"
	}, {
		"timeData" : tomorrow1,
		"dayData" : "明天"
	}, {
		"timeData" : tomorrow2,
		"dayData" : "后天"
	} ]
	for (var i = 0; i < timeArray.length; i++) {
		if (i == 0) {
			var labelObj = $('<div class="control-item-inline">'
					+ '<div class="mui-control-item mui-active">'
					+ '<div class="data">' + timeArray[i]["dayData"] + '</div>'
					+ '<div class="time">' + timeArray[i]["timeData"]
					+ '</div>' + '<div class="line"><p></p>'
					+ '</div></div></div>');
		} else {
			var labelObj = $('<div class="control-item-inline">'
					+ '<div class="mui-control-item">' + '<div class="data">'
					+ timeArray[i]["dayData"] + '</div>' + '<div class="time">'
					+ timeArray[i]["timeData"] + '</div>'
					+ '<div class="line"><p></p>' + '</div></div></div>');
		}
		$("#sliderSegmentedControl").append(labelObj);
	}
	var dataArray = {
		"clothes" : [ {
			"type" : "着装厚度指数",
			"image" : "thickness.png"
		} ],
		"human" : [ {
			"type" : "舒适度指数",
			"image" : "cosy.png"
		} ],
		"fishing" : [ {
			"type" : "垂钓指数",
			"image" : "fishing.png"
		} ],
		"raingear" : [ {
			"type" : "雨伞指数",
			"image" : "umbrella.png"
		} ],
		"mountaineering" : [ {
			"type" : "登山指数",
			"image" : "mountain.png"
		} ],
		"controlClothing" : [ {
			"type" : "穿衣指数",
			"image" : "dressing.png"
		} ],
		"airDrying" : [ {
			"type" : "晾晒指数",
			"image" : "bask.png"
		} ],
		"airConditioner" : [ {
			"type" : "空调开启指数",
			"image" : "conditioner.png"
		} ],
		"heatstroke" : [ {
			"type" : "中暑指数",
			"image" : "allergy.png"
		} ]

	}

	var todayArray = [];
	for ( var key in dataArray) {
		if (dataArray[key].length != 0) {
			for (var i = dataArray[key].length - 1; i >= 0; i--) {
				todayArray.push(dataArray[key][i])
			}
		}
	}
	for (var i = 0; i < todayArray.length; i++) {
		if (i <= 2) {
			var li_one = $('<li class="mui-table-view-cell  mui-col-xs-3 "><div class="index-view">'
					+ '<img src="../../img/lifeindex/'
					+ todayArray[i]["image"]
					+ '">'
					+ '<p class="index-state">'
					+ "-"
					+ '</p>'
					+ '<p class="index-type">'
					+ todayArray[i]["type"]
					+ '</p></div></li>')
			$(".index-details-one>ul").append(li_one);
		} else if (i > 2 && i <= 5) {
			var li_two = $('<li class="mui-table-view-cell  mui-col-xs-3 "><div class="index-view">'
					+ '<img src="../../img/lifeindex/'
					+ todayArray[i]["image"]
					+ '">'
					+ '<p class="index-state">'
					+ "-"
					+ '</p>'
					+ '<p class="index-type">'
					+ todayArray[i]["type"]
					+ '</p></div></li>')

			$(".index-details-two>ul").append(li_two);
		} else if (i > 5 && i <= 8) {
			var li_three = $('<li class="mui-table-view-cell  mui-col-xs-3 "><div class="index-view">'
					+ '<img src="../../img/lifeindex/'
					+ todayArray[i]["image"]
					+ '">'
					+ '<p class="index-state">'
					+ "-"
					+ '</p>'
					+ '<p class="index-type">'
					+ todayArray[i]["type"]
					+ '</p></div></li>')
			$(".index-details-three>ul").append(li_three);
		}
	}
	$(".index-details>").css('display', 'none');// 隐藏

}
