/**
 * Created by DELL on 2019/4/22.
 */
function GetTianQi(skycon){
    var weaState;
    switch(skycon){
        case "CLEAR_DAY":
            weaState = "晴";
            break;
        case "CLEAR_NIGHT":
            weaState = "晴";
            break;
        case "PARTLY_CLOUDY_DAY":
            weaState = "多云";
            break;
        case "PARTLY_CLOUDY_NIGHT":
            weaState = "多云";
            break;
        case "CLOUDY":
            weaState = "阴";
            break;
        case "CLOUDY_NIGHT":
            weaState = "阴";
            break;
        case "RAIN":
            weaState = "雨";
            break;
        case "SNOW":
            weaState = "雪";
            break;
        case "SNOW_NIGHT":
            weaState = "雪";
            break;
        case "WIND":
            weaState = "大风";
            break;
        case "FOG":
            weaState = "雾";
            break;
        case "HAZE":
            weaState = "雾霾";
            break;
    }
    return weaState;
}

//判断空气质量
function GetLevel(aqi){
    var aqicolorArr = ["#72B962","#E1C556","#E7855C","#BF5056","#A34874"];
    var LEVELS = ['优', '良', '轻度', '中度', '重度', '无'];
    var leve_index = aqi < 50 ? 0 : aqi < 100 ? 1 : aqi < 150 ? 2 : aqi < 200 ? 3 : 4;
    var level = LEVELS[leve_index],
        color = aqicolorArr[leve_index];
    return {"level":level,"color":color};
}