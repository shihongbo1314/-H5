var BaseObject = {};
$(function () {
	mui.showLoading();
	getAllCropBirthName(); //获取所有作物及生育期
	//点击作物跳转到详情
	$("#cropUL").on("click", "li", function () {
		var data = $(this).data("data");
		if (data) {
			if (data["crop"]["isGreenHouse"] == 1) {
				$("#sliderSegmentedControl").show();
				getGreenHouseCropInfo(data);
			} else {
				$("#sliderSegmentedControl").hide();
				getCropInfo(data);
			}
			// $(".mui-pages").css("z-index", "10")
			$(".tab").css("display", "none")
			$(".farming").css("height", "calc(105% + 5px)")
			$(".mui-bar-nav").css("display", "block")
			$(".mui-page-center").css("display", "block")
		} else {
			mui.toast("该作物不在生育期");
			$(".tab").css("display", "block")
		}

	})
	$(".mui-pull-left").on("click", function () {
		// $(".mui-pages").css("z-index", "1")
		$(".tab").css("display", "block")
		$(".mui-page-center").css("display", "none")
		$(".mui-bar-nav").css("display", "none")
	})

	//点击生育期展示该生育期的数据
	$("#sliderSegmentedControl").on("click", "label", function () {
		var data = $(this).data("data");
		showCropInfo(data);
	})
})

/***
 *获取所有作物的当前生育期 
 ***/
function getAllCropBirthName() {
	$("#cropUL").empty();
	$.ajax({
		url: "http://www.tongzhouqixiang.xyz/YanTaiXCX/xcxController/getDataByParamsGet.do?urlStr=http://58.59.29.50:15019/chwt-isd/data/kepu-crop/get",

		// url: "http://58.59.29.50:15019/chwt-isd/data/kepu-crop/get",
		dataType: "json",
		type: "get",
		data: {
			regionCode: 370102
		},
		success: function (data) {
			if (data.state == 1) {
				var dataArray = data.records.crops;
				var noBirthArray = [];
				var greenhouseArray = [];
				var number = 0;
				for (var i = 0; i < dataArray.length; i++) {
					if (dataArray[i]["crop"]["isDelete"] == 1) {
						continue;
					}
					if (dataArray[i]["birth"] == null) {
						if (dataArray[i]["crop"]["isGreenHouse"] == 1) {
							greenhouseArray.push(dataArray[i]);
						} else {
							noBirthArray.push(dataArray[i]);
						}
						continue;
					}
					var li = $("<li></li>");
					li.data("data", dataArray[i]);
					if (dataArray[i]["crop"]["farmName"] == "苹果") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "pingguo.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "樱桃") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "dayingtao.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "姜") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "jiang.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "大豆") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "dadou.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "棉花") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "mianhua.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "玉米") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "yumi.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "花生") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "huasheng.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "酿酒葡萄") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "putao.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "石榴") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "shiliu.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "红杏") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "hongxin.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "黄烟") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "huangyan.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "山药") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "shanyao.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					if (dataArray[i]["crop"]["farmName"] == "花生") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "huasheng.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					}
					// li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "huasheng.png" + "'><div><label>" + dataArray[i]["crop"]["farmName"] + "</label></div><p>" + dataArray[i]["birth"]["birthName"] + "</p></div>");
					$("#cropUL").append(li);
					number++;
				}
				//大棚作物
				for (var m = 0; m < greenhouseArray.length; m++) {
					var li = $("<li></li>");
					li.data("data", greenhouseArray[m]);
					if (greenhouseArray[m]["crop"]["farmName"] == "黄瓜（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "huanggua.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "姜（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "jiang.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "白菜（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "dabaicai.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "番茄（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "fanqie.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "辣椒（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "lajiao.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "西瓜（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "xigua.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "草莓（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "caomei.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "西洋参（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "yangshen.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "蓝莓（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "lanmei.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "樱桃（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "dayingtao.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "茄子（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "qiezi.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "西葫芦（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "xihulu.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "菜豆（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "caidou.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "丝瓜（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "sigua.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					if (greenhouseArray[m]["crop"]["farmName"] == "甜瓜（大棚）") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "tiangua.png" + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					}
					// li.append("<div><img src='http://58.59.29.50:15004/cropImg/" + greenhouseArray[m]["crop"]["imagePath"] + "'><div><label>" + greenhouseArray[m]["crop"]["farmName"] + "</label></div><p>全生育期</p></div>");
					$("#cropUL").append(li);
					number++;
				}
				//不在生育期的作物
				for (var j = 0; j < noBirthArray.length; j++) {
					var li = $("<li></li>");
					if (noBirthArray[j]["crop"]["farmName"] == "小麦") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "xiaomai.png" + "'><div><label>" + noBirthArray[j]["crop"]["farmName"] + "</label></div><p>不在生育期</p></div>");
					}
					if (noBirthArray[j]["crop"]["farmName"] == "日照绿茶") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "cha.png" + "'><div><label>" + noBirthArray[j]["crop"]["farmName"] + "</label></div><p>不在生育期</p></div>");
					}
					if (noBirthArray[j]["crop"]["farmName"] == "青萝卜") {
						li.append("<div><img src='http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/" + "luobo.png" + "'><div><label>" + noBirthArray[j]["crop"]["farmName"] + "</label></div><p>不在生育期</p></div>");
					}
					// li.append("<div><img src='http://58.59.29.50:15004/cropImg/" + noBirthArray[j]["crop"]["imagePath"] + "'><div><label>" + noBirthArray[j]["crop"]["farmName"] + "</label></div><p>不在生育期</p></div>");
					$("#cropUL").append(li);
					number++;
				}
				var num = num % 3; //不是三的倍数的就空的li补齐
				if (num != 0) {
					for (var i = 0; i < 3 - num; i++) {
						var li = "<li></li>";
						$("#cropUL").append(li);
					}
				}
				//滚动条
				mui('.mui-scroll-wrapper').scroll({
					scrollY: true, //是否竖向滚动
					scrollX: false, //是否横向滚动
					startX: 0, //初始化时滚动至x
					startY: 0, //初始化时滚动至y
					indicators: false, //是否显示滚动条
					deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
					bounce: true //是否启用回弹
				});
				mui.hideLoading();
			} else {
				mui.hideLoading();
				$("#empty").show();
			}
		},
		error: function () {
			mui.hideLoading();
			$("#empty").show();
		}
	})
}
/***
 * 根据生育期ID获取所有的详细信息
 ***/
