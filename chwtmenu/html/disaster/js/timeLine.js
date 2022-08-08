var timeLineConsole = {};
// 时间轴控制器
timeLineConsole.timeHour = null; // 数据显示的时次
timeLineConsole.timeType = null; // 显示的要素类型
timeLineConsole.timeData = {}; // 显示的要素data
timeLineConsole.timeInterVal = {}; // 时间区间
timeLineConsole.initHtml = function(){
	var timeLine = $("#timeLine");
	var timeLineLeft = $("<div class='timeLine_left'></div>");
	var timeLineRight = $("<div class='timeLine_right'></div>");
	var timeLineTime = $("<div class='timeLine_time'></div>");
	timeLine.append(timeLineLeft);
	timeLine.append(timeLineTime);
	timeLine.append(timeLineRight);
	timeLineLeft.append("<div class='timeLine_btn' onclick='timeLineConsole.playClose();timeLineConsole.resize()'><span class='img' style='background-image: url(dataFile/image/timeLine/timeLine_reset.png);'></span><br><span data-language='timeLine'></span></div>");
	timeLineLeft.append("<div class='timeLine_btn' onclick='timeLineConsole.play()'><span class='img' style='background-image: url(dataFile/image/timeLine/timeLine_play.png);'></span><br><span data-language='timeLine'></span></div>");
	timeLineLeft.append("<div class='timeLine_btn' onclick='timeLineConsole.playClose();timeLineConsole.next(-1)'><span class='img' style='background-image: url(dataFile/image/timeLine/timeLine_last.png);'></span><br><span data-language='timeLine'></span></div>");
	timeLineLeft.append("<div class='timeLine_btn time'><input type='text' readonly='true' class='dataTime'><span data-language='timeLine'></span></div>");
	timeLineRight.append("<div class='timeLine_btn' onclick='timeLineConsole.playClose();timeLineConsole.next(1)'><span class='img' style='background-image: url(dataFile/image/timeLine/timeLine_next.png);'></span><br><span data-language='timeLine'></span></div>");
	var timeLineTimeUl = $('<ul class="timeHourUL"></ul>');
	timeLineTime.append(timeLineTimeUl);
	timeLineTime.append('<div class="timeHourNOW transitionAll"><span></span></div>');
	for (var i = 0; i < 24; i++) {
		if(i<10){
			timeLineTimeUl.append("<li><span></span>0" + i + ":00</li>");
		}else{
			
			timeLineTimeUl.append("<li><span></span>" + i + ":00</li>");
		}
	}
	
	var timeLine = ["重置", "播放", "上一个", "更改日期", "下一个"];
	$("[data-language='timeLine']").each(function(i, o){
		$(o).html(timeLine[i]);
	})
	timeLineConsole.init();
}
timeLineConsole.init = function(){
    $('#timeShow .dataTime').on('change', function(){
    	// 查看的时间变动了
   // timeLineConsole.playClose();
    	if(timeLineConsole.timeType == "格点预报"){
    		var time = $('#timeShow .dataTime').val().replaceAll("-", "/");
    		var num = timeLineConsole.timeHourNOW;
    		if(timeLineConsole.timeData.timeType == "3H"){
    			timeLineConsole.initTimeHourLine();
    			// 从新生成时间轴的值
    			if($("#timeLine .timeHourUL li.disabled").length > 0){
    				// 有禁止点击的时次
    				if($("#timeLine .timeHourUL li:eq(" + num + ")").hasClass("disabled")){
    					// 这个点禁止显示
    					// 判断当前时间是否在数据范围内
    					if($("#timeLine .timeHourUL li:eq(0)").hasClass("disabled")){
    						// 左边禁止
    						var index = $("#timeLine .timeHourUL li.disabled:last").index();
    						index ++;
    						timeLineConsole.timeHour = 3; 
    					}else{
    						timeLineConsole.timeHour = 240; 
    						var index = $("#timeLine .timeHourUL li.disabled:first").index();
    						
    						index--
    					}    					
    					timeLineConsole.timeHourNOW = index;
						$("#timeLine .timeHourUL").find("li").removeClass("active");
						$("#timeLine .timeHourUL").find("li").eq(index).addClass("active");						
    					geDianYuBao.show(); // 显示内容
    					return;
    				}
    			}
			}
			
    		// 更新显示的小时
    		var thisTime = new Date(time + " " + (num*3+2) + ":0").getTime();
    		var ssss = thisTime - timeLineConsole.timeInterVal.startTime.getTime();
    		ssss = ssss/1000/60/60; // 相差的小时数
    		if(timeLineConsole.timeData.timeType == "3H"){
    			ssss += 3;
    		}
    		timeLineConsole.timeHour = ssss;
    		geDianYuBao.show(); // 显示内容
		}
    });
	$("#timeLine .timeHourUL").on("click", "li", function(){
		// 时间轴点击时刻调用的方法
	// timeLineConsole.playClose();
		if($(this).hasClass("disabled")){
			// 这个按钮不能点击
			return;
		};
		if($(this).hasClass("active")){
			return;
		}
		$("#timeLine .timeHourUL").find("li").removeClass("active");
		$(this).addClass("active");
		
		var num = $(this).index();
		if(timeLineConsole.timeType == "格点预报"){
			// 更新显示的小时
			timeLineConsole.timeHourNOW=num;
			var time = $('#timeShow .dataTime').val().replaceAll("-", "/");
    		var thisTime = new Date(time + " " + (num*3+2) + ":0").getTime();
    		var ssss = thisTime - timeLineConsole.timeInterVal.startTime.getTime();
    		ssss = ssss/1000/60/60; // 相差的小时数
    		ssss += 3;
    		timeLineConsole.timeHour = ssss;
    		geDianYuBao.show(); // 显示内容
		}
	})
	$("#dateLine>div").on("click", "label", function(){
		// 时间轴点击时刻调用的方法
	// timeLineConsole.playClose();
		var num = $(this).index();
		if(timeLineConsole.timeType == "灾害"){
			// 更新显示的小时
			timeLineConsole.timeHourNOW=num;
			timeLineConsole.timeHour = num;
			changGuiQiXiangZaiHai.show();
		}
	})
	$("#zhLine").on("click", "li", function(){
		// 时间轴点击时刻调用的方法
		var num = $(this).index();
		// 更新显示的小时
		timeLineConsole.timeHourNOW=num;
		timeLineConsole.timeHour = num;
		changGuiQiXiangZaiHai.show();
		select_Time=num
		$(this).css("background","#007AFD").siblings().css("background","rgba(255,255,255,0.9)");
		$(this).css("color","#ffffff").siblings().css("color","#000000");
	})
	
}

