const COLOR1 = '#274c63';
const COLOR2 = '#008FFB';

// real time line chart 설정
var data1 = [];
var data2 = [];
var lastDate = 0; // X축 마지막 라벨 (시간)
const TICKINTERVAL = 1000; // 데이터 간의 시간 간격 (ms)
const XAXISNUMBER = 5;
const XAXISRANGE = TICKINTERVAL*XAXISNUMBER; // X축의 범위를 나타내는 변수 = X축에 라벨을 몇개까지 보여줄거냐 (ms) ex : 1000*n=5000, n=5개

// realtime content load stack
var parentHeight = 0;
var scrollDiv = null;

// radial chart config
const RADIAL_OFFSETY = -5;
const RADIAL_HEIGHT = 200;

$(function() {

	setInterval(function() {
	    var randomTop = Math.floor(Math.random() * 80); // 0부터 100까지의 랜덤한 숫자 생성
	    let randomTop2 = Math.floor(Math.random() * 21) + 25;
	    var rand = Math.floor(Math.random() * 4) + 1;
	    var $content = $('<p class="content unoptimized type' + rand + '">●</p>'); // 새로운 엘리먼트 생성
	    $('#top-animation').append($content); // 엘리먼트를 body에 추가
	    $content.css('top', randomTop + '%'); // 랜덤한 top 좌표 적용

	    // 좌측에서 중앙으로 이동하는 애니메이션 (Easing 효과 추가)
	    $content.animate({
	        left: '50%',
	        top: randomTop2+"%"
	    }, {
	        duration: 5000, // 중앙까지 이동하는 애니메이션 지속 시간
	        easing: 'easeInOutQuad', // Easing 효과 (선택적)
	        complete: function() {
	        	let cnt = parseInt($(`#cylinder .type0${rand} .value`).text());
	        	cnt += 1;
	        	const cylinderCnt = $(`#cylinder .type0${rand} li`).length;
	        	if(cnt/10 > cylinderCnt){
	        		const $newCylinder = $(`<li style="width:1px;"><img src="/resources/img/cylinder-type0${rand}.png" style="width:1px; height:70px;"  /></li>`);
	        		$(`#cylinder .type0${rand} ul`).append($newCylinder);
	        		$newCylinder.animate({"width":"10px"});
	        		$newCylinder.find("img").animate({"width":"45px"});
	        	}
	        	$(`#cylinder .type0${rand} .value`).text(cnt);
	            $(this).removeClass('unoptimized').addClass('optimized'); // 클래스 변경
	            $(this).animate({
	                left: '100%', // 우측 끝으로 이동
	                top: randomTop+"%"
	            }, {
	                duration: 2000, // 우측 끝까지 이동하는 애니메이션 지속 시간
	                easing: 'easeInOutQuad', // Easing 효과 (선택적)
	                complete: function() {
	                    $(this).remove(); // 애니메이션 종료 후 엘리먼트 삭제
	                }
	            });
	        }
	    });
	}, 200); // 0.1초(100ms) 간격으로 실행

	animateCylinder();

	// 트리맵 차트
	drawTreemapChart();	
	
	// 실시간 라인 차트
	drawRealTimeLineChart(); 
	drawTodayLineChart();
	
	// 레디얼 차트
	drawRadialChart01();
	drawRadialChart02();
	animateNumber("#radial-chart01-value span", 0, 67, 1000, `%`);
	animateNumber("#radial-chart02-value span", 0, 80, 1000, `%`);
	
	// 파이 차트
	drawPieChart01();
	
	// 믹스 차트
	drawMixedChart();
	
	// 바차트
	// drawBarChart01();

	setTimeout(function(){
		parentHeight = $("#table-outer").height()-15;
		containerHeightResize();
		// scrollDiv = new SimpleBar($('#table-inner')[0]);
		// console.log(scrollDiv);
		// scrollDiv.getScrollElement().scrollTop = 1000;
	},500);
	
	$(window).resize(function() {
		containerHeightResize();
	});	
	
})

/** 테이블 높이 리사이징 */
function containerHeightResize(){
	parentHeight = $("#table-outer").height()-15;
	// console.log(parentHeight);
	$("#table-inner").css({"height":parentHeight+"px"});
}

