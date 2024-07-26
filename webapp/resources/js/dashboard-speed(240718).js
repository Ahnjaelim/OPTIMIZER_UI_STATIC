const nodata = `<div class="no-data"><p><ion-icon name="alert-circle-outline"></ion-icon> 해당 데이터가 존재하지 않습니다.</p></div>`;
const UNOPTIMIZED = `<span style="color:rgba(255,255,255,0.3);">최적화 전</span>`;
const UNCHECKED = `<span style="color:rgba(255,255,255,0.3);">측정 전</span>`;
const CHECKING = `<span style="color:rgba(255,255,255,0.3);">측정 중</span>`;
const USE_UNSTRFILE = true; // 비정형 사용 여부

// 인터벌 관리
let animationData = [];
let dataInterval = null;

// 데이터 가져오기
let resourceCountData = null;
let resourceCountArray = null;
let statusCountArray = {
	sum : [],
	unstrfile_sum : [],
};
statusCountArray.sum[-1] = 0;
statusCountArray.sum[0] = 0;
statusCountArray.sum[1] = 0;
statusCountArray.sum[2] = 0;
statusCountArray.sum[11] = 0;
statusCountArray.unstrfile_sum[-1] = 0;
statusCountArray.unstrfile_sum[0] = 0;
statusCountArray.unstrfile_sum[1] = 0;
statusCountArray.unstrfile_sum[2] = 0;
statusCountArray.unstrfile_sum[11] = 0;
let strfileCountArray = [];
let unstrfileCountArray = [];

let newResourceData = null;
let newResourceArray = null;

let avgTimeData = null;
let avgTimeArray = null;
let avgTimeByTypeData = null;
let avgTimeByTypeArray = null;
let sumResourceSizeData = null;
let sumResourceSizeArray = null;
let sumResourceTypeSizeData = null;
let sumResourceTypeSizeArray = null;
let alarmData = getAlertAjax(null,null);
let alarmArray = alarmData.data;
let latestAlarmArray = getAlertAjax('1',null);

/** 비정형 */
let newUnstrResourceData = null;
let newUnstrResourceArray = null;
let sumUnstrResourceSizeData = null;
let sumUnstrResourceSizeArray = null;
let toggle = 1;

$(function() {

	if(!$(".navbar-menu li").eq(0).hasClass("active")){
		$(".navbar-menu li").eq(0).addClass("active");
	}
	targetDateInit();
	updateVisitDate();
	
	setInterval(function() {
		if (document.visibilityState === 'visible') {
			selectViewLogAll();
		} else {
		}
	}, 1000);

	animateCylinder();

	if(USE_UNSTRFILE == true){
		drawUnstrfile();
		initSwitchBtnEvent(1);
		initSwitchBtnEvent(2);
	}

	// 데이터 그리기 및 새로고침
	drawDataEle();
	drawUnstrSizeStatusEle();
	dataInterval = setInterval(function(){
		drawDataEle();
		if(USE_UNSTRFILE == true){
			if(toggle==0){
				$(`.switch-btn[data-no=1] .str`).click();
				$(`.switch-btn[data-no=2] .str`).click();
				toggle=1;		
			}else{
				$(`.switch-btn[data-no=1] .unstr`).click();
				$(`.switch-btn[data-no=2] .unstr`).click();
				toggle=0;						
			}
		}		
	},10000);
	setTimeout(function(){
		drawPieChart({targetChartEleId : "strfile-status-pie-chart", targetListEleId : "strfile-status-top10-list", useUnstrfile : 0});	
		drawPieChart({targetChartEleId : "unstrfile-status-pie-chart", targetListEleId : "unstrfile-status-top10-list", useUnstrfile : 1});	
	},500);	
	
	// [확인하세요]
	/*$(".alarm .number strong").html(latestAlarmArray.length);*/
	let alarmHtml = "";
	let strLength = 20;
	let is_new = 0;
	if(alarmData && alarmArray.length > 0){
		const newAlarmCount = alarmArray.filter(alarm => alarm.is_new === 1).length;
			if(newAlarmCount > 0) {
				for(let i = 0; i < alarmArray.length; i++){
					if(alarmArray[i].is_new === 1) {
					is_new++;
					$(".alarm .number strong").html(is_new);
				
					let content = alarmArray[i].content.length > strLength ? alarmArray[i].content.substring(0, strLength) + '...' : alarmArray[i].content;
					alarmHtml += `<li><a href="/alertCenter"><i class="fa-solid fa-bell"></i> ${content}</a></li>`;
				 }
				}
			}else{
				alarmHtml = `<li style="opacity:0.5; margin-top:30px; margin-left: 20px;">확인할 알림이 없습니다.</li>`;
			}
		
	}else {
		alarmHtml = `<li style="opacity:0.5; margin-top:30px; margin-left: 20px;">확인할 알림이 없습니다.</li>`;
	}
	$(".alarm ul").html(alarmHtml);
})

