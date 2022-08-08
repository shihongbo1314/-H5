function add0(n) {
    return n < 10 ? '0' + n : '' + n
}

const second = 1000
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour

function parseTime(D, format = 'yyyy-MM-dd hh:mm') {
    const year = D.getFullYear()
    const month = D.getMonth() + 1
    const date = D.getDate()
    const hours = D.getHours()
    const minutes = D.getMinutes()
    const seconds = D.getSeconds()
    let str = format
    function replace(tpl, val) {
        if (new RegExp(tpl).test(str)) {
            str = str.replace(tpl, val)
        }
    }
    replace('yyyy', year)
    replace('MM', add0(month))
    replace('M', month)
    replace('dd', add0(date))
    replace('d', date)
    replace('hh', add0(hours))
    replace('h', hours)
    replace('HH', add0(hours))
    replace('H', hours)
    replace('mm', add0(minutes))
    replace('m', minutes)
    replace('ss', add0(seconds))
    replace('s', seconds)
    return str
}
function FungetdateTime(count) {
    var dd = new Date();
    dd.setDate(dd.getDate() + count);//获取count天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    var weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
    let T = weeks[new Date(y + '/' + '/' + m + '/' + d).getDay()]
    return d + '/' + T
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
function FungetdateTimeDay(count) {
    var dd = new Date();
    dd.setDate(dd.getDate() + count);//获取count天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    return y + '' + m + '' + d
}
function FungetdateTimeTenDay(count) {
    var dd = new Date();
    dd.setDate(dd.getDate() + count);//获取count天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    return m + '/' + d
}
function shiyidu(count) {
    switch (count) {
        case '3':
            return '不适宜'
            break;
        case '2':
            return '较适宜'
            break;
        case '1':
            return '适宜'
            break;
        default:
            break;
    }
}
