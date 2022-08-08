var ybResult=""
var regionCode = '370105' // 城市code
$(function() {
	getView()
	getCity()
	getData()
	//getOption()
	
})
function getView() {
	$('.air-div').css('display','none')
}
function getPlay() {
	if ( 'speechSynthesis' in window ) {
		$(".voice_start").css('display','flex')
		$(".voice_end").css('display','none')
		if(ybResult==""){
			ybResult="获取内容失败，请稍后在试。"
		}
	    const to_speak = new SpeechSynthesisUtterance(ybResult);
		to_speak.lang = 'zh'; // 汉语
	    speechSynthesis.cancel();
	    speechSynthesis.speak(to_speak);
	    // 播放完成
	    to_speak.onend=function(){
	    	$(".voice_start").css('display','none')
			$(".voice_end").css('display','flex')
	    }
	  } else {
		  mui.alert('播放失败,您的浏览器不支持');
	  }
}
function getStart() {
	if ( 'speechSynthesis' in window ) {
		$(".voice_start").css('display','none')
		$(".voice_end").css('display','flex')
		speechSynthesis.cancel();
	}
}
// 实况、预报数据、预警
function getData() {
	mui.showLoading();
	$.ajax({
		type : "GET",
		url :BASEPATH + 'data/weather/get',
		data : {
			regionCode : regionCode,
		},
		dataType : 'json',
		success : function(res) {
			
			if (res.state == 1) {
				var dataArray = res.records;
				if (JSON.stringify(dataArray) != "{}") {
					showLayout(dataArray)
				}
				mui.hideLoading();
			}
		},error : function(){
			mui.hideLoading();
			$(".mui-badge").css("display","none")
			$(".swiper-wrapper").empty()
			var divObj=$('<div class="swiper-slide">'
					+'<div class="yjtext">当前暂无预警</div></div>')
			$(".swiper-wrapper").append(divObj);
		}
	});
	getLunarCalendar()
	getRegion()
}


function showLayout(data) {
	if (JSON.stringify(data.jsMin) != "{}") {
		showRainfall(data.jsMin)
	}
	showLive(data.skHour)
	showForecast(data.ybCity)
	showHourWeather(data.ybHour)
	showWarning(data.yjEffective)
	
}


// 查询城市
function getCity() {
	$.ajax({
		type : 'get',
		dataType : 'json',
		url : BASEPATH + "data/base-region/get",
		success : function(res) {
			if (res.state = 1) {
				let arr = res.records;
				let cityArray = {};
				let addressObj = [];
				for(var key in arr){
					let countysObj = [];
					for(var countyskey in arr[key]["childRegionData"]){
						// 三级
						let countysArray = {
							"text" : arr[key]["childRegionData"][countyskey]["regionName"],
							"value" : arr[key]["childRegionData"][countyskey]["regionCode"]
						}
						countysObj.push(countysArray)
					}
					// 二级
					cityArray = {
						"text" : arr[key]["regionName"],
						"value" : arr[key]["regionCode"],
						"children" : countysObj
					}
					addressObj.push(cityArray)
				
				}
				// 一级
				var listArray = [];
				var fenl = {} // 定义一个空对象，作为每个一级数据对象
				fenl.text = "山东省"
				fenl.value = "1"
				listArray.push(fenl)
				for (var i = 0; i < listArray.length; i++) {
					listArray[i].children = addressObj;
				}
				var newPicker = new mui.PopPicker({
					layer : 3
				// num为选择器的层级数
				});
				// 设置数据到picker上
				newPicker.setData(listArray);
				
				var selectCity = document.getElementById('selectCity');
				// 单击inpick
				selectCity.addEventListener('tap', function(event) {
					newPicker.show(function(items) {
						var province = (items[0] || {}).text;
						var city = (items[1] || {}).text;
						var county = (items[2] || {}).text;
						var countyCode = (items[2] || {}).value;
						var address =city + county
						regionCode=countyCode
						getData()
						
					})
				})
				


			}
		}

	});

}

// 根据行政编码获取详情
function getRegion() {
	$.ajax({
		url : BASEPATH+"data/region/get",
		dataType : "json",
		data : {
			regionCode:regionCode
		},
		success : function(res){
			
			if(res.state==1){
				var dataArray=res.records;
				if (JSON.stringify(dataArray) != "{}") {
					var city=dataArray.city
					var county=dataArray.county
					$(".usercity").text(city+county)
					getSunSet(dataArray["lat"],dataArray["lon"])
				} 
			}
			
		},
		error : function(){
			
		}
	})
		
}

