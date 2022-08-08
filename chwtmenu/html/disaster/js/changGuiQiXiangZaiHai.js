// 常规气象灾害
var changGuiQiXiangZaiHai = {};
var select_Time='0'
changGuiQiXiangZaiHai.init = function(){
	changGuiQiXiangZaiHai.getData();
}
changGuiQiXiangZaiHai.getData = function(){
	if(changGuiQiXiangZaiHai.data == null){
		mui.showLoading();
		$.ajax({
			url : BASEPATH +"data/zhlq/get",
			dataType : "JSON",
			success : function(data){
				mui.hideLoading();
				if(data.state == 1){
					changGuiQiXiangZaiHai.data = data.records["zhlq"];
					changGuiQiXiangZaiHai.initStyle();
				}else{
					mui.alert("获取数据失败！");
				}
			},
			error : function(data){
				// 异常
				mui.hideLoading();
				mui.alert("获取数据失败！");
			}
		})
	}else{
		changGuiQiXiangZaiHai.initStyle();
	}
}
changGuiQiXiangZaiHai.typeData = [
	{
		name : '大雨',
		type : "dayu",
		icon : "dataFile/image/warningType/countType2_4.png",
	},
	{
		name : '暴雨',
		type : "baoyu",
		icon : "dataFile/image/warningType/countType2_5.png",
	},
	{
		name : '大暴雨',
		type : "dabaoyu",
		icon : "dataFile/image/warningType/countType2_6.png",
	},
	{
		name : '大风',
		type : "dafeng",
		icon : "dataFile/image/warningType/countType2_7.png",
	},
	{
		name : '高温',
		type : "gaowen",
		icon : "dataFile/image/warningType/countType2_8.png",
	},
	{
		name : '强降温',
		type : "qiangjiangwen",
		icon : "dataFile/image/warningType/countType2_9.png",
	},
]
changGuiQiXiangZaiHai.initStyle = function(){
	console.log(changGuiQiXiangZaiHai.data)
	// 初始化显示样子
	changGuiQiXiangZaiHai.isshow = true;
	var startTime = changGuiQiXiangZaiHai.data["dayu"][0].zaiHaiLuoQu.qbTime;
	changGuiQiXiangZaiHai.stsrtTimeStr = startTime.substr(0, 4) + "/" + startTime.substr(4, 2) + "/" + startTime.substr(6, 2);
	changGuiQiXiangZaiHai.stsrtTimeShiCi = changGuiQiXiangZaiHai.data["dayu"][0].zaiHaiLuoQu.shici;
	changGuiQiXiangZaiHai.startTime = new Date(changGuiQiXiangZaiHai.stsrtTimeStr);
	
	$("#echart_1_time").html(changGuiQiXiangZaiHai.stsrtTimeStr.replaceAll("/", "-")+"更新数据");
	
	// 初始化显示类型
	// 类型选择器

	$("#sliderSegmentedControl>div").empty();
	for(var i in changGuiQiXiangZaiHai.typeData){
		var label = $("<label class='mui-control-item'>" + changGuiQiXiangZaiHai.typeData[i].name + "</label>");
		label.data("data", changGuiQiXiangZaiHai.typeData[i]);
		$("#sliderSegmentedControl>div").append(label);
	}
	$("#sliderSegmentedControl>div").on("click", "label", function(){
		var _this = $(this);		
		var data = _this.data("data");
		timeLineConsole.showType = data.type; 
		timeLineConsole.update("灾害", data);
	})
	$("#sliderSegmentedControl>div").find("label").eq(0).addClass("mui-active");
	$("#sliderSegmentedControl>div").find("label").eq(0).click();
	changGuiQiXiangZaiHai.initEchart();
}

changGuiQiXiangZaiHai.show = function(){
	var num = timeLineConsole.timeHourNOW;
	var type = timeLineConsole.showType;
	var name = changGuiQiXiangZaiHai.data[type][num].zaiHaiLuoQu.fileName;
	if(type == "dafeng"){
		name = name.replace(".png", "s.png");
	}
	var baifenNum=changGuiQiXiangZaiHai.data[type][num]["baifenNum"]
	if(baifenNum==0){
		if(type=="dayu"){
			mapConsole.addImgToMap("../../img/disaster/no-dy.png");
		}else if(type=="baoyu"){
			mapConsole.addImgToMap("../../img/disaster/no-by.png");
		}else if(type=="dabaoyu"){
			mapConsole.addImgToMap("../../img/disaster/no-dby.png");
		}else if(type=="dafeng"){
			mapConsole.addImgToMap("../../img/disaster/no-df.png");
		}else if(type=="gaowen"){
			mapConsole.addImgToMap("../../img/disaster/no-gw.png");
		}else if(type=="qiangjiangwen"){
			mapConsole.addImgToMap("../../img/disaster/no-qjw.png");
		}else{
			mapConsole.addImgToMap("../../img/disaster/no-else.png");
		}
		
	}else{
		mapConsole.addImgToMap(BASEPATH_IMAGE_PATH+changGuiQiXiangZaiHai.data[type][num]["imgUrl"]);
	}
	
	
}

