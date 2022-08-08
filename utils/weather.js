 function GetWindDirTxt(wind_D) {
    var Wind_D_Txt = "--";

    if (wind_D <= 11.25 || (wind_D >= 348.76 && wind_D <= 360)) {
        Wind_D_Txt = "北风";
    }
    else if (wind_D <= 33.75) {
        Wind_D_Txt = "北东北风";
    }
    else if (wind_D <= 56.25) {
        Wind_D_Txt = "东北风";
    }
    else if (wind_D < 78.75) {
        Wind_D_Txt = "东东北风";
    }
    else if (wind_D < 101.25) {
        Wind_D_Txt = "东风";
    }
    else if (wind_D < 123.75) {
        Wind_D_Txt = "东东南风";
    }
    else if (wind_D < 146.25) {
        Wind_D_Txt = "东南风";
    }
    else if (wind_D < 168.75) {
        Wind_D_Txt = "南东南风";
    }
    else if (wind_D <= 191.25) {
        Wind_D_Txt = "南风";
    }
    else if (wind_D <= 213.75) {
        Wind_D_Txt = "南西南风";
    }
    else if (wind_D < 236.25) {
        Wind_D_Txt = "西南风";
    }
    else if (wind_D < 258.75) {
        Wind_D_Txt = "西西南风";
    }
    else if (wind_D < 281.25) {
        Wind_D_Txt = "西风";
    }
    else if (wind_D < 303.75) {
        Wind_D_Txt = "西西北风";
    }
    else if (wind_D < 326.25) {
        Wind_D_Txt = "西北风";
    }
    else if (wind_D < 348.75) {
        Wind_D_Txt = "北西北风";
    }

    return Wind_D_Txt;
}
 function WindPower(speed) {
    if (speed >= 999900) {
        return "--";
    }

    var power = 0;
    if (speed <= 0.2) {
        power = 0;
    }
    else if (speed <= 1.5) {
        power = 1;
    }
    else if (speed <= 3.3) {
        power = 2;
    }
    else if (speed <= 5.4) {
        power = 3;
    }
    else if (speed <= 7.9) {
        power = 4;
    }
    else if (speed <= 10.7) {
        power = 5;
    }
    else if (speed <= 13.8) {
        power = 6;
    }
    else if (speed <= 17.1) {
        power = 7;
    }
    else if (speed <= 20.7) {
        power = 8;
    }
    else if (speed <= 24.4) {
        power = 9;
    }
    else if (speed <= 28.4) {
        power = 10;
    }
    else if (speed <= 32.6) {
        power = 11;
    }
    else if (speed <= 36.9) {
        power = 12;
    }
    else if (speed <= 41.4) {
        power = 13;
    }
    else if (speed <= 46.1) {
        power = 14;
    }
    else if (speed <= 50.9) {
        power = 15;
    }
    else if (speed <= 56.0) {
        power = 16;
    }
    else if (speed <= 61.2) {
        power = 17;
    }
    else {
        power = 18;
    }

    return power;
}
 function getWeatherImg(type) {
	switch (type) {
	case "晴":
		return 0;
	case "多云":
		return 1;
	case "阴":
		return 2;
	case "阵雨":
		return 3;
	case "雷阵雨":
		return 4;
	case "雷阵雨伴有冰雹":
		return 5;
	case "雨夹雪":
		return 6;
	case "小雨":
		return 7;
	case "中雨":
		return 8;
	case "大雨":
		return 9;
	case "暴雨":
		return 10;
	case "大暴雨":
		return 11;
	case "特大暴雨":
		return 12;
	case "阵雪":
		return 13;
	case "小雪":
		return 14;
	case "中雪":
		return 15;
	case "大雪":
		return 16;
	case "暴雪":
		return 17;
	case "雾":
		return 18;
	case "冻雨":
		return 19;
	case "沙尘暴":
		return 20;
	case "小到中雨":
		return 21;
	case "中到大雨":
		return 22;
	case "大到暴雨":
		return 23;
	case "暴雨到大暴雨":
		return 24;
	case "大暴雨到特大暴雨":
		return 25;
	case "小到中雪":
		return 26;
	case "中到大雪":
		return 27;
	case "大到暴雪":
		return 28;
	case "浮尘":
		return 29;
	case "扬沙":
		return 30;
	case "强沙尘暴":
		return 31;
	case "霾":
		return 53;
	case "无":
		return 99;
	}
	return "0";
}
/*风速转为风力
 *@method GetWindPower
 *@param{Float}speed 风速
 *@return {int} 风力
*/
 function GetWindPower(speed) {
    if (speed >= 999900) {
        return "--";
    }

    var power = 0;
    if (speed <= 0.2) {
        power = 0;
    }
    else if (speed <= 1.5) {
        power = 1;
    }
    else if (speed <= 3.3) {
        power = 2;
    }
    else if (speed <= 5.4) {
        power = 3;
    }
    else if (speed <= 7.9) {
        power = 4;
    }
    else if (speed <= 10.7) {
        power = 5;
    }
    else if (speed <= 13.8) {
        power = 6;
    }
    else if (speed <= 17.1) {
        power = 7;
    }
    else if (speed <= 20.7) {
        power = 8;
    }
    else if (speed <= 24.4) {
        power = 9;
    }
    else if (speed <= 28.4) {
        power = 10;
    }
    else if (speed <= 32.6) {
        power = 11;
    }
    else if (speed <= 36.9) {
        power = 12;
    }
    else if (speed <= 41.4) {
        power = 13;
    }
    else if (speed <= 46.1) {
        power = 14;
    }
    else if (speed <= 50.9) {
        power = 15;
    }
    else if (speed <= 56.0) {
        power = 16;
    }
    else if (speed <= 61.2) {
        power = 17;
    }
    else {
        power = 18;
    }

    return power;
}
/**
 * 根据风速判断风级（m/s）
 ***/
 function fsTurnTofj(fs){
	if (fs!=0 && fs == ""||fs == null) {
        return "—";
    }
    var fengSu_text = "—";
    if (fs >=0&&fs<=0.2) {
        fengSu_text = "0级";
    } else if (fs >=0.3&&fs<=1.5) {
    	fengSu_text = "1级";
    } else if (fs >=1.6&&fs<=3.3) {
    	fengSu_text = "2级";
    } else if (fs >=3.4&&fs<=5.4) {
    	fengSu_text = "3级";
    } else if (fs >=5.5&&fs<=7.9) {
    	fengSu_text = "4级";
    } else if (fs >=8.0&&fs<=10.7) {
    	fengSu_text = "5级";
    } else if (fs >=10.8&&fs<=13.8) {
        fengSu_text = "6级";
    } else if (fs >=13.9&&fs<=17.1) {
    	fengSu_text = "7级";
    } else if (fs >=17.2&&fs<=20.7){
    	fengSu_text = "8级";
    }else if (fs >=20.8&&fs<=24.4){
    	fengSu_text = "9级";
    }else if (fs >=24.5&&fs<=28.4){
    	fengSu_text = "10级";
    }else if (fs >=28.5&&fs<=32.6){
    	fengSu_text = "11级";
    }else if (fs >=32.6&&fs<=36.9){
    	fengSu_text = "12级";
    }else if (fs >=37.0&&fs<=41.4){
    	fengSu_text = "13级";
    } else if (fs >=41.5&&fs<=46.1){
    	fengSu_text = "14级";
    }else if (fs >=46.2&&fs<=50.9){
    	fengSu_text = "15级";
    }else if (fs >=51.0&&fs<=56.0){
    	fengSu_text = "16级";
    }else if (fs >=56.1){
    	fengSu_text = "17级";
    } else {
    	fengSu_text = "-";
    }

    return fengSu_text;
}
/**
 * 获取天气现象
 * **/
 function getWeatherNameForNum(key){
	key = key + "";
	switch (key) {
	case "00":
		return "晴";
	case "01":
		return "多云";
	case "02":
		return "阴";
	case "03":
		return "阵雨";
	case "04":
		return "雷阵雨";
	case "05":
		return "雷阵雨伴有冰雹";
	case "06":
		return "雨夹雪";
	case "07":
		return "小雨";
	case "08":
		return "中雨";
	case "09":
		return "大雨";
	case "10":
		return "暴雨";
	case "11":
		return "大暴雨";
	case "12":
		return "特大暴雨";
	case "13":
		return "阵雪";
	case "14":
		return "小雪";
	case "15":
		return "中雪";
	case "16":
		return "大雪";
	case "17":
		return "暴雪";
	case "18":
		return "雾";
	case "19":
		return "冻雨";
	case "20":
		return "沙尘暴";
	case "21":
		return "小到中雨";
	case "22":
		return "中到大雨";
	case "23":
		return "大到暴雨";
	case "24":
		return "暴雨到大暴雨";
	case "25":
		return "大暴雨到特大暴雨";
	case "26":
		return "小到中雪";
	case "27":
		return "中到大雪";
	case "28":
		return "大到暴雪";
	case "29":
		return "浮尘";
	case "30":
		return "扬沙";
	case "31":
		return "强沙尘暴";
	case "53":
		return "霾";
	case "99":
		return "无";
	case "32":
		return "浓雾";
	case "49":
		return "强浓雾";
	case "54":
		return "中度霾";
	case "55":
		return "重度霾";
	case "56":
		return "严重霾";
	case "57":
		return "大雾";
	case "58":
		return "特强浓雾";
	case "301":
		return "雨";
	case "302":
		return "雪";
	default:
		return "-";
	}
}
/**
 * 获取文字风向
 * */
 function getfengXingForDuShu(fx) {
    if (fx == null || fx == "") {
        return "—";
    }
    var fengXiang_text = "—";
 //   var fengNum = parseFloat(fx)%360;
    var fengNum = parseFloat(fx);
    if (fengNum == 0) {
        fengXiang_text = "北风";
    } else if (fengNum == 90) {
        fengXiang_text = "东风";
    } else if (fengNum == 180) {
        fengXiang_text = "南风";
    } else if (fengNum == 270) {
        fengXiang_text = "西风";
    } else if (fengNum > 0 && fengNum < 90) {
        fengXiang_text = "东北风";
    } else if (fengNum > 90 && fengNum < 180) {
        fengXiang_text = "东南风";
    } else if (fengNum > 180 && fengNum < 270) {
        fengXiang_text = "西南风";
    } else if (fengNum > 270 && fengNum < 360) {
        fengXiang_text = "西北风";
    } else if (fengNum == 360) {
        fengXiang_text = "北风";
    } else {
        fengXiang_text = "静风";
    }

    return fengXiang_text;
}
/***
 * 风向
 * */
 function getWindTypeForNum(key){
	key = key + "";
	switch (key) {
	case "0":
		return "无持续风向";
	case "1":
		return "东北风";
	case "2":
		return "东风";
	case "3":
		return "东南风";
	case "4":
		return "南风";
	case "5":
		return "西南风";
	case "6":
		return "西风";
	case "7":
		return "西北风";
	case "8":
		return "北风";
	case "9":
		return "旋转风";

	default:
		return "-";
	}
}
/**
 * 风力
 * **/
 function getWindLevelForNum(key){
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