// 日出日落
function getSunSet(latitude, longitude){
	// 经纬度接口写反了，这里也需要反着写
	$.ajax({
		type : "get",
		url: BASEPATH + 'data/sunrise-sunset/get',
		data:{
			lon:latitude,
			lat:longitude
		},
		success : function(res) {
			  if(res.state==1){
				  var hour = "时";
		          var minute = "分";
		          
				  var datainfo = res.records;  
		          var sunup = datainfo.split('-')[0];// 日出
		          sunup= sunup.replace(hour, ":").replace(minute, "")
		          
		          var sunset = datainfo.split('-')[1];// 日出
		          sunset= sunset.replace(hour, ":").replace(minute, "")
		         
		         // 日出
		          var richu = sunup;
		          var sunupOneStr = sunup.substring(0, sunup.indexOf(":"));
		          var sunupTwoStr = sunup.substring(sunup.indexOf(":") + 1);
		          if (sunupOneStr.length == 1 && sunupTwoStr.length == 1) {
		            richu = "0" + sunupOneStr + ':' + "0" + sunupTwoStr;
		          } else if (sunupOneStr.length == 1) {
		            richu = "0" + sunupOneStr + ':' + sunupTwoStr;
		            if (sunupTwoStr.length == 1) {
		              richu = "0" + sunupOneStr + ':' + "0" + sunupTwoStr;
		            }
		          } else if (sunupTwoStr.length == 1) {
		            richu = sunupOneStr + ':' + "0" + sunupTwoStr;
		            if (sunupOneStr.length == 1) {
		              richu = "0" + sunupOneStr + ':' + "0" + sunupTwoStr;
		            }
		          } else {
		            richu = sunup;
		          }
		          // 日落
		          var riluo = sunset;
		          var sunsetOneStr = sunset.substring(0, sunset.indexOf(":"));
		          var sunsetTwoStr = sunset.substring(sunset.indexOf(":") + 1);

		          if (sunsetOneStr.length == 1 && sunsetTwoStr.length == 1) {
		            riluo = "0" + sunsetOneStr + ':' + "0" + sunsetTwoStr;
		          } else if (sunsetOneStr.length == 1) {
		            riluo = "0" + sunsetOneStr + ':' + sunsetTwoStr;
		            if (sunsetTwoStr.length == 1) {
		              riluo = "0" + sunsetOneStr + ':' + "0" + sunsetTwoStr;
		            }
		          } else if (sunsetTwoStr.length == 1) {
		            riluo = sunsetOneStr + ':' + "0" + sunsetTwoStr;
		            if (sunsetOneStr.length == 1) {
		              riluo = "0" + sunsetOneStr + ':' + "0" + sunsetTwoStr;
		            }
		          } else {
		            riluo = sunset;
		          }
		          $(".sunrise-text").html(richu);
		          $(".sunset-text").html(riluo);
			  }
		}
	})
}

// 逐小时预报
function showHourWeather(res) {
	var tempArr=[];//温度
	var timeArr=[];//时间
	var tqstateArr=[];//天气状态
	$(".houryb").empty();
	if (res.length > 0) {
		var hourList =res;
        for (let i = 0; i < hourList.length; i++) {
        	var hours = hourList[i].ybtime;
            if (hours != '') {
              hours = hours.substring(8, 10) + '时';
            }
            hourList[i].hourtime = hours;
            var new_tem = hourList[i].tem;
            if (new_tem != '') {
              if (new_tem < 998) {
                hourList[i].new_tem = parseInt(new_tem)+"°";
              } else {
                hourList[i].new_tem = "-";
              }
            } else {
              hourList[i].new_tem = "-";
            }
             var dayimage = hourList[i].weather;// 天气现象
             if (dayimage < 10) {
                dayimage = '0' + dayimage;
              }
              hourList[i].dayimage = dayimage; 
            
            var fengxiang = hourList[i].dd_level;
            if (fengxiang != '') {
              hourList[i].dd_level = parseInt(fengxiang);
            } else {
              hourList[i].dd_level = "-";
            }
            var imgUrl="../../img/weather_icon/day/"+hourList[i].dayimage+".png"
		    var li = $('<li><img src="'+imgUrl+'">'
						+'<div class="weather-air"><p>'+getHourFengXing(hourList[i].dd_level)+'<br/>'+getHourWindLevel(hourList[i].ff_level)+'</p></div></li>'); 
		    $(".houryb").append(li);
		    timeArr.push(hourList[i].hourtime)
	        tempArr.push(hourList[i].tem)
	        tqstateArr.push(getStringTem(hourList[i].weather))
        }
        var ybstate=getStringTem(hourList[0]["weather"])
        $(".state-text").text(ybstate)
       
	}

	document.getElementById('yb3').style.width = "calc(55px *"+tempArr.length+")";
    createHourLine("yb3", tempArr, timeArr,tqstateArr)
}

