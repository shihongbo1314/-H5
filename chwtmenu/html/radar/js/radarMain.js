var baseData = {};
var mapConsole = {};
var baseObj={};
var marker1;
// 分钟预报雷达图
window.onload=function(){
	$(window).on("resize", function(){
		baseData.map.invalidateSize();
		baseData.map.fitBounds(baseData.bounds);
	})
	initMap();
	initLegend();
	minuteData();
}

/**
 * 雷达图图例
 * 
 * @returns
 */
function initLegend() {
	$("#legendList").empty();
	var dataArray=[{"legendcolor":"#ab23f9","legendvalue":"65"},{"legendcolor":"#d78dfc","legendvalue":"60"},
		{"legendcolor":"#f20e2c","legendvalue":"55"},{"legendcolor":"#fc6553","legendvalue":"50"},
		{"legendcolor":"#ffacaa","legendvalue":"45"},{"legendcolor":"#8b8c18","legendvalue":"40"},
		{"legendcolor":"#cac827","legendvalue":"35"},{"legendcolor":"#fcf465","legendvalue":"30"},
		{"legendcolor":"#048618","legendvalue":"25"},{"legendcolor":"#00ee32","legendvalue":"20"},
		{"legendcolor":"#a7fca9","legendvalue":"15"},{"legendcolor":"#1c27d1","legendvalue":"10"},
		{"legendcolor":"#7a71f1","legendvalue":"5"},{"legendcolor":"#c1c3fa","legendvalue":"0"},
		{"legendcolor":"#07aba3","legendvalue":"-5"}]
	for(var i=0;i<dataArray.length;i++){
		var div = $('<div class="legendDiv"></div>');
		div.append('<span class="legendcolor" style="background-color: '+dataArray[i]['legendcolor']+'"></span><span class="legendvalue" >'+dataArray[i]['legendvalue']+'</span>')
		$("#legendList").append(div);
	}
	$("#legend").hide();
	// 图例显示or隐藏
	$("#controlBtn1>.imgBtn1").click(function(){
		if($("#controlBtn1>.imgBtn1").hasClass("active")){
			$("#controlBtn1>.imgBtn1").removeClass("active");
			$("#legend").show();
		}else{
			$("#controlBtn1>.imgBtn1").addClass("active");
			$("#legend").hide();
		}
		// 到这个节点为止，不再传播
		event.stopPropagation() 
	})
	// marker弹窗绑定事件
	$("#map").on("click",".leaflet-popup",function(){
		mapConsole.mousemoveMarker.clickFun();
	})
}

/**
 * 地图初始化
 * 
 * @returns
 */
function initMap(){
	
	baseData.bounds = L.latLngBounds(L.latLng(34.25, 114.65),  L.latLng(38.55, 122.80));
	baseData.bounds2 = [[34.25, 114.65],  [38.55, 122.80]];
	baseData.boundsArray = [L.latLng(34.25, 114.65), L.latLng(34.25,122.80), L.latLng(38.55, 122.80), L.latLng(38.55,114.65), L.latLng(34.25, 114.65)];
	
	baseData.map = L.map('map', {
		trackResize : true,
		zoomSnap : 0.1,
	});
	baseData.map._controlCorners.bottomright.remove();
   
	// 高德平面图
	mapConsole.gaode_Map = new L.TileLayer(
			"http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
			{
				Subdomains : [ "1", "2", "3", "4" ]
			});
    
    mapConsole.gaode_Map.addTo(baseData.map);
	baseData.map.fitBounds(baseData.bounds);
	
	$("#map").parents(".shareBox").data("resize", function(){
		baseData.map.invalidateSize();
		baseData.map.fitBounds(baseData.bounds);
	})
	
	leidatuConsole.init();

}


mapConsole.updateMapType = function(type){
	// 更换地图
	if(mapConsole.mapType != null){
		baseData.map.removeLayer(mapConsole[mapConsole.mapType]);
		mapConsole.mapType = null;
	}
	if(type != "shiliang_Map"){
		mapConsole.mapType = type;
		mapConsole[mapConsole.mapType].addTo(baseData.map);
	}
}

function updateColor(color){
	return;
	var layer = baseData.layer.getLayers();
	for(var i in layer){
		layer[i].setStyle({
			color : color,
		});
	}
}