function getCropInfo(data) {
	$("#birthDiv p").html("无");
	var birth = data.birth;
	var crop = data.crop;
	if (crop.farmName == "苹果") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "pingguo.png");
	}
	if (crop.farmName == "樱桃") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "dayingtao.png");
	}
	if (crop.farmName == "姜") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "jiang.png");
	}
	if (crop.farmName == "大豆") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "dadou.png");
	}
	if (crop.farmName == "棉花") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "mianhua.png");
	}
	if (crop.farmName == "玉米") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "yumi.png");
	}
	if (crop.farmName == "花生") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "huasheng.png");
	}
	if (crop.farmName == "酿酒葡萄") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "putao.png");
	}
	if (crop.farmName == "石榴") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "shiliu.png");
	}
	if (crop.farmName == "红杏") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "hongxin.png");
	}
	if (crop.farmName == "黄烟") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "huangyan.png");
	}
	if (crop.farmName == "山药") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "shanyao.png");
	}
	// $("#birthDiv>img").attr("src", "http://58.59.29.50:15004/cropImg/" + crop.imagePath);
	$("#birthDiv>h3").html(crop.farmName);
	if (birth.birthName) {
		$(".birthName").html(birth.birthName);
	}
	if (birth.timeText) {
		$(".timeText").html(birth.timeText);
	}
	if (birth.sydtext) {
		$(".sydtext").html(birth.sydtext);
	}
	if (birth.weatherDisasterText) {
		$(".weatherDisasterText").html(birth.weatherDisasterText);
	}
	if (birth.insectDisasterText) {
		$(".insectDisasterText").html(birth.insectDisasterText);
	}
	if (birth.activityText) {
		$(".activityText").html(birth.activityText);
	}
	if (birth.proposalText) {
		$(".proposalText").html(birth.proposalText);
	}
	viewApi.go("#pageTwo");
}
/***
 * 根据生育期ID获取所有的详细信息
 ***/
