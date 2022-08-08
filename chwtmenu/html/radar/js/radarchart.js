// 分钟预报雷达图
var leidatuConsole = {};
leidatuConsole.init = function() {
	leidatuConsole.initConsole();
	leidatuConsole.initData();
}
leidatuConsole.initConsole = function() {
	$("#leidaConfig .times").on("click", "li", function() {
		var _this = $(this);
		if (_this.hasClass("click")) {
			return false;
		}
		$("#leidaConfig .times li").removeClass("click");
		_this.addClass("click");
		var url = _this.data("url");
		$("#leidaTime").text(_this.data("time"));
		leidatuConsole.addImgToMap(leidatuConsole.host + url);
		return false;
	})
}
leidatuConsole.addImgToMap = function(url) {

	// 地图中叠加图片
	var opacity = 1;
	var bounds = leidatuConsole.bounds;

	if (leidatuConsole.imgLayer == null) {
		leidatuConsole.imgLayer = L.imageOverlay(url, bounds, {
			opacity : opacity,
			pane : "overlayPane"
		});
		leidatuConsole.imgLayer.addTo(baseData.map);
	} else {
		leidatuConsole.imgLayer.setUrl(url);
	}
}
leidatuConsole.initData = function() {
	mui.showLoading();
	var _this = $("#leidaConfig .button");
	if (_this.hasClass("click")) {
		_this.text("播放").removeClass("click");
		if (leidatuConsole.playTimeOut != null) {
			window.clearInterval(leidatuConsole.playTimeOut);
			leidatuConsole.playTimeOut = null;
		}
	}
	
	var ul = $("#leidaConfig .times");
	ul.empty();
	$.ajax({
				url : BASEPATH+"data/radar/get",
				success : function(res) {
					if(res.state==1){
						var data=res.records;
						if(JSON.stringify(data) != "{}"){
							leidatuConsole.bounds = L.latLngBounds(L.latLng(
									data.bbox[1], data.bbox[0]), L.latLng(data.bbox[3],
									data.bbox[2]));
							mui.hideLoading();
							leidatuConsole.host = BASEPATH_IMAGE_PATH;
							var hasData = false;
							var num = 0;
							if (JSON.stringify(data.series) == "{}") {
								// 设置隐藏
								document.getElementById("leidaTime").style.display = "none";
								document.getElementById("leidaConfig").style.display = "none";
							} else {
								var listArray = [];
								for ( var i in data.series) {
									var pastResult = {};
									pastResult['time'] = i;
									pastResult['value'] = data.series[i];
									listArray.push(pastResult);
								}
								listArray.reverse();
								if (listArray.length > 10) {
									listArray = listArray.slice(0, 10)
								}
								listArray.reverse();
								for (var i = 0; i < listArray.length; i++) {
									var time = listArray[i].time.substr(4, 2) + "-"
											+ listArray[i].time.substr(6, 2) + " "
											+ listArray[i].time.substr(8, 2) + ":"
											+ listArray[i].time.substr(10, 2);
									var timestr = listArray[i].time.substr(8, 2) + ":"
											+ listArray[i].time.substr(10, 2);
									var li = $("<li data-toggle='tooltip' style='text-align: center;' title='"
											+ time + "'>" + timestr + "</li>");
									li.data("url", listArray[i].value);
									li.data("time", time);
									ul.append(li);
									hasData = true;
									num++;
								}

								ul.find("li").eq(0).click();
								ul.find("li").css("width", "calc(100% / " + num + ")");

								if (hasData) {
									// 有内容自动播放
									leidatuConsole.play(_this);
								}
								ul.find("li").tooltip({
									trigger : "hover"
								});
								// 设置可见
								document.getElementById("leidaTime").style.display = "none";
								document.getElementById("leidaConfig").style.display = "block";

							}

						}else{
							leidatuConsole.displaynone()
						}
					}else{
						// 设置隐藏
						leidatuConsole.displaynone()
					}

				},
				error : function() {
					mui.hideLoading();
					mui.alert("雷达图加载失败！");
					// 设置隐藏
					leidatuConsole.displaynone()

				}
			})

}

leidatuConsole.displaynone = function() {
	document.getElementById("leidaTime").style.display = "none";
	document.getElementById("leidaConfig").style.display = "none";
}

leidatuConsole.playChange = function() {
	// 切换播放速度
	if (leidatuConsole.playTimeOut != null) {
		window.clearInterval(leidatuConsole.playTimeOut);
		leidatuConsole.playTimeOut = window.setInterval(
				"leidatuConsole.playNext()", 1000 * parseFloat($(
						"#leidaConfig .speed").val()));
	}
}
leidatuConsole.play = function(obj) {
	// 播放/暂停
	var _this = $(obj);
	if (!_this.hasClass("click")) {
		_this.text("暂停").addClass("click");
		leidatuConsole.playTimeOut = window.setInterval(
				"leidatuConsole.playNext()", 1000 * parseFloat($(
						"#leidaConfig .speed").val()));
	} else {
		_this.text("播放").removeClass("click");
		if (leidatuConsole.playTimeOut != null) {
			window.clearInterval(leidatuConsole.playTimeOut);
			leidatuConsole.playTimeOut = null;
		}
	}
}
leidatuConsole.playNext = function() {
	// 查看下一张图片
	// 如果任务清单的专报在编辑，这里被挡住就暂停播放
	// if(!$("#generalIframe", window.parent.document).is(":hidden")){
	// return;
	// }

	if ($("#leidaConfig .times .click").nextAll().length > 0) {
		$("#leidaConfig .times li.click").next().click();
	} else {
		$("#leidaConfig .times li:eq(0)").click();
	}
}