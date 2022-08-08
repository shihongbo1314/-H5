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
//时间栅格化
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
 /**
  * 字符串替换
  */
 String.prototype.replaceAll = function(s1,s2){ 
 	return this.replace(new RegExp(s1,"gm"),s2); 
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
  * uv数据转成风速风向
  * 
  * @param uMs
  * @param vMs
  * @returns
  */
 function UVdataToSDdata(uMs, vMs){
 	
 	function ts(u, v){ 
         if (u == 0 & v < 0) {
             return 0;
         } else if (u < 0 & v == 0){
             return 90;
         } else if (u == 0 & v > 0){
             return 180;
         } else if  (u > 0 & v == 0) {
             return 270;
         }
         return 999.9;
     }
 	
 	var s = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
 
     var tsD = ts(uMs, vMs);
     if (tsD != 999.9) {
     	return tsD;
 	}
 	var windAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
 	var windDirTrigTo = Math.atan2(uMs / windAbs, vMs / windAbs);
 	var windDirTrigToDegrees = windDirTrigTo * 180 / Math.PI;
 	var windDirTrigFromDegrees = windDirTrigToDegrees + 180;
 	var d = windDirTrigFromDegrees.toFixed(3);
 	return {
 		s : s,
 		d : d
 	}
 }
 function getfengXingForDuShu(fx) {
     if (fx == null || fx == "") {
         return "—";
     }
     var fengXiang_text = "—";
     var fengNum = parseFloat(fx)%360;
     if (fengNum == 0) {
         fengXiang_text = "北风";
         // fengXiang = "S.png";
     } else if (fengNum == 90) {
         fengXiang_text = "东风";
         // fengXiang = "W.png";
     } else if (fengNum == 180) {
         fengXiang_text = "南风";
         // fengXiang = "N.png";
     } else if (fengNum == 270) {
         fengXiang_text = "西风";
         // fengXiang = "E.png";
     } else if (fengNum > 0 && fengNum < 90) {
         fengXiang_text = "东北风";
         // fengXiang = "W-S.png";
     } else if (fengNum > 90 && fengNum < 180) {
         fengXiang_text = "东南风";
         // fengXiang = "W-N.png";
     } else if (fengNum > 180 && fengNum < 270) {
         fengXiang_text = "西南风";
         // fengXiang = "E-N.png";
     } else if (fengNum > 270 && fengNum < 360) {
         fengXiang_text = "西北风";
         // fengXiang = "E-S.png";
     } else if (fengNum == 360) {
         fengXiang_text = "北风";
         // fengXiang = "S.png";
     } else {
         fengXiang_text = "静风";
     }
 
     return fengXiang_text;
 
 }