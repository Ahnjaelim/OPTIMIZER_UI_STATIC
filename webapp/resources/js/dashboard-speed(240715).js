const COLOR1 = '#274c63';
const COLOR2 = '#008FFB';
const nodata = `<div class="no-data"><p><ion-icon name="alert-circle-outline"></ion-icon> 해당 데이터가 존재하지 않습니다.</p></div>`;
const UNOPTIMIZED = `<span style="color:rgba(255,255,255,0.3);">최적화 전</span>`;
const UNCHECKED = `<span style="color:rgba(255,255,255,0.3);">측정 전</span>`;
const CHECKING = `<span style="color:rgba(255,255,255,0.3);">측정 중</span>`;

// 인터벌 관리
let animationData = [];
let dataInterval = null;

// 데이터 가져오기
let resourceCountData = null;
let resourceCountArray = null;
let newResourceData = null;
let newResourceArray = null;
let avgTimeData = null;
let avgTimeArray = null;
let avgTimeByTypeData = null;
let avgTimeByTypeArray = null;
let sumResourceSizeData = null;
let sumResourceSizeArray = null;
let alarmData = getAlertAjax(null,null);
let alarmArray = alarmData.data;
let latestAlarmArray = getAlertAjax('1',null);

$(function() {

	targetDateInit();
	updateVisitDate();
	
	setInterval(function() {
		if (document.visibilityState === 'visible') { //console.log('페이지가 현재 보이는 상태입니다.');
			selectViewLogAll();
		} else { // console.log('페이지가 현재 보이지 않는 상태입니다.');
		}
	}, 1000);

	animateCylinder();

	// 데이터 그리기 및 새로고침
	drawDataEle();	
	dataInterval = setInterval(function(){
		drawDataEle();
	},5000);
	
	// [확인하세요]
	/*$(".alarm .number strong").html(latestAlarmArray.length);*/
	let alarmHtml = "";
	let strLength = 20;
	if(alarmData && alarmArray.length > 0){
		for(let i = 0; i < alarmArray.length; i++){
			if(alarmArray[i].is_new === 1) {
				let is_new = i+1;
				$(".alarm .number strong").html(is_new);
			}
			
			let content = alarmArray[i].content.length > strLength ? alarmArray[i].content.substring(0, strLength) + '...' : alarmArray[i].content;
			alarmHtml += `<li><a href="/alertCenter"><i class="fa-solid fa-bell"></i> ${content}</a></li>`;
		}
	}else{
		alarmHtml = `<li style="opacity:0.5;">확인해야하는 알림이 없습니다.</li>`;
	}
	$(".alarm ul").html(alarmHtml);
})

function drawDataEle(){
	drawSizeStatusEle();
	drawTimeStatusEle();
	drawResourceCountEle();
	drawNewResourceEle();
	drawTreemapChart();		
}

function drawSlotmachine(targetEle){
	let html = "";
	for(let i = 1; i <= 3; i++){
		html += `<div class="slot-machine" id="slot${i}">
            <div class="number">
                <div class="digit">0</div>
                <div class="digit">1</div>
                <div class="digit">2</div>
                <div class="digit">3</div>
                <div class="digit">4</div>
                <div class="digit">5</div>
                <div class="digit">6</div>
                <div class="digit">7</div>
                <div class="digit">8</div>
                <div class="digit">9</div>
            </div>
        </div>`;
	}
	html += `<div class="slot-machine dot">.</div>
		<div class="slot-machine" id="slot-fixed1">
            <div class="number-fixed">
                <div class="digit">0</div>
                <div class="digit">1</div>
                <div class="digit">2</div>
                <div class="digit">3</div>
                <div class="digit">4</div>
                <div class="digit">5</div>
                <div class="digit">6</div>
                <div class="digit">7</div>
                <div class="digit">8</div>
                <div class="digit">9</div>
            </div>
        </div>`;
	$(targetEle).html(html);
}

 function spin(value) {
    const [integerPart, decimalPart] = value.toString().split('.');
    const valueStr = integerPart.padStart(3, '0'); // 6자리로 맞추기
    const slots = $('.slot-machine .number');
    slots.each(function(index) {
        if (index < 6) {
            const digit = parseInt(valueStr[index], 10);
            $(this).css('top', `-${digit * 1}em`); // 각 숫자의 높이에 맞게 조정
        }
    });

    if (decimalPart !== undefined) {
        const decimalDigit = parseInt(decimalPart[0], 10);
        $('#slot-fixed1 .number-fixed').css('top', `-${decimalDigit * 1}em`);
    } else {
        $('#slot-fixed1 .number-fixed').css('top', `0em`);
    }
}
/**
 * [웹 콘텐츠 최적화 현황]
 * @returns
 */
