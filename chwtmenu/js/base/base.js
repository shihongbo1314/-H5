/**
 * 初始化方法
 * 
 * @param arr
 *            要运行的方法列表（异步）
 * @param start
 *            初始化方法（同步）
 * @param main
 *            主方法
 * @param end
 *            收尾方法（同步）
 * @returns {Array}
 */
function baseInitFun(arr, start, main, end){
	var num = 0;
	var len = arr.length;

	var init = function (){
		if(start){
			start();
		}
		for (var i = 0; i < arr.length; i++) {
			arr[i](next);
		}
	}

	var next = function(){
		num++;
		if(num == len){
			// 初始化内容结束
			main();

			if(end){
				end();
			}
		}
	}

	return [
		init()
	]
}
/**
 * 字符串替换
 */
String.prototype.replaceAll = function(s1,s2){ 
	return this.replace(new RegExp(s1,"gm"),s2); 
}

/* 地图叠加窗口自动排位 */
function floatWindowAutoPoint(arr, baseObj){
	var objHeight;
	var marginTop = 10; // 上边距
	var marginBottom = 10; // 下边距
	var marginLeft = 10; // 左边距
	var baseHeight = baseObj.outerHeight();

	if($("#timeSelect").is(":visible") || $("#mapShowType").is(":visible")){
		// 顶部时间轴显示 或者顶部类型选择显示
		marginTop += 40;
	}

	if($("#dateSelect").is(":visible")){
		marginBottom += 40;
	}

	if($("#main_top").is(":visible")){
		// 第二版标题显示
		marginTop += 100;
	}

	baseHeight = baseHeight - marginTop - marginBottom; // 去掉上下边距
	var leftNum = 0;
	var topPoint = 0;
	var leftPoint = 0;
	var width = $(arr).eq(0).outerWidth(true); // 单个窗口宽度 根据第一个窗口的大小判断
	var point = 10; // 每个窗口的间距 10px
	var _this;

	for (var i = 0; i < arr.length; i++) {
		_this = $(arr).eq(i);
		if(topPoint + _this.outerHeight(true) + point > baseHeight){
			topPoint = 0;
			leftNum ++;
			leftPoint = leftNum * (width + point);
		}

		_this.css({
			position : "absolute",
			top : topPoint + marginTop + "px",
			left : leftPoint + marginLeft + "px"
		});

		topPoint += _this.outerHeight(true) + point;
	}
}

/**
 * 弹窗
 * 
 * @param info
 *            内容
 * @param fun
 *            是否需要确认，内容为确认后执行内容
 */
function shareAlert(info, fun) {
	if(window.parent != window){
		return window.parent.shareAlert(info, fun);
	}
	var html = $('<div class="shareAlert"></div>');
	$(html).append(
					'<div class="shareAlertBox">'
							+ '<div class="shareAlertDrag"></div>'
							+ '<span class="offButton">X</span>'
							+ '<div class="shareAlertInfo"></div>'
							+ '<div class="shareAlertButton">'
							+ '<input class="shareAlertOk" type="button" value="确定" />'
							+ '<input class="shareAlertNo" type="button" value="取消" />'
							+ '</div>');
	$("body").append(html);
	$(html).find(".shareAlertInfo").html(info);
	if (fun) {
		$(html).find(".shareAlertOk").click(function() {
			if(!fun(true)){
				off();
			};
		})
		$(html).find(".shareAlertNo").click(function() {
			fun(false);
			off();
		})
	} else {
		$(html).find(".shareAlertOk").click(function() {
			off();
		})
		$(html).find(".shareAlertNo").hide();
	}

	var resizeHtml = function(){
		var bw = $("body").width();
		var bh = $("body").height();
		var tw = $(html).find(".shareAlertBox").width();
		var th = $(html).find(".shareAlertBox").height();
		$(html).find(".shareAlertBox").css({
			left : ((bw - tw) / 2) + "px",
			top : ((bh - th) / 2) + "px"
		})
	}

	resizeHtml();
	// 绑定事件
	$(html).find(".offButton").click(function() {
		$(html).remove();
	})
	
	$(html).find(".shareAlertButton input").keypress(function (event){
		if (event.keyCode == "13") {
			$(html).remove();
		}
	});
	
	$(html).find(".shareAlertOk").focus();

	var off = function(){
		$(html).remove();
		$(window).off("resize.shareAlert");
	}

	$(window).on("resize.shareAlert",function(){
		resizeHtml();
	})
	
		
	$(html).on('mousedown', ".shareAlertDrag", function(ev) {
		// 点击开始
	    var _this = $(this).parent(".shareAlertBox");
	    var dx = ev.pageX;
	    var dy = ev.pageY;
	    var transform = _this.css("transform");
	    
	    var tx = 0;
	    var ty = 0;
	    if(transform != "none"){
	    	transform = transform.replace("matrix(", "").replace(")", "");
	    	var arr = transform.split(",");
	    	tx = parseInt(arr[4]);
	    	ty = parseInt(arr[5]);
	    }
	    _this.parents(".shareAlert").on('mousemove', function(ev) {
			// 鼠标移动过程
	    	 var mx = ev.pageX;
			 var my = ev.pageY;
			 _this.css("transform", "translate(" + (mx - dx + tx) + "px," + (my - dy + ty) + "px)");
		})
		.on('mouseup', ".shareAlertDrag", function(ev) {
			// 鼠标松开
			_this.parents(".shareAlert").off('mousemove');
			_this.off('mouseup');
		})
		
		$(window).on("mouseup",function(){
			_this.parents(".shareAlert").off('mousemove');
			_this.off('mouseup');
		})
	})
	return html;
}

/**
 * 使用shoartAlert 格式定制的固定弹窗
 * 
 * @param obj
 *            窗口最外层对象
 * @param type
 *            需要操作的类型
 */
function shareAlertWindow(obj, type){
	if(type == "init"){
		// 给这个窗口内的关闭按钮绑定关闭事件
		$(obj).on("click", ".closeClass", function (){
			$(obj).hide();
		});
	}else if(type == "close"){
		// 关闭
		$(obj).hide();
	}else if(type == "open"){
		// 开启
		$(obj).show();
		var box = $(obj).find(".shareAlertBox");
		var width = box.outerWidth();
		var height = box.outerHeight();
		var windowHeight = $(window).outerHeight();
		// 判断高度是否超出窗口
		var top;
		if(height >= windowHeight){
			top = 0;
			$(obj).css("overflow", "auto");
			box.css({
				left : "50%",
				top : top,
				"margin-left" : "-" + (width / 2) + "px",
				"margin-top" : "20px",
			})
		}else{
			box.css({
				left : "50%",
				top : "50%",
				"margin-left" : "-" + (width / 2) + "px",
				"margin-top" : "-" + (height / 2) + "px",
			})
		}

		
	}else{
		// 
	}
}

/**
 * 获取form表单的所有值，根据name，转换成json
 * 
 * @param obj
 */
function getFormToJson(obj){
	var object = new Object();
	var bo = false;
	$(obj).find(":input").each(function(){
		if(bo) return false;
		var verify = eval($(this).data("verify"));
		if(verify != null){
			var valIsNull = false;
			// 验证是否为空
			if(this.value == null || this.value.trim() == ""){
				valIsNull = true;
				if(verify.notNull){
					shareAlert(verify.notNull);
					bo = true;
				}
			}
			if(valIsNull){
				// 没有内容，不需要判断验证后面的
			}else if(verify.tel){
				// 验证是否手机号
				var re = /^\d{11}$/;
				if (re.test(this.value.trim()) != true) {
					shareAlert(verify.tel);
					bo = true;
				}
			}else if(verify.email){
				// 验证是否邮箱
			    var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
			    if (re.test(this.value.trim()) != true) {
			    	shareAlert(verify.email);
					bo = true;
			    }
			}else if(verify.number){
				// 验证为数字整数
				var re=/^\d*$/;
				if (this.value.trim().match(re) == null){
					shareAlert(verify.number);
					bo = true;
				}
			}else if(verify.float){
				// 验证为数字可以为小数
				var re=/^\d*\.?\d*$/;
				if (this.value.trim().match(re) == null){
					shareAlert(verify.float);
					bo = true;
				}
			}
		}
		
		object[this.name] = this.value.trim();
	});
	if(bo) return false;
	return object;
}

/**
 * 为form表单赋值，根据name赋值
 * 
 * @param obj
 */
function setFormValue(obj, data){
	$(obj).find(":input").each(function(){
		for (var da in data) {
			if(this.name == da){
				this.value = data[da];
			}
		}
	});
}

/**
 * 清空form表单
 * 
 * @param obj
 * @returns
 */
function formClear(obj){
	$(obj).find(":input").each(function(){
		this.value = null;
	});
}

/* 获取下拉菜单的值 */
function selectDivGet(obj, type){
	if(type == "text"){
		return $(obj).find("p").text().trim();
	}else if(type == "val"){
		return $(obj).find("p").date("val");
	}else{
		return $(obj).find("p").text().trim();
	}
	
}

/* 获取横向单选的值 */
function radioBox_gatVal(obj){
	var val = $(obj).find(".radio_ul li.click").text().trim();
	return val;
}