/* 获取分钟级降水 */
function minuteData() {
	mui.showLoading();
	$.ajax({
		url : BASEPATH+"data/weather/get",
		dataType : "json",
		data : {
			regionCode:"370105"	
		},
		success : function(res){
			
			if(res.state==1){
				var dataArray=res.records;
				if (JSON.stringify(dataArray) != "{}") {
					console.log(dataArray)
					if (JSON.stringify(dataArray.jsMin) != "{}") {
						showData(dataArray.jsMin)
						
					}else{
						$('.desc').text('分钟级降水数据加载错误！');
					}
					
				} else {
					$('.desc').text('分钟级降水数据加载错误！');
				}
			}else{
				$('.desc').text('分钟级降水数据加载错误！');
			}
			mui.hideLoading();
			
		},
		error : function(){
			$('.desc').text('分钟级降水数据加载错误！');
		}
	})
	showRegion()	
}
function showData(data){
	 if (data.status != 'ok') {
		 $('.rain-tips').text('分钟级降水数据加载错误！');
	 	return;
	 }
	var result = data.result;
	if (!result) {
		$('.rain-tips').text('分钟级降水数据加载错误！');
		return;
	}
	var data = data.result.minutely;
	var radar_desc = data.description;
	
	$('.rain-tips').text(radar_desc);
	var rainfall_data = data.precipitation_2h.slice(0, 60);
	var t = result.hourly.temperature[0].value < -2 ? '雪' : '雨';
	$('.level_c .leve_1 .type_flag').text(t);
	

	var init_canvas_size = function() {
		// console.log($('#hour_rain').width(),$('#hour_rain').outerWidth());
		var info_width = $('#hour_rain').width(),
			into_height = $('#hour_rain').height();
		var width = info_width > 600 ? info_width - 40 : info_width;
		$('#rain_line').attr('width', width).attr('height', into_height).css({
			width: width,
			height: into_height
		});
	}
	init_canvas_size();
	draw_canvas($('#rain_line').get(0), (new Date()).getTime(),rainfall_data);
}
// 根据行政编码获取详情
function showRegion() {
	$.ajax({
		url : BASEPATH+"data/region/get",
		dataType : "json",
		data : {
			regionCode:"370105"	
		},
		success : function(res){
			
			if(res.state==1){
				var dataArray=res.records;
				if (JSON.stringify(dataArray) != "{}") {
					console.log(dataArray)
					var city=dataArray.city
					var county=dataArray.county
					$("#nowAddress").text(city+county)
					if(marker1!=null){
						baseData.map.removeLayer(marker1)
					}
				   	var markers=[];
				   	// 系统默认的marker,有一个蓝色图标
				   	var latlng=[dataArray.lat,dataArray.lon];
				   	baseData.map.flyTo(latlng);
				       marker1 = L.marker(latlng, {
				   		icon : L.icon({
				   			iconUrl: 'image/mark.png',
				   			iconSize: [28, 28],
				   			iconAnchor: [16, 16],
				   			className : "station"
				   		})
				   	})
				   	markers.push(marker1); 
				    var citiesLayer = L.layerGroup(markers);
				    baseData.map.addLayer(citiesLayer);	
				} 
			}
			
		},
		error : function(){
			
		}
	})
		
}

function draw_canvas(c, startTime,rainfall_data) {
	if (rainfall_data != undefined) {
		// console.log("bgy",rainfall_data)
		// update
		var time = (new Date()).getTime() - startTime;
		var data = Array.apply(null, new Array(rainfall_data.length)).map(Number.prototype.valueOf, 0);
		var data_len = data.length;
		var canvas_len = c.width;
		var canvas_height = c.height
		var cxt = c.getContext("2d"); // console.log(rainfall_data,canvas_len,canvas_height);

		speed = 2.2 * 0.5
		wave_length = 6
		wave_size = 0.4


		for (i = 0; i < data_len; i++) {
			speed = 2.6 * 0.5
			wave_length = 4
			wave_size = 6
			data[i] = rainfall_data[i] + wave_size * Math.cos((i / data_len) * wave_length * Math.PI * 3 - 3.2 * Math.PI * time / (1000 * speed)) / canvas_height / 10
		}

		// clear
		cxt.clearRect(0, 0, canvas_len, canvas_height);

		// draw
		var interval = canvas_len / (data_len - 1);

		for (i = 0; i < data_len - 1; i++) {
			cxt.fillStyle = "#1878f0";
			// cxt.fillStyle="#0066FF";
			// cxt.fillStyle="#000000";
			cxt.beginPath();

			cxt.moveTo(i * interval, canvas_height)
			cxt.lineTo(i * interval, canvas_height * (1 - data[i]))
			cxt.lineTo((i + 1.2) * interval, canvas_height * (1 - data[i + 1]))
			cxt.lineTo((i + 1.2) * interval, canvas_height)
			cxt.lineTo(i * interval, canvas_height)

			cxt.closePath();
			cxt.fill();
		}
	}

}

