/**
 * Created by DELL on 2019/4/22.
 */

/**
 * 预报折线图
 * 
 * @param demoId
 * @param chartData
 * @param xData
 * @param lineColor
 * @param position
 * @param circularColor
 * @returns
 */
function createWDLine(demoId, chartData, xData, lineColor, position,
		circularColor) {
	var myChart = echarts.init(document.getElementById(demoId));
	option = {
		calcubale : false,
		animation : true,
		xAxis : {
			show : false,
			data : xData,
			type : "category",
			splitLine : false,
			axisLabel : false,
			splitArea : false,
			axisLine : false,
			axisTick : false,
		},
		grid : {
			left : '0',
			right : '0',
		},
		yAxis : {
			splitLine : false,
			scale : false,
			allowDecimals : false,
			minInterval:0.1,
			splitNumber : "4",
			min : function(value) {
				return value.min - 0.1;
			},
			max : function(value) {
				return value.max + 0.1;
			},
			type : "value",
			show : false,
			boundaryGap : false,
			splitArea : false,
			axisLine : false,
			axisTick : false,
		},
		series : [ {
			data : chartData,
			itemStyle : {
				normal : {
					color : "#ffffff",
					borderColor : circularColor,
					borderWidth : 1.5,
				}
			},
			label : {
				normal : {
					show : true,
					position : position,
					color : '#000000',
					fontSize : 16,
					formatter : function(p) {
						return p.value + "°";
					}
				}
			},
			symbol : 'circle',
			symbolSize : 6,
			smooth : true,
			lineStyle : {
				normal : {
					color : lineColor,
					width : 1.5,
					type : 'solid'
				}
			},
			type : 'line'
		} ],
		animation: false
	};
	myChart.setOption(option);
}
/**
 * 逐小时预报
 * @param demoId
 * @param chartData
 * @param xData
 * @param tqstate
 * @returns
 */
function createHourLine(demoId, chartData, xData,tqstate) {
	
	var myChart = echarts.init(document.getElementById(demoId));
	option = {
//		backgroundColor : "rgba(246,246,246,0.20)", // 设置整体图表的背景颜色
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow',
				shadowStyle : {
					color : 'rgba(0,74,255,0.05)',
				},
			},
			backgroundColor : "rgba(255,255,255,0.8)", // 设置背景图片 rgba格式
			color : "#333333",
			fontSize : 14,
			borderWidth : "1", // 边框宽度设置1
			borderColor : "rgba(0,0,0,0.05)", // 设置边框颜色
			textStyle : {
				color : "#333333", // 设置文字颜色
				fontSize : 14,
			},
			padding : [ 2, 10 ], // 内边距
			extraCssText : 'box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.05);border-radius: 2px', // 添加阴影
//			position : function position(point, params, dom, rect, size) {
//				// 固定在顶部
//				return [ point[0], point[1] - size.contentSize[0] ];
//			},
			position: 'top',
			
			formatter : function(params) {
				var index = params[0]["dataIndex"]
				return Math.round(params[0].value) + "° " + tqstate[index];

			}
		},
		grid : {
			left : '0',
			right : '0',
			top : '10px',
			bottom : '20',
			borderColor : "transparent",
			backgroundColor : 'rgba(246,246,246,0.50)',
		},
		xAxis : {

			type : 'category',
			data : xData,
			splitLine : {
				show : false
			},
			// 去掉刻度线
			axisLine : {
				show : false
			},
			// 去掉刻度
			axisTick : {
				show : false,
				alignWithLabel : true,
			},
			axisLabel : {
				textStyle : {
					color : 'rgba(51,51,51,0.80)',
					fontSize : 12,

				}
			},
		},
		yAxis : {
			show : false,
			type : 'value',
			min : function(value) {
				return value.min-3;
			},
			max : function(value) {
				return value.max+3;
			},
			interval : function(value) {
				return Math.ceil((value.max+3) / 2);
			},
			splitLine : {
				show : false
			},
			// 去掉刻度线
			axisLine : {
				show : false
			},
			// 去掉刻度
			axisTick : {
				show : false,
				alignWithLabel : true,
			},

			axisLabel : {
				textStyle : {
					color : 'rgba(51,51,51,0.80)',
					fontSize : 12,

				},
				formatter : '{value}°',

			},

		},
		series : [ {
			data : chartData,
			itemStyle : {
				normal : {
					color : "#4EB5F9",
					borderColor : "#4EB5F9",
					borderWidth : 0,
				}
			},
			// label : {
			// normal : {
			// show : true,
			// position : "top",
			// color : '#000000',
			// fontSize : 14,
			// formatter : function(p) {
			// return p.value + "°";
			// }
			// }
			// },
			symbol : 'none',
			symbolSize : 1.5,
			// 让曲线更加圆滑
			smooth : true,
			lineStyle : {
				normal : {
					color : "#4EB5F9",
					width : 2,
					type : 'solid'
				}
			},
			type : 'line',
			markLine: {
		        data: [
		          { type: 'max', name: 'Max' },
		          { type: 'min', name: 'Min' },
		        ],
		        silent: true, // true 不响应⿏标事件
		        symbol: "none", // 相当于["none", "none"] [虚线，没有箭头]
		        lineStyle: {
		        	width:0, // 0 的时候可以隐藏线
		         },
		         label: {
		        	 show: true, // 是否展⽰⽂字 
		        	 position: 'top',
		 			 textStyle: {
		 				color: 'rgba(51,51,51,0.80)', //更改坐标轴文字颜色
		 				fontSize: 12 //更改坐标轴文字大小
		 			}
		         }
		      }
		} ]

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