// 通用的方法
function BaseInfo(){
	var boxTabsInit = function (){
		// 导航菜单
		
		$(".boxTabs").on("click", ".box_title_btn", function(){
			if($(this).hasClass("click")){
				return;
			}
			var _this = $(this).parents(".boxTabs");
			_this.find(".box_title_btn").removeClass("click");
			$(this).addClass("click");

			var title = $(this).attr("data-title");
			_this.find(".box_info_tab").hide();
			_this.find(".box_info_tab[data-title =" + title +  "]").show();
			var btn = $(this).parents(".boxTabs").find(".lessen_btn");
			if(btn.data("lessen")){
				// 当窗口是收缩的时候，展开这个窗口
				btn.click();
			}else{	
				$(window).resize();
			}
		})
	}
	
	var noImgDrag = function (){
		// 禁止浏览器图片拖动
		$("img").on("dragstart",function (){
			return false;
		})
	}



	/* 下拉菜单初始化 */
	var selectDivInit = function (){
		// 这里只能使用live 不能使用on 否则 document点击事件无法默认调用
		$(".select_div").on("click", "p", function(){
			var _this = $(this);
			var _div = _this.parent();
			var _ul = _div.find("ul");

			if(_this.data("show")){
				// 当选择框展开的时候，隐藏下拉框
				_ul.hide();
				_this.data("show", false);
			}else{
				_ul.show();
				_this.data("show", true);

				$(document).one("click", function(){
					_ul.hide();
					_this.data("show", false);
				})
			}
		})
		$(".select_div").on("click", "li", function(){
			var _this = $(this);
			var _div = _this.parents(".select_div");
			var _ul = _div.find("ul");
			var _val = _div.find("p");

			// 改变text 与 val 值
			var text = _this.text().trim();
			var val = _this.data("val");
			val = val == null ? text : val;
			_val.text(text);
			_val.data("val", val);

			// 改变现实样式 关闭选择框
			_ul.find("li").removeClass("click");
			_this.addClass("click");
			_ul.hide();
			_val.data("show", false);
			
		})
	}

	/* 多选按钮切换 */
	var checkboxInit = function (){
		$("div.checkbox_div").on("change", "input", function(){
			var _this = $(this);
			if(_this.attr("checked") == "checked"){
				_this.parent().addClass("checked");
			}else{
				_this.parent().removeClass("checked");
			}
		})
	}

	/* 横向单选 */
	var radioBoxInit = function (){
		
		$(".radio_div").each(function(i,v){
			var _this = $(v);
			var length = _this.find(".radio_ul li").length;
			_this.find(".radio_ul li").css("width", 100 / length + "%");
		})
		
		
		$(".radio_div").on("click" , ".radio_ul li",function(){
			var _this = $(this);
			if(_this.hasClass("click")){
				return;
			}
			_this.siblings(".click").removeClass("click");
			_this.addClass("click");
			radioBox_gatVal(_this.parents(".radio_baseDiv"));
		});
		$(".radio_baseDiv").on("click" , ".radio_leftBtn",function(){
			var _click = $(this).siblings(".radio_div").find(".radio_ul li.click");
			if(_click.prev().length == 0){
				shareAlert("没有更多了！");
			}else{
				_click.prev().click();
			}
		});
		$(".radio_baseDiv").on("click" , ".radio_rightBtn",function(){
			var _click = $(this).siblings(".radio_div").find(".radio_ul li.click");
			if(_click.next().length == 0){
				shareAlert("没有更多了！");
			}else{
				_click.next().click();
			}
		});
	}

	/* 收缩按钮初始化 */
	var lessenInit = function (){
		$(".box_lessen").each(function(i,v){
			var btn = $(this).find(".lessen_btn");
			btn.siblings(".box_info_div").addClass("animated");
			if(btn.data("lessen")){
				btn.siblings(".box_info_div").hide();
				btn.text("v");
			}else{
				btn.data("lessen", false);
				btn.text("^");
			}
		})
		$(".box_lessen").on("click", ".lessen_btn", function(){
			var btn = $(this);
			if(btn.data("lessen")){
				btn.data("lessen", false);
				// btn.siblings(".box_info_div").removeClass("fadeOut");
				// btn.siblings(".box_info_div").addClass("fadeIn");
				btn.siblings(".box_info_div").fadeIn(500);
				btn.text("^");
				$(window).resize();
			}else{
				btn.data("lessen", true);
				// btn.siblings(".box_info_div").removeClass("fadeIn");
				// btn.siblings(".box_info_div").addClass("fadeOut");
				$(this).siblings('.box_info_div').fadeOut(500);
				
				btn.text("v");
				setTimeout("$(window).resize();",550);// 延时
			}
			// $(window).resize();
			// setTimeout("$(window).resize();",1010);//延时
		});
	}

	/* 获取字符串占字符长度（1汉字占两个字符） */
	var getTextCharLength = function(text) {  
		var len = 0;  
		for (var i=0; i<text.length; i++) {  
			if (text.charCodeAt(i)>127 || text.charCodeAt(i)==94) {  
				len += 2;  
			} else {  
				len ++;  
			}  
		}  
		return len;  
	}

	/* 悬浮提示框 */
	var tooltips = function(){
		$(".tooltips_div").on({
			mouseover : function(){
				// 鼠标移入
				var text = $(this).attr("data-name");
				var width = (getTextCharLength(text) / 2) * 12 + 40;
				var Tooltips = $("<div class='Tooltips'>" + text + "<span></span></div>");
				$(this).after(Tooltips);

				// obj 的相对位置 - this 的宽度 - 突出的角标
				var left = $(this).position().left - width - 10;
				// obj 的相对位置 - （obj 的高度 - this 的高度）/ 2
				var top = $(this).position().top + ($(this).outerHeight() - 20) / 2;
				Tooltips.css({
					"width": width + "px",
				    "top": top + "px",
				    "left": left + "px"
				});
				
				$(".tooltips_div").on("mouseout", function(){
					$(".tooltips_div").off("mouseout");
					Tooltips.remove();
				})
			}
		}, ".tooltips_val");
	}
	if($('[data-toggle="tooltip"]').length){
		$('[data-toggle="tooltip"]').tooltip();
	}

	 // 单选
	var boxInfoBoxBtnInit = function(){
		$(".box_info_btn_ul").on("click", "li", function(){
			var _this = $(this);
			if(_this.attr("disable")){
				// 按钮被禁用
				return;
			}
			var _ul = _this.parent();
			_ul.find(".click").removeClass("click");
			_this.addClass("click");
		});
	}
	
	// 多选
	var boxInfoBoxBtnCheckInit = function(){
		$(".box_info_btnCheck_ul").on("click", "li", function(){
			var _this = $(this);
			if(_this.attr("disable")){
				// 按钮被禁用
				return;
			}
			if(_this.hasClass("click")){
				_this.removeClass("click");
			}else{
				_this.addClass("click");
			}
		});
	}
	
	/**
	 * 弹出框拖动
	 */
	var shareAlertDrag = function(){
		
		$(".shareAlertBox").on('mousedown', ".shareAlertDrag", function(ev) {
			// 点击开始
		    var _this = $(this).parent(".shareAlertBox");
		    var dx = ev.pageX;
		    var dy = ev.pageY;
		    var transform = _this.css("transform");
		    
		    var tx = 0;
		    var ty = 0;
		    if(transform != "none"){
		    	transform = transform.replace("matrix(", "").replace(")", "");
		    	var arr = transform.split(",");
		    	tx = parseInt(arr[4]);
		    	ty = parseInt(arr[5]);
		    }
		    _this.parents(".shareAlert").on('mousemove',  function(ev) {
				// 鼠标移动过程
		    	 var mx = ev.pageX;
				 var my = ev.pageY;
				 _this.css("transform", "translate(" + (mx - dx + tx) + "px," + (my - dy + ty) + "px)");
			})
			_this.on('mouseup', function(ev) {
				// 鼠标松开
				_this.parents(".shareAlert").off('mousemove');
				_this.off('mouseup');
			})
			$(window).on("mouseup",function(){
				_this.parents(".shareAlert").off('mousemove');
				_this.off('mouseup');
			})
		})
	}

	/**
	 * 可输入的下拉框
	 */
	var SelectInput = function(){
		$(".selectInput").each(function(){
			var _this = $(this);
			_this.find("select").on("change", function(){
				_this.find("input").val($(this).val());
			})
		})
	}
	
	var init = function(){
		SelectInput();
		tooltips();
		radioBoxInit();
		checkboxInit();
		selectDivInit();
		lessenInit();
		noImgDrag();
		boxTabsInit();
		boxInfoBoxBtnInit();
		boxInfoBoxBtnCheckInit();
		shareAlertDrag();
	}

    return [
		init()
    ]

}

function scrollInfo (){
	// 自定义滚动条
	var scroll = {
		resize : function resize(obj){
			var base = $(obj);
			var box = base.find(".scroll_box");
			var bar = $("<div class='scroll_bar'></div>");
			if(base.outerHeight() < box.outerHeight()){
				base.css("padding-right", "16px");
				if(base.find(".scroll_bar").length == 0){
					base.append(bar);
				}else{
					bar = base.find(".scroll_bar");
				}
				var beishu = base.outerHeight() / box.outerHeight();
				bar.height(beishu * base.outerHeight() + "px");
				bar.css("top", (base.scrollTop() + base.scrollTop() * beishu) + "px");
			}else{
				base.find(".scroll_bar").detach();
				base.css("padding-right", "0");
			}
		},
		init : function init(obj){
			var base = $(obj);
			scroll.resize(obj);
			base.on("resize", function(){
				scroll.resize(this);
			}).on({
				mouseover : function(){
					// 鼠标移入
					var base = $(this);
					var box = base.find(".scroll_box");
					var bar = base.find(".scroll_bar");

					if(base.height() < box.outerHeight()){
						
						// bar.show();
						var beishu = base.outerHeight() / box.outerHeight();
						bar.height(beishu * base.outerHeight() + "px");
						bar.css("top", (base.scrollTop() + base.scrollTop() * beishu) + "px");
					}
				},
				mousewheel : function(event, delta) {
					// 鼠标滚轮
					var base = $(this);
					var box = base.find(".scroll_box");
					var bar = base.find(".scroll_bar");
					if(base.height() < box.outerHeight()){
						var beishu = base.outerHeight() / box.outerHeight();
						var dir = delta > 0 ? 'Up' : 'Down';
						var ydjl = 40; // 移动距离
						if (dir == 'Up') {
							base.scrollTop(base.scrollTop() - ydjl);
						} else {
							base.scrollTop(base.scrollTop() + ydjl);
						}
						
						bar.css("top", (base.scrollTop() + base.scrollTop() * beishu) + "px");
					}
				}
			}).on({
				mousedown: function(e){
					var el=$(this);
					var dy = e.pageY;
					var top = parseInt(el.css("top"));
					var base = el.parent(".scroll_base");
					var box = base.find(".scroll_box");
					var beishu = base.outerHeight() / box.outerHeight();
					var baseScrool = base.scrollTop(); // 距离顶部的距离
					$(document).on('mousemove.drag', function(e){ 
						var scroll = e.pageY - dy; // 鼠标移动的距离
						base.scrollTop(baseScrool + scroll / beishu);
						el.css("top", (base.scrollTop() +  + base.scrollTop() * beishu) + "px"); 
					});
				},
				mouseup: function(e){ 
					$(document).off('mousemove.drag'); 
				}
			}, ".scroll_bar");
			$(window).on("mouseup" , function(e){ 
				$(document).off('mousemove.drag'); 
			});
		}
	}
	
	return scroll;
}