async function drawSizeStatusEle(){
	
	// 처음 화면 로딩중 표시
	let $sizeStatus = $(".size-status");
	
	try {
        // 데이터 로딩 영역
        sumResourceSizeData = await selectSumResourceSize();
		sumResourceSizeArray = sumResourceSizeData.data;
        
        const {result_code, data} = sumResourceSizeData;
        let {type1_size, type2_size, percentage} = data;
        
        if(result_code == 200){
			$sizeStatus.find(".value").html(`<strong class="org">${fileSizeUnitFormatter(type1_size)}</strong> <i class="fa-solid fa-right-long"></i> <strong class="new">${fileSizeUnitFormatter(type2_size)}</strong> <span>${percentage.toFixed(1)}%</span>`);
			drawSlotmachine("#slotmachine1");
			let size2obj = utilFnc.formatFileSize(type2_size);
			spin(size2obj.value);
			let diff_size = fileSizeUnitFormatter(type1_size - type2_size);
			$sizeStatus.find(".desc-value").html(diff_size);
        }else if(result_code == 204){
        	 $sizeStatus.find(".card-content").css({"opacity": "0.2"});
	         $sizeStatus.find(".card-content").after('<div class="nodata">No Data Available</div>');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        $sizeStatus.find(".value").html('<div class="error">Error loading data</div>');
    }
}

async function drawResourceCountEle(){
	// 리소스 카운트
	try {
        resourceCountData = await selectCountGroupByTypeAndStatus();
        resourceCountArray = resourceCountData.data;
		let sum = [];	
		sum[-1] = 0;
		sum[0] = 0;
		sum[1] = 0;
		sum[2] = 0;
		sum[11] = 0;
		for(let i=0; i<resourceCountArray.length; i++){
			const {resource_type, resource_status, type_count, status_count, percentage} = resourceCountArray[i];
			$targetEle = $(`.optimize-progress [data-type=${resource_type}]`);
			
			if(resource_status == 1){ // 실린더 밑 카운트
				$targetEle.find(".value").html(`<strong>${status_count}</strong>/${type_count}건`);			
				$targetEle.find(".percentage").html(`${percentage}%`);
				$targetEle.find(".progress-bar").css({"width" : `${percentage}%`});
			}
			if(resource_status == -1){ // 상단 우측 카드 & 하단 우측 하단 테이블
				const $targetLi = $(`#shortcut li[data-resource-type=${resource_type}]`);
				const $targetTr = $(`.type-status-table2 tr[data-resource-type=${resource_type}]`);
				$targetTr.find(".optimizable-count").html(`<strong>${status_count}건 최적화 가능</strong>`);
				if(status_count == 0){
					$targetLi.find("a").removeAttr("href");
					$targetLi.find(".status").html(`완료<ion-icon name="checkmark-circle"></ion-icon>`);
					$targetLi.find("button").replaceWith('<span class="badge-comp" style="float:right; position:relative; top:7px;">완료</span>');
					$targetTr.find(".optimizable-count").html(`<strong>최적화 완료<ion-icon name="checkmark-circle"></ion-icon></strong>`);
					$targetTr.find(".optimizable-count strong").addClass("zero");
					$targetTr.find(".cell-btn").html(`<span class="badge-comp">완료</span>`);
				}
			}
			sum[resource_status] += status_count; // 강제
		} // end of for
		
		let total_count = 0; // 리소스 전체 카운트
		for(let i = -1; i <= 11; i++){
			if(sum[i]!=undefined){
				total_count += sum[i];
			}
		}		
		$(".unoptimized-count").html(`<strong style="color:var(--color-yellow);">${sum[-1]}</strong><strong>/${total_count}</strong><span>건</span>`);	
	}catch (error) {
    } 	
}

async function drawTimeStatusEle(){
	
	try {
        avgTimeData = await selectAvgTime();
        avgTimeArray = avgTimeData.data;
		avgTimeByTypeData = await selectAvgTimeByType();
		avgTimeByTypeArray = avgTimeByTypeData.data;	
		// [렌더링 시간 단축 현황]
		let $timeStatus = $(".time-status");
		if(avgTimeData.result_code==200){
			let org_time = avgTimeArray.org_time;
			let new_time = avgTimeArray.new_time;
			$timeStatus.find(".value").html(`<strong class="org">${timeUnitFormatter(org_time)}</strong> <i class="fa-solid fa-right-long"></i> <strong class="new">${timeUnitFormatter(new_time)}</strong> <span>${avgTimeArray.percentage}%</span>`);
			$timeStatus.find(".desc-value").html((avgTimeArray.org_time-avgTimeArray.new_time).toFixed(1)+"ms");		
		}else if(avgTimeData.result_code==204){
			$timeStatus.find(".card-content").css({"opacity":"0.2"});
			$timeStatus.find(".card-content").after(nodata);
		}
		for(let i = 0; i < avgTimeByTypeArray.length; i++){
			let resource_type = avgTimeByTypeArray[i].resource_type;
			let $tr = $(`.type-status-table2 tr[data-resource-type=${resource_type}]`);
			let width = avgTimeByTypeArray[i].percentage;
			$tr.find(".time-rate").html(`<div>&nbsp;</div><p>${avgTimeByTypeArray[i].percentage}%</p>`);
			$tr.find(".time-rate div").animate({"width":width+"%"});
			$tr.find(".time-rate-value").html(`${timeUnitFormatter(avgTimeByTypeArray[i].org_time)} <i class="fa-solid fa-right-long"></i> ${timeUnitFormatter(avgTimeByTypeArray[i].new_time)}`);
		}	
		$(".predict-comp-rate").html(`<strong style="color:#ffffff;">${avgTimeArray.percentage}%</strong>`);	

	}catch (error) {
    } 		
}

async function drawNewResourceEle(){
	try {
	    newResourceData = await selectNewResourceAll();
	    newResourceArray = newResourceData.data;	
		// console.log("selectNewResourceAll",newResourceArray);
		// 새로 추가된 리소스
		let totalNewItemHtml = `<strong style="color:rgba(255,255,255,0.3)";>0</strong><span style="color:rgba(255,255,255,0.3)";>건</span>`;
		let checkNewItemHtml = `<strong style="color:rgba(255,255,255,0.3)";>0</strong><span style="color:rgba(255,255,255,0.3)";>건</span>`;
		const totalNewItem = newResourceArray.find(item => item.resource_status == 99);
		const checkNewItem = newResourceArray.find(item => item.resource_status == 98);
		if (totalNewItem.count > 0){
			totalNewItemHtml = `<a><strong style="color:#ffffff;">${totalNewItem.count}</strong><span style="color:#ffffff;">건</span></a>`;		
		}
		if (checkNewItem !== undefined) {
			checkNewItemHtml = `<a><strong style="color:#ffffff;">${checkNewItem.count}</strong><span style="color:#ffffff;">건</span></a>`;		
		}
		$(".new-resource").html(totalNewItemHtml);
		$(".new-resource-check").html(checkNewItemHtml);
	}catch (error) {
	} 	

	
}

function showNextItem() {
    let nextIndex = (slideIndex + 1) % slideItems.length;
    $(slideItems[slideIndex]).animate({ top: '-100px' }, 1000, function() {
        $(this).css("top", "100px"); // 현재 항목을 아래로 이동
    });
    $(slideItems[nextIndex]).css("top", "100px").animate({ top: '0px' }, 1000);
    slideIndex = nextIndex;
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

/** 트리맵 차트 */
async function drawTreemapChart() {
	let loadingHtml = `<div style="position:absolute; top:50%; left: 50%; transform:translate(-50%, -50%); width:100%; text-align:center;">
		<div class="spinner-border text-primary m-1" role="status" style="--bs-spinner-width: 1.2rem; --bs-spinner-height: 1.2rem; position:relative; top:5px;">
			<span class="sr-only">Loading...</span>
  		</div>
		<span>데이터를 불러오고 있습니다.</span>
	</div>`;
	$("#temp-chart04").html(loadingHtml);
	
	try {
		let unoptimizedData = await selectResourceAllUnoptimized();
		let unoptimizedArray = unoptimizedData.data;
		if (unoptimizedData.hasOwnProperty('msg') && unoptimizedData.msg == "replaced") {
		}
		if(unoptimizedData){
			for(let i = 0; i < unoptimizedArray.length; i++){
				unoptimizedArray[i].y = 11 - i;
			}
		}
		
	    let options = {
	        series: [{
	            data: unoptimizedArray
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
	                    const index = config.dataPointIndex;
	                    const chartItemData = config.w.config.series[0].data[index];
	                    // console.log(chartItemData);
	                    location.href=`/optimizerByContent?resource_name=${chartItemData.x}&resource_no=${chartItemData.resource_no}`;
	                }
	            }        
	        },
	        dataLabels: {
	            enabled: true,
	            style: {
	              fontSize: '15px',
	            },
	            formatter: function(text, op) {
	            	let traffic = (op.value/1024/1024).toFixed(1);
	            	let customValue = op.w.config.series[op.seriesIndex].data[op.dataPointIndex].resource_new_size_type1; // 커스텀 값 접근
	            	customValue = fileSizeUnitFormatter_v2(customValue);
	            	return [text, customValue, '최적화'];
	            },
	            offsetY: -4
	          }, 
	          tooltip: {
	              enabled: true,
	              y: {
	                  formatter: function(value) {
	                      return (value / 1024 / 1024).toFixed(1) + ' MB';
	                  }
	              },
	              custom: function({ series, seriesIndex, dataPointIndex, w }) {
	                  const data = w.config.series[seriesIndex].data[dataPointIndex];
	                  const value = fileSizeUnitFormatter(data.resource_new_size_type1);
	                  return `<div class="tooltip-content">
	                              <p><strong>${data.x}</strong></p>
	                              <p>원본 용량 : ${value}</p>
	                          </div>`;
	              }
	          },
	          colors: ['#FFA500'], // 주황색으로 설정
	    };
	
	    let chart = new ApexCharts(document.querySelector("#temp-chart04"), options);
	    if(unoptimizedData.resultCode == 204 || unoptimizedData.data.length==0){
	    	$("#temp-chart04").addClass("h-100");
	    	$("#temp-chart04").html(nodata);
	    }else if(unoptimizedData.resultCode == 200){
			$("#temp-chart04").html("");
	    	chart.render();    
	    }
		
	}catch (error) {
	} 	
}


function targetDateInit(){
	let now = new Date();

	// 년, 월, 일을 추출합니다.
	let year = now.getFullYear();
	let month = ('0' + (now.getMonth() + 1)).slice(-2);
	let day = ('0' + now.getDate()).slice(-2);

	// 시, 분, 초, 밀리초를 추출합니다.
	let hours = ('0' + now.getHours()).slice(-2);
	let minutes = ('0' + now.getMinutes()).slice(-2);
	let seconds = ('0' + now.getSeconds()).slice(-2);
	let milliseconds = ('00' + now.getMilliseconds()).slice(-3);

	// 출력 형식에 맞게 조합합니다.
	let formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
	$("#target_date").val(formattedTime);	
	document.cookie = `entryTime=${formattedTime}; path=/`;
}

/** 애니메이션 로그 불러오는 ajax **/
function selectViewLogAll(){
	// let result = "";
	$.ajax({
		type: 'GET',
		url: '/selectViewLogAll',
		data:{
			target_date : $("#target_date").val()
		},
		//async: false,
		success: function(response) {
			let data = response.data;
			let totalDataCount = data.length;
			let maxElements = 50;
			let interval = Math.ceil(totalDataCount / maxElements);
			let summarizedData = [];

			// 요약된 데이터 생성
			for(let i = 0; i < totalDataCount; i += interval) {
				summarizedData.push(data[i]);
			}

			// 실제 카운트는 animationForeach_v2 함수 내부에서 처리
			summarizedData.forEach((item, idx) => {
				let timeoutUnit = 20;
				setTimeout(function(){
					animationForeach_v2([ item ], idx * interval, interval);
				}, timeoutUnit * idx);
			});
			
			// 데이터가 모두 빠져나가면 초기화
			const cnt1 = parseInt($(`#cylinder .type01 .value`).text());
			const cnt2 = parseInt($(`#cylinder .type02 .value`).text());
			const cnt3 = parseInt($(`#cylinder .type03 .value`).text());
			const cnt4 = parseInt($(`#cylinder .type04 .value`).text());
			const total = cnt1 + cnt2 + cnt3 + cnt4;
			if (total === 0) {
				timeMonitorData = {
					index: 0,
					sum_org_time: 0,
					sum_new_time: 0,
					avg_rate_sum: 0
				};
				$("#time-monitor").html("0%");
				$("#top-animation .station.server .color").css({"opacity":"0.0"});
			}				

		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	//return result;
}

let timeMonitorData = {
	index : 0,
	sum_org_time : 0,
	sum_new_time : 0,
	avg_rate_sum : 0
};

let avg_rate_sum = 0;
const CYLINDER_UNIT = 100;
function animationForeach_v2(data, startIdx, interval){
	data.forEach(item => {
		if(item != null && item != undefined){
			let randomTop = Math.floor(Math.random() * 35) + 15;
			let randomTop2 = Math.floor(Math.random() * 5) + 38;
			let randomTop3 = Math.floor(Math.random() * 20) + 30;
			let resource_type = item.resource_type;
			let optimized = "";
			let duration = 10000;
			if(item.resource_status == 1){
				optimized = "optimized";
				duration = 6000;
			}

			// 엘리먼트 생성 및 애니메이션 처리
			let $content = $(`<p class="content before type${resource_type} ${optimized}" style="left:0; top:${randomTop}%;">●</p>`);
			$('#top-animation').append($content);
			setTimeout(function() {
				$content.css({
					'left': '50%',
					'top': randomTop2 + "%"
				});
			}, 100);
			setTimeout(function() {
				// 실제 카운트 업데이트
				let cnt = parseInt($(`#cylinder .type0${resource_type} .value`).text());
				cnt += interval;  // interval 값을 더해 실제 데이터 개수 반영				
				$(`#cylinder .type0${resource_type} .value`).text(cnt);
				const cylinderCnt = $(`#cylinder .type0${resource_type} li`).length;
				if((cnt / CYLINDER_UNIT) + 5 >= cylinderCnt){
					const $newCylinder = $(`<li style="width:10px;"><img src="/resources/img/cylinder-type0${resource_type}.png" style="width:45px; height:70px;" /></li>`);
					$(`#cylinder .type0${resource_type} ul`).append($newCylinder);
				} else {
					const $lastCylinder = $(`#cylinder .type0${resource_type} li`).last();
					$lastCylinder.remove();
				}
				$content.removeClass('before').addClass('after');
				$content.css({
					'left': '98%',
					'top': randomTop3 + "%"
				});
				
				// 서버 상태 표시
				let total = 0;
				for(let i = 1; i <= 4; i++){
					total += parseInt($(`#cylinder .type0${i} .value`).text());
				}
				$("#top-animation .station.server .color").css({"opacity":"0.0"});
				if(total > 50){
					$("#top-animation .station.server .color.red").css({"opacity":"1.0"});
				}else if (total > 30){
					$("#top-animation .station.server .color.yellow").css({"opacity":"1.0"});					
				}else{
					$("#top-animation .station.server .color.green").css({"opacity":"1.0"});										
				}
			}, 5000);
			
			setTimeout(function() {
				let cnt = parseInt($(`#cylinder .type0${resource_type} .value`).text());
				cnt -= interval;  // interval 값을 빼서 실제 데이터 개수 반영
				$(`#cylinder .type0${resource_type} .value`).text(cnt);
				$content.remove();
				if(item.org_time > 0 && item.new_time > 0 && item.org_time != item.new_time){
					timeMonitorData.index++;
					let _tmp_rate = (item.org_time - item.new_time) * 1.0 / item.org_time;
					timeMonitorData.avg_rate_sum += _tmp_rate;
					let value = (timeMonitorData.avg_rate_sum / timeMonitorData.index) * 100;
					value = value.toFixed(1);
					$("#time-monitor").html(value + "%");
				}			
			}, duration);
		}
	});
}


function setEntryTimeCookie() {
    const entryTime = Date.now();  // 타임스탬프 (밀리초 단위)
    document.cookie = `entryTime=${entryTime}; path=/`;
}

/** ============================================================================================================== */
/** ============================================================================================================== */
/** ============================================================================================================== */

tabulatorFunctions.timeTabulator = function(data){
	let result = new Tabulator("#volist", {
		height:"500px",
		selectable:false,
	    progressiveLoad:"scroll",	    
	    // pagination:true, // progressiveLoad 옵션과 양립 X
	    paginationMode:"remote", // enable remote pagination
	    paginationSize:14, // 목록 크기
	    progressiveLoad:"scroll",	
	    sortMode: "remote",
	    ajaxURL:"/selectResourceListByParentId", // set url for ajax request
	    ajaxParams:data,	    
	    placeholder:"해당 조건에 맞는 데이터가 존재하지 않습니다.",
	    autoResize:true,
	    tooltips:false,
	    locale:true,
	    langs:{
	        "default":{
	            "pagination":{
	                "counter":{
	                    "showing": "Showing",
	                    "of": "of",
	                    "rows": "rows",
	                    "pages": "pages",
	                    "Prev": "이전",
	                }
	            },
	            "data":{
					"loading":`<div class="spinner-border text-primary m-1" role="status"><span class="sr-only">Loading...</span></div>`,
					"error":"Error",
				},          
	            
	        },
	    },	    
	    ajaxContentType : "application/json; charset=utf-8",
	    ajaxContentType:"json",
	    ajaxResponse:function(url,prarm,response){
	    	// console.log("page : "+this.getPage());
	    	// console.log("size : "+this.getSize());
	    	$("#list_cnt span").html(response.list_cnt);
	    	for(let i=0;i<response.data.length;i++){
	    	}
	    	return response; 
	    },
	    paginationInitialPage: 1,
	    paginationLoading: "<div class='custom-pagination-loader'><div class='spinner'></div>Loading...</div>",
	    layout: "fitColumns",
	    columns: [ 	
	    	{
	    		title: "No",
	    		field: "resource_no",
	    		hozAlign: "right",
	    		headerSort:true,
	    		visible:false,
				resizable:false,
	    	},	    	
	    	{
	    		title: "No",
	    		field: "row_no",
	    		width: 50,
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
				resizable:false,
	    	},
	    	{
	    		title: "구분",
	    		field: "resource_type",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:true,
	    		width: 80,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = `<span style="font-size:1.2em;">`;
	    			switch(cell.getValue()){
		    			case 0 : result += `📁`; break;
		    			case 1 : result += `🖼️`; break;
		    			case 2 : result += `🎥`; break;
		    			case 3 : result += `📄`; break;
		    			case 4 : result += `🅰️`; break;
	    			}
	    			result += "</span>";
	    			return result;
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "웹 컨텐츠 이름",
	    		field: "resource_name",
	    		hozAlign: "left",
	    		headerSort:true,
	    		widthgrow :true,
	    		cellClick: function(e, cell) {
	                let rowData = cell.getRow().getData(); // 클릭된 셀의 행 데이터 가져오기
	                if(rowData['resource_type'] == 0){
	                	$('#folderlist').jstree(true).deselect_all();
	                	$('#folderlist').jstree(true).select_node(rowData['resource_no']);	                	
	                }
	            },
				resizable:false,	    		
	    	},
	    	{
	    		title: "기존 렌더링 시간",
	    		field: "org_time",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
					let result = "";
					if(cell.getValue()==0){
						result = UNCHECKED;
					}else if(cell.getValue()==-1){
						result = CHECKING;
					}else{
						result = timeUnitFormatter(cell.getValue());
					}		
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "최적화 렌더링 시간",
	    		field: "new_time",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
					let result = "";
					if(cell.getValue()==0){
						result = UNCHECKED;
					}else if(cell.getValue()==-1){
						result = CHECKING;
					}else{
						result = timeUnitFormatter(cell.getValue());
					}		
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "렌더링 시간 단축률",
	    		field: "time_reduction_rate",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			//let result = cell.getValue();
	    			let result = null;
	    			let rowData = cell.getRow().getData();
	    			let org_time = parseFloat(rowData.org_time);
		    		let new_time = parseFloat(rowData.new_time);
		    		result = ((org_time - new_time) / org_time)*100;
		    		result = result.toFixed(1);
	    			if(isNaN(result)){
	    				result = UNCHECKED;
	    			}else{
	    				result += "%";
	    			}
					if(rowData.org_time == -1 || rowData.new_time == -1){
						result = CHECKING;
					}
	    			return result;
	    		},
				resizable:false,
	    	},	
	    	{
	    		title: "시간 측정",
	    		field: "time_check_btn",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			//let result = cell.getValue();
	    			let result = null;
	    			let rowData = cell.getRow().getData();
	    			let org_time = rowData.org_time;
		    		let new_time = rowData.new_time;
	    			if(org_time >= 0 && new_time >= 0){
	    				result = `<button class="btn btn-primary btn-sm" style="width:75px;" onclick="singleTimeCheckBtnEvent({resource_no : ${rowData.resource_no}});">시간 측정</button>`;
	    			}else{
	    				result = `<button class="btn btn-success btn-sm" style="width:75px;" onclick="singleTimeCheckBtnEvent({resource_no : ${rowData.resource_no}, retry : 1});">측정 중</button>`;	    				
	    			}
	    			return result;
	    		},
				resizable:false,
	    	},		    	
	    	
	    ],	    
	});	
	
	return result;
}

const sizeStatusTopContent = `OPTIMIZER로 웹 콘텐츠를 <span id="type1_size">0</span> <i class="fa-solid fa-right-long"></i> <span id="type2_size">0</span> <span id="percentage" class="border-yellow">0</span> 경량화하여, 더욱 빠르게 렌더링 하고 있습니다.`;
topFunctions.topContentGenerator1 = function(){	
	let descHtml = `웹 콘텐츠를 최적화하여 해당 파일이 얼만큼 경량화 되었는지 확인할 수 있습니다.`;
	$desc.html(descHtml);

	$topContent.html(sizeStatusTopContent);
	let topValueData = null;
	setTimeout(function(){
		sizeStatusDataLoad();
	},1000);

    const originalUpdateButtons = updateButtons; // 기존 updateButtons 함수를 참조
    updateButtons = function() { // updateButtons 함수를 확장하여 재정의
        originalUpdateButtons(); // 기존 함수 호출
        sizeStatusDataLoad();
    }
}

function sizeStatusDataLoad(){
	let data = {endDate_ts : $("input[name=endDate_ts]").val()}
	let result = selectSumResourceSize(data);
	let resultData = result.data;
	let resultCode = result.result_code;
	if(resultCode==200){
		$topContent.html(sizeStatusTopContent);
		$("#type1_size").html(fileSizeUnitFormatter(resultData.type1_size));
		$("#type2_size").html(fileSizeUnitFormatter(resultData.type2_size));
		$("#percentage").html(`${resultData.percentage.toFixed(1)}%`);			
	}
	else {
		$topContent.html("데이터가 없습니다.");
	}
}

topFunctions.timeTopContent = function(){	
	let descHtml = `웹 콘텐츠를 최적화하여 웹 콘텐츠의 렌더링 시간이 얼마나 단축되었는지 확인할 수 있습니다. (최적화가 완료된 웹 콘텐츠만 표시됩니다.)`;
	let topContentHtml = null;
	topContentHtml = `<div>OPTIMIZER로 웹 콘텐츠를 최적화하여, 평균 <span id="org_time">0</span> <i class="fa-solid fa-right-long"></i> <span id="new_time">0</span> <span id="percentage" class="border-yellow">0</span> 빠르게 렌더링 하고 있습니다.</div>	`;
	let optionalComponentHtml = `<div style="text-align:right;">
		<ion-icon name="time-outline"></ion-icon> 마지막 측정 시간 <span id="latest-check-time">0000-00-00 00:00:00</span>
		<button class="btn btn-primary btn-sm" id="check-time-btn" onclick="checkTimeBtnEvent();">렌더링 시간 측정</button>
		<button class="btn btn-success btn-sm" id="check-time-processing-btn" style="display:none;">렌더링 시간을 측정 중</span>
	</div>`;
	$desc.html(descHtml);
	$topContent.html(topContentHtml);
	$optionalComponent.html(optionalComponentHtml);
	if(avgTimeData.result_code==200){
		$topContent.find("#org_time").html(`${timeUnitFormatter(avgTimeArray.org_time)}`);
		$topContent.find("#new_time").html(`${timeUnitFormatter(avgTimeArray.new_time)}`);
		$topContent.find("#percentage").html(`${avgTimeArray.percentage}%`);		
	}else{
		
	}
	let latestCheckDateData = selectLatestCheckTimeAgent().data;
	let latestCheckDateArray = null;
	if (latestCheckDateData && latestCheckDateData.rgtr_dt) {
	    latestCheckDateArray = latestCheckDateData.rgtr_dt.split(".");
	} else {
	    console.error("latestCheckDateData is null or rgtr_dt is not defined");
	    // 적절한 대체 로직을 추가할 수 있습니다.
	    latestCheckDateArray = []; // 기본값 또는 다른 로직으로 초기화
	}
	let latestCheckDate = latestCheckDateArray[0];
	$optionalComponent.find("#latest-check-time").html(latestCheckDate);
	
	// 시간 체크 에이전트 상태 확인
	timeAgentInterval = setInterval(function(){
		timeAgentStatus = optimizerCheckTimeAgentProcess().data.replace("\n","");
		// console.log("timeAgentStatus : "+timeAgentStatus);
		if(timeAgentStatus==0){
			$optionalComponent.find("#check-time-btn").css({"display":"inline-block"});		
			$optionalComponent.find("#check-time-processing-btn").css({"display":"none"});		
		}else{
			$optionalComponent.find("#check-time-btn").css({"display":"none"});		
			$optionalComponent.find("#check-time-processing-btn").css({"display":"inline-block"});	
		}
		let latestData = selectResourceListByParentIdAjax().data;
		latestData.forEach(function(latestItem) {
             let targetRow = table_resource.getRows().find(function(row) {
                 return row.getData().resource_no === latestItem.resource_no;
             });
             if(targetRow){
            	 let orgRowData = targetRow.getData();
            	 let latestRowData = Object.assign({}, latestItem);
            	 latestRowData.row_no = orgRowData.row_no; 
            	 targetRow.update(latestRowData);     	
            	 targetRow.reformat();
            	 // console.log("해당 row를 찾았습니다. "+orgRowData.resource_no);
             }

        });		
	},10000);
	
}

topFunctions.sizeTopContent = function(){	
	let descHtml = `웹 콘텐츠를 최적화하여 관리 중인 서비스의 웹 콘텐츠가 얼마나 경량화 되었는지 확인할 수 있습니다. (최적화가 완료된 웹 콘텐츠만 표시됩니다.)`;
	let topContentHtml = null;
	topContentHtml = `OPTIMIZER로 웹 콘텐츠를 <span id="type1_size">0</span> <i class="fa-solid fa-right-long"></i> <span id="type2_size">0</span> <span id="percentage" class="border-yellow">0</span> 경량화하여, 더욱 빠르게 렌더링 하고 있습니다.`;
	let optionalComponentHtml = ``;
	$desc.html(descHtml);
	$topContent.html(topContentHtml);
	$optionalComponent.html(optionalComponentHtml);
	let resultData = sumResourceSizeData.data;
	let resultCode = sumResourceSizeData.result_code;
	if(resultCode==200){
		$topContent.html(topContentHtml);
		$("#type1_size").html(fileSizeUnitFormatter(resultData.type1_size));
		$("#type2_size").html(fileSizeUnitFormatter(resultData.type2_size));
		$("#percentage").html(`${resultData.percentage.toFixed(1)}%`);			
	}
	else {
		$topContent.html("해당 데이터가 없습니다.");
	}
}

tabulatorFunctions.sizeTabulator = function(data){
	let result = new Tabulator("#volist", {
		height:"500px",
		selectable:false,
	    progressiveLoad:"scroll",	    
	    // pagination:true, // progressiveLoad 옵션과 양립 X
	    paginationMode:"remote", // enable remote pagination
	    paginationSize:14, // 목록 크기
	    progressiveLoad:"scroll",	
	    sortMode: "remote",
	    ajaxURL:"/selectResourceListByParentId", // set url for ajax request
	    ajaxParams:data,	    
	    placeholder:"해당 조건에 맞는 데이터가 존재하지 않습니다.",
	    autoResize:true,
	    tooltips:false,
	    locale:true,
	    langs:{
	        "default":{
	            "pagination":{
	                "counter":{
	                    "showing": "Showing",
	                    "of": "of",
	                    "rows": "rows",
	                    "pages": "pages",
	                    "Prev": "이전",
	                }
	            },
	            "data":{
					"loading":`<div class="spinner-border text-primary m-1" role="status"><span class="sr-only">Loading...</span></div>`,
					"error":"Error",
				},          
	            
	        },
	    },	    
	    ajaxContentType : "application/json; charset=utf-8",
	    ajaxContentType:"json",
	    ajaxResponse:function(url,prarm,response){
	    	// console.log("page : "+this.getPage());
	    	// console.log("size : "+this.getSize());
	    	$("#list_cnt span").html(response.list_cnt);
	    	for(let i=0;i<response.data.length;i++){
	    		let size1 = parseFloat(response.data[i].resource_new_size_type1);
	    		let size2 = parseFloat(response.data[i].resource_new_size_type2);
	    		response.data[i].reduction_rate = null;
	    		if(size2 > 0){
	    			response.data[i].reduction_rate = ((size1 - size2) / size1)*100;	    
	    			response.data[i].reduction_rate = response.data[i].reduction_rate.toFixed(1)+"%";
	    		}else{
	    			response.data[i].reduction_rate = UNOPTIMIZED;
	    		}
	    	}
	    	return response; 
	    },
	    paginationInitialPage: 1,
	    paginationLoading: "<div class='custom-pagination-loader'><div class='spinner'></div>Loading...</div>",
	    layout: "fitColumns",
	    columns: [ 	
	    	{
	    		title: "No",
	    		field: "resource_no",
	    		hozAlign: "right",
	    		headerSort:true,
	    		visible:false,
				resizable:false,
	    	},	    	
	    	{
	    		title: "No",
	    		field: "row_no",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		width: 50,
	    		headerSort:false,
				resizable:false,
	    	},
	    	{
	    		title: "구분",
	    		field: "resource_type",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:true,
	    		width: 80,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = `<span style="font-size:1.2em;">`;
	    			switch(cell.getValue()){
		    			case 0 : result += `📁`; break;
		    			case 1 : result += `🖼️`; break;
		    			case 2 : result += `🎥`; break;
		    			case 3 : result += `📄`; break;
		    			case 4 : result += `🅰️`; break;
	    			}
	    			result += "</span>";
	    			return result;
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "웹 컨텐츠 이름",
	    		field: "resource_name",
	    		hozAlign: "left",
	    		headerSort:true,
	    		widthgrow :true,
	    		cellClick: function(e, cell) {
	                let rowData = cell.getRow().getData(); // 클릭된 셀의 행 데이터 가져오기
	                if(rowData['resource_type'] == 0){
	                	$('#folderlist').jstree(true).deselect_all();
	                	$('#folderlist').jstree(true).select_node(rowData['resource_no']);	                	
	                }
	            },
				resizable:false,	    		
	    	},
	    	{
	    		title: "원본 크기",
	    		field: "resource_new_size_type1",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = cell.getValue();
	    			if(result > 0){
	    				result = fileSizeUnitFormatter(result);
	    			}
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "최적화 크기",
	    		field: "resource_new_size_type2",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = cell.getValue();
	    			if(result > 0){
	    				result = fileSizeUnitFormatter(result);
	    			}
	    			if(result == 0){
	    				result = UNOPTIMIZED;
	    			}
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "파일 경량화율",
	    		field: "reduction_rate",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 120,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue();
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "마지막 최적화 일시",
	    		field: "updt_dt",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:false,
	    		width: 180,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let dateArray = cell.getValue().split('.');
	    			let result = dateArray[0];
	    			if(result == null || result == undefined || result == ""){
	    				result = UNOPTIMIZED;
	    			}
	    			return result;
	    		},
				resizable:false,
	    	},		    	
	    	
	    ],	    
	});	
	
	return result;
}


function singleTimeCheckBtnEvent(param){
	let title = "렌더링 시간 측정을 시작합니다.";
	if (param && param.retry !== undefined && param.retry === 1) {
		title = "렌더링 시간을 다시 측정합니다.";
	}
	Swal.fire({
		icon: "warning",
		title: title,
		text: "잠시 기다려주세요.",
		showCancelButton: false,
		confirmButtonColor: "#51d28c",
		cancelButtonColor: "#f34e4e",
		confirmButtonText: "확인",
		cancelButtonText: "취소",
		showClass: {
			popup: 'animate__animated animate__fadeIn animate__faster',
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOut animate__faster',
		},        
	});
	let targetRow = table_resource.getRows().find(function(row) {
        return row.getData().resource_no === param.resource_no;
    });
	if(targetRow){
		console.log("해당 row가 존재합니다.");
		let updateData = Object.assign({}, targetRow.getData());
		updateData.org_time = -1;
		updateData.new_time = -1;
		targetRow.update(updateData);
		targetRow.reformat();
	}
	optimizerCheckTimeAgent(param);
}

topFunctions.latestTopContent = function(){	
	let descHtml = `이번달 새로 추가된 웹 콘텐츠 목록을 확인하실 수 있습니다.`;
	let topContentHtml = null;
	topContentHtml = `이번달 <span id="date-range" style="color:#ffffff; font-weight:normal;"></span> 새로 추가된 웹 콘텐츠는 총 <span id="latest-count"></span>입니다.`;
	let optionalComponentHtml = ``;
	$desc.html(descHtml);
	$topContent.html(topContentHtml);
	$optionalComponent.html(optionalComponentHtml);
	let targetData = newResourceArray.find(item => item.resource_status == 99);
	$topContent.find("#latest-count").html(`${targetData.count}건`);
	let startDate = formatTsToKorean($("input[name=startDate_ts]").val());
	let endDate = formatTsToKorean($("input[name=endDate_ts]").val());
	$topContent.find("#date-range").html(`(${startDate} ~ ${endDate})`);
	$("input[name=search_date]").val(1);
}

tabulatorFunctions.latestTabulator = function(data){
	let result = new Tabulator("#volist", {
		height:"500px",
		selectable:false,
	    progressiveLoad:"scroll",	    
	    // pagination:true, // progressiveLoad 옵션과 양립 X
	    paginationMode:"remote", // enable remote pagination
	    paginationSize:14, // 목록 크기
	    progressiveLoad:"scroll",	
	    sortMode: "remote",
	    ajaxURL:"/selectResourceListByParentId", // set url for ajax request
	    ajaxParams:data,	    
	    placeholder:"해당 조건에 맞는 데이터가 존재하지 않습니다.",
	    autoResize:true,
	    tooltips:false,
	    locale:true,
	    langs:{
	        "default":{
	            "pagination":{
	                "counter":{
	                    "showing": "Showing",
	                    "of": "of",
	                    "rows": "rows",
	                    "pages": "pages",
	                    "Prev": "이전",
	                }
	            },
	            "data":{
					"loading":`<div class="spinner-border text-primary m-1" role="status"><span class="sr-only">Loading...</span></div>`,
					"error":"Error",
				},          
	            
	        },
	    },	    
	    ajaxContentType : "application/json; charset=utf-8",
	    ajaxContentType:"json",
	    ajaxResponse:function(url,prarm,response){
	    	// console.log("page : "+this.getPage());
	    	// console.log("size : "+this.getSize());
	    	$("#list_cnt span").html(response.list_cnt);
	    	for(let i=0;i<response.data.length;i++){
	    		let size1 = parseFloat(response.data[i].resource_new_size_type1);
	    		let size2 = parseFloat(response.data[i].resource_new_size_type2);
	    		response.data[i].reduction_rate = null;
	    		if(size2 > 0){
	    			response.data[i].reduction_rate = ((size1 - size2) / size1)*100;	    
	    			response.data[i].reduction_rate = response.data[i].reduction_rate.toFixed(1)+"%";
	    		}else{
	    			response.data[i].reduction_rate = UNOPTIMIZED;
	    		}
	    	}
	    	return response; 
	    },
	    paginationInitialPage: 1,
	    paginationLoading: "<div class='custom-pagination-loader'><div class='spinner'></div>Loading...</div>",
	    layout: "fitColumns",
	    columns: [ 	
	    	{
	    		title: "No",
	    		field: "resource_no",
	    		hozAlign: "right",
				headerHozAlign:"center",
	    		headerSort:true,
	    		visible:false,
				resizable:false,
	    	},	    	
	    	{
	    		title: "No",
	    		field: "row_no",
	    		width: 50,
	    		hozAlign: "right",
				headerHozAlign:"center",
	    		headerSort:false,
				resizable:false,
	    	},
	    	{
	    		title: "구분",
	    		field: "resource_type",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:true,
	    		width: 80,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = `<span style="font-size:1.2em;">`;
	    			switch(cell.getValue()){
		    			case 0 : result += `📁`; break;
		    			case 1 : result += `🖼️`; break;
		    			case 2 : result += `🎥`; break;
		    			case 3 : result += `📄`; break;
		    			case 4 : result += `🅰️`; break;
	    			}
	    			result += "</span>";
	    			return result;
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "웹 컨텐츠 이름",
	    		field: "resource_name",
	    		hozAlign: "left",
	    		headerSort:true,
	    		widthgrow :true,
	    		cellClick: function(e, cell) {
	                let rowData = cell.getRow().getData(); // 클릭된 셀의 행 데이터 가져오기
	                if(rowData['resource_type'] == 0){
	                	$('#folderlist').jstree(true).deselect_all();
	                	$('#folderlist').jstree(true).select_node(rowData['resource_no']);	                	
	                }
	            },
				resizable:false,	    		
	    	},
	    	{
	    		title: "최적화 적용",
	    		field: "resource_status",
	    		hozAlign: "center",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
					let result = cell.getValue();
					result = printResourceStatus(result);
					return result;
	    		},
				resizable:false,
				headerHozAlign:"center",
	    	},		
	    	{
	    		title: "원본 크기",
	    		field: "resource_new_size_type1",
	    		hozAlign: "right",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = cell.getValue();
	    			if(result > 0){
	    				result = fileSizeUnitFormatter(result);
	    			}
	    			return result;
	    		},
				resizable:false,
				headerHozAlign:"right",
	    	},		
	    	{
	    		title: "최적화 크기",
	    		field: "resource_new_size_type2",
	    		hozAlign: "right",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = cell.getValue();
	    			if(result > 0){
	    				result = fileSizeUnitFormatter(result);
	    			}
	    			if(result == 0){
	    				result = UNOPTIMIZED;
	    			}
	    			return result;
	    		},
				resizable:false,
				headerHozAlign:"right",
	    	},		
	    	{
	    		title: "파일 경량화율",
	    		field: "reduction_rate",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 120,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue();
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "등록 일시",
	    		field: "rgstr_dt",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:false,
	    		width: 180,
	    		formatter: function(cell, formatterParams, onRendered) {
					let result = cell.getValue();
					let resultArray = result.split("."); 
	    			return resultArray[0];
	    		},
				resizable:false,
	    	},		    	
	    	
	    ],	    
	});	
	
	return result;
}

