/**
 * 修改bodyColor
 * @param color
 */
function iFrameSettingsCollor(oldColor, color){
	$("body").removeClass(oldColor).addClass(color);
}


/**
 * 修改fontSize
 * @param color
 */
function iFrameSettingsFontSize(oldFontSize, bodyFontSize){
	$("body").removeClass(oldFontSize).addClass(bodyFontSize);
}

/**
 * 初始化body class
 */
var setBodyClass = function (){
	try {
		var bodyClass = window.parent.getBodyClass();
	} catch (e) {
		// TODO: handle exception
		// 测试用
		var bodyClass = {
			bodyColor : "color_blue", // 现在显示的颜色class
			bodyFontSize : "fontSize12" // 现在显示的字体大小
		}
	}
	
	document.body.className = "colorText " + bodyClass.bodyColor + " " + bodyClass.bodyFontSize;
}()

/**
 * 自动调整table高度
 */
var autoHtmlMainHeight = function(){
	var titleHeight = $(".htmlTitle").outerHeight();
	$(".htmlMain").css("height", "calc(100% - " + titleHeight + "px");
}

$(function(){
	autoHtmlMainHeight();
})