/** 실린더 애니메이션 */
function animateCylinder() {
	// 좌우로 왔다갔다하는 애니메이션
	$('#cylinder').animate({
		left: '49%' // 45%로 이동
	}, {
		duration: 1000, // 애니메이션 지속 시간 (1초)
		easing: 'swing', // 부드러운 움직임을 위한 Easing 효과
		complete: function() {
			// 45%로 이동한 후, 55%로 이동하는 애니메이션 호출
			$('#cylinder').animate({
				left: '51%' // 55%로 이동
			}, {
				duration: 1000, // 애니메이션 지속 시간 (1초)
				easing: 'swing', // 부드러운 움직임을 위한 Easing 효과
				complete: animateCylinder // 애니메이션 종료 후 다시 함수 호출하여 반복
			});
		}
	});
}

/** 슬롯머신같은 숫자 애니메이션 */
function animateNumber(element, from, to, duration, suffix) {
	$({
		value : from
	}).animate({
		value : to
	}, {
		duration : duration,
		easing : 'swing',
		step : function() {
			$(element).html(this.value.toFixed(0) + suffix);
		}
	});
}

/** 오늘의 속도 차트 */
function drawTodayLineChart (selector){
	let currentDate = new Date();
	let currentHour = currentDate.getHours();	
	let array1 = randArray(25);
	let array2 = [];
	let sirArray = []; // sir : speed improvement rate
	let rand = Math.random() * (0.9 - 0.3) + 0.3;
	for(let i = 0; i < array1.length; i++){
		array2.push(Math.floor(array1[i]*rand));
		let sir = Math.floor((array1[i]-array2[i])/array1[i]*100);
		if (isNaN(sir)) {
			sir = 0;
		}
		sirArray.push(sir);
	}

	// 속도 향상율 = (이전 용량 - 새로운 용량) / 이전 용량 * 100%
	
	let options = {
		series: [
			{
				name: '최적화 전',
				data: array1,
			},
			{
				name: '최적화 후',
				data: array2,
			}
			],
		chart: {
			toolbar: {
				show: false, // 이 부분에서 toolbar 설정
				offsetY: '-20',
				offsetX: '7',
				tools: {
					download: false
				}
			},		    	
			type: 'area',
			height: '100%',
			offsetX: -5,
			offsetY: 5,

		},
		colors: [COLOR1, COLOR2],
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth'
		},
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 0.6,
				opacityTo: 0.8,
			}
		},
		legend: {
			show: false,
		},
		annotations: {
			xaxis: [{
				x: currentHour,
				borderColor: '#999',
				yAxisIndex: 0,
				label: {
					show: true,
					text: '현재',
					style: {
						color: "#fff",
						background: '#008FFB'
					}
				}
			}]
		},		    
		xaxis: {
			categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],

		},
		yaxis: {
			min: 0,
			max: 100,
			tickAmount: 1
		},
		tooltip: {
			theme: 'dark',
			custom: function({series, seriesIndex, dataPointIndex, w}) {
		        const series1Value = series[0][dataPointIndex];
		        const series2Value = series[1][dataPointIndex];
		        const difference = series1Value - series2Value;
		        const percentageDifference = ((difference / series1Value) * 100).toFixed(0);
		        let html = `<div class="apexcharts-tooltip-custom">로딩 속도 <strong style="color:var(--color-light-blue) !important;">${percentageDifference}%<ion-icon name="caret-up-outline" style="color:var(--color-light-blue) !important;"></ion-icon></strong> 향상</div>`;
		        if (isNaN(percentageDifference)) {
		        	html = `<div class="apexcharts-tooltip-custom" style="color:var(--color-opacity50);">측정 중</div>`;
		        }
		        return html;
		    }				
		},		
	};

	let chart = new ApexCharts(document.querySelector("#temp-chart02"), options);
	chart.render();	
}

function randArray(length) {
	let array = [];
	let currentDate = new Date();
	let currentHour = currentDate.getHours();

	for (let i = 0; i < length; i++) {
		let yvalue = Math.floor(Math.random() * 100); 
		if(i >= currentHour){
			yvalue = 0;
		}
		array.push(yvalue); 
	}
	// console.table(array);

	return array;
}