// 时间栅格化
function DateGrid(date, type){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minute = date.getMinutes();
	var secend = date.getSeconds();
	var week = date.getDay();

	var grid = function (num){
		if(parseInt(num) > 9){
			return num;
		}else{
			return "0" + num;
		}
	}

	var getWeek = function (num){
		switch(num){
			case 0:
			return "周日";
			case 1:
			return "周一";
			case 2:
			return "周二";
			case 3:
			return "周三";
			case 4:
			return "周四";
			case 5:
			return "周五";
			case 6:
			return "周六";
		}
	}

	type = type.replace("yyyy", year);
	type = type.replace("MM", grid(month));
	type = type.replace("dd", grid(day));
	type = type.replace("HH", grid(hours));
	type = type.replace("mm", grid(minute));
	type = type.replace("ss", grid(secend));
	type = type.replace("ww", getWeek(week));

	type = type.replace("M", month);
	type = type.replace("d", day);
	type = type.replace("H", hours);
	type = type.replace("m", minute);
	type = type.replace("s", secend);
	type = type.replace("w", week);

	return type
}

// 时间轴(面对对象)
function Timeline(){
	var Timeline = {
		obj : null, // 这个空间最外层
		table : null, // 大轴所在的table
		scroll : null, // 滑动条最外层
		scrollSelected : null, // 滑动条选中的部分
		hover : null, // 鼠标移入显示的控件
		slider : null, // 鼠标点击移动的控件,也是直接显示时间轴结果的地方
		date : null,// 时间轴的参数
		timeStopLenght : 2000, // 时间轴播放的速度
		sliderWidth : null, // 滑动条总长度(px)
		sliderTopWidht : null, // 滑动条上面滑块的长度
		bigDateVal : null, // 大轴的值
		smallDateVal : null, // 小轴的值
		bigDateLength : 0, // 大轴的长度
		smallDateLength : function(n){
			// 小轴长度
			return Timeline.date.smallDate[n].length;
		},
		dateSelectTimeFun : null, // 播放时的系统方法
		timeLineType : 0, // 时间轴类型 0：没有时间轴，1： 逐3小时240小时 2：逐3小时72小时
							// 3：逐24小时240小时
		getVal : null, // 获取值的方法
		playState : false, // 播放状态
		returnVal : function returnVal(obj){
			 // 返回显示的值或指定的值与对应的数据下标
			var bigDateVal = obj == null ? Timeline.bigDateVal : obj.bigDate;
			var smallDateVal = obj == null ? Timeline.smallDateVal : obj.smallDate;
			
			for (var n = 0; n < Timeline.bigDateLength; n++) {
				if(Timeline.date.bigDate[n] == bigDateVal){
					break;
				}
			}
			if(Timeline.date.dateRepeat){
				for (var i = 0; i < Timeline.smallDateLength(n); i++) {
					if(Timeline.date.smallDate[n][i] == smallDateVal){
						break;
					}
				}
			}else{
				var i = n;
			}
			return {
				bigDate : bigDateVal,
				smallDate : smallDateVal,
				bigDateNum : n,
				smallDateNum : i,
				time : new Date(Timeline.date.times[n].setHours(smallDateVal))
			}
			
		},
		stop : function stop(){
			// 停止播放
			Timeline.playState = false;
			Timeline.obj.find("span.glyphicon").removeClass("glyphicon-pause").addClass("glyphicon-play");
			if(Timeline.dateSelectTimeFun != null){
				window.clearInterval(Timeline.dateSelectTimeFun);
				Timeline.dateSelectTimeFun = null;
			}
		},
		dateSelectPlay : function dateSelectPlay(){
			if(!Timeline.playState){
				return;
			}
			// 判断小轴的位置
			var returnVal = Timeline.returnVal();
			var i = returnVal.smallDateNum; // 标志小轴 的位置
			var n = returnVal.bigDateNum; // 标志大轴的位置
			
			i ++;
			if(Timeline.date.dateRepeat){
				// 小轴重复显示
				// 判断大轴的位置
				if(i >= Timeline.smallDateLength(n)){
					// 小轴已经到头，小轴归零，大轴进一格
					i = 0;
					n ++;
					if(n >= Timeline.bigDateLength){
						// 大轴到头了，归零
						n = 0;
					}
				}
				Timeline.setVal({smallDate : Timeline.date.smallDate[n][i], bigDate : Timeline.date.bigDate[n]});
			}else{
				// 小轴不重复
				n ++;
				if(n >= Timeline.bigDateLength){
					// 大轴到头了，归零
					n = 0;
				}
				Timeline.setVal({smallDate : Timeline.date.smallDate[n], bigDate : Timeline.date.bigDate[n]});
			}
		},
		setVal : function setVal(obj, bo){
			var left;
			var returnVal = Timeline.returnVal(obj);
			var n = returnVal.smallDateNum; // 标志小轴 的位置
			var i = returnVal.bigDateNum; // 标志大轴的位置
			
			if(Timeline.date.dateRepeat){
				// 小轴重复显示
				left = (i + n / Timeline.smallDateLength(i)) * 100 / Timeline.bigDateLength;
			}else{
				left = n * 100 / Timeline.bigDateLength;
			}
			
			var sliderText = Timeline.getBigDateVal(obj);
			
			Timeline.scrollSelected.css("width", left + "%");
			Timeline.slider.css("left", left + "%");
			Timeline.setDateVal(obj);
			Timeline.slider.find("p").text(sliderText);
			if(!bo){
				Timeline.date.dateSelectChange(Timeline);
			}
		},
		reset : function reset(){
			
		},
		// 大轴初始化
		bigDateInit : function bigDateInit(){
			Timeline.table.find("td.dateNum").remove();
			for (var i = 0; i < this.date.bigDate.length; i++) {
				Timeline.table.find("tr").append('<td class="dateNum"><span class="val">' 
						+ this.date.bigDate[i] + '</span><span class="tishi">!</span></td>');
			}
		},
		// 获取小轴显示的值
		getSmallDateVal : function getSmallDateVal(obj){
			if(Timeline.date.getSmallDateVal == null){
				return obj.smallDate;
			}else {
				return Timeline.date.getSmallDateVal(obj);
			}
		},
		// 获取大轴显示的值
		getBigDateVal : function getBigDateVal(obj){
			if(Timeline.date.getBigDateVal == null){
				return obj.bigDate + "  " + obj.smallDate;
			}else {
				return Timeline.date.getBigDateVal(obj);
			}
		},
		// 获取大轴、小轴显示的值 （鼠标移入、点击滑动条时）
		getDateVal : function getDateVal(width, left){
			var smallDate;
			var oneDayWidth = width / Timeline.bigDateLength; // 长轴单个长度
			var n = parseInt(left * width / 100 / oneDayWidth);
			if(Timeline.date.dateRepeat){
				// 小轴重复显示
				smallDate = Timeline.date.smallDate[n][parseInt(((left * width / 100) % oneDayWidth) * Timeline.smallDateLength(n) / oneDayWidth)];
			}else{
				smallDate = Timeline.date.smallDate[parseInt(left * Timeline.date.smallDate.length / 100)];
			}
			var bigDate = Timeline.date.bigDate[n];
			return {smallDate : smallDate, bigDate : bigDate};
		},
		// 获取大轴、小轴显示的值 (点击大轴时)
		getDateVal2 : function getDateVal2(val, width){
			var smallDate;
			
			var returnVal = Timeline.returnVal({bigDate: val, smallDate : Timeline.smallDateVal});
			var n = returnVal.smallDateNum; // 标志小轴 的位置
			var i = returnVal.bigDateNum; // 标志大轴的位置
			
			
			var left;
			if(Timeline.date.dateRepeat){
				// 小轴重复显示
				var smallDateLength = Timeline.smallDateLength(i);
				smallDate = Timeline.smallDateVal; // 上一次小轴的值
				
				// 判断小轴的值是否超出
				if(smallDate > Timeline.date.smallDate[i][smallDateLength - 1]){
					smallDate = Timeline.date.smallDate[i][smallDateLength - 1];
					n = 1;
				}else if(smallDate < Timeline.date.smallDate[i][0]){
					smallDate = Timeline.date.smallDate[i][0];
					n = 0;
				}else{
					n = n / smallDateLength;
				}
				left = (i + n) * 100 / Timeline.bigDateLength;
			}else{
				smallDate = Timeline.date.smallDate[i];
				left = i * 100 / Timeline.date.smallDate.length;
			}
			var bigDate = val;
			return {smallDate : smallDate, bigDate : bigDate, left : left};
		},
		// 赋值大轴、小轴显示的值
		setDateVal : function setDateVal(obj){
			Timeline.bigDateVal = obj.bigDate; // 大轴的值
			Timeline.smallDateVal = obj.smallDate; // 小轴的值
		},
		over : function over(){
			Timeline.obj.off("click", "table td:eq(0)");
			Timeline.obj.off("click", ".dateNum");
			Timeline.obj.off("mousedown mouseup", ".slider");
			Timeline.obj.off("mousemove mouseout mousedown", ".scrollBackstage");
			Timeline.timeLineType = 0; // 时间轴状态改成关闭
		},
		sliderInit : function sliderInit(){
			Timeline.obj.on("click", "table td:eq(0)", function(e){
				// 播放暂停
				var _this = $(this).find("span");
				if(_this.hasClass("glyphicon-play")){
					Timeline.playState = true;
					_this.removeClass("glyphicon-play").addClass("glyphicon-pause");
					// 播放
					window.dateSelectPlay = Timeline.dateSelectPlay;
					if(elementTypeManage.oldShowType == "灾害落区预报"){
						dateSelectPlay();
					}else{
						Timeline.dateSelectTimeFun = window.setInterval("dateSelectPlay();", Timeline.timeStopLenght);
					}
				}else{
					// 暂停
					Timeline.stop();
				}
			}).on("click", ".dateNum", function(e){
				// 停止播放
				Timeline.stop();
				// 切换大轴
				var w = Timeline.obj.find(".scrollBackstage").width();

				var dateVal = Timeline.getDateVal2($(this).find("span.val").text().trim(), w);

				var sliderText = Timeline.getBigDateVal(dateVal);
				left = dateVal.left;
				
				Timeline.scrollSelected.css("width", left + "%");
				Timeline.slider.css("left", left + "%");
				
				var oldText = $("#dateSelect .dateScroll .slider p").text();
				if(oldText != sliderText){
					Timeline.setDateVal(dateVal);
					Timeline.slider.find("p").text(sliderText);
					Timeline.date.dateSelectChange(Timeline);
				}
			}).on({
				"mousedown" : function(e){
					// 停止播放
					Timeline.stop();
					// 拖动时间条
					var el=$(this);
					var dy = e.pageX;
					var left = parseInt(el.css("left"));
					var w = Timeline.obj.find(".scrollBackstage").width();
					var oneDayWidth = w / Timeline.bigDateLength; // 长轴单个长度
					
					
					$(document).on('mousemove.slider', function(e){
						var scroll = e.pageX - dy; // 鼠标移动的距离
						var leftPx = scroll + left;
						var leftPe = leftPx * 100 / w;
						if(leftPe < 0 || leftPe >= 100){
							// leftPe 不能等于100 会出现bug
							return;
						}
						
						var dateVal = Timeline.getDateVal(w, leftPe);
						
						var sliderText = Timeline.getBigDateVal(dateVal)
						
						Timeline.scrollSelected.css("width", leftPe + "%");
						Timeline.slider.css("left", leftPe + "%");
						var oldText = Timeline.slider.find("p").text();
						if(oldText != sliderText){
							Timeline.setDateVal(dateVal);
							Timeline.slider.find("p").text(sliderText);
							Timeline.date.dateSelectChange(Timeline);
						}
					});
				},
				"mouseup" : function(){
					// 释放时间条
					$(document).off('mousemove.slider'); 
				}
			}, ".slider").on({
				// 鼠标在时间轴上移动\点击\移除效果
				"mousemove" : function(e){
					// 鼠标移入时间条显示时间
					var w = $(this).width();
					var left = (e.offsetX) * 100 / w;
					
					Timeline.hover.find("p").text(Timeline.getSmallDateVal(Timeline.getDateVal(w, left)));
					
					var hoverWidth = Timeline.hover.width();
					var sliderLeft = parseInt(Timeline.slider.css("left"));
					var sliderWidth = parseInt(Timeline.slider.width());
					var sliderHeight = parseInt(Timeline.slider.height());
					var bottom = 11;
					if(e.offsetX > sliderLeft - hoverWidth && e.offsetX < sliderLeft + sliderWidth){
						// 两个悬浮框重叠
						bottom = sliderHeight + 13;
					}
					
					Timeline.hover.show().css({
						"left": left + "%",
						"bottom": bottom + "px"
					});
					
				},
				"mouseout" : function(){
					// 鼠标移出时间条
					Timeline.hover.hide();
				},
				"mousedown" : function(e){
					// 停止播放
					Timeline.stop();
					// 点击时间条 切换时间
					var w = $(this).width();
					var left = (e.offsetX) * 100 / w;
					
					var dateVal = Timeline.getDateVal(w, left);
					
					var sliderText = Timeline.getBigDateVal(dateVal)
					Timeline.scrollSelected.css("width", left + "%");
					Timeline.slider.css("left", left + "%");
					var oldText = Timeline.slider.find("p").text();
					if(oldText != sliderText){
						Timeline.setDateVal(dateVal);
						Timeline.slider.find("p").text(sliderText);
						Timeline.date.dateSelectChange(Timeline);
					}
				}
			}, ".scrollBackstage");
			$(window).on("mouseup" , function(e){ 
				// 释放时间条
				$(document).off('mousemove.slider'); 
			});
		},
		updateDate : function updateDate(date){
			Timeline.date = date;
			Timeline.bigDateLength = date.bigDate.length;
			// Timeline.smallDateLength = date.smallDate.length;
			Timeline.getVal = date.getVal;
			Timeline.bigDateInit(); // 大轴初始化

		},
		init : function init(date){
			Timeline.obj = $(date.obj);
			Timeline.obj.dateSelectPlay = Timeline.dateSelectPlay;
			Timeline.table = Timeline.obj.find("table"); // 大轴所在的table
			Timeline.scroll = Timeline.obj.find(".scroll"); // 滑动条最外层
			Timeline.scrollSelected = Timeline.obj.find(".scrollSelected"); // 滑动条选中的部分
			Timeline.hover = Timeline.obj.find(".hover"); // 鼠标移入显示的控件
			Timeline.slider = Timeline.obj.find(".slider"); // 鼠标点击移动的控件,也是直接显示时间轴结果的地方
			Timeline.sliderInit(); // 鼠标移入\移出\点击事件
		}
	};
	
	return Timeline;
}


