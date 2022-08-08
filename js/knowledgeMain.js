$(function () {
	getData()
	//查询列表数据
	function getData() {
		$('#listUL').empty();
		mui.showLoading();
		$.ajax({
			type: 'GET',
			  url: 'http://58.59.29.50:15019/chwt-isd/data/kepu-data-type/get',
			// url: 'https://www.tongzhouqixiang.xyz/Wechat/sdtq/Function/listMeteorologicalScienceType.do',
			dataType: 'json',
			success: function success(data) {
				if (data.state == 1) {
					var dataArray = data.records;
					if (dataArray.length != 0) {
						var sortData = getMinSort(dataArray)
						var newArray=[];
						for (var i = 0; i < sortData.length; i++) {
							if (sortData[i].code != "qita") {
								newArray.push(sortData[i])
							}
						
						}
						for (var i = 0; i < newArray.length; i++) {
							var name = newArray[i].name;
							var imagetype = "http://58.59.29.50:15019/chwt/img/else.png";
							var code = newArray[i].code;
							if (code == "yjxhzn") {
								imagetype = "http://58.59.29.50:15019/chwt/img/yjxh.png";
							} else if (code == "tianqi") {
								imagetype = "http://58.59.29.50:15019/chwt/img/rgyxtq.png";
							} else if (code == "yanyu") {
								imagetype = "http://58.59.29.50:15019/chwt/img/qxyy.png";
							} else if (code == "shuyu") {
								imagetype = "http://58.59.29.50:15019/chwt/img/shuyu.png";
							} else if (code == "qihou") {
								imagetype = "http://58.59.29.50:15019/chwt/img/qihou.png";
							} else if (code == "jieqi") {
								imagetype = "http://58.59.29.50:15019/chwt/img/essjq.png";
							} else if (code == "zhishu") {
								imagetype = "http://58.59.29.50:15019/chwt/img/qxzs.png";
							} else if (code == "yiqi") {
								imagetype = "http://58.59.29.50:15019/chwt/img/yiqi.png";
							} 
							var resultli = $('<li><a href="#" class="itemDiv"> <img class="mui-media-object" src="' + imagetype + '">' +
								'<p class="mui-media-body">' + name + '</p></a></li>');
							resultli.data("data", newArray[i]);
							$('#listUL').append(resultli);
						
						}
						

					}

				}
				mui.hideLoading();
			},
			error: function error(err) {
				mui.hideLoading();
			}
		});
	}
	//点击科普类型查询详细列表
	$("#listUL").on("click", "li", function () {
		var data = $(this).data("data");
		if (data.code == "jieqi") {
			window.location.href = "./solarTerms.html";
		} else {
			localStorage.setItem('iframeData', JSON.stringify(data));
			var searchUrl = encodeURI("knowledgeList.html?id=" + data);
			parent.location.href = searchUrl;
		}
	})
	/**
	 * 区域排序
	 * 
	 * @returns
	 */
	function getMinSort(arr) {
		var min
		for (var i = 0; i < arr.length; i++) {
			for (var j = i; j < arr.length; j++) {
				if (arr[i].sort > arr[j].sort) {
					min = arr[j]
					arr[j] = arr[i]
					arr[i] = min
				}
			}
		}
		return arr;
	}
});