function drawRealTimeLineChart(){
	let options = {
		series: [
			{
				name : '최적화 전',
				data: data1.slice()
			},
			{
				name : '최적화 후',
				data: data2.slice()
			},
		],
		chart: {
			id: 'realtime',
			height: '100%',
			offsetY: 0,
			offsetX: -5,
			type: 'area',
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: TICKINTERVAL
				}
			},
			toolbar: {
				show: false,
				offsetY: '-20',
				tools: {
					download: false
				}
			},
			zoom: {
				enabled: false
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth'
		},
		markers: {
			size: 0
		},
		xaxis: {
			type: 'datetime',
			range: XAXISRANGE,
			labels: {
	            datetimeFormatter: {
	                hour: 'HH',
	                minute: 'mm',
	                second: 'ss'
	            },
	            formatter: function(val) {
	                const timeString = new Date(val).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
	                // 오전/오후 표시를 제거하기 위해 AM/PM을 제거합니다.
	                return timeString.replace(/(오전|오후)/, '');
	            }
	        }		
		},
		yaxis: {
			max: 100,
			tickAmount: 1
		},
		legend: {
			show: false
		},
		colors: [COLOR1, COLOR2],
		tooltip: {
			theme: 'dark',
		    /*x: {
		            formatter: function(val) {
		                // val은 x축의 값이고, 일반적으로 timestamp 형식입니다.
		                // 시:분:초 형식으로 변환하여 반환합니다.
		                return new Date(val).toLocaleTimeString();
		            }
		     }*/
			custom: function({series, seriesIndex, dataPointIndex, w}) {
		        const series1Value = series[0][dataPointIndex];
		        const series2Value = series[1][dataPointIndex];
		        const difference = series1Value - series2Value;
		        const percentageDifference = ((difference / series1Value) * 100).toFixed(0);
		        let html = `<div class="apexcharts-tooltip-custom">로딩 속도 <strong style="color:var(--color-light-blue) !important;">${percentageDifference}%<ion-icon name="caret-up-outline" style="color:var(--color-light-blue) !important;"></ion-icon></strong> 향상</div>`;
		        if (isNaN(percentageDifference)) {
		        	html = `<div class="apexcharts-tooltip-custom" style="color:var(--color-opacity50);">측정 중</div>`;
		        }
		        return html;
		    }				
		},		
	};

	let chart = new ApexCharts(document.querySelector("#temp-chart01"), options);
	chart.render();

	window.setInterval(function () {
		getNewSeries(lastDate, {
			min: 10,
			max: 90
		})

		chart.updateSeries([
			{data: data1},
			{data: data2},
		])
	}, TICKINTERVAL)
}

//초기 데이터 생성
function getDayWiseTimeSeries(baseval, count, yrange) { 
    var i = 0;
    while (i < count) {
        var x = baseval;
        let rand = Math.random() * 0.7 + 0.1;
        var y1 = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        
        var y2 = Math.floor(y1*rand);

        data1.push({x: x, y: y1}); // 데이터1에 대한 x, y 값 추가
        data2.push({x: x, y: y2}); // 데이터2에 대한 x, y 값 추가
        lastDate = baseval;
        baseval += TICKINTERVAL;
        i++;
    }
}

getDayWiseTimeSeries(new Date().getTime()-(TICKINTERVAL*XAXISNUMBER), 10, {
	min: 10,
	max: 90
})


function getNewSeries(baseval, yrange) { // baseval = lastDate
	var newDate = baseval + TICKINTERVAL; // TICKINTERVAL : 데이터 간격
	lastDate = newDate

	for(var i = 0; i< data1.length - 10; i++) {
		// IMPORTANT
		// we reset the x and y of the data which is out of drawing area
		// to prevent memory leaks
		data1[i].x = newDate - XAXISRANGE - TICKINTERVAL
		data1[i].y = 0
	}
	
	for(var i = 0; i< data2.length - 10; i++) {
		// IMPORTANT
		// we reset the x and y of the data which is out of drawing area
		// to prevent memory leaks
		data2[i].x = newDate - XAXISRANGE - TICKINTERVAL
		data2[i].y = 0
	}
	let rand = Math.random() * 0.7 + 0.1;
	let y1 = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
	let y2 = Math.floor(y1*rand);
	
	data1.push({
		x: newDate,
		y: y1
	})
	data2.push({
		x: newDate,
		y: y2
	})
}

function resetData(){
	// Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
	data1 = data1.slice(data1.length - 10, data1.length);
	data2 = data2.slice(data2.length - 10, data2.length);
}