/**
 * 通用表格生成
 * 
 * @returns
 */
function ShareTable(){
	var ShareTable = {
		url : null, // 访问的url
		table : null, // table 最外层id
		currPage : 0, // 页数
		pageSize : 0, // 每页显示最大数量
		dataOther : null, // 获取分页时需要的其他参数
		shareAlert : null, // 提示方法
		dataTitle : null, // table每一列的显示方法
		hasTableKong : false, // 当数据不够显示当前页时是否显示空行填充
		isShowPage : false, // 是否显示分页按钮
		hasClick : false, // 是否选中
		successData : null, // 返回的数据
		showBackground: false, // 是否显示背景颜色
		tableAlert : function tableAlert(val){
			alert(val);
		},// 默认提示方法
		init : function init(obj){ // 初始化
			this.url = obj.url;
			this.table = $(obj.table);
			this.currPage = obj.data.currPage;
			this.pageSize = obj.data.pageSize;
			this.dataOther = obj.dataOther;
			this.dataTitle = obj.dataTitle;
			this.shareAlert = shareAlert == null ? tableAlert : shareAlert;

			this.isShowPage = obj.isShowPage;
			this.hasClick = obj.hasClick;
			this.hasTableKong = obj.hasTableKong;
			this.showBackground = obj.showBackground;
			
			return ShareTable;	
		},
		getNewList : function getNewList(){
			ShareTable.currPage = 1;
			ShareTable.getList();
		},
		getList : function getList(){ // 获取分页数据
			var newData = ShareTable.dataOther == null ? new Object() : ShareTable.dataOther();
			newData.currPage = ShareTable.currPage;
			newData.pageSize = ShareTable.pageSize;
			
			$.ajax({
				url: ShareTable.url,
				type:'post',
				dataType:'json',
				data: newData,
				success:function(data){
					shareLoad("close");
					ShareTable.successData = data;
					if(data.e == 1){
						ShareTable.showTable(data.o);
						if(data.o.list == null || data.o.list.length == 0){
							// ShareTable.shareAlert("没有内容！");
							ShareTable.showNull();
						}
					}else{
						// 没有内容
						ShareTable.shareAlert(data.s);
					}
				},error:function(data){
					// 没有内容
					shareLoad("close");
					ShareTable.shareAlert("系统异常！");
				}
			});
		},
		showNull : function showNull (){
			var tableTitle = ShareTable.dataTitle;
			var html = $("<tr class='tableNull notValue'><td colspan='" + tableTitle.length + "'>暂无内容</td></tr>");
			ShareTable.table.find(".shareTable .scroll_box table").append(html).css("height", "100%");
		},
		showData : function showData(data){
			ShareTable.successData = data;
			ShareTable.showTable(data.o);
		},
		showTable : function showTable(data){
			// 循环table
			var tableTitle = ShareTable.dataTitle;
			// 创建table
			var _table = $("<table border=1 cellpadding=0 cellspacing=0 style='width:100%;'></table>");
			// 加载标题
			
			var _thead = $("<thead></thead>");
			var _tr = $("<tr></tr>");
			for (var i = 0; i < tableTitle.length; i++) {
				var _infoStyle = "style='"; 
				if(tableTitle[i].align != null){
					_infoStyle += "text-align: " + tableTitle[i].align + "; ";
				}
				if(i == 0){
					_infoStyle += "width: 80px; ";
				}
				_infoStyle += "'";
				
				if(tableTitle[i].isCheck && i == 0){
					// 框选编号
					var _checkBox = "<label class='tableCheckboxAll'></label>"
					$(_tr).append("<th class='" + tableTitle[i].titleId + "' " 
							+ _infoStyle + " >" + _checkBox + tableTitle[i].titleName + "</th>");
				}else{
					$(_tr).append("<th class='" + tableTitle[i].titleId + "' " 
							+ _infoStyle + " >" + tableTitle[i].titleName + "</th>");
				}
			}
			$(_thead).append(_tr);
			$(_table).append(_thead);
			
			var _tbody = $("<tbody></tbody>");
			// 加载列表内容
			for (var i = 0; i < data.list.length; i++) {
				// 样式
				var _style = i % 2 != 0 ? "style='background: rgb(232, 241, 246);'" 
							: "style='background: rgb(255, 255, 255);'"; 
				if(!ShareTable.showBackground) _style = "";
				var _tr = $("<tr " + _style + "></tr>");
				for (var j = 0; j < tableTitle.length; j++) {
					
					var _infoStyle = "style='"; 
					if(tableTitle[j].align != null){
						_infoStyle += "text-align: " + tableTitle[j].align + "; ";
					}
					if(j == 0){
						_infoStyle += "width: 80px; ";
					}
					_infoStyle += "'";
					var _thisNumber = (data.currPage - 1) * data.pageSize + (i + 1);
					if(tableTitle[j].isCheck && j == 0){
						// 框选编号
						var _checkBox = "<label class='tableCheckbox' data-value='" 
									  + data.list[i][tableTitle[j].titleId] + "' ></label>"
						$(_tr).append("<td class='" + tableTitle[j].titleId + "' " 
								+ _infoStyle + " >" + _checkBox + _thisNumber + "</td>");
					}else if(j==0){
						$(_tr).append("<td class='" + tableTitle[j].titleId + "' " 
								+ _infoStyle + " >" + _thisNumber + "</td>");
					}else{
						var value = data.list[i][tableTitle[j].titleId];
						let td = $("<td class='" + tableTitle[j].titleId + "' "
								+ _infoStyle + " ></td>");
						if(tableTitle[j].valFun){
							value = tableTitle[j].valFun(value, data.list[i], i);
						}
						td.append(value == null ? "-" : value);
						$(_tr).append(td);
					}
				}	
				$(_tbody).append(_tr);
			}
			
			// 加载空白行
			if(ShareTable.hasTableKong){
				var _kongLength = data.pageSize - data.list.length;
				for (var i = 0; i < _kongLength; i++) {
					var _style = (i+data.list.length) % 2 != 0 ? "style='background: rgb(232, 241, 246);'" 
							: "style='background: rgb(255, 255, 255);'"; 
					if(!ShareTable.showBackground) _style = "";
					var _tr = $("<tr class='notValue'" + _style + "></tr>");
					for (var j = 0; j < tableTitle.length; j++) {
						$(_tr).append("<td><br /></td>");
					}
					$(_tbody).append(_tr);
				}
			}
			// 加载空白行end
			
			$(_table).append(_tbody);
			
			ShareTable.table.html("<div class='shareTable'><div class='scroll_base'><div class='scroll_box'></div></div></div><div class='sharePage'></div>");
			ShareTable.table.find(".shareTable .scroll_box").html(_table);
			ShareTable.table.find(".shareTable .scroll_box").append("<div class='tableTitle'></div>");
			ShareTable.table.find(".shareTable .scroll_box .tableTitle").append(_table.clone(true));
			if(ShareTable.hasClick){
				ShareTable.clickCheckbox(data);
			}
			if(ShareTable.isShowPage){
				ShareTable.showPage(data);
				ShareTable.table.addClass("hasPage")
			}
			scrollInfo().init(ShareTable.table.find(".scroll_base"));
			// 滚动条事件
			ShareTable.table.find(".shareTable").on("scroll", function(){
				ShareTable.table.find(".tableTitle").css("top", ShareTable.table.find(".shareTable").scrollTop() + "px");
			})
			// 提示框
			if($('[data-toggle="tooltip"]').length){
				$('[data-toggle="tooltip"]').tooltip();
			}
		},
		clickCheckbox : function clickCheckbox(data){ // 绑定点击事件
			ShareTable.table.find("tr").click(function(){
				if($(this).hasClass("notValue")){
					return;
				}else if($(this).hasClass("click")){
					$(this).removeClass("click");
					if($(this).find("label").hasClass("tableCheckboxAll")){
						// 取消全选
						ShareTable.table.find("tr").removeClass("click");
					}else{
						ShareTable.table.find(".tableCheckboxAll").parents("tr").removeClass("click");
					}
				}else{
					$(this).addClass("click");
					if($(this).find("label").hasClass("tableCheckboxAll")){
						// 全选
						// ShareTable.table.find("tr").addClass("click");
						ShareTable.table.find("tr").each(function(i,v){
							if(!$(v).hasClass("notValue")){
								$(v).addClass("click");
							}
						})
					}else{
						// 判断全选按钮是否需要选中
						if(ShareTable.table.find("tbody .click").length == data.list.length){
							ShareTable.table.find(".tableCheckboxAll").parents("tr").addClass("click");
						}
					}
				}
			})
		},
		showPage : function showPage(data){
			if(data.pageCount == 0){
				data.pageCount = 1;
				data.currPage = 1;
			}
			// 加载分页
			var _pageDiv = $("<div></div>");
			
			// 前
// var _pageFirst = '<input type="button" value="&lt;&lt;" data-page="first">'
// var _pageLeft = '<input type="button" value="&lt;" data-page="left">';
			var _pageFirst = '<span class="button" data-page="first"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span></span>'
			var _pageLeft = '<span class="button" data-page="left"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></span>';
			
			// 中间
			var start,end;
			if(data.pageCount < 9){
				start = 1;
				end = data.pageCount;
			}else if(data.currPage < 5){
				start = 1;
				end = 9;
			}else if(data.currPage - 4 > 0 &&  data.currPage + 4 <= data.pageCount){
				start = data.currPage - 4;
				end = data.currPage + 4;
			}else{
				start = data.pageCount - 8;
				end = data.pageCount;
			}
			

			
			// 后
// var _pageRight = '<input type="button" value="&gt;" data-page="right">'
// var _pageEnd = '<input type="button" value="&gt;&gt;" data-page="end">';
			var _pageRight = '<span class="button" data-page="right"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></span>';
			var _pageEnd = '<span class="button" data-page="end"><span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></span>';

			$(_pageDiv).append(_pageFirst);
			$(_pageDiv).append(_pageLeft);
			for (var i = start; i <= end; i++) {
				var _class = data.currPage == i ? " click" : ""; // 当前页选中
				$(_pageDiv).append('<span class="button ' + _class + '" data-page="' + i + '">' + i + '</span>');
			}
			$(_pageDiv).append(_pageRight);
			$(_pageDiv).append(_pageEnd);
			
			// 分页详情
			var divPageInfo="<div>共 "+data.total+" 条数据，每页 "+data.pageSize+" 条，共 "+data.pageCount+" 页，当前第 "+data.currPage+" 页 </div>";
			ShareTable.table.find(".sharePage").html(divPageInfo);
			ShareTable.table.find(".sharePage").append(_pageDiv);
			ShareTable.pageChange(data);
		},
		pageChange : function pageChange(data){ // 分页按钮
			ShareTable.table.find(".sharePage .button").click(function (){
				if(ShareTable.table.find(".sharePage .button").length == 5){
					return;
				}
				
				if($(this).attr("data-page") == "first"){
					// 去首页
					if(data.currPage != 1){
						ShareTable.currPage = 1;
						ShareTable.getList();
					}
				}else if($(this).attr("data-page") == "left"){
					// 去上一页
					if(data.currPage != 1){
						ShareTable.currPage --;
						ShareTable.getList();
					}
				}else if($(this).attr("data-page") == "right"){
					// 去下一页
					if(data.currPage != data.pageCount){
						ShareTable.currPage ++;
						ShareTable.getList();
					}
				}else if($(this).attr("data-page") == "end"){
					// 去尾页
					if(data.currPage != data.pageCount){
						ShareTable.currPage = data.pageCount;
						ShareTable.getList();
					}
				}else{
					// 去指定页
					if(data.currPage != parseInt($(this).attr("data-page"))){
						ShareTable.currPage = parseInt($(this).attr("data-page"));
						ShareTable.getList();
					}
				}
			})
		},
		getShareTable : function getShareTable(val){ // 获取列表的值
			if(val == "getValueAll"){
				// 获取所有
				return ShareTable.successData.o.list;
			}else if(val == "getSelect"){
				// 获取选中的
				var _class = ShareTable.table.find("th:eq(0)").attr("class");
				var newShareTableList = [];
				ShareTable.table.find("tr.click").each(function(i,v){
					var id = $(v).find(".tableCheckbox").attr("data-value");
					for (var i = 0; i < ShareTable.successData.o.list.length; i++) {
						if(ShareTable.successData.o.list[i][_class] == id){
							newShareTableList.push(ShareTable.successData.o.list[i]);
							break;
						}
					}
				});
				return newShareTableList;
			}
		}
	}

	return ShareTable;
}