timeLineConsole.update = function(type, data){
	timeLineConsole.timeType = type;
	if(type == "灾害"){
//		var startHour = 0;	
		var startHour = select_Time;	
		timeLineConsole.timeHour = startHour;
		timeLineConsole.timeData = data;
		timeLineConsole.timeInterVal = {
			startTime: changGuiQiXiangZaiHai.startTime
		}
		timeLineConsole.timeHourNOW=startHour
		changGuiQiXiangZaiHai.show();
		
	}	
	timeLineConsole.initTimeHourLine();
}
/* 更新时间轴 */
timeLineConsole.initTimeHourLine = function(){
	// 从新生成时间轴 时刻的线
	
	 if(timeLineConsole.timeType == "灾害"){
		var startTime = timeLineConsole.timeInterVal.startTime;
		var type = timeLineConsole.showType;
		var weatherData = changGuiQiXiangZaiHai.data[type];
		$("#zhLine").empty();
		for(var i =0; i<10; i++){
			var label = $("<li class='mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3'>" + DateGrid(startTime, "MM/dd") +"</li>");
			label.data("val", i);
			$("#zhLine").append(label);
			startTime = new Date(startTime.getTime() + 1000*60*60*24);
		}
		$("#zhLine").find("li").eq(timeLineConsole.timeHourNOW).css("background","#007AFD;");
		$("#zhLine").find("li").eq(timeLineConsole.timeHourNOW).css("color","#ffffff");
		$("#zhLine").find("li").eq(timeLineConsole.timeHourNOW).click();
		select_Time=timeLineConsole.timeHourNOW
	}
}
timeLineConsole.getInterval = function(){
	
}
timeLineConsole.next = function(num){
	if(timeLineConsole.timeType == "格点预报"){
		var interval; // 间隔
		var startHour = 0;
		if(timeLineConsole.timeData.timeType == "3H"){
			interval = 3;
			startHour = 3;
		}else if(timeLineConsole.timeData.timeType == "1D"){
			interval = 24;
		}
		
		timeLineConsole.timeHour += interval * num;
		
		// 判断是否超出范围
		if(timeLineConsole.timeData.timeType == "3H"){
			if(timeLineConsole.timeHour == 0){
				timeLineConsole.timeHour = 3;
				return;
			}else if(timeLineConsole.timeHour > 240){
				timeLineConsole.timeHour = 240;
				timeLineConsole.playClose();
				return;
			}
		}else if(timeLineConsole.timeData.timeType == "1D"){
			interval = 24;
			if(timeLineConsole.timeHour < 0){
				timeLineConsole.timeHour = 0;
				return;
			}else if(timeLineConsole.timeHour > 240){
				timeLineConsole.timeHour = 240;
				timeLineConsole.playClose();
				return;
			}
		}
		
		var time = new Date(timeLineConsole.timeInterVal.startTime.getTime() + 1000*60*60*(timeLineConsole.timeHour - startHour)); // 后面减去的是起始时间
		var startHour = time.getHours();
		var num = (startHour + 1)/3 - 1;
		$("div#timeLine .timeHourNOW").css("left", (num /8*100) + "%");
		$("div#timeLine .timeHourNOW").data("num", num);
		var timeDayVal = DateGrid(time, "yyyy-MM-dd");
		if(timeDayVal != $('#timeLine .dataTime').val()){
			$('#timeLine .dataTime').val(timeDayVal);
			$('#timeLine .dataTime').datetimepicker("update");
			timeLineConsole.initTimeHourLine();
			// 更换了一天 从新生成时间轴小时
		}
		geDianYuBao.show(); // 显示内容
		if(timeLineConsole.timeHour >= 240){
			timeLineConsole.playClose();
		}
	}
}
timeLineConsole.resize = function(){
	// 重置
	map.fitBounds(lockConsole.mapBounds, {
		// paddingTopLeft : L.point(0, 60),
		// paddingBottomRight : L.point(0, 60)
	}); // 地图显示范围
}
timeLineConsole.play = function(){
	// 播放
	if($("#timeLine .timeLine_btn:eq(1)").hasClass("play")){
		// 正在播放状态
		timeLineConsole.playClose();
		return;
	}
	
	timeLineConsole.playFun = window.setInterval('timeLineConsole.next(1)', 1000*2);
	$("#timeLine .timeLine_btn:eq(1)").addClass("play");
	$("#timeLine .timeLine_btn:eq(1) [data-language='timeLine']").html("暂停");
}
timeLineConsole.playClose = function(){
	// 停止播放
	if($("#timeLine .timeLine_btn:eq(1)").hasClass("play")){
		clearInterval(timeLineConsole.playFun);
		$("#timeLine .timeLine_btn:eq(1)").removeClass("play");
		$("#timeLine .timeLine_btn:eq(1) [data-language='timeLine']").html("播放");
	}
}