function drawMixedChart() {
	let options = {
			series: [{
				name: '최적화 전',
				type: 'column',
				data: [100, 70, 50, 50],
				yaxis: "optimize",
				dataLabels: {
		            enabled: true,
		            formatter: function(val) {
		                return val+"GB";
		            }
		        }				
			}, {
				name: '최적화 후',
				type: 'column',
				data: [50, 30, 20, 20],
				yaxis: "optimize"
			}, {
				name: '속도 향상률',
				type: 'line',
				data: [50, 58, 60, 60],
				yaxis: "speed"
			}],
			chart: {
				width: '100%',
				height:  '100%',
				type: 'line',
				stacked: false,
				toolbar: { 
					show: false,
					offsetY: '-20',
					offsetX: -10,
					tools: {
						download: false
					}
				},
				marginTop: 40
			},
			dataLabels: {
				  enabled: true,
				  textAnchor: 'start',
				  /*formatter: function(val, opt) {
					  //console.log(opt.w.globals);
					  console.log(opt.w.globals);
				  //return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
					  return val+"GB";
				  },*/
				  formatter: function(value, { seriesIndex, dataPointIndex, w }) {
					  let result = "";
					  if(seriesIndex < 2){
						  result = value+"GB";
					  }else{
						  result = value+"% ▲";
					  }
					  // return w.config.series[seriesIndex].name + ":  " + value+" / "+seriesIndex
					  return result;
				}				  
			},			
			stroke: {
				width: [1, 1, 4]
			},
			xaxis: {
				categories: ["이미지", "동영상", " 텍스트", "폰트"],
			},
			yaxis: [
				{	
					show:false,
					axisTicks: { show: true },
					axisBorder: { show: true, color: '#ced4dc' },
					labels: { style: { colors: '#ced4dc' } },
					title: { text: "웹 콘텐츠 용량 비교", style: { color: '#ced4dc' } },
					tooltip: { enabled: true },
					min: 0,
					max: 100,
				},
				{
					show:false,
					opposite: true,
					axisTicks: { show: true },
					axisBorder: { show: true, color: '#008ffb' },
					labels: { style: { colors: '#008ffb' } },
					title: { text: "Operating Cashflow (thousand crores)", style: { color: '#008ffb' } },
					min: 0,
					max: 100,
					offsetX: 10
				},
				{
					show: false,
					opposite: true,
					axisTicks: { show: true, },
					axisBorder: { show: true, color: '#FEB019' },
					labels: { style: { colors: '#FEB019' }, offsetX:-10 },
					title: { text: "속도 향상률", style: { color: '#FEB019' },},
					min: 0,
					max: 100,
					offsetX: 10
				}],
			tooltip: {
				theme: 'dark',
			    y:{
				    formatter: function(val, opt) {
				        const seriesIndex = opt.seriesIndex;
				        const value = val;
				        let result = "";
				        if (seriesIndex < 2) {
				            result = value + "GB";
				        } else {
				            result = value + "% ▲";
				        }
				        return result;
				    }				    	
			    },
			
					
			},
			legend: {
				show: false
			},
			colors: [COLOR1, COLOR2, '#FEB019'], // 각 시리즈에 대한 색상 지정
	};

	let chart = new ApexCharts(document.querySelector("#mix-chart01"), options);
	chart.render();
}

/** 트리맵 차트 */
function drawTreemapChart() {
    let options = {
        series: [{
            data: [{
                    x: 'intro.mp4',
                    y: 218,
                    id: 'intro.mp4',
                },
                {
                    x: 'mainvisual01.png',
                    y: 149
                },
                {
                    x: 'mainvisual02.png',
                    y: 184
                },
                {
                    x: 'image01.png',
                    y: 55
                },
                {
                    x: 'image02.png',
                    y: 84
                },
                {
                    x: 'image03.png',
                    y: 31
                },
                {
                    x: 'font01.woff',
                    y: 70
                },
                {
                    x: 'font02.woff',
                    y: 30
                },
                {
                    x: 'font03.woff',
                    y: 44
                }
            ]
        }],
        legend: {
            show: false
        },
        chart: {
            height: '100%',
            type: 'treemap',
            toolbar: {
                show: false,
                offsetY: '-20',
                offsetX: '-25',
                tools: {
                    download: false
                }
            },
            zoom: {
                enabled: true
            },
            events: {
            	dataPointSelection: function(event, chartContext, config) {
            		alert("클릭 이벤트!");
                    // 클릭한 데이터 포인트의 인덱스를 통해 원본 데이터에서 해당 데이터 포인트 찾기
                    // console.log(chartContext);
                    // console.log(config.dataPointIndex);
            		/*const index = config.dataPointIndex;
                    $('#table-inner tbody tr').removeClass('active');
                    $(`#table-inner tbody tr:eq(${index})`).addClass('active');    
                    const rowOffset = $(`#table-inner tbody tr:eq(${index})`).offset().top;
                    const scrollTop = rowOffset - $('#table-inner').offset().top;
                    $('#table-inner').stop().animate({"scrollTop":scrollTop});                    
                    */
                    // scrollDiv.getScrollElement().scrollTop = 0;
                }
            }        
        },
        dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px',
            },
            formatter: function(text, op) {
            	//console.log(op);
              return [text, op.value+"MB", '최적화']
            },
            offsetY: -4
          },        
    };

    let chart = new ApexCharts(document.querySelector("#temp-chart04"), options);
    chart.render();
}