/**
 * 屏蔽回车事件
 * 
 * @returns {Boolean}
 */
function KeyDown(event){
    if ( event.keyCode == 13 ){
        return false;
    }else{
    	return true;
    }
}
/**
 * 获取最外层页面的参数\方法
 * 
 * @param data
 * @returns
 */
function getBaseWindow(data){
	var win = window;
	while(win != win.parent){
		win = win.parent;
	}
	return win[data];
}
/**
 * iframe 窗口获取class样式
 */
function getBodyClass(){
	return {
		bodyFontSize : systemConsole.fontSizeClass,
		bodyColor : systemConsole.colorClass
	}
}

/**
 * 判断经纬度是否在这个范围内
 * 
 * @param pt
 * @param poly
 * @returns {Boolean}
 */
function isInsidePolygon(pt, poly) {
	for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i].lat <= pt.lat && pt.lat < poly[j].lat) || (poly[j].lat <= pt.lat && pt.lat < poly[i].lat))
				&& (pt.lng < (poly[j].lng - poly[i].lng)
						* (pt.lat - poly[i].lat) / (poly[j].lat - poly[i].lat)
						+ poly[i].lng) && (c = !c);
	return c;
}

/**
 * 地图画圈
 * 
 * @returns {___anonymous41076_41621}
 */