changGuiQiXiangZaiHai.close = function(){
	// 关闭这个菜单时候关闭的东西
	changGuiQiXiangZaiHai.isshow = false;
	$("#yuJingShuJu").hide();
	$("#yuJingShuJuShouZaiMianJi").hide();
	$("#weatherType").hide();
	$("#timeLine").hide();
	timeLineConsole.playClose();
	mapConsole.removeMapImg();
}

changGuiQiXiangZaiHai.getTimeStr = function(str){
	return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
}

changGuiQiXiangZaiHai.initEchart = function(){
	var type = [];
	var series = [];
	var time = [];
	var maxVal = 100;
	// 时间
	
	for(var i =0; i<changGuiQiXiangZaiHai.typeData.length; i++){
		type.push(changGuiQiXiangZaiHai.typeData[i].name);
		var typeData = changGuiQiXiangZaiHai.data[changGuiQiXiangZaiHai.typeData[i].type];
		for(var j=typeData.length - 1, k=0; j>=0; j--,k++){
			if(parseFloat(typeData[j].baifenNum) != 0){
				series.push(changGuiQiXiangZaiHai.getEchartData(i, k, parseFloat(typeData[j].baifenNum), typeData[j]));
			}
			if(i == 0){
				time.push(changGuiQiXiangZaiHai.getTimeStr(typeData[j].zaiHaiLuoQu.date));
			}
		}
	}
	
	if(changGuiQiXiangZaiHai.myChart == null){
		changGuiQiXiangZaiHai.myChart = echarts.init($("#echart_1")[0]);
		changGuiQiXiangZaiHai.myChart.on('click', changGuiQiXiangZaiHai.echartClick);
	}
	
	
	var option = changGuiQiXiangZaiHai.getOption(type, time, series , maxVal);
	changGuiQiXiangZaiHai.myChart.clear(); // 清空缓存
	changGuiQiXiangZaiHai.myChart.setOption(option);
	changGuiQiXiangZaiHai.myChart.resize();
}
changGuiQiXiangZaiHai.echartClick = function(params){
	// 点击echrts切换对应的时间与类型
	if($("#sliderSegmentedControl>div").find("label").eq(params.value[0]).hasClass("mui-active")){
		if(!$("#zhLine").find("li").eq(9 - params.value[1]).hasClass("mui-active")){
			$("#zhLine").find("li").removeClass("mui-active");
			$("#zhLine").find("li").eq(9 - params.value[1]).addClass("mui-active");
			$("#zhLine").find("li").eq(9 - params.value[1]).click();
		}
	}else{
		$("#sliderSegmentedControl>div").find("label").removeClass("mui-active");		
		$("#sliderSegmentedControl>div").find("label").eq(params.value[0]).addClass("mui-active");
		$("#sliderSegmentedControl>div").find("label").eq(params.value[0]).click();
		if(!$("#zhLine").find("li").eq(9 - params.value[1]).hasClass("mui-active")){
			$("#zhLine").find("li").removeClass("mui-active");
			$("#zhLine").find("li").eq(9 - params.value[1]).addClass("mui-active");
			$("#zhLine").find("li").eq(9 - params.value[1]).click();
		}
	}	
	
}
changGuiQiXiangZaiHai.colors = [{type : "大雨" , value : ["rgb(255, 110, 105)", "rgb(255, 88, 80)", "rgb(255, 58, 50)", "rgb(253, 35, 26)",
    "rgb(230, 29, 21)", "rgb(209, 32, 26)", "rgb(187, 34, 28)", "rgb(160, 27, 22)",
    "rgb(136, 14, 9)", "rgb(109, 4, 0)"]},
{type : "暴雨" , value : ["rgb(255, 110, 105)", "rgb(255, 88, 80)", "rgb(255, 58, 50)", "rgb(253, 35, 26)",
    "rgb(230, 29, 21)", "rgb(209, 32, 26)", "rgb(187, 34, 28)", "rgb(160, 27, 22)",
    "rgb(136, 14, 9)", "rgb(109, 4, 0)"]},
{type : "大暴雨" , value : ["rgb(255, 110, 105)", "rgb(255, 88, 80)", "rgb(255, 58, 50)", "rgb(253, 35, 26)",
    "rgb(230, 29, 21)", "rgb(209, 32, 26)", "rgb(187, 34, 28)", "rgb(160, 27, 22)",
    "rgb(136, 14, 9)", "rgb(109, 4, 0)"]},
{type : "大风" , value : ["rgb(255, 110, 105)", "rgb(255, 88, 80)", "rgb(255, 58, 50)", "rgb(253, 35, 26)",
    "rgb(230, 29, 21)", "rgb(209, 32, 26)", "rgb(187, 34, 28)", "rgb(160, 27, 22)",
    "rgb(136, 14, 9)", "rgb(109, 4, 0)"]},
{type : "高温" , value : ["rgb(255, 110, 105)", "rgb(255, 88, 80)", "rgb(255, 58, 50)", "rgb(253, 35, 26)",
    "rgb(230, 29, 21)", "rgb(209, 32, 26)", "rgb(187, 34, 28)", "rgb(160, 27, 22)",
    "rgb(136, 14, 9)", "rgb(109, 4, 0)"]},
{type : "强降温" , value : ["rgb(255, 110, 105)", "rgb(255, 88, 80)", "rgb(255, 58, 50)", "rgb(253, 35, 26)",
    "rgb(230, 29, 21)", "rgb(209, 32, 26)", "rgb(187, 34, 28)", "rgb(160, 27, 22)",
    "rgb(136, 14, 9)", "rgb(109, 4, 0)"]}]