topFunctions.checkLatestTopContent = function(){	
	let descHtml = `이번달 새로 추가된 웹 콘텐츠 중 확인이 필요한 웹 콘텐츠 목록을 확인하실 수 있습니다.`;
	let topContentHtml = null;
	topContentHtml = `이번달 <span id="date-range" style="color:#ffffff; font-weight:normal;"></span> 새로 추가된 웹 콘텐츠 중 확인이 필요한 (최적화 상태가 미흡인) 웹 콘텐츠는 총 <span id="latest-count"></span>입니다.`;
	let optionalComponentHtml = ``;
	$desc.html(descHtml);
	$topContent.html(topContentHtml);
	$optionalComponent.html(optionalComponentHtml);
	let targetData = newResourceArray.find(item => item.resource_status == 98);
	$topContent.find("#latest-count").html(`${targetData.count}건`);
	let startDate = formatTsToKorean($("input[name=startDate_ts]").val());
	let endDate = formatTsToKorean($("input[name=endDate_ts]").val());
	$topContent.find("#date-range").html(`(${startDate} ~ ${endDate})`);
	$("input[name=search_date]").val(1);
	$("input[name=search_condition]").val(-1);
}

tabulatorFunctions.checkLatestTabulator = function(data){
	let result = new Tabulator("#volist", {
		height:"500px",
		selectable:false,
	    progressiveLoad:"scroll",	    
	    // pagination:true, // progressiveLoad 옵션과 양립 X
	    paginationMode:"remote", // enable remote pagination
	    paginationSize:14, // 목록 크기
	    progressiveLoad:"scroll",	
	    sortMode: "remote",
	    ajaxURL:"/selectResourceListByParentId", // set url for ajax request
	    ajaxParams:data,	    
	    placeholder:"해당 조건에 맞는 데이터가 존재하지 않습니다.",
	    autoResize:true,
	    tooltips:false,
	    locale:true,
	    langs:{
	        "default":{
	            "pagination":{
	                "counter":{
	                    "showing": "Showing",
	                    "of": "of",
	                    "rows": "rows",
	                    "pages": "pages",
	                    "Prev": "이전",
	                }
	            },
	            "data":{
					"loading":`<div class="spinner-border text-primary m-1" role="status"><span class="sr-only">Loading...</span></div>`,
					"error":"Error",
				},          
	            
	        },
	    },	    
	    ajaxContentType : "application/json; charset=utf-8",
	    ajaxContentType:"json",
	    ajaxResponse:function(url,prarm,response){
	    	// console.log("page : "+this.getPage());
	    	// console.log("size : "+this.getSize());
	    	$("#list_cnt span").html(response.list_cnt);
	    	for(let i=0;i<response.data.length;i++){
	    		let size1 = parseFloat(response.data[i].resource_new_size_type1);
	    		let size2 = parseFloat(response.data[i].resource_new_size_type2);
	    		response.data[i].reduction_rate = null;
	    		if(size2 > 0){
	    			response.data[i].reduction_rate = ((size1 - size2) / size1)*100;	    
	    			response.data[i].reduction_rate = response.data[i].reduction_rate.toFixed(1)+"%";
	    		}else{
	    			response.data[i].reduction_rate = UNOPTIMIZED;
	    		}
	    	}
	    	return response; 
	    },
	    paginationInitialPage: 1,
	    paginationLoading: "<div class='custom-pagination-loader'><div class='spinner'></div>Loading...</div>",
	    layout: "fitColumns",
	    columns: [ 	
	    	{
	    		title: "No",
	    		field: "resource_no",
	    		hozAlign: "right",
	    		headerSort:true,
	    		visible:false,
				resizable:false,
	    	},	    	
	    	{
	    		title: "No",
	    		field: "row_no",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		width: 50,
	    		headerSort:false,
				resizable:false,
	    	},
	    	{
	    		title: "구분",
	    		field: "resource_type",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:true,
	    		width: 80,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = `<span style="font-size:1.2em;">`;
	    			switch(cell.getValue()){
		    			case 0 : result += `📁`; break;
		    			case 1 : result += `🖼️`; break;
		    			case 2 : result += `🎥`; break;
		    			case 3 : result += `📄`; break;
		    			case 4 : result += `🅰️`; break;
	    			}
	    			result += "</span>";
	    			return result;
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "웹 컨텐츠 이름",
	    		field: "resource_name",
	    		hozAlign: "left",
	    		headerSort:true,
	    		widthgrow :true,
	    		cellClick: function(e, cell) {
	                let rowData = cell.getRow().getData(); // 클릭된 셀의 행 데이터 가져오기
	                if(rowData['resource_type'] == 0){
	                	$('#folderlist').jstree(true).deselect_all();
	                	$('#folderlist').jstree(true).select_node(rowData['resource_no']);	                	
	                }
	            },
				resizable:false,	    		
	    	},
	    	{
	    		title: "최적화 적용",
	    		field: "resource_status",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
					let result = cell.getValue();
					result = printResourceStatus(result); 
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "원본 크기",
	    		field: "resource_new_size_type1",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = cell.getValue();
	    			if(result > 0){
	    				result = fileSizeUnitFormatter(result);
	    			}
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "최적화 크기",
	    		field: "resource_new_size_type2",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 100,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = cell.getValue();
	    			if(result > 0){
	    				result = fileSizeUnitFormatter(result);
	    			}
	    			if(result == 0){
	    				result = UNOPTIMIZED;
	    			}
	    			return result;
	    		},
				resizable:false,
	    	},		
	    	{
	    		title: "파일 경량화율",
	    		field: "reduction_rate",
	    		hozAlign: "right",
				headerHozAlign:"right",
	    		headerSort:false,
	    		width: 120,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue();
	    		},
				resizable:false,
	    	},
	    	{
	    		title: "최적화 상태",
	    		field: "resource_condition",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:false,
	    		width: 120,
	    		formatter: function(cell, formatterParams, onRendered) {
					let cellValue = cell.getValue();
					let result = "";
					if(cellValue == 1){
	    				result = `<span class="badge badge-normal">양호</span>`;	    			
	    			}else{
	    				result = `<span class="badge badge-abnormal">미흡</span>`;
	    			}
	    			return result;

	    		},
				resizable:false,
	    	},
	    	{
	    		title: "등록 일시",
	    		field: "rgstr_dt",
	    		hozAlign: "center",
				headerHozAlign:"center",
	    		headerSort:false,
	    		width: 180,
	    		formatter: function(cell, formatterParams, onRendered) {
					let result = cell.getValue();
					let resultArray = result.split("."); 
	    			return resultArray[0];
	    		},
				resizable:false,
	    	},		    	
	    	
	    ],	    
	});	
	
	return result;
}