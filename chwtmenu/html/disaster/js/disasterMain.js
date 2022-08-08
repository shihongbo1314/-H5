var baseObj={};
$(function(){
	mapConsole.init();
	timeLineConsole.init();
	changGuiQiXiangZaiHai.init();
	$("#controlBtn>#liveMap").click(function(){
		$("#disChart1").show();
		changGuiQiXiangZaiHai.myChart.resize();
	})
})