function initSwitchBtnEvent(no){
	$(`.switch-btn[data-no=${no}] .str`).click(function(){
		$(`.switch-btn[data-no=${no}] button`).removeClass("active");
		$(`.switch-btn[data-no=${no}] .str`).addClass("active");
		$(`.switch-container[data-no=${no}]`).css({"left":"0%"});
	});
	$(`.switch-btn[data-no=${no}] .unstr`).click(function(){
		$(`.switch-btn[data-no=${no}] button`).removeClass("active");
		$(`.switch-btn[data-no=${no}] .unstr`).addClass("active");		
		$(`.switch-container[data-no=${no}]`).css({"left":"-100%"});
	});	
}

function drawUnstrfile (){
	$(`.animation-row2 [data-type="5"]`).removeClass("hide");
}

function drawDataEle(){
	drawSizeStatusEle();
	drawTimeStatusEle();
	drawResourceCountEle();
	drawNewResourceEle();	
	drawTypeSizeStatusEle();	
}

function spinSlotmachine(targetEle, value, int, dcm) {

	let html = "";
	for(let i = 1; i <= int; i++){
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
	html += `.`;
	for(let i = 1; i <= dcm; i++){
		html += `<div class="slot-machine" id="slot-fixed${i}">
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
	}
	$(targetEle).html(html);

    const [integerPart, decimalPart] = value.toString().split('.');
    const valueStr = integerPart.padStart(int, '0'); // 3자리로 맞추기
    const slots = $(targetEle).find('.slot-machine .number');
	if(value < 100){
		$(targetEle).find('.slot-machine').eq(0).css({"display":"none"});
	}
	if(value < 10){
		$(targetEle).find('.slot-machine').eq(1).css({"display":"none"});
	}
	setTimeout(function(){
	    slots.each(function(index) {
	        if (index < int) { // 정수 부분
	            const digit = parseInt(valueStr[index], 10);
	            $(this).css('top', `-${digit * 1}em`); // 각 숫자의 높이에 맞게 조정
	        }
	    });
	
		if (decimalPart !== undefined) {
		    $(targetEle).find('.number-fixed').each(function(index) {
		        if (index < dcm) {
		            const decimalDigit = parseInt(decimalPart[index], 10);
		            $(this).css('top', `-${decimalDigit * 1}em`);
		        }
		    });
		}		
	},500);
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
			const size2obj = utilFnc.formatFileSize(type2_size);
			$sizeStatus.find(".value").html(`<strong class="org">${fileSizeUnitFormatter(type1_size)}</strong> <i class="fa-solid fa-right-long"></i> <strong class="new slotmachine-container" id="slotmachine1"></strong><strong class="new"><sub>${size2obj.unit}</sub></strong> <span>${percentage.toFixed(1)}%</span>`);
			spinSlotmachine("#slotmachine1", size2obj.value, 3, 1);
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

async function drawUnstrSizeStatusEle(){
	
	try {
        // 데이터 로딩 영역
        sumUnstrResourceSizeData = await selectSumResourceSize(1);
		sumUnstrResourceSizeArray = sumUnstrResourceSizeData.data;
		let percentage = sumUnstrResourceSizeArray.percentage;
		$("#unstr-predict-comp-rate").html(`<strong style="color:#ffffff;">${percentage.toFixed(1)}%</strong>`);
    } catch (error) {
    }
}

async function drawResourceCountEle(){
	
	statusCountArray.sum[-1] = 0;
	statusCountArray.sum[0] = 0;
	statusCountArray.sum[1] = 0;
	statusCountArray.sum[2] = 0;
	statusCountArray.sum[11] = 0;
	statusCountArray.unstrfile_sum[-1] = 0;
	statusCountArray.unstrfile_sum[0] = 0;
	statusCountArray.unstrfile_sum[1] = 0;
	statusCountArray.unstrfile_sum[2] = 0;
	statusCountArray.unstrfile_sum[11] = 0;	
	// 리소스 카운트
	try {
        resourceCountData = await selectCountGroupByTypeAndStatus();
        resourceCountArray = resourceCountData.data;
		for(let i=0; i<resourceCountArray.length; i++){
			const {resource_type, resource_status, type_count, status_count, percentage} = resourceCountArray[i];
			const $targetEle = $(`.optimize-progress [data-type=${resource_type}]`);

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
			if(resource_type <= 4){
				statusCountArray.sum[resource_status] += status_count;	
			}
			else if(resource_type >= 5){
				statusCountArray.unstrfile_sum[status_count] += status_count;
			}

		} // end of for
		
		let total_count = 0; // 리소스 전체 카운트
		let unstrfile_total = 0; 
		strfileCountArray = [];
		unstrfileCountArray= [];
		for(let i = -1; i <= 11; i++){
			let statusItem = statusArray.find(item => item.value == i);
			if(statusCountArray.sum[i]!=undefined){
				total_count += statusCountArray.sum[i];
				strfileCountArray.push({
					statusLable : statusItem.label,
					status : i,
					value : statusCountArray.sum[i],
				});
			}
			if(statusCountArray.unstrfile_sum[i]!=undefined){
				unstrfile_total +=	statusCountArray.unstrfile_sum[i];
				/*unstrfileCountArray.push({
					statusLable : statusItem.label,
					status : i,
					value : statusCountArray.unstrfile_sum[i],
				});*/
			}
		}
		let unstrfileTypeCountArray = [];
		unstrfileTypeCountArray[-1] = 0;
		unstrfileTypeCountArray[0] = 0;
		unstrfileTypeCountArray[1] = 0;
		unstrfileTypeCountArray[2] = 0;
		unstrfileTypeCountArray[11] = 0;
		let unstrfileTypeCount = 0;
		let typeCount = 0;
		if(USE_UNSTRFILE == true){
			let unstrfileArray = resourceCountArray.filter(item => item.resource_type >= 5);
			for(let i = 5; i <= 9; i++){
				let typeCountItem = unstrfileArray.find(item => item.resource_type == i);
				unstrfileTypeCount += typeCountItem.type_count;
			}
			for(let j = -1; j <= 11; j++){
				for(let i = 5; i <= 9; i++){
					let typeCountItem = unstrfileArray.find(item => item.resource_type == i && item.resource_status == j);
					if(unstrfileTypeCountArray[j]!=undefined){
						unstrfileTypeCountArray[j] += typeCountItem.status_count;					
					}
				}
			}
			for(let i = -1; i <= 11; i++){
				let statusItem = statusArray.find(item => item.value == i);
				if(unstrfileTypeCountArray[i]!=undefined){
					unstrfileCountArray.push({
						statusLable : statusItem.label,
						status : i,
						value : unstrfileTypeCountArray[i],
					});					
				}
			}
			const $targetEle = $(`.optimize-progress [data-type='5']`);
			const unstrfile_percent = parseInt((unstrfileTypeCountArray[1]/unstrfileTypeCount)*100);
			$targetEle.find(".value").html(`<strong>${unstrfileTypeCountArray[1]}</strong>/${unstrfileTypeCount}건`);			
			$targetEle.find(".percentage").html(`${unstrfile_percent}%`);
			$targetEle.find(".progress-bar").css({"width" : `${unstrfile_percent}%`});
		}
		$(`.type-status-table[data-file-type="strfile"] .unoptimized-count`).html(`<strong style="color:var(--color-yellow);">${statusCountArray.sum[-1]}</strong><strong>/${total_count}</strong><span>건</span>`);	
		$(`.type-status-table[data-file-type="unstrfile"] .unoptimized-count`).html(`<strong style="color:var(--color-yellow);">${unstrfileTypeCountArray[-1]}</strong><strong>/${unstrfileTypeCount}</strong><span>건</span>`);	
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
			const org_time = avgTimeArray.org_time;
			const new_time = avgTimeArray.new_time;
			$timeStatus.find(".value").html(`<strong class="org">${timeUnitFormatter(org_time)}</strong> <i class="fa-solid fa-right-long"></i> <strong class="new slotmachine-container" id="slotmachine2"></strong><strong class="new"><sub>초</sub></strong> <span>${avgTimeArray.percentage}%</span>`);
			spinSlotmachine("#slotmachine2", new_time/1000, 3, 3);
			$timeStatus.find(".desc-value").html((avgTimeArray.org_time-avgTimeArray.new_time).toFixed(1)+"ms");		
		}else if(avgTimeData.result_code==204){
			$timeStatus.find(".card-content").css({"opacity":"0.2"});
			$timeStatus.find(".card-content").after(nodata);
		}
		for(let i = 0; i < avgTimeByTypeArray.length; i++){
			let resource_type = avgTimeByTypeArray[i].resource_type;
			let $tr = $(`.type-status-table2 tr[data-resource-type=${resource_type}]`);
			let width = avgTimeByTypeArray[i].percentage;
			$tr.find(".time-rate").html(`<div style="width:0%">&nbsp;</div><p>${avgTimeByTypeArray[i].percentage}%</p>`);
			$tr.find(".time-rate-value").html(`${timeUnitFormatter(avgTimeByTypeArray[i].org_time)} <i class="fa-solid fa-right-long"></i> ${timeUnitFormatter(avgTimeByTypeArray[i].new_time)}`);
			setTimeout(function(){
				$tr.find(".time-rate div").animate({"width":width+"%"});				
			}, 500);
		}	
		$("#str-predict-comp-rate").html(`<strong style="color:#ffffff;">${avgTimeArray.percentage}%</strong>`);	

	}catch (error) {
    } 		
}

async function drawNewResourceEle(){
	try {
	    newResourceData = await selectNewResourceAll(0);
	    newResourceArray = newResourceData.data;	
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
		$(`.type-status-table[data-file-type="strfile"] .new-resource`).html(totalNewItemHtml);
		$(`.type-status-table[data-file-type="strfile"] .new-resource-check`).html(checkNewItemHtml);
		
		// 비정형
		newUnstrResourceData = await selectNewResourceAll(1);
		newUnstrResourceArray = newUnstrResourceData.data;
		totalNewItemHtml = "";
		checkNewItemHtml = "";
		const totalUnstrNewItem = newUnstrResourceArray.find(item => item.resource_status == 99);
		const checkUnstrNewItem = newUnstrResourceArray.find(item => item.resource_status == 98);
		if (totalUnstrNewItem.count > 0){
			totalNewItemHtml = `<a><strong style="color:#ffffff;">${totalUnstrNewItem.count}</strong><span style="color:#ffffff;">건</span></a>`;		
		}
		if (checkUnstrNewItem !== undefined) {
			checkNewItemHtml = `<a><strong style="color:#ffffff;">${checkUnstrNewItem.count}</strong><span style="color:#ffffff;">건</span></a>`;		
		}	
		$(`.type-status-table[data-file-type="unstrfile"] .new-resource`).html(totalNewItemHtml);
		$(`.type-status-table[data-file-type="unstrfile"] .new-resource-check`).html(checkNewItemHtml);
					
	}catch (error) {
	} 	
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
			const interval = parseInt($("#animation-multiple-value").val());
			//let interval = Math.ceil(totalDataCount / maxElements);
			let summarizedData = [];
			
			let typeMax = 4;
			if(USE_UNSTRFILE){
				typeMax = 9
			}
			
			let resourceTypeArray = [];
			for(let i = 1; i <= typeMax; i++){
				resourceTypeArray[i] = data.filter(item => item.resource_type == i);
			}
			
			let summarizedArray = [];
			for(let i = 1; i <= typeMax; i++){
				for(let j = 0; j < resourceTypeArray[i].length; j += interval) {
					if(summarizedArray[i] == undefined){
						summarizedArray[i] = [];
					}
					summarizedArray[i].push(resourceTypeArray[i][j]);
				}
			} 
			
			for(let i = 1; i <= typeMax; i++){
				if(summarizedArray[i] != undefined){
					summarizedArray[i].forEach((item, idx) => {
						let timeoutUnit = 200;
						setTimeout(function(){
							animationForeach_v2([ item ], idx * interval, interval, idx, resourceTypeArray[i].length);
						}, timeoutUnit * idx);
					});
				}
			}
			
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
const CYLINDER_UNIT = parseInt($("#animation-multiple-value").val());
const CYLINDER_MAX = 15;
function animationForeach_v2(data, startIdx, interval, idx, length){
	let q = length / interval;
	let addCount = 0;
	if(idx < q-1){
		addCount = idx * interval;
	}else{
		addCount = length % interval;
	}
	data.forEach((item, index) => {
		if(item != null && item != undefined){
			let randomTop = Math.floor(Math.random() * 35) + 15;
			let randomTop2 = Math.floor(Math.random() * 5) + 38;
			let randomTop3 = Math.floor(Math.random() * 20) + 30;
			let resource_type = item.resource_type;
			if(resource_type >= 5){
				resource_type = 5;
			}
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

				cnt += addCount;  // interval 값을 더해 실제 데이터 개수 반영				
				$(`#cylinder .type0${resource_type} .value`).text(cnt);
				const cylinderCnt = $(`#cylinder .type0${resource_type} li`).length;
				if((cnt / CYLINDER_UNIT) + 5 >= cylinderCnt){
					const $newCylinder = $(`<li style="width:10px;"><img src="/resources/img/cylinder-type0${resource_type}.png" style="width:45px; height:70px;" /></li>`);
					if(cylinderCnt <= CYLINDER_MAX){
						$(`#cylinder .type0${resource_type} ul`).append($newCylinder);
					}
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
				cnt -= addCount;  // interval 값을 빼서 실제 데이터 개수 반영
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

function drawPieChart(param){
    const {targetChartEleId, targetListEleId, useUnstrfile} = param;
    am5.ready(function() {
	
	    $(`#${targetChartEleId}`).html("");
	    // $(`#${targetListEleId}`).html("");
	    let existingRoot = am5.registry.rootElements.find(root => root.dom.id === targetChartEleId);
	    if (existingRoot) {
	        existingRoot.dispose();
	        // 타겟 엘리먼트의 내용을 지워서 잔여 데이터가 없도록 함
	    }
	    
	    // 루트 엘리먼트 생성
	    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
	    let root = am5.Root.new(targetChartEleId);
	    root._logo.dispose();
	    
	    // 테마 설정
	    // https://www.amcharts.com/docs/v5/concepts/themes/
	    root.setThemes([
	      am5themes_Animated.new(root)
	    ]);
	    
	    // 차트 생성
	    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
	    let chart = root.container.children.push(am5percent.PieChart.new(root, {
	      radius: am5.percent(90),
	      innerRadius: am5.percent(50),
	      layout: root.horizontalLayout,
	    }));
	    
	    // 시리즈 생성
	    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
	    let series = chart.series.push(am5percent.PieSeries.new(root, {
	      name: "Series",
	      valueField: "value",
	      categoryField: "statusLable",
	    }));
	    
	    series.slices.template.events.on("click", function(ev) {
	        let sliceData = ev.target.dataItem.dataContext;
	        let listData = selectResourceTop10({resource_status : sliceData.status, use_unstrfile : useUnstrfile});
	        const $targetEle = $(`#${targetListEleId}`);
	        if(useUnstrfile==1){
	            
	        }
	        let targetStatusItem = statusArray.find(item => item.value == sliceData.status);
	        let html = `
	        <table class="ranking-table">
	        <colgroup>
	            <col width="30px" />
	            <col width="*" />
	            <col width="120px" />
	            ${useUnstrfile != 1 ? '<col width="120px" />' : ''}
	        </colgroup>
	            <thead>
	                <tr>
	                    <th colspan="4" style="background:rgba(255,255,255,0.1);">${targetStatusItem.label}</th>
	                </tr>
	                <tr>
	                    <th>#</th>
	                    <th>웹 콘텐츠 이름</td>
	                    <th>원본 용량</th>
	                    ${useUnstrfile != 1 ? '<th>원본 렌더링 시간</th>' : ''}
	                </tr>
	            </thead>
	            <tbody>
	        `;
	        for(let i = 0; i < 5; i++){
	            if(i < listData.length){
	                html += `<tr>
	                    <td>${i+1}</td>
	                    <td>${listData[i].resource_name}</td>
	                    <td align="right">${fileSizeUnitFormatter_v2(listData[i].resource_new_size_type1)}</td>
	                     ${useUnstrfile != 1 ? `<td align=right>${timeUnitFormatter(listData[i].org_time)}</td>` : ''}
	                </tr>`;                
	            }else{
	                html += `<tr>
	                    <td colspan="4" align="center"><span style="color:rgba(255, 255, 255, 0.5);">데이터 없음</span></td>
	                </tr>
	                `;
	            }
	        }
	        html += `</tbody>
	            </table>`;
	        $targetEle.html(html);
	    });    
	    
	    // 데이터 설정
	    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
	    let data = strfileCountArray;
	    series.data.setAll({});
	    if(useUnstrfile==1){
	        data = unstrfileCountArray;
	    }
	
	    series.data.setAll(data);
	    
	    // 레이블과 틱 비활성화
	    series.labels.template.set("visible", false);
	    series.ticks.template.set("visible", false);
	
	    series.slices.template.setAll({
	      cornerRadius: 8
	    });
	    series.states.create("hidden", {
	      endAngle: -90
	    });
	
	    // 범례 생성
	    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
	    let legend = chart.children.push(am5.Legend.new(root, {
	      centerY: am5.percent(50),
	      y: am5.percent(50),
	      layout: root.verticalLayout,
	
	    }));
	    // 값 레이블 정렬을 오른쪽으로 설정
	    legend.valueLabels.template.setAll({ 
	        textAlign: "right",
	         fill: am5.color(0xFFFFFF),
	        events: {}
	    })
	    // 레이블의 너비 및 최대 너비 설정
	    legend.labels.template.setAll({ 
	      maxWidth: 140,
	      width: 140,
	      oversizedBehavior: "wrap",
	        fill: am5.color(0xFFFFFF)
	    });
	    legend.data.setAll(series.dataItems);
	    
	    // 초기 시리즈 애니메이션 재생
	    // https://www.amcharts.com/docs/v5/concepts/anim ations/#Animation_of_series
	    series.appear(1000, 100);
    
        // 특정 슬라이스를 클릭하도록 트리거하는 함수
        function clickSliceByIndex(index) {
            if (index >= 0 && index < series._dataItems.length) {
                let slice = series._dataItems[index];
                if (slice) {
                    let sliceElement = slice.get("slice");
                    if (sliceElement) {
                        sliceElement.events.dispatch("click", {
                            type: "click",
                            target: sliceElement
                        });
                    } else {
                        console.log("slice.get('slice')가 undefined입니다.");
                    }
                } else {
                    console.log("해당 인덱스에 데이터 항목이 없습니다.");
                }
            } else {
                console.log("인덱스가 범위를 벗어났습니다.");
            }
        }
            
        series.events.on("datavalidated", function() {
            let chartDataArray = series.data.values;
            let maxValue = 0;
            let maxIndex = 0;
            for(let i = 0; i < chartDataArray.length; i++){
                if(chartDataArray[i].value > maxValue){
                    maxValue = chartDataArray[i].value;
                    maxIndex = i;
                }
            }
            setTimeout(() => {
                clickSliceByIndex(maxIndex);
            }, 1500);
        });
    
    
    }); // end am5.ready()
}


async function drawTypeSizeStatusEle(){
	try {
        sumResourceTypeSizeData = await selectSizeGroupByType();
        sumResourceTypeSizeArray = sumResourceTypeSizeData.data;
		for(let i = 0; i < sumResourceTypeSizeArray.length; i++){
			const {resource_type, size1, size2, percentage} = sumResourceTypeSizeArray[i];
			if(resource_type >= 5){
				let $tr = $(`.type-status-table2 tr[data-resource-type=${resource_type}]`);
				$tr.find(".time-rate").html(`<div style="width:0%">&nbsp;</div><p>${percentage}%</p>`);
				
				$tr.find(".time-rate-value").html(`${fileSizeUnitFormatter_v2(size1)} <i class="fa-solid fa-right-long"></i> ${fileSizeUnitFormatter_v2(size2)}`);
				setTimeout(function(){
					$tr.find(".time-rate div").animate({"width":percentage+"%"});
				}, 500);
			}
		}	
	}catch (error) {
    } 	
}