function getMapChange(){
	var mapChange =  {
		pointArray : null,
		type : false,
		setGetVal : null,
		init : function(){
			map.on('mousedown', function(ev) {
				if(mapChange.type){
					map.dragging.disable(); // 禁用地图拖动
					
					 // 初始化线
					mapChange.pointArray =  L.polyline([], {color: 'red'});

					
					// 线添加点
					mapChange.pointArray.addLatLng(ev.latlng);
					map.addLayer(mapChange.pointArray);

					
					map.on("mousemove", function(ev){
						if(mapChange.type){
							// 线添加点
							mapChange.pointArray.addLatLng(ev.latlng);
							map.addLayer(mapChange.pointArray);
						}
					})
					
					map.on("mouseup", function(ev){
						if(mapChange.type){
							// 线添加点
							mapChange.pointArray.addLatLng(ev.latlng);
							map.addLayer(mapChange.pointArray);
							
							// 移除事件
							map.off('mouseup');
							map.off('mousemove');
							if(mapChange.setGetVal) mapChange.setGetVal(mapChange);
							map.dragging.enable(); // 启用地图拖动
							mapChange.type = false;
						}
					})
				}
			})
		},
		setOpen : function(bo){
			mapChange.type = bo;
		}
	}
	
	return mapChange;
}

/**
 * 树形结构
 */
function baseTree(){
	
	var data = [{
		name : "显示的名称",
		id : 1, // 识别的编号，不可重复
		val : data, // 这行保存的数据
		data : [], // 下级菜单
		isMenu : true, // 是否菜单
	}]
	
	var tree = {
		obj : null, // 最外层对象
		data : null, // 储存的数据
		isClick : false, // 是否可以选中
		initData : null, // 初始化的东西
		lastClickObj : null, // 上次选中的对象
		clickFun : null, // 点击时调用的方法
		init : function(data){
			// 初始化
			tree.initData = data;
			tree.obj = data.obj;
			tree.isClick = data.isClick;
			tree.clickFun = data.clickFun;
			tree.update(data.data);
			if(tree.isClick){
				// 需要勾选时的点击事件
				tree.initClickTreu();
			}else{
				// 没有勾选时的点击事件
				tree.initClickFalse();
			}
			
		},
		initClickTreu : function(){
			// 绑定点击事件
			
			tree.obj.on("click", ".tree_li_btn", function(){
				var _this = $(this);
				if(_this.data("ismenu")){
					// 展开、收缩下级菜单
					// 通过展开按钮 判断当前需要的操作
					if(_this.children(".glyphicon").hasClass("glyphicon-triangle-right")){
						// 展开
						_this.children(".glyphicon").removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom");
						_this.next().show();
					}else{
						// 收缩
						_this.children(".glyphicon").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right");
						_this.next().hide();
					}
					
					tree.obj.parents(".scroll_base").resize();
				}else{
					// 选中、取消当前
					if(_this.parent().hasClass("click")){
						_this.parent().removeClass("click");
					}else{
						_this.parent().addClass("click");
					}
					
					
					// 判断是否给上一级添加选中效果
					tree.clickCheckBoxChange(_this);
				}
			}).on("click", ".treeCheckbox", function(){
				var _this = $(this).parent(".tree_li_btn");
				// 选中、取消当前
				if(_this.parent().hasClass("click")){
					_this.parent().removeClass("click");
					if(_this.data("ismenu")){
						// 取消下级所有
						_this.parent().find(".tree_li").removeClass("click");
					}
				}else{
					_this.parent().addClass("click");
					if(_this.data("ismenu")){
						// 选中下级所有
						_this.parent().find(".tree_li").addClass("click");
					}
				}
				// 判断是否给上一级添加选中效果
				tree.clickCheckBoxChange(_this);
				
				
				return false; // 组织冒泡事件，防止触发上级点击事件
			})
		},
		
		initClickFalse : function(){
			// 不需要勾选时的点击事件
			// 不需要勾选，所以这是个单选控件
			// 既然是单选，在点击一个选项的时候，取消上一个按钮的选中
			// 需要保存上次选中的按钮是哪个
			// 已展开的是否需要收缩？ 应该不需要吧
			
			// tree.obj.find(".tree_li[data-id=" + data[i] +
			// "]").addClass("click");
			
			

			tree.obj.on("click", ".tree_li_btn", function(){
				var _this = $(this);
				if(_this.data("ismenu")){
					// 展开、收缩下级菜单
					// 通过展开按钮 判断当前需要的操作
					if(_this.children(".glyphicon").hasClass("glyphicon-triangle-right")){
						// 展开
						_this.children(".glyphicon").removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom");
						_this.next().show();
					}else{
						// 收缩
						_this.children(".glyphicon").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right");
						_this.next().hide();
					}
					
					tree.obj.parents(".scroll_base").resize();
				}else{
					// 选中当前
					if(!_this.parent().hasClass("click")){
						_this.parent().addClass("click");
						if(tree.lastClickObj != null){
							// 取消上次选中
							tree.lastClickObj.removeClass("click");
						}
						tree.lastClickObj = _this.parent();
						if(tree.clickFun != null){
							tree.clickFun(_this.parent().data("val"));
						}
					}
					
					
					// 判断是否给上一级添加选中效果
// tree.clickCheckBoxChange(_this);
				}
			})
			
		},
		clickCheckBoxChange : function(obj){
			// 判断是否给上一级添加选中效果
			var bo = false;
			if(obj.parent().hasClass("click")){
				bo = true;
			}else{
				var arr = obj.parent().parent().find(".tree_li");
				for (var i = 0; i < arr.length; i++) {
					if(arr.eq(i).hasClass("click")){
						bo = true;
					}
				}
			}

			if(bo){
				obj.parent().parents(".tree_li").addClass("click");
			}else{
				obj.parent().parents(".tree_li").removeClass("click");
			}
		},
		initTreeLi : function(data){
			// 获取li
			var li = $('<li class="tree_li" data-id="' + data.id + '"></li>');
			li.data("name", data.name);
			li.data("val", data.val);
			li.data("id", data.id);
			li.data("isMenu", data.isMenu);
			
			var p = $('<p class="tree_li_btn" data-isMenu=' + data.isMenu + '></p>');
			if(data.isMenu && data.data && data.data.length > 0){
// <!-- 文件夹，收缩 -->
				p.append('<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>');
			}
			
			if(tree.isClick){
// <!-- 是否选中按钮，只要内部有一个选中，当前就选中，内部没有，当前就未选中 -->
				p.append('<label class="treeCheckbox"></label>');
			}
			
// <!-- 当前菜单的名称 -->
			p.append('<span class="tree_treeName">' + data.name + '</span>');
			li.append(p);
			
			if(data.isMenu && data.data && data.data.length > 0){
				var ul = $('<ul class="tree_ul"></ul>');
				for (var i = 0; i < data.data.length; i++) {
					ul.append(tree.initTreeLi(data.data[i]));
				}
				li.append(ul);
			}
			
			return li;
			
		},
		initHtml : function(){
			tree.obj.empty(); // 清空
			var ul = $('<ul class="tree_ul"></ul>');
			for (var i = 0; i < tree.data.length; i++) {
				ul.append(tree.initTreeLi(tree.data[i]));
			}
			tree.obj.append(ul);
			tree.obj.parents(".scroll_base").resize();
		},
		update : function(data){
			// 更新内容
			tree.data = data;
			tree.initHtml();
		},
		select : function(data){
			// 取消所有选中
			tree.obj.find(".tree_li").removeClass("click");
			// 选中指定内容
			for (var i = 0; i < data.length; i++) {
				tree.obj.find(".tree_li[data-id=" + data[i] + "]").addClass("click");
			}
		},
		getVal : function(){
			// 获取选中内容
			var li = tree.obj.find(".tree_li.click");
			var data = [];
			for (var i = 0; i < li.length; i++) {
				data.push(li.eq(i).data("val"));
			}
			return data;
		},
		showAll : function(bo){
			// 全部展开或收缩
			var li = tree.obj.find(".tree_li");
			if(bo){
				// 全部展开
				for (var i = 0; i < li.length; i++) {
					li.children(".tree_li_btn").children(".glyphicon").removeClass("glyphicon-triangle-right");
					li.children(".tree_li_btn").children(".glyphicon").addClass("glyphicon-triangle-bottom");
					li.children(".tree_ul").show();
				}
			}else{
				// 全部隐藏
				for (var i = 0; i < li.length; i++) {
					li.children(".tree_li_btn").children(".glyphicon").removeClass("glyphicon-triangle-bottom");
					li.children(".tree_li_btn").children(".glyphicon").addClass("glyphicon-triangle-right");
					li.children(".tree_ul").hide();
				}
			}
		}
	}
	
	return tree;
}

/**
 * 弹出窗口
 * 
 * @param obj
 *            弹出框对象
 * @param type
 *            要做的事
 */
