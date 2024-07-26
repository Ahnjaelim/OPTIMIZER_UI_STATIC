const COLOR1 = '#274c63';
const COLOR2 = '#008FFB';

// real time line chart 설정
var data1 = [];
var data2 = [];
var lastDate = 0; // X축 마지막 라벨 (시간)
var TICKINTERVAL = 5000; // 데이터 간의 시간 간격 (ms) 60*60*24*1000 = 86400000
var XAXISRANGE = 25000; // X축의 범위를 나타내는 변수 = X축에 몇개까지 보여줄거냐 (ms) 현재는 9일로 설정됨 86400000*9 = 777600000

// realtime content load stack
var parentHeight = 0;

$(function() {

	// 실시간 라인 차트
	var realTimeLineChart = drawRealTimeLineChart(); 

	addContent();
	addContent();
	addContent();
	addContent();
	setInterval(function() {
		addContent();
	}, 3000); // 3초(3000밀리초)마다 호출

	drawTempChart01("#temp-chart02");

	drawMixedChart();

	drawTreemapChart();

	setInterval(function() {
		var randomTop = Math.floor(Math.random() * 90); // 0부터 100까지의 랜덤한 숫자 생성
		let rand = Math.floor(Math.random() * 4) + 1;
		var $content = $(`<p class="content type${rand}">●</p>`); // 새로운 엘리먼트 생성
		$('#top-animation').append($content); // 엘리먼트를 body에 추가
		$content.css('top', randomTop + '%'); // 랜덤한 top 좌표 적용

		// 좌측에서 우측으로 이동하는 애니메이션 (Easing 효과 추가)
		$content.animate({
			left: '100%' // 우측 끝으로 이동
		}, {
			duration: 1000, // 애니메이션 지속 시간
			easing: 'easeInOutQuad', // Easing 효과
			complete: function() {
				$(this).remove(); // 애니메이션 종료 후 엘리먼트 삭제
			}
		});
	}, 100); // 0.5초(500ms) 간격으로 실행

	animateCylinder();
	
	setTimeout(function(){
		parentHeight = $("#content-load-stack-outer").height();
		containerHeightResize();
	},500);
	
	$(window).resize(function() {
		containerHeightResize();
	});
})

function containerHeightResize(){
	parentHeight = $("#content-load-stack-outer").height();
	// console.log(parentHeight);
	$("#content-load-stack-inner").css({"height":parentHeight+"px"});
}

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

function selectDashbordData(data) {
	let result = "";
	$.ajax({
		type : 'GET',
		url : '/selectDashbordData',
		data : {},
		async : false,
		success : function(res) {
			result = res;
		},
		error : function onError(error) {
			console.error(error);
		}
	});
	return result;
}

//슬롯 머신처럼 숫자를 올리는 함수
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

function drawTempChart01 (selector){
	let currentDate = new Date();
	let currentHour = currentDate.getHours();	
	let array1 = randArray(24);
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
				show: true, // 이 부분에서 toolbar 설정
				offsetY: '-20',
				offsetX: '7',
				tools: {
					download: false
				}
			},		    	
			type: 'area',
			height: '100%',


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
			theme: 'dark'
		},		
	};

	let chart = new ApexCharts(document.querySelector(selector), options);
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
			type: 'area',
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: 1000
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
			theme: 'dark'
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
	}, 1000)
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

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
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
				yaxis: "optimize"
			}, {
				name: '최적화 후',
				type: 'column',
				data: [50, 30, 20, 20],
				yaxis: "optimize"
			}, {
				name: '속도 향상률',
				type: 'line',
				data: [20, 80, 37, 36],
				yaxis: "speed"
			}],
			chart: {
				height:  '100%',
				type: 'line',
				stacked: false,
				toolbar: { 
					show: true,
					offsetY: '-20',
					offsetX: '7',
					tools: {
						download: false
					}
				},
				marginTop: 40
			},
			dataLabels: {
				enabled: true,
				enabledOnseries: [0]
			},
			stroke: {
				width: [1, 1, 4]
			},
			xaxis: {
				categories: ["이미지", "동영상", " 텍스트", "폰트"],
			},
			yaxis: [{
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
				theme: 'dark'
			},
			legend: {
				show: false
			},
			colors: [COLOR1, COLOR2, '#FEB019'], // 각 시리즈에 대한 색상 지정
	};

	let chart = new ApexCharts(document.querySelector("#temp-chart03"), options);
	chart.render();
}



function drawTreemapChart(){
	let options = {
			series: [
				{
					data: [
						{
							x: 'intro.mp4',
							y: 218
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
				}
				],
				legend: {
					show: false
				},
				chart: {
					height:  '100%',
					type: 'treemap',
					toolbar: {
						show:true,
						offsetY: '-20',
						offsetX: '-25',
						tools: {
							download: false
						}
					},
					zoom: {
						enabled: true
					}
				},
	};

	let chart = new ApexCharts(document.querySelector("#temp-chart04"), options);
	chart.render();



}

function addContent() {
	let orig_file = Math.floor(Math.random() * 10) + 1;
	let ratio = Math.random() * (0.9 - 0.2) + 0.2;
	let optimized_file = (orig_file * ratio).toFixed(1);
	let speed_percent = ((1 - ratio) * 100).toFixed(1);
	// 새로운 컨텐츠 생성
	let $content = $("<li>").html(`<table width="100%">
			<colgroup>
			<col width="200px" />
			<col width="100px" />
			<col width="*" />
			<col width="150px" />
			<col width="150px" />
			</colgroup>
			<tr class="unoptimized">
				<td rowspan="2" align="left">🖼️ image01.png</td>
				<td><label>최적화 전</label></td>
				<td><div class="compress-bar" style="width:${orig_file*10}%;">&nbsp;</div></td>
				<td align="right" class="size">${orig_file}MB</td>
				<td align="right" rowspan="2" class="speed-rate">${speed_percent}% <ion-icon name="caret-up-outline"></ion-icon></td>
			</tr>
			<tr class="optimized">
				<td><label>최적화 후</label></td>
				<td style="padding:5px 0px 0px 0px; text-align:left;">
					<div class="compress-bar" style="width:${optimized_file*10}%; background-color:#038edc; display:inline-block;">&nbsp;</div>
					<img src="/resources/img/icon-roket.png" width="16px" style="position:relative; top:-5px;" />
				</td>
				<td align="right" class="size">${optimized_file}MB</td>
			</tr>	    
	</table>`);

	// 컨텐츠 스택에 추가하고 효과 적용
	$("#content-load-stack").prepend($content);
	$content.slideDown();
	
	let stackCount = $("#content-load-stack li").length;
	if(stackCount > 10){
		$("#content-load-stack li").slice(10).remove();
	}
}	

