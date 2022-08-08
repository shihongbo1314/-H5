/**
 * Created by DELL on 2019/4/22.
 */
function Getfengxiang(fx1) {
    var fx3 = "";
    if (fx1 > 0 && fx1 < 11.25) {
        fx3 = "北风";
    }
    else if (fx1 > 11.26 && fx1 < 33.75) {
        fx3 = "东北风";
    }
    else if (fx1 > 33.76 && fx1 < 56.25) {
        fx3 = "东北风";
    }
    else if (fx1 > 56.26 && fx1 < 78.75) {
        fx3 = "东北风";
    }
    else if (fx1 > 78.76 && fx1 < 101.25) {
        fx3 = "东风";
    }
    else if (fx1 > 101.25 && fx1 < 123.75) {
        fx3 = "东南风";
    }
    else if (fx1 > 123.76 && fx1 < 146.25) {
        fx3 = "东南风";
    }
    else if (fx1 > 146.26 && fx1 < 168.75) {
        fx3 = "东南风";
    }
    else if (fx1 > 168.76 && fx1 < 191.25) {
        fx3 = "南风";
    }
    else if (fx1 > 191.26 && fx1 < 213.75) {
        fx3 = "西南风";
    }
    else if (fx1 > 213.76 && fx1 < 236.25) {
        fx3 = "西南风";
    }
    else if (fx1 > 236.26 && fx1 < 258.75) {
        fx3 = "西南风";
    }
    else if (fx1 > 258.76 && fx1 < 281.25) {
        fx3 = "西风";
    }
    else if (fx1 > 281.76 && fx1 < 303.75) {
        fx3 = "西北风";
    }
    else if (fx1 > 303.76 && fx1 < 326.25) {
        fx3 = "西北风";
    }
    else if (fx1 > 326.26 && fx1 < 348.75) {
        fx3 = "西北风";
    }
    else { fx3 = "北风"; }

    return fx3;
}

function Getfengsu(fs1) {

    var fs3 = "", fj;
    if (fs1 > 0 && fs1 < 0.2) {
        fs3 = "无风";
        fj = 0;
    }
    else if (fs1 > 0.3 && fs1 < 1.5) {
        fs3 = "软风";
        fj = 1;
    }
    else if (fs1 > 1.6 && fs1 < 3.3) {
        fs3 = "轻风";
        fj = 2;
    }
    else if (fs1 > 3.4 && fs1 < 5.4) {
        fs3 = "微风";
        fj = 3;
    }
    else if (fs1 > 5.5 && fs1 < 7.9) {
        fs3 = "和风";
        fj = 4;
    }
    else if (fs1 > 8.0 && fs1 < 10.7) {
        fs3 = "轻劲风";
        fj = 5;
    }
    else if (fs1 > 10.8 && fs1 < 13.8) {
        fs3 = "强风";
        fj = 6;
    }
    else if (fs1 > 13.9 && fs1 < 17.1) {
        fs3 = "疾风";
        fj = 7;
    }
    else if (fs1 > 17.2 && fs1 < 20.7) {
        fs3 = "大风";
        fj = 8;
    }
    else if (fs1 > 20.8 && fs1 < 24.4) {
        fs3 = "烈风";
        fj = 9;
    }
    else if (fs1 > 24.5 && fs1 < 28.4) {
        fs3 = "狂风";
        fj = 10;
    }
    else if (fs1 > 28.5 && fs1 < 32.6) {
        fs3 = "暴风";
        fj = 11;
    }
    else if (fs1 > 32.7 && fs1 < 36.9) {
        fs3 = "台风";
        fj = 12;
    }
    else { fs3 = "微风"; fj = 3; }
    return { "name": fs3, "value": fj };
}



function Getfengsu_cy(fs1) {
    var fs3 = "", fj;
    if (fs1 > 0 && fs1 < 2) {
        fs3 = "无风";
        fj = 1;
    }
    else if (fs1 > 2 && fs1 < 6) {
        fs3 = "微风";
        fj = 1;
    }
    else if (fs1 > 6 && fs1 < 12) {
        fs3 = "微风";
        fj = 2;
    }
    else if (fs1 > 12 && fs1 < 19) {
        fs3 = "和风";
        fj = 3;
    }
    else if (fs1 > 19 && fs1 < 30) {
        fs3 = "和风";
        fj = 4;
    }
    else if (fs1 > 30 && fs1 < 40) {
        fs3 = "轻风";
        fj = 5;
    }
    else if (fs1 > 40 && fs1 < 51) {
        fs3 = "强风";
        fj = 6;
    }
    else if (fs1 > 51 && fs1 < 62) {
        fs3 = "疾风";
        fj = 7;
    }
    else if (fs1 > 62 && fs1 < 75) {
        fs3 = "大风";
        fj = 8;
    }
    else if (fs1 > 75 && fs1 < 87) {
        fs3 = "烈风";
        fj = 9;
    }
    else if (fs1 > 87 && fs1 < 103) {
        fs3 = "狂风";
        fj = 10;
    }
    else if (fs1 > 103 && fs1 < 117) {
        fs3 = "暴风";
        fj = 11;
    }
    else if (fs1 > 117 && fs1 < 132) {
        fs3 = "飓风";
        fj = 12;
    }
    else if (fs1 > 132 && fs1 < 149) {
        fs3 = "台风";
        fj = 12;
    }
    else if (fs1 > 149 && fs1 < 166) {
        fs3 = "强台风";
        fj = 12;
    }
    else if (fs1 > 166 && fs1 < 183) {
        fs3 = "强台风";
        fj = 12;
    }
    else if (fs1 > 183 && fs1 < 201) {
        fs3 = "超强台风";
        fj = 12;
    }
    else if (fs1 > 201 && fs1 < 220) {
        fs3 = "超强台风";
        fj = 12;
    }
    else { fs3 = "微风"; fj = 3; }
    return { "name": fs3, "value": fj };
}