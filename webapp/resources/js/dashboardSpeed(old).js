$(function() {
	const chartData = selectDashbordData();
	const org_sum = chartData.resourceSizeSum.org_sum;
	const type2_sum = chartData.resourceSizeSum.type2_sum;
	const donutchart_bg = "#dcdcdc";
	const donutchart_color = "#038edc";
	
	var donutchart1_value1 = (1 - (type2_sum / org_sum)) * 100;
	donutchart1_value1 = parseFloat(donutchart1_value1.toFixed(1));
	var donutchart1_value2 = 100 - donutchart1_value1;
	donutchart1_value2 = parseFloat(donutchart1_value2.toFixed(1));
	var donutchart1_data = [ donutchart1_value1, donutchart1_value2 ];

	var donutchart2_value1 = (1 - (type2_sum / org_sum)) * 100;
	donutchart2_value1 = parseFloat(donutchart2_value1.toFixed(1));
	var donutchart2_value2 = 100 - donutchart2_value1;
	donutchart2_value2 = parseFloat(donutchart2_value2.toFixed(1));
	var donutchart2_data = [ donutchart2_value1, donutchart2_value2 ];

	console.log(donutchart1_data);
	console.log(donutchart2_data);

	const donutchart1_option = {
		labels : [ '최적화 후 평균 속도 향상 비율', '' ],
		series : [90, 10],
		chart : {
			height : 240,
			type : "donut",
		},
		stroke : {
			width : 0
		},
		plotOptions : {
			pie : {
				donut : {
					size : '90%', // 도넛의 두께를 설정
				}
			}
		},
		dataLabels : {
			enabled : false
		},
		legend : {
			show : false
		},
		colors : [ donutchart_color, donutchart_bg ],
		tooltip : {
			y : {
				formatter : function(value) {
					return value + '%'; // '%'를 추가하여 반환
				}
			}
		},
	};
	var donutchart1 = new ApexCharts(document.querySelector("#speed-rate-donut-chart"), donutchart1_option);
	donutchart1.render();
	animateNumber($("#speed-rate-donut-chart-value"), 0, 90, 3000, `% <i class="fas fa-caret-up"></i>`);

	const donutchart2_option = {
		labels : [ '평균 웹 컨텐츠 압축율', '' ],
		series : [70, 30],
		chart : {
			height : 240,
			type : "donut",
			toolbar : {show:false}
		},
		stroke : {
			width : 0
		},
		plotOptions : {
			pie : {
				donut : {
					size : '90%' // 도넛의 두께를 조절합니다.
				}
			}
		},
		dataLabels : {
			enabled : false
		},
		legend : {
			show : false
		},
		colors : [ donutchart_color, donutchart_bg ],
		tooltip : {
			y : {
				formatter : function(value) {
					return value + '%'; // '%'를 추가하여 반환
				}
			}
		},
	};

	var donutchart2 = new ApexCharts(document.querySelector("#compress-rate-donut-chart"), donutchart2_option);
	donutchart2.render();
	animateNumber($("#compress-rate-donut-chart-value"), 0, 70, 3000, `% <i class="fas fa-caret-up"></i>`);


	const donutchart3_option = {
			labels : [ '평균 웹 컨텐츠 압축율', '' ],
			series : [50, 50],
			chart : {
				height : 240,
				type : "donut",
			},
			stroke : {
				width : 0
			},
			plotOptions : {
				pie : {
					donut : {
						size : '90%' // 도넛의 두께를 조절합니다.
					}
				}
			},
			dataLabels : {
				enabled : false
			},
			legend : {
				show : false
			},
			colors : [ donutchart_color, donutchart_bg ],
			tooltip : {
				y : {
					formatter : function(value) {
						return value + '%'; // '%'를 추가하여 반환
					}
				}
			},
		};	
	
	var donutchart3 = new ApexCharts(document.querySelector("#donut-chart3"), donutchart3_option);
	donutchart3.render();
	animateNumber($("#donut-chart3-value"), 0, 50, 3000, `% <i class="fas fa-caret-up"></i>`);
	
	const donutchart4_option = {
			labels : [ '평균 웹 컨텐츠 압축율', '' ],
			series : [80, 20],
			chart : {
				height : 240,
				type : "donut",
			},
			stroke : {
				width : 0
			},
			plotOptions : {
				pie : {
					donut : {
						size : '90%' // 도넛의 두께를 조절합니다.
					}
				}
			},
			dataLabels : {
				enabled : false
			},
			legend : {
				show : false
			},
			colors : [ donutchart_color , donutchart_bg ],
			tooltip : {
				y : {
					formatter : function(value) {
						return value + '%'; // '%'를 추가하여 반환
					}
				}
			},
		};	
	
	var donutchart4 = new ApexCharts(document.querySelector("#donut-chart4"), donutchart4_option);
	donutchart4.render();	
	animateNumber($("#donut-chart4-value"), 0, 80, 3000, `% <i class="fas fa-caret-up"></i>`);
	
	// 평균 로딩 시간
	// animateNumber($("#avg-load-sec-value"), 0, 4.5, 3000, `초`);


	addContent();
	addContent();
	addContent();
	addContent();
    setInterval(function() {
        addContent();
    }, 3000); // 3초(3000밀리초)마다 호출


})

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
		<td rowspan="2">🖼️ image01.png</td>
		<td><label>최적화 전</label></td>
		<td><div class="compress-bar" style="width:${orig_file*10}%;">&nbsp;</div></td>
		<td align="right">${orig_file}MB</td>
		<td align="right" rowspan="2" class="speed-rate">${speed_percent}% <ion-icon name="caret-up-outline"></ion-icon></td>
    </tr>
    <tr class="optimized">
		<td><label>최적화 후</label></td>
		<td style="padding:5px 0px 0px 0px">
			<div class="compress-bar" style="width:${optimized_file*10}%; background-color:#038edc; display:inline-block;">&nbsp;</div>
			<img src="/resources/img/icon-roket.png" width="16px" style="position:relative; top:-5px;" />
		</td>
		<td align="right">${optimized_file}MB</td>
    </tr>	    
    </table>`);
    
    // 컨텐츠 스택에 추가하고 효과 적용
    $("#content-load-stack").prepend($content);
    $content.slideDown();
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

// 슬롯 머신처럼 숫자를 올리는 함수
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

function drawSampleChart() {

	let options = {
		    series: [{
		        name: "원본 속도",
		        data: [359, 322, 314, 259, 114, 112, 111]
		    }, {
		        name: "최적화 후 속도",
		        data: [150, 150, 140, 120, 50, 50, 50]
		    }],
		    chart: {
		        type: 'bar',
		        height: 430,
			    toolbar: {
			        show: false // 다운로드 버튼 숨기기
			    }
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
		    colors: ['#dcdcdc', '#038edc'],
		    stroke: {
		        show: true,
		        width: 1,
		        colors: ['#fff']
		    },
		    tooltip: {
		        shared: true,
		        intersect: false,
		        y: {
		            formatter: function(value) {
		                // 컴마 추가하여 1000 단위로 구분하고 'MB' 추가
		                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ms';
		            }
		        }			        
		    },
		    xaxis: {
		        categories: ["NotoSansKR-Bold.woff2", "NotoSansKR-Medium.woff2",
		            "NotoSansKR-Regular.woff2", "NotoSansKR-Light.woff2",
		            "464.png", "465.png", "466.png"
		        ],
		        title: {
		            text: '웹 컨텐츠 로딩 속도 (단위 ms)'
		        }
		    },
		    yaxis: {
		        title: {
		            text: '웹 컨텐츠'
		        }
		    },

		};


	// let chart = new ApexCharts(document.querySelector("#sample-chart"), options);
	// chart.render();

}