// 获取农历信息
function getLunarCalendar() {
	$.ajax({
		type : "GET",
		url : BASEPATH + 'data/lunar-calendar/get',
		dataType : 'json',
		success : function(res) {
			if (res.state == 1) {
				var dataArray = res.records;
				if (JSON.stringify(dataArray) != "{}") {
					if (dataArray.code == 1) {
						var yearTips = dataArray.data.yearTips;
						var lunarCalendar = dataArray.data.lunarCalendar;
						$('.calendar').text(yearTips + lunarCalendar);
					}

				}

			}
		}
	});

}

// 预警信息
function showWarning(data) {
	$(".swiper-wrapper").empty()
	if(data.length!=0){
		$(".mui-badge").css("display","block")
		$(".mui-badge").text(data.length)
		for(var i=0;i<data.length;i++){
			var title1=data[i].HEADLINE.split("[")[0]
			var title2=title1.split("发布")[1]
			var title3=title2.split("预警")[0]
			var imageUrl=""
			if(title3.indexOf("雷电大风")!=-1){
				imageUrl="../../img/yjImgStr/elseyj.png"
			}else{
				imageUrl="../../img/yjImgStr/"+title3+"_small.png"
			}
			var divObj=$('<div class="swiper-slide">'
					+'<img class="yjimg" src="'+imageUrl+'">'
					+'<div class="yjtext">'+title1+'</div></div>')
			$(".swiper-wrapper").append(divObj);
			
		}
	}else{
		$(".mui-badge").css("display","none")
		var divObj=$('<div class="swiper-slide">'
				+'<div class="yjtext">当前暂无预警</div></div>')
		$(".swiper-wrapper").append(divObj);
	}
	
}
// 小时实况数据
function showLive(data) {
	var tem = "--";// 温度
	if (data.tem) {
		if (data.tem < 9999) {
			tem = data.tem+"°";
		}
	}
	$('.live-tem').text(tem);

	var pre_1h = "降水 0mm";// 降水
	if (data.pre_1h) {
		if (data.pre_1h < 9999) {
			pre_1h = "降水 " + data.pre_1h + "mm";
		}
	}
	$('.rain').text(pre_1h);

	var rhu = "湿度 --";// 湿度
	if (data.rhu) {
		if (data.rhu < 9999) {
			rhu = "湿度 " + data.rhu + "%";
		}
	}
	$('.humidity').text(rhu);

	var win_d_avg_10mi = "--";// 风向
	if (data.win_d_avg_10mi) {
		if (data.win_d_avg_10mi < 9999) {
			win_d_avg_10mi = getFengXing(data.win_d_avg_10mi);
		}
	}

	var win_s_avg_10mi = "";// 风速
	if (data.win_s_avg_10mi) {
		if (data.win_s_avg_10mi < 9999) {
			win_s_avg_10mi = getLiveWindLevel(data.win_s_avg_10mi) + "级";
		}
	}

	$('.wind').text(win_d_avg_10mi + " " + win_s_avg_10mi);

	var datetime = data.datetime;
	if (datetime) {
		datetime = datetime.substring(4, 6) + "/" + datetime.substring(6, 8)
				+ " " + datetime.substring(8, 10) + ":"
				+ datetime.substring(10, 12) + "更新"
		$(".updatetime").text(datetime)
	}
	ybResult="济南当前温度"+tem+rhu+pre_1h+win_d_avg_10mi+win_s_avg_10mi
}
// 两天预报、七天预报
function showForecast(res) {
	var dayList = [];
	var nightList = [];
	var mintempArr = [];// 最小温度
	var maxtempArr = [];// 最大温度
	var timeArr = [];// 日期

	var forecastArr = [];

	if (res.length > 0) {
		for (let i = 1; i < res.length; i++) {
			if (res[i].ybtime.substring(8, 12) == '0800') {
				dayList.push(res[i]);
			}
		}

		for (let i = 0; i < res.length; i++) {
			if (res[i].ybtime.substring(8, 12) == '2000') {
				nightList.push(res[i]);
			}
		}
		for (let i = 0; i < dayList.length; i++) {
			var days = dayList[i].ybtime;
			var daysStr = '';
			if (days != '') {
				days = days.substring(0, 4) + '-' + days.substring(4, 6) + '-'
						+ days.substring(6, 8);
				daysStr = getSevendaysStr(days, -1);
				var timejiequ = getHourWeatherStr(days, -1);
				dayList[i].timejiequ = timejiequ
			}
			dayList[i].ybtimestr = daysStr

			if (dayList[i].tem_max < 998) {
				dayList[i].tem_max = parseInt(dayList[i].tem_max);
			} else {
				dayList[i].tem_max = '-';
			}
			if (dayList[i].tem_min < 998) {
				dayList[i].tem_min = parseInt(dayList[i].tem_min);
			} else {
				dayList[i].tem_min = '-';
			}
			var dayimage = dayList[i].wep_12h;
			if (dayimage < 10) {
				dayimage = '0' + dayimage;
			}
			dayList[i].dayImage = dayimage;
			dayList[i].dayState = dayList[i].wep_12h;

			var nightimage = nightList[i].wep_12h;
			if (nightimage < 10) {
				nightimage = '0' + nightimage;
			}
			dayList[i].netImage = nightimage;
			dayList[i].netState = nightList[i].wep_12h;

			var weekdaytime = dayList[i].ybtime;
            var timestrone = weekdaytime.substring(0, 4) + '-' + weekdaytime.substring(4, 6) + '-' + weekdaytime.substring(6, 8);
            var timestrtwo = getDates(0, timestrone);
			var weeks = [];
			var time = new Date();
			var dqtime = DateGrid(time, "yyyyMMdd");// 当前时间
			for (let i = 0; i < timestrtwo.length; i++) {
				weeks.push(timestrtwo[i].week);

			}
			var weekDay = '';
			var datatimeStr=dayList[0].timejiequ;
            datatimeStr=datatimeStr.substring(0,8);
            if(datatimeStr==dqtime){
                if(i==0){
                  weeks="今天"
                  dayList[i].yblistindex=true;
                }else if(i==1){
                  weeks="明天"
                }
              }else if(datatimeStr>dqtime){
                if(i==0){
                  weeks="明天"
                }else if(i==1){
                  weeks="后天"
                }
              }else if(datatimeStr<dqtime){
                if(i==0){
                  weeks="昨天"
                }else if(i==1){
                  weeks="今天"
                  dayList[i].yblistindex=true;
                }else if(i==2){
                  weeks="明天"
                }
              }
            weekDay = weeks;
			dayList[i].weekdays = weekDay;
		}

		  var html1 = "";
		  $("#forecastUL").empty();
		  $("#two-forecastUL").empty()
		  for (var i = 0; i < dayList.length; i++) {
	         	 mintempArr.push(dayList[i].tem_min);
	         	 maxtempArr.push(dayList[i].tem_max);
	         	 timeArr.push(dayList[i].ybtimestr);
	         	var netState=getStringTem(dayList[i].netState);
	         	var dayState=getStringTem(dayList[i].dayState);
	         	var win_d_avg_12h=getYBFengXing(dayList[i].win_d_avg_12h);
	         	var win_s_avg_12h=getWindLevelForNum(dayList[i].win_s_avg_12h);
	         	var temvalue=dayList[i].tem_max+"/"+dayList[i].tem_min+"°"
	         		if(dayList[i]["weekdays"]=="今天"){
	         			 html1 += `<li class="selecebg">
	     					<p class="weekdays">${dayList[i]["weekdays"]}</p>
	     					<p class="date">${dayList[i]["ybtimestr"]}</p>
	     					<p class="netState">${netState}</p>
	     					<img class="netStateImg" src="../../img/weather_icon/day/${dayList[i]["netImage"]}.png">
	     					<img src="../../img/weather_icon/night/${dayList[i]["dayImage"]}.png" alt="" class="night dayStateImg">
	     					<p class="dayState">${dayState}</p>
	     					<p class="win_d">${win_d_avg_12h}<br><span class="win_s">${win_s_avg_12h}</span></p>
	     					<div class="weather-air"><p>良</p></div>
	     				</li>`;
	         		}else{
	         			 html1 += `<li>
	     					<p class="weekdays">${dayList[i]["weekdays"]}</p>
	     					<p class="date">${dayList[i]["ybtimestr"]}</p>
	     					<p class="netState">${netState}</p>
	     					<img class="netStateImg" src="../../img/weather_icon/day/${dayList[i]["netImage"]}.png">
	     					<img src="../../img/weather_icon/night/${dayList[i]["dayImage"]}.png" alt="" class="night dayStateImg">
	     					<p class="dayState">${dayState}</p>
	     					<p class="win_d">${win_d_avg_12h}<br><span class="win_s">${win_s_avg_12h}</span></p>
	     					<div class="weather-air"><p>良</p></div>
	     				</li>`;
	         		}
	            
	         	var li=$('<li class="mui-table-view-cell"><label class="weekdays">'+dayList[i]["weekdays"]+'</label>'
						+'<label class="date">02/03</label> <label class="weather-air">良</label>'
						+'<img class="netStateImg"'
						+'src="../../img/weather_icon/day/'+dayList[i]["netImage"]+'.png">'
						+'<label class="netState">'+netState+'</label> <label>/</label> <img class="dayStateImg"'
						+'src="../../img/weather_icon/night/'+dayList[i]["dayImage"]+'.png">'
						+'<label class="dayState">'+dayState+'</label>'
						+'<div class="temvalue">'+temvalue+'</div></li>')
						$("#forecastUL").append(li);
	         	if(dayList[i]["weekdays"]=="今天" || dayList[i]["weekdays"]=="明天"){
	         		forecastArr.push(dayList[i])
	         	}
	         }
		  
	        $(".weekyb").html(html1);
	        document.getElementById('yb1').style.width = "calc(73px * "+maxtempArr.length+")";
	        document.getElementById('yb2').style.width = "calc(73px * "+mintempArr.length+")";
	        
	        var lineColor1 = "#F14B7E", position1 = 'top';
	        createWDLine("yb1", maxtempArr, timeArr, lineColor1, position1,"#F14B7E")
	
	        var lineColor2 = "#4EB5F9", position2 = 'bottom';
	        createWDLine("yb2", mintempArr, timeArr, lineColor2, position2,"#4EB5F9")		 		         	        	    

	        if(forecastArr.length!=0){
	        	for(var i=0;i<forecastArr.length;i++){
	        		var temvalue=forecastArr[i].tem_min+"/"+forecastArr[i].tem_max+"°"
	        		var tqstate=""
	        		var netState=getStringTem(forecastArr[i]["netState"])
	        		var dayState=getStringTem(forecastArr[i]["dayState"])
	        		if(netState==dayState){
	        			tqstate=netState
	        		}else{
	        			tqstate=netState+"转"+dayState
	        		}
	        		var li=$('<li class="mui-table-view-cell  mui-col-xs-6">'
	    					+'<div class="forecast-item"><div class="forecast-item flex">'
							+'<span class="forecast-date">'+forecastArr[i]["weekdays"]+'</span><span class="forecast-quality"></span></div>'
							+'<span class="forecast-state">'+tqstate+'</span></div>'
	    					+'<div class="forecast-item margintop-xs flex">'
							+'<span class="forecast-tem flex">'+temvalue+'</span> <img class="forecast-img" src="../../img/weather_icon/day/'+forecastArr[i]["netImage"]+'.png"></div></li>')
							$("#two-forecastUL").append(li);
		        }
	        }
	        
	}
}