changGuiQiXiangZaiHai.getEchartData = function (typeIndex, timeIndex, val, data){
	var colorArray = changGuiQiXiangZaiHai.colors[typeIndex].value;
	return {
		visualMap: false, //data颜色生效
        value:[typeIndex, timeIndex, val, data],
        itemStyle:{
        	normal:{
        		color : colorArray[parseInt(val/10)],
        	}
        }
	}
},

changGuiQiXiangZaiHai.getOption = function getOption(xData, yData, data, max){
	return {
	    tooltip: {
	    	shwo: true,
	    	formatter : function(params, ticket, callback){
	    		var html = yData[params.value[1]] + "<br>";
	    		html += params.marker;
	    		html += xData[params.value[0]] + "影响面积：" + params.value[2] + "%<br>";
	    		return html;
	    	}
	    },
	    xAxis: {
	        type: 'category',
	        data: xData,
	        splitArea: {
	            show: true
	        },
			axisLine : {
				lineStyle : { // 刻度线的样式
					color : "#FFF"
				}
			},
			axisLabel: {
				interval: 0,
				rotate: -45
			}
	    },
	    yAxis: {
	        type: 'category',
	        data: yData,
	        splitArea: {
	            show: true
	        },
			axisLine : {
				lineStyle : { // 刻度线的样式
					color : "#FFF"
				}
			}
	    },  
	    grid: {
	    	top : "0",
	    	bottom: "50px",
	    	left : "80px",
	    	right:"15px"
	    },
	    visualMap: {
	        min: 0,
	        max: max,
	        show: false
	    },
	    series: [{
	        name: 'Punch Card',
	        type: 'heatmap',
	        data: data,
	        label: {
	            normal: {
	                show: false
	            }
	        },
	        itemStyle: {
	            emphasis: {
	                shadowBlur: 10,
	                shadowColor: 'rgba(0, 0, 0, 0.5)'
	            }
	        }
	    }]
	}
}
// ...................................................................受灾面积统计图
changGuiQiXiangZaiHai.shouzaimianji = function(data){
	if(changGuiQiXiangZaiHai.myChart2 == null){
		changGuiQiXiangZaiHai.myChart2 = echarts.init($("#echart_2")[0]);
	}
	
	
	var option = changGuiQiXiangZaiHai.getOption2(data);
	changGuiQiXiangZaiHai.myChart2.clear(); // 清空缓存
	changGuiQiXiangZaiHai.myChart2.setOption(option);
	changGuiQiXiangZaiHai.myChart2.resize();
}
changGuiQiXiangZaiHai.getOption2 = function(data){
	
	var seriesData = [];
	for(var i in data){
		seriesData.push({
			name : data[i].farmName,
			value : data[i].baifenshu
		})
	}
	
	return {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b}<br>整体面积：{c}%<br>占比：{d}%"
	    },
	    series : [
	        {
	            type: 'pie',
	            radius : '60%',
	            center: ['50%', '50%'],
	            data:seriesData,
	            label: {
	                color : "#fff",
	                fontSize : 15
	            },
	            labelLine : {
	            	lineStyle : {
	            		width : 2,
	            		shadowColor: 'rgba(0, 0, 0, 1)',
	            		shadowBlur: 10
	            	}
	            },
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
}