function getGreenHouseCropInfo(data) {
	$("#birthDiv p").html("无");
	var birth = data.birth;
	var crop = data.crop;
	console.log(crop)
	if (crop.farmName == "黄瓜（大棚）") {
		$("#birthDiv>img").attr("src", "../cropImg/"+ "huanggua.png");
	}
	if (crop.farmName == "姜（大棚）") {
		$("#birthDiv>img").attr("src", "../cropImg/"+ "jiang.png");
	}
	if (crop.farmName == "白菜（大棚）") {
		$("#birthDiv>img").attr("src", "../cropImg/"+ "dabaicai.png");
	}
	if (crop.farmName == "番茄（大棚）") {
		$("#birthDiv>img").attr("src", "../cropImg/"+ "fanqie.png");
	}
	if (crop.farmName == "辣椒（大棚）") {
		$("#birthDiv>img").attr("src", "../cropImg/"+ "lajiao.png");
	}
	if (crop.farmName == "西瓜（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "xigua.png");
	}
	if (crop.farmName == "草莓（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "caomei.png");
	}
	if (crop.farmName == "西洋参（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "yangshen.png");
	}
	if (crop.farmName == "蓝莓（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "lanmei.png");
	}
	if (crop.farmName == "白菜（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "dabaicai.png");
	}
	if (crop.farmName == "樱桃（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "dayingtao.png");
	}
	if (crop.farmName == "茄子（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "qiezi.png");
	}
	if (crop.farmName == "西葫芦（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "xihulu.png");
	}
	if (crop.farmName == "菜豆（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "caidou.png");
	}
	if (crop.farmName == "丝瓜（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "sigua.png");
	}
	if (crop.farmName == "甜瓜（大棚）") {
		$("#birthDiv>img").attr("src", "http://www.tongzhouqixiang.xyz/shandong/chwt/cropImg/"+ "tiangua.png");
	}
	// $("#birthDiv>img").attr("src", "../cropImg/" +"caidou.png");
	$("#birthDiv>h3").html(crop.farmName);

	$("#sliderSegmentedControl>div").empty();
	mui.showLoading();
	$.ajax({
		url: "http://www.tongzhouqixiang.xyz/YanTaiXCX/xcxController/getDataByParamsGet.do?urlStr=http://58.59.29.50:15019/chwt-isd/data/kepu-crop-detail/get/",
		// url: "http://58.59.29.50:15019/chwt-isd/data/kepu-crop-detail/get/",
		type: "get",
		data: {
			cropId: crop.id,
		},
		success: function (data) {
			if (data.state == 1) {
				//生育期
				if (data.records.birthIndicator) {
					if (data.records.birthIndicator.length != 0) {
						var birthIndicator = data.records.birthIndicator;
						for (var i = birthIndicator.length - 1; i >= 0; i--) {
							if (i == birthIndicator.length - 1) {
								var labelObj = $("<label class='mui-control-item mui-active'>" + birthIndicator[i]["birthName"] + "</label>");
							} else {
								var labelObj = $("<label class='mui-control-item'>" + birthIndicator[i]["birthName"] + "</label>");
							}

							labelObj.data("data", birthIndicator[i]);
							$("#sliderSegmentedControl>div").append(labelObj);
						}
						$("#sliderSegmentedControl>div label").eq(0).click();
						viewApi.go("#pageTwo");
						mui.hideLoading();
					} else {
						mui.hideLoading();
						mui.toast("暂无数据");
					}
				} else {
					mui.hideLoading();
					mui.toast("暂无数据");
				}
			} else {
				mui.hideLoading();
				mui.toast("暂无数据");
			}
		},
		error: function (data) {
			mui.hideLoading();
			mui.toast("暂无数据");
		}
	})


}
/**
 *展示生育期的数据 
 **/
function showCropInfo(data) {
	var birth = data;
	if (birth.birthName) {
		$(".birthName").html(birth.birthName);
	}
	if (birth.timeText) {
		$(".timeText").html(birth.timeText);
	}
	if (birth.SYDText) {
		$(".sydtext").html(birth.SYDText);
	}
	if (birth.weatherDisasterText) {
		$(".weatherDisasterText").html(birth.weatherDisasterText);
	}
	if (birth.insectDisasterText) {
		$(".insectDisasterText").html(birth.insectDisasterText);
	}
	if (birth.activityText) {
		$(".activityText").html(birth.activityText);
	}
	if (birth.proposalText) {
		$(".proposalText").html(birth.proposalText);
	}
}