// 分钟降水
function showRainfall(data) {
	// 分钟降水
	if (data.status != 'ok') {
		$('.rain-tips').text('分钟级降水数据加载错误');
		$('.air-div').css('display','none')
		return;
	}
	var result = data.result;
	if (!result) {
		$('.rain-tips').text('分钟级降水数据加载错误');
		$('.air-div').css('display','none')
		return;
	}
	$('.air-div').css('display','flex')
	var data = data.result.minutely;
	var radar_desc = data.description;
	$('.rain-tips').text(radar_desc);
	var rainfall_data = data.precipitation_2h.slice(0, 60);
	var t = result.hourly.temperature[0].value < -2 ? '雪' : '雨';
	$('.level_c .leve_1 .type_flag').text(t);
	
	var timeArray =[];
	for(var i=0;i<rainfall_data.length;i++){
	      timeArray.push(i)
	 }
	

	 var init_canvas_size = function() {
	
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
	 
	 var hourly=result.hourly;
	 if(hourly){
		 var result_aqi=hourly.aqi[0]["value"]
		 var level=GetLevel(result_aqi).level
		 var image=GetLevel(result_aqi).image
		 $(".qualityvalue").text(result_aqi)
		 $(".qualitylevel").text(level)
		 $(".qualityimg").attr("src","../../img/air/"+image+".png")
	 }
}

// 逐小时预报
function getOption() {

	var imgsrc=new Array("http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png","http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png","http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png",
			"http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png","http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png",
			"http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png","http://58.59.29.50:15004/shandong/dataFile/weather_icon/day/04.png"); // 图片路径数组
	var dom = document.getElementById("rain-echarts");
	var myChart = echarts.init(dom);
	var app = {};
	var option;
	option = {
		grid : {
			top : '8px',
			left : '12px',
			right : '12px',
			bottom : '8px',
			containLabel : true
		},
	    tooltip : {
	        trigger: 'axis',
	        padding: 10, 
	     	formatter:function(params,ticket,callback){
			console.log(params[0].dataIndex);
			var imgindex=params[0].dataIndex;
			var txt=params[0].name+":"+params[0].value+"<br/>";
			txt+="<img src="+imgsrc[imgindex]+" width=\"40\" >"; // 添加对应的图片
		  return txt;
	    }

	    },
	    toolbox: {
	        show : false,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
// calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : ['周一','周二','周三','周四','周五','周六','周日'] // 横坐标
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
				scale: true,
	            axisLabel : {
	                formatter: '{value} °C' // 纵坐标单位
	            }
	        }
	    ],

	    series : [
	         {
	            name:'',
	            type:'line',
	            data: [34, 12,
			    {
			        value : 56,
			        tooltip:{
					trigger:'axis',
					formatter:function(params, ticket, callback){
					
			                    var thistxt = "222";
			                    return thistxt;
					}
					}
			    },
	    		22,55,32,10
	    		],
				
	           
	        }

	    ]
	};

	if (option && typeof option === 'object') {
		myChart.clear(); // 清空缓存
		myChart.setOption(option);
		 myChart.dispatchAction({
		 type: "showTip",
		 seriesIndex: 0, // 显示第几个series，从0开始
		 dataIndex: 0 // 显示第几个数据，从0开始
		 });
	}
}
function onclickRadar() {
	window.location.href = "../radar/radarMain.html";
}