function shareWindow(obj, type){

	
	if($(obj.id).length == 0){
		// 没有当前弹窗，进行初始化
		if(obj == null || obj.id == null){
			return;
		}
		
		var html = $('<div class="shareWindow">'
			+ '<div class="shareWindowTitle"><span class="shareWindowTitle_txt">'
			+ '</span><span class="closeBtn glyphicon glyphicon-remove" aria-hidden="true"></span>'
			+ '</div><div class="shareWindowInfo"><div class="scroll_base">'
			+ '<div class="scroll_box"><div class="shareWindowHtml"></div>'
			+ '</div></div></div></div>');
		
		html.attr("id", obj.id.replace("#", ""));
		html.find(".shareWindowTitle_txt").text(obj.title);
		html.find(".shareWindowHtml").html(obj.html);
		html.css({
			width: obj.width,
			height: obj.height,
		    transform: "translate(-" + (parseInt(obj.width) / 2) + "px, -" + (parseInt(obj.height) / 2) + "px);"
		})
		
		$("body").append(html);
		
		if(type != "init"){
			shareWindow(obj, "init");	
		}
	}
	
	if(type == "init"){
		// 初始化
		$(obj.id).find(".closeBtn").on("click", function(){
			shareWindow(obj, "close");
		})
		
		
		
		$(obj.id).on('mousedown', ".shareWindowTitle_txt", function(ev) {
			// 点击开始
		    var _this = $(obj.id);
		    var dx = ev.pageX;
		    var dy = ev.pageY;
		    var transform = _this.css("transform");
		    
		    var tx = 0;
		    var ty = 0;
		    if(transform != "none"){
		    	transform = transform.replace("matrix(", "").replace(")", "");
		    	var arr = transform.split(",");
		    	tx = parseInt(arr[4]);
		    	ty = parseInt(arr[5]);
		    }
		    $(window).on('mousemove', function(ev) {
				// 鼠标移动过程
		    	 var mx = ev.pageX;
				 var my = ev.pageY;
				 _this.css("transform", "translate(" + (mx - dx + tx) + "px," + (my - dy + ty) + "px)");
			})
			.on('mouseup', ".shareWindowTitle_txt", function(ev) {
				// 鼠标松开
				$(window).off('mousemove');
				_this.off('mouseup');
			})
			
			$(window).on("mouseup",function(){
				$(window).off('mousemove');
				_this.off('mouseup');
			})
		})
		
	}else if(type == "open"){
		// 开启
		$(obj.id).show();
	}else if(type == "close"){
		// 关闭
		$(obj.id).hide();
	}
	
}

/**
 * 更新图片查看器的图片
 * 
 * @returns
 */
function updateViewer(url, index) {
	if(window.parent != window){
		return window.parent.updateViewer(url, index);
	}
	
	var imgBox = $("#showBigImg");
	imgBox.empty();
	
	if(!isArray(url)){
		imgBox.append('<img src="' + url + '" alt="" data-original="' + url + '">');
		index = 0;
	}else{ 
		for(var i in url){
			imgBox.append('<img src="' + url[i] + '" alt ="" data-original="' + url[i] + '">');
		}
	}
	new Viewer(document.getElementById('showBigImg'), {
		url : 'data-original'
	});
	$("#showBigImg img").eq(index).click();
}

/**
 * 判断值为数组
 * 
 * @param o
 * @returns
 */
function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}

/**
 * 右侧一次性弹窗
 */
var leftAlert = function(){
	var clickFun; // 点击确认调用的方法
	var errorFun; // 点击取消调用的方法
	
	// 点击确认时候调用的方法
	var success = function(){
		clickFun();
		hide();
	}
	
	var show = function(text, fun, fun2){
		$("#leftAlert .info").html(text);
		clickFun = fun;
		errorFun = fun2;
		$("#leftAlert").show();
	} 
	
	// 点击取消时候调用的方法
	var error = function(){
		if(errorFun){
			errorFun();
		}
		hide();
	}
	
	// 关闭
	var hide = function(){
		$("#leftAlert").hide();
	}
	
	return {
		show, success, hide, error
	}
}()


/**
 * 选中下拉菜单
 * 
 * @returns
 */
function selectOption(obj, num){
	$(obj).find("option").eq(num).prop("selected" ,true);
}

/**
 * 开启弹窗
 * 
 * @param type
 * @returns
 */
function shareLoad(type) {
	if(window.parent != window){
		window.parent.shareLoad(type);
		return;
	}
	if(type == "open"){
		$(".imgload").fadeIn();
	}else if(type == "close"){
		setTimeout("$('.imgload').fadeOut()", 500);
	}
	return false;
}

/**
 * 保存截图
 */
var saveImageFile = function(obj){
	shareLoad("close");
	
	var data = $(obj).attr("src");
	var filename = "图片.jpg";
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = data;
	save_link.download = filename;
  
	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(event);
};

/**
 * 保存地图为图片
 * 
 * @returns
 */
function StartCapture(){
	shareLoad("open");
	domtoimage.toJpeg($('#mapBase')[0]).then(function(dataUrl){
		var img = $("#saveMapToImage");
		img.append('<img src="' + dataUrl + '" onload="saveImageFile(this)" />')
	}).catch(function(error){
		shareLoad("close");
		shareAlert("截图失败！");		
	})
}

/**
 * 格式化秒
 * 
 * @param int
 *            value 总秒数
 * @return string result 格式化后的字符串
 */
function formatSeconds(value) { 
	 var theTime = parseInt(value);// 需要转换的时间秒
	 var theTime1 = 0;// 分
	 var theTime2 = 0;// 小时
	 var theTime3 = 0;// 天
	 if(theTime > 60) { 
		 theTime1 = parseInt(theTime/60); 
		 theTime = parseInt(theTime%60); 
		 if(theTime1 > 60) { 
			   theTime2 = parseInt(theTime1/60); 
			   theTime1 = parseInt(theTime1%60); 
			   if(theTime2 > 24){
				    // 大于24小时
				    theTime3 = parseInt(theTime2/24);
				    theTime2 = parseInt(theTime2%24);
			   }
		 } 
	 } 
	 var result = '';
	 if(theTime > 0){
	  result = ""+parseInt(theTime)+"秒";
	 }
	 if(theTime1 > 0) { 
	  result = ""+parseInt(theTime1)+"分"+result; 
	 } 
	 if(theTime2 > 0) { 
	  result = ""+parseInt(theTime2)+"小时"+result; 
	 } 
	 if(theTime3 > 0) { 
	  result = ""+parseInt(theTime3)+"天"+result; 
	 }
	 return result; 
}
/**
 * 获取地址栏参数
 * 
 * @param string
 *            name 参数名
 * @return string r 参数值
 */
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/* 时间判断 */
function judgeTime(startTime,endTime){
	// 验证时间
	if(startTime == null || startTime == ""){
		shareAlert("请选择开始时间！");
		return false;
	}
	if(endTime == null || endTime == ""){
		shareAlert("请选择结束时间！");
		return false;
	}
	var s = new Date(startTime.replaceAll("-", "/"));
	var e = new Date(endTime.replaceAll("-", "/"));
	if(s.getTime() > e.getTime()){
		shareAlert("开始时间不能大于结束时间")
		return false;
	}
	
	return true;
}
function bMapTransQQMap(lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    
	return {
	      lng: lngs,
	      lat: lats     
	}  
}
function start(obj){
    $(obj).not('[data-isLoading]').each(function () {
       if (isShow($(this))) {
           loadImg($(this));
       }
   })
}
// 判断图片是否出现在视窗的函数
function isShow($node){
   return $node.offset().top <= $(window).height()+$(window).scrollTop();
}
// 加载图片的函数，就是把自定义属性data-src 存储的真正的图片地址，赋值给src
function loadImg($img){
   $img.attr('src', $img.attr('data-src'));
   $img.load(function(){
	   $img.css("padding","0px");
   }) 
   // 已经加载的图片，我给它设置一个属性，值为1，作为标识
   // 弄这个的初衷是因为，每次滚动的时候，所有的图片都会遍历一遍，这样有点浪费，所以做个标识，滚动的时候只遍历哪些还没有加载的图片
   $img.attr('data-isLoading',1);
}
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
// 按照特定方式格式化
function sortArr(arr, str) {
    var _arr = [],
        _t = [],
        // 临时的变量
        _tmp;
 
    // 按照特定的参数将数组排序将具有相同值得排在一起
    arr = arr.sort(function(a, b) {
        var s = a[str],
            t = b[str];
 
        return s < t ? -1 : 1;
    });
 
    if ( arr.length ){
        _tmp = arr[0][str];
    }
    // console.log( arr );
    // 将相同类别的对象添加到统一个数组
    for (var i in arr) {
       // console.log( _tmp);
        if ( arr[i][str] === _tmp ){
           // console.log(_tmp)
            _t.push( arr[i] );
        } else {
            _tmp = arr[i][str];
            _arr.push( _t );
            _t = [arr[i]];
        }
    }
    // 将最后的内容推出新数组
    _arr.push( _t );
    return _arr;
}

function getSevendaysStr(today, addDayCount) {
	  var dd;
	  if (today) {
	    dd = new Date(today);
	  } else {
	    dd = new Date();
	  }
	  dd.setDate(dd.getDate() + addDayCount); // 获取AddDayCount天后的日期
	  var year = dd.getFullYear();
	  var month = dd.getMonth() + 1 // 获取当前月份的日期
	  var day = dd.getDate();
	  var hour = dd.getHours();
	  var minute = dd.getMinutes();
	  if (month < 10) {
	    month = '0' + month;
	  };
	  if (day < 10) {
	    day = '0' + day;
	  };
	  if (hour < 10) {
	    hour = '0' + hour;
	  };
	  if (minute < 10) {
	    minute = '0' + minute;
	  };
	  return month + "/" + day;
}
function getDates(days, todate) {
	  var dateArry = [];
	  var dateObj = dateLater(todate, -1);
	  dateArry.push(dateObj)
	  return dateArry;
}
function dateLater(dates, later) {
	  let dateObj = {};
	  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
	  let date = new Date(dates);
	  date.setDate(date.getDate() + later);
	  let day = date.getDay();
	  let yearDate = date.getFullYear();
	  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
	  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
	  dateObj.time = yearDate + '-' + month + '-' + dayFormate;
	  dateObj.week = show_day[day];
	  return dateObj;
}
function getLiveHour(today, addDayCount) {
	  var dd;
	  if (today) {
	    dd = new Date(today);
	  } else {
	    dd = new Date();
	  }
	  var ddStr = dd.getTime() - addDayCount * 60 * 1000 * 60;
	  ddStr = new Date(ddStr);
	  var year = ddStr.getFullYear();
	  var month = ddStr.getMonth() + 1 // 获取当前月份的日期
	  var day = ddStr.getDate();
	  var hour = ddStr.getHours();
	  var minute = ddStr.getMinutes();
	  if (month < 10) {
	    month = '0' + month;
	  };
	  if (day < 10) {
	    day = '0' + day;
	  };
	  if (hour < 10) {
	    hour = '0' + hour;
	  };
	  if (minute < 10) {
	    minute = '0' + minute;
	  };
	  return year + "" + month + "" + day + "" + hour+""+minute;
}
// 预报-风向
var getYBFengXing=function(fx1) {
	  if (fx1==0) {
	    fx3 = "微风";
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
	    fx3 = "静风";
	  }
	  return fx3;
	}
