$(function() {

	addContent();
	addContent();
	addContent();
	addContent();
    setInterval(function() {
        addContent();
    }, 3000); // 3초(3000밀리초)마다 호출

    // DrawTempChart01("#temp-chart01");
    drawTempChart01("#temp-chart02");
    // drawTimeFlowingChart();
    
    var timeflowingChart = drawTimeFlowingChart();  
    setInterval(function(){
    	updateChart(timeflowingChart);
    }, 5000);
    
    drawMixedChart();
    drawTreemapChart();
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
		<td rowspan="2" align="left">🖼️ image01.png</td>
		<td><label>최적화 전</label></td>
		<td><div class="compress-bar" style="width:${orig_file*10}%;">&nbsp;</div></td>
		<td align="right">${orig_file}MB</td>
		<td align="right" rowspan="2" class="speed-rate">${speed_percent}% <ion-icon name="caret-up-outline"></ion-icon></td>
    </tr>
    <tr class="optimized">
		<td><label>최적화 후</label></td>
		<td style="padding:5px 0px 0px 0px; text-align:left;">
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

function drawTempChart01 (selector){
	let options = {
		    series: [
		        {
		            name: 'before',
		            data: randArray(24),
		        },
		        {
		            name: 'after',
		            data: randArray(24),
		        }
		    ],
		    chart: {
		    	toolbar: {
		            show: false // 이 부분에서 toolbar 설정
		        },		    	
		        type: 'area',
		        height: '100%',
		        stacked: true,
		        events: {
		            selection: function (chart, e) {
		                console.log(new Date(e.xaxis.min))
		            }
		        },
		        
		    },
		    colors: ['#008FFB', '#CED4DC'],
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
		    xaxis: {
		    	categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
		    },
		    yaxis: {
		    	tickAmount: 2
		    },
		    
		};

    let chart = new ApexCharts(document.querySelector(selector), options);
    chart.render();	
}

function randArray(length) {
    let array = [];

    for (let i = 0; i < length; i++) {
        let randomNumber = Math.floor(Math.random() * 100); // 0부터 50까지의 난수 생성
        array.push({
            x: i, // x축 값 설정
            y: randomNumber, // y축 값 설정
        }); 
    }
    // console.table(array);

    return array;
}
function drawTimeFlowingChart() {
	  let currentDate = new Date();
	  let currentEpochTime = currentDate.getTime() - currentDate.getTimezoneOffset() * 60000;

	  let options = {
	    series: [
	      {
	        name: 'series1',
	        data: [[currentEpochTime - 15000, 34], [currentEpochTime - 10000, 43], [currentEpochTime - 5000, 31], [currentEpochTime, 43]]
	      },
	      {
	        name: 'series2',
	        data: [[currentEpochTime - 15000, 24], [currentEpochTime - 10000, 33], [currentEpochTime - 5000, 21], [currentEpochTime, 33]]
	      }
	    ],
	    chart: {
	      height:  '100%',
	      type: 'area',
	      toolbar: {
	        show: false
	      },
	      animations: {
	        enabled: true,
	        easing: 'linear',
	        dynamicAnimation: {
	          speed: 1000
	        }
	      }
	    },
	    stroke: {
	      curve: 'smooth'
	    },
	    xaxis: {
	      type: 'datetime',
	      labels: {
	        format: 'HH:mm:ss'
	      },
	    },
	    yaxis: {
	      tickAmount: 1,
	      min: 0,
	      max: 100
	    },
	    tooltip: {
	      x: {
	        format: 'yyyy/MM/dd HH:mm:ss'
	      }
	    },
	    legend: {
	      show: false
	    },
	    colors: ['#CED4DC', '#008FFB'],
	    dataLabels: {
	      enabled: true
	    }
	  };

	  let chart = new ApexCharts(document.querySelector("#temp-chart01"), options);
	  chart.render();

	  return chart;
	}

	function updateChart(chart) {
	  let currentDate = new Date();
	  let currentEpochTime = currentDate.getTime() - currentDate.getTimezoneOffset() * 60000;
	  let currentEpochString = parseInt(currentEpochTime.toString());

	  let rand = Math.random() * (0.7 - 0.1) + 0.1;

	  let series = [
	    [...chart.w.config.series[0].data],
	    [...chart.w.config.series[1].data]
	  ];

	  series[0].push([currentEpochTime, Math.floor(Math.random() * 100)]);
	  series[1].push([currentEpochTime, Math.floor(series[0][series[0].length - 1][1] * rand)]);

	  if (series[0].length > 4) {
	    series[0].shift();
	    series[1].shift();
	  }
	 
	  chart.updateSeries([
	    { data: series[0] },
	    { data: series[1] }
	  ]);
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
            toolbar: { show: false },
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
        },
        legend: {
        	show: false
        },
        colors: ['#ced4dc', '#008ffb', '#FEB019'], // 각 시리즈에 대한 색상 지정
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
	              },
	              {
	                x: 'product01.jpg',
	                y: 68
	              },
	              {
	                x: 'product02.jpg',
	                y: 28
	              },
	              {
	                x: 'product03.jpg',
	                y: 19
	              },
	              {
	                x: 'product04.jpg',
	                y: 29
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
	          toolbar: {show:false},
	        },
	        };

	        let chart = new ApexCharts(document.querySelector("#temp-chart04"), options);
	        chart.render();
	      
	      
	    	
}