function draw_canvas(c, startTime,rainfall_data) {
	if (rainfall_data != undefined) {

		var time = (new Date()).getTime() - startTime;

		var data = Array.apply(null, new Array(rainfall_data.length)).map(Number.prototype.valueOf, 0);;
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
			cxt.fillStyle = "rgba(68,230,107,1)";
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
var getHourFengXing=function(fx1) {
	  if (fx1==0) {
	    fx3 = "无风";
	  }
	  else if (fx1==1) {
	    fx3 = "东北风";
	  }
	  else if (fx1 == 2) {
	    fx3 = "东风";
	  }
	  else if (fx1 == 3) {
	    fx3 = "东南风";
	  }
	  else if (fx1 == 4) {
	    fx3 = "南风";
	  }
	  else if (fx1 == 5) {
	    fx3 = "西南风";
	  }
	  else if (fx1 == 6) {
	    fx3 = "西风";
	  }
	  else if (fx1 == 7) {
	    fx3 = "西北风";
	  }
	  else if (fx1 == 8) {
	    fx3 = "北风";
	  }
	  else if (fx1 == 9) {
	    fx3 = "旋转风";
	  }else {
	    fx3 = "-";
	  }
	  return fx3;
	}
 var getHourWindLevel=function(key) {
	  key = key + "";
	  switch (key) {
	    case "0":
	      return "≤3级";
	    case "1":
	      return "3-4级";
	    case "2":
	      return "4-5级";
	    case "3":
	      return "5-6级";
	    case "4":
	      return "6-7级";
	    case "5":
	      return "7-8级";
	    case "6":
	      return "8-9级";
	    case "7":
	      return "9-10级";
	    case "8":
	      return "10-11级";
	    case "9":
	      return "11-12级";
	    default:
	      return "-";
	  }
	}
// 判断空气质量
 function GetLevel(aqi) {
// var aqicolorArr = [ "#72B962", "#E1C556", "#E7855C", "#BF5056", "#A34874" ];
 	var aqiimgrArr = [ "air_excellent", "air_good", "air_light", "air_moderate6", "air_severe","air_serious" ];
 	var LEVELS = [ '优', '良', '轻度', '中度', '重度','严重' ];
 	var leve_index = aqi < 50 ? 0 : aqi < 100 ? 1 : aqi < 150 ? 2
 			: aqi < 200 ? 3 : 4;
 	var level = LEVELS[leve_index], image = aqiimgrArr[leve_index];
 	return {
 		"level" : level,
 		"image" : image
 	};
 }