// 预报-风级
function getWindLevel(fengNum) {
	  var fs = "";
	  if (fengNum >= 0 && fengNum <= 0.2) {
	    fs = "<3级";
	  } else if (fengNum >= 0.3 && fengNum <= 1.5) {
	    fs = "<3级";
	  } else if (fengNum >= 1.6 && fengNum <= 3.3) {
	    fs = "<3级";
	  } else if (fengNum >= 3.4 && fengNum <= 5.4) {
	    fs = "<3级";
	  } else if (fengNum >= 5.5 && fengNum <= 7.9) {
	    fs = "4级";
	  } else if (fengNum >= 8.0 && fengNum <= 10.7) {
	    fs = "5级";
	  } else if (fengNum >= 10.8 && fengNum <= 13.8) {
	    fs = "6级";
	  } else if (fengNum >= 13.9 && fengNum <= 17.1) {
	    fs = "7级";
	  } else if (fengNum >= 17.2 && fengNum <= 20.7) {
	    fs = "8级";
	  } else if (fengNum >= 20.8 && fengNum <= 24.4) {
	    fs = "9级";
	  } else if (fengNum >= 24.5 && fengNum <= 28.4) {
	    fs = "10级";
	  } else if (fengNum >= 28.5 && fengNum <= 32.6) {
	    fs = "11级";
	  } else if (fengNum >= 32.7 && fengNum <= 36.9) {
	    fs = "12级";
	  } else if (fengNum >= 37.0 && fengNum <= 41.4) {
	    fs = "13级";
	  } else if (fengNum >= 41.5 && fengNum <= 46.1) {
	    fs = "14级";
	  } else if (fengNum >= 51.0 && fengNum <= 56.0) {
	    fs = "15级";
	  } else if (fengNum >= 56.1 && fengNum <= 61.2) {
	    fs = "16级";
	  } else if (fengNum >= 61.3) {
	    fs = "17级以上";
	  }

	  return fs;
	}
function getWindLevelForNum(key) {
	  key = key + "";
	  switch (key) {
	    case "0":
	      return "微风";
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
var getStringTem = function (tem) {
	 var dayTemp = parseInt(tem);
	  switch (dayTemp) {
	    case 0: {
	      return "晴";
	    }
	    case 1: {
	      return "多云";
	    }
	    case 2: {
	      return "阴";
	    }
	    case 3: {
	      return "阵雨";
	    }
	    case 4: {
	      return "雷阵雨";
	    }
	    case 5: {
	      return "雷阵雨伴有冰雹";
	    }
	    case 6: {
	      return "雨夹雪";
	    }
	    case 7: {
	      return "小雨";
	    }
	    case 8: {
	      return "中雨";
	    }
	    case 9: {
	      return "大雨";
	    }
	    case 10: {
	      return "暴雨";
	    }
	    case 11: {
	      return "大暴雨";
	    }
	    case 12: {
	      return "特大暴雨";
	    }
	    case 13: {
	      return "阵雪";
	    }
	    case 14: {
	      return "小雪";
	    }
	    case 15: {
	      return "中雪";
	    }
	    case 16: {
	      return "大雪";
	    }
	    case 17: {
	      return "暴雪";
	    }
	    case 18: {
	      return "雾";
	    }
	    case 19: {
	      return "冻雨";
	    }
	    case 20: {
	      return "沙尘暴";
	    }
	    case 21: {
	      return "小到中雨";
	    }
	    case 22: {
	      return "中到大雨";
	    }
	    case 23: {
	      return "大到暴雨";
	    }
	    case 24: {
	      return "暴雨到大暴雨";
	    }
	    case 25: {
	      return "大暴雨到特大暴雨";
	    }
	    case 26: {
	      return "小到中雪";
	    }
	    case 27: {
	      return "中到大雪";
	    }
	    case 28: {
	      return "大到暴雪";
	    }
	    case 29: {
	      return "浮尘";
	    }
	    case 30: {
	      return "扬沙";
	    }
	    case 31: {
	      return "强沙尘暴";
	    }
	    case 53: {
	      return "霾";
	    }
	    case 99: {
	      return "无";
	    }
	    case 32: {
	      return "浓雾";
	    }
	    case 49: {
	      return "强浓雾";
	    }
	    case 54: {
	      return "中度霾";
	    }
	    case 55: {
	      return "重度霾";
	    }
	    case 56: {
	      return "严重霾";
	    }
	    case 57: {
	      return "大雾";
	    }
	    case 58: {
	      return "特强浓雾";
	    }
	    case 301: {
	      return "雨";
	    }
	    case 302: {
	      return "雪";
	    }
	    default:
	  }
	  return "晴";
	}

// 实况风向
function getFengXing(fx1) {
	  var fx3 = "";
	  if (fx1 > 0 && fx1 < 11.25) {
	    fx3 = "北风";
	  } else if (fx1 > 11.26 && fx1 < 33.75) {
	    fx3 = "东北风";
	  } else if (fx1 > 33.76 && fx1 < 56.25) {
	    fx3 = "东北风";
	  } else if (fx1 > 56.26 && fx1 < 78.75) {
	    fx3 = "东北风";
	  } else if (fx1 > 78.76 && fx1 < 101.25) {
	    fx3 = "东风";
	  } else if (fx1 > 101.25 && fx1 < 123.75) {
	    fx3 = "东南风";
	  } else if (fx1 > 123.76 && fx1 < 146.25) {
	    fx3 = "东南风";
	  } else if (fx1 > 146.26 && fx1 < 168.75) {
	    fx3 = "东南风";
	  } else if (fx1 > 168.76 && fx1 < 191.25) {
	    fx3 = "南风";
	  } else if (fx1 > 191.26 && fx1 < 213.75) {
	    fx3 = "西南风";
	  } else if (fx1 > 213.76 && fx1 < 236.25) {
	    fx3 = "西南风";
	  } else if (fx1 > 236.26 && fx1 < 258.75) {
	    fx3 = "西南风";
	  } else if (fx1 > 258.76 && fx1 < 281.25) {
	    fx3 = "西风";
	  } else if (fx1 > 281.76 && fx1 < 303.75) {
	    fx3 = "西北风";
	  } else if (fx1 > 303.76 && fx1 < 326.25) {
	    fx3 = "西北风";
	  } else if (fx1 > 326.26 && fx1 < 348.75) {
	    fx3 = "西北风";
	  } else {
	    fx3 = "北风";
	  }

	  return fx3;
	}

function getLiveWindLevel(fengNum) {
	  var fs = "";
	  if (fengNum >= 0 && fengNum <= 0.2) {
	    fs = "0";
	  } else if (fengNum >= 0.3 && fengNum <= 1.5) {
	    fs = "1";
	  } else if (fengNum >= 1.6 && fengNum <= 3.3) {
	    fs = "2";
	  } else if (fengNum >= 3.4 && fengNum <= 5.4) {
	    fs = "3";
	  } else if (fengNum >= 5.5 && fengNum <= 7.9) {
	    fs = "4";
	  } else if (fengNum >= 8.0 && fengNum <= 10.7) {
	    fs = "5";
	  } else if (fengNum >= 10.8 && fengNum <= 13.8) {
	    fs = "6";
	  } else if (fengNum >= 13.9 && fengNum <= 17.1) {
	    fs = "7";
	  } else if (fengNum >= 17.2 && fengNum <= 20.7) {
	    fs = "8";
	  } else if (fengNum >= 20.8 && fengNum <= 24.4) {
	    fs = "9";
	  } else if (fengNum >= 24.5 && fengNum <= 28.4) {
	    fs = "10";
	  } else if (fengNum >= 28.5 && fengNum <= 32.6) {
	    fs = "11";
	  } else if (fengNum >= 32.7 && fengNum <= 36.9) {
	    fs = "12";
	  } else if (fengNum >= 37.0 && fengNum <= 41.4) {
	    fs = "13";
	  } else if (fengNum >= 41.5 && fengNum <= 46.1) {
	    fs = "14";
	  } else if (fengNum >= 51.0 && fengNum <= 56.0) {
	    fs = "15";
	  } else if (fengNum >= 56.1 && fengNum <= 61.2) {
	    fs = "16";
	  } else if (fengNum >= 61.3) {
	    fs = "17";
	  }

	  return fs;
	}
function getHourWeatherStr(today, addDayCount) {
	  // console.log(today);
	  var dd;
	  if (today) {
	    dd = new Date(today);
	  } else {
	    dd = new Date();
	  }
	  dd.setDate(dd.getDate() + addDayCount); // 获取AddDayCount天后的日期
	  var year = dd.getFullYear();
	  var month = dd.getMonth() + 1 // 获取当前月份的日期
	  var day = dd.getDate();
	  var hour = dd.getHours();
	  var minute = dd.getMinutes();
	  if (month < 10) {
	    month = '0' + month;
	  };
	  if (day < 10) {
	    day = '0' + day;
	  };
	  if (hour < 10) {
	    hour = '0' + hour;
	  };
	  if (minute < 10) {
	    minute = '0' + minute;
	  };
	  return year + "" + month + "" + day + "" + hour +""+ minute;
	}