function drawRadialChart01 (){
	let options = {
		series: [67],
		chart: {
			height: RADIAL_HEIGHT,
			type: 'radialBar',
			offsetY: RADIAL_OFFSETY
		},
		plotOptions: {
			radialBar: {
				startAngle: -135,
				endAngle: 135,
				dataLabels: {
					name: {
						fontSize: '16px',
						color: undefined,
						offsetY: 120,
						show:false,
					},
					value: {
						offsetY: 5,
						fontSize: '30px',
						color: COLOR2,
						formatter: function (val) {
							return val + `%`;
						},
						show:false
					}
				}
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				shadeIntensity: 0.15,
				inverseColors: false,
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 50, 65, 91]
			},
		},
		stroke: {
			dashArray: 4
		},
		// labels: ['Median Ratio'],
	};

	let chart = new ApexCharts(document.querySelector("#radial-chart01"), options);
	chart.render();

}

function drawRadialChart02 (){
	let options = {
			series: [80],
			chart: {
				height: RADIAL_HEIGHT,
				type: 'radialBar',
				offsetY: RADIAL_OFFSETY
			},
			plotOptions: {
				radialBar: {
					startAngle: -135,
					endAngle: 135,
					dataLabels: {
						name: {
							fontSize: '16px',
							color: undefined,
							offsetY: 120,
							show:false,
						},
						value: {
							offsetY: 76,
							fontSize: '22px',
							color: undefined,
							formatter: function (val) {
								return val + "%";
							},
							show:false,
						}
					}
				}
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					shadeIntensity: 0.15,
					inverseColors: false,
					opacityFrom: 1,
					opacityTo: 1,
					stops: [0, 50, 65, 91]
				},
			},
			stroke: {
				dashArray: 4
			},
			labels: ['Median Ratio'],
	};
	
	let chart = new ApexCharts(document.querySelector("#radial-chart02"), options);
	chart.render();
	
}

function drawPieChart01(){


	let options = {
		series: [40, 30, 15, 15],
		chart: {
			type: 'pie',
			width: 260,
			heigh: 260,
			offsetY: 20,
			offsetX: -15
			
		},
		labels: ["이미지", "동영상", "텍스트", "폰트"],
		theme: {
			monochrome: {
				enabled: true
			}
		},
		plotOptions: {
			pie: {
				dataLabels: {
					offset: -5
				}
			}
		},
		dataLabels: {
			formatter(val, opts) {
				const name = opts.w.globals.labels[opts.seriesIndex]
				return [name, val.toFixed(1) + '%']
			},
			style: {
				colors: ['#fff']
			},
		},
		legend: {
			show: false
		},
	    tooltip: {
	        enabled: true,
	        y: {
	            formatter: function(val) {
	                return val + "%";
	            }
	        }
	    },		
	};

    let chart = new ApexCharts(document.querySelector("#pie-chart01"), options);
    chart.render();
  	
}

function drawBarChart01(){
	let options = {
		series: [{
			data: [44, 55, 41, 64]
		}, {
			data: [53, 32, 33, 52]
		}],
		chart: {
			type: 'bar',
			height: '100%'
		},
		plotOptions: {
			bar: {
				horizontal: true,
				dataLabels: {
					position: 'top',
				},
			}
		},
		dataLabels: {
			enabled: true,
			offsetX: -6,
			style: {
				fontSize: '12px',
				colors: ['#fff']
			}
		},
		tooltip: {
			shared: true,
			intersect: false
		},
		xaxis: {
			categories: ['이미지', '동영상', '텍스트', '폰트'],
		},
		colors: [COLOR1, COLOR2], 
		legend: {
			show: false
		},		
	};

	let chart = new ApexCharts(document.querySelector("#bar-chart01"), options);
	chart.render();


      	
}