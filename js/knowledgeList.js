var theRequest;
$(function () {
	//从另一个html页面传来的值，在这里获取
	var url = window.location.search; //获取url中"?"符后的字串 ('?id=.....')
	$('body').append(window.location);
	theRequest = JSON.parse(localStorage.getItem('iframeData'));
	// 	延时加载
	window.setTimeout(initData, 50);
	window.setTimeout(initData2, 50);
	//点击科普类型查询详细列表
	$("#productUL").on("click", "li", function () {
		var data = $(this).data("data");
		localStorage.setItem('iframeData', JSON.stringify(data));
		var searchUrl = encodeURI("knowledgeDetails.html?id=" + data);
		parent.location.href = searchUrl;
	})

})
//查询专报列表
function initData() {
	var code = theRequest.code;
	$("#productUL").empty();
	mui.showLoading();
	$.ajax({
		type: 'GET',
		// url: 'https://www.tongzhouqixiang.xyz/Wechat/sdtq/Function/listMeteorologicalScienceByType.do',
		url: 'http://58.59.29.50:15019/chwt-isd/data/kepu-data-detail/get',
		data: {
			type: code,
		},
		dataType: 'json',
		success: function success(data) {
			if (data.state == 1) {
				var dataArray = data.records;
				if (dataArray.length != 0) {
					document.getElementById("nodata").style.display = "none";
					for (var i = 0; i < dataArray.length; i++) {
						var resultli = $('<li class="mui-table-view-cell mui-collapse"></li>');
						resultli.append('<div class="mui-navigate-right"><img class="mui-media-object mui-pull-left productimg" src="http://58.59.29.50:15019/chwt/img/productimg.png"><div class="mui-media-body">' +
							dataArray[i].title +
							'</div></div>');
						resultli.data("data", dataArray[i]);
						$("#productUL").append(resultli);
					}
					var name = dataArray[0].typeName;
					$("#title").text(name);
				}
				//  else {
				// 	//无内容
				// 	document.getElementById("nodata").style.display = "flex";
				// }

			} 
			// else {
			// 	//无内容
			// 	document.getElementById("nodata").style.display = "flex";
			// }
			mui.hideLoading();
		},
		error: function error(err) {
			mui.hideLoading();
			//无内容
			document.getElementById("nodata").style.display = "flex";
		}
	});

	mui(".mui-table-view").on('tap', '.mui-table-view-cell', function () {
		var data = $(this).data("data");
		localStorage.setItem('iframeData', JSON.stringify(data));
		var searchUrl = encodeURI("knowledgeDetails.html?id=" + data);
		parent.location.href = searchUrl;
	});
	mui(".mui-table-view").on('click', '.mui-table-view-cell', function () {
		var data = $(this).data("data");
		localStorage.setItem('iframeData', JSON.stringify(data));
		var searchUrl = encodeURI("knowledgeDetails.html?id=" + data);
		parent.location.href = searchUrl;
	});
}

function initData2() {
	var code = theRequest.typeCode;
	$("#productUL").empty();
	mui.showLoading();
	$.ajax({
		type: 'GET',
		// url: 'https://www.tongzhouqixiang.xyz/Wechat/sdtq/Function/listMeteorologicalScienceByType.do',
		url: 'http://58.59.29.50:15019/chwt-isd/data/kepu-data-detail/get',
		data: {
			type: code,
		},
		dataType: 'json',
		success: function success(data) {
			if (data.state == 1) {
				var dataArray = data.records;
				if (dataArray.length != 0) {
					document.getElementById("nodata").style.display = "none";
					for (var i = 0; i < dataArray.length; i++) {
						var resultli = $('<li class="mui-table-view-cell mui-collapse"></li>');
						resultli.append('<div class="mui-navigate-right"><img class="mui-media-object mui-pull-left productimg" src="http://58.59.29.50:15019/chwt/img/productimg.png"><div class="mui-media-body">' +
							dataArray[i].title +
							'</div></div>');
						resultli.data("data", dataArray[i]);
						$("#productUL").append(resultli);
					}
					var name = dataArray[0].typeName;
					$("#title").text(name);
				}
				//  else {
				// 	//无内容
				// 	document.getElementById("nodata").style.display = "flex";
				// }

			} 
			// else {
			// 	//无内容
			// 	document.getElementById("nodata").style.display = "flex";
			// }
			mui.hideLoading();
		},
		error: function error(err) {
			mui.hideLoading();
			//无内容
			document.getElementById("nodata").style.display = "flex";
		}
	});

	mui(".mui-table-view").on('tap', '.mui-table-view-cell', function () {
		var data = $(this).data("data");
		localStorage.setItem('iframeData', JSON.stringify(data));
		var searchUrl = encodeURI("knowledgeDetails.html?id=" + data);
		parent.location.href = searchUrl;
	});
	mui(".mui-table-view").on('click', '.mui-table-view-cell', function () {
		var data = $(this).data("data");
		localStorage.setItem('iframeData', JSON.stringify(data));
		var searchUrl = encodeURI("knowledgeDetails.html?id=" + data);
		parent.location.href = searchUrl;
	});
}