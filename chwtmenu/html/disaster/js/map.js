var apitoken;
var mapConsole={};
var map;
var marker1;
mapConsole.init=function(){
	mapConsole.bounds = L.latLngBounds(L.latLng(34.25, 114.65),  L.latLng(38.55, 122.80));
	mapConsole.bounds2 = [[34.25, 114.65],  [38.55, 122.80]];
    mapConsole.boundsArray = [L.latLng(34.25, 114.65), L.latLng(34.25,122.80), L.latLng(38.55, 122.80), L.latLng(38.55,114.65), L.latLng(34.25, 114.65)];
	map = L.map('map',{
			minZoom : 5,
			maxZoom : 18,
            zoomSnap : 0.1,
			zoomControl: false,
			trackResize : true
		});
	map._controlCorners.bottomright.remove(); // 去掉右下角标识
	
	//mapConsole.reactangle=L.rectangle(mapConsole.bounds, {color:"#ddd", weight:1,fill:false, pane : "shadowPane"});	
	// 高德平面图
	mapConsole.gaode_Map = new L.TileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",{Subdomains : [ "1", "2", "3", "4" ]});
	mapConsole.gaode_Map.addTo(map);
	map.fitBounds(mapConsole.bounds);
	mapConsole.getRegion()
	
}

mapConsole.getRegion=function(){
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
					$("#user_address").text(dataArray.city+dataArray.county)
					if(marker1!=null){
						map.removeLayer(marker1)
					}
				   	var markers=[];
				   	// 系统默认的marker,有一个蓝色图标
				   	var latlng=[dataArray.lat,dataArray.lon];
				   	map.flyTo(latlng);
				       marker1 = L.marker(latlng, {
				   		icon : L.icon({
				   			iconUrl: '../radar/image/mark.png',
				   			iconSize: [28, 28],
				   			iconAnchor: [16, 16],
				   			className : "station"
				   		})
				   	})
				   	markers.push(marker1); 
				    var citiesLayer = L.layerGroup(markers);
				    map.addLayer(citiesLayer);	
				} 
			}
			
		},
		error : function(){
			
		}
	})
}

mapConsole.addImgToMap = function(url, data){
	// 地图中叠加图片
	// Lon[114.65, 122.80] lat[34.25, 38.55]
	var opacity;
	var bounds;
	if(data != null){
		opacity = data.opacity;
		bounds = data.bounds;
	}
	
	if(opacity == null) {opacity = 0.6};
	if(bounds == null) {
		bounds = mapConsole.bounds;
	//	mapConsole.reactangle.setBounds(mapConsole.bounds);		
	};
	if(mapConsole.imgLayer == null){
		mapConsole.imgLayer = L.imageOverlay(url, bounds,{
			opacity : opacity,
			 pane : "overlayPane"
		});
		mapConsole.imgLayer.addTo(map);
	}else{
		mapConsole.imgLayer.setUrl(url);
		mapConsole.imgLayer.setOpacity(opacity);
		mapConsole.imgLayer.setBounds(bounds);
	}
}
mapConsole.removeMapImg = function(){
	// 地图中移除图片
	if(mapConsole.imgLayer != null){
		map.removeLayer(mapConsole.imgLayer);
		mapConsole.imgLayer.remove();
		mapConsole.imgLayer = null;
	}
}
//地图上鼠标移入显示数据的模块
mapConsole.mousemoveMarker = {
	ONOFF : false, // 开关  默认关闭
	isShow : false,
	data : null, // 数据存储的地方
	close : function(){
		// 关闭方法
		mapConsole.mousemoveMarker.ONOFF = false;
		$("#map .move").hide();
	},
	show : function(latlng){
//		if(mapConsole.mousemoveMarker.marker == null){
//			// mapConsole.mousemoveMarker.marker = L.marker(latlng, {
//			// 	icon : L.divIcon({
//			// 		className: 'my-div-icon23423',
//			// 		iconSize : [20, 20],
//			// 		iconAnchor : [10, 0],
//			// 		html : '<lable class="move">...</lable>'
//			// 	})
//			// });
//			mapConsole.mousemoveMarker.marker = L.marker([latlng.lat, latlng.lng]).addTo(map)
//			    .bindPopup("加载中...").openPopup();
//			mapConsole.mousemoveMarker.marker.on("click", mapConsole.mousemoveMarker.clickFun);
//		}else{
//			mapConsole.mousemoveMarker.marker.setLatLng(latlng);
//		}
//		
//		if(!mapConsole.mousemoveMarker.isShow){
//			mapConsole.mousemoveMarker.marker.addTo(map);
//			mapConsole.mousemoveMarker.isShow = true;
//		}
	},
	hide : function(){
		if(mapConsole.mousemoveMarker.marker != null && mapConsole.mousemoveMarker.isShow){
			mapConsole.mousemoveMarker.marker.remove();
			mapConsole.mousemoveMarker.isShow = false;
		}
	},
	getData : function(latlng){ // 根据经纬度获取值
		var bounds = mapConsole.bounds2;
		var index;
		
		var warningData = timeLineConsole.timeData;
		
		var trueIndex = getMinDistancePoint(latlng.lng, latlng.lat, bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0], 0.05, 0.05);
		var index = trueIndex;
		
		var val = mapConsole.mousemoveMarker.data[index];
		
		
		return val;
	},
	startNum : 0, // 获取的第N个数据
	update: function(latlng){
	
	},
	elementGetValue : function(type, Val){
		
	},
	
	getTMPVal : function(val){
		return parseFloat((parseFloat(val) -0).toFixed(0));
	},
	clickFun : function(){

	}
};

