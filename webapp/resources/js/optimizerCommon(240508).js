
var table_resource = null;
var scrollTop = 0;
var selectedRows = null;
const statusArray = [
	{value : 1, label : "최적화 완료", icon : "check-circle"},
	{value : 0, label : "최적화 대기", icon : "hourglass-start"},
	{value : 11, label : "최적화 진행 중", icon : "hourglass-half"},
	{value : -1, label : "최적화 미적용", icon : "minus-circle"},
	{value : 2, label : "최적화 해제", icon : "circle-xmark"},
	// {value : 3, label : "없음", icon : "question-circle"},	
];

const typeArray = [
	{value : 1, label : "이미지", icon : "image"},
	{value : 2, label : "동영상", icon : "video"},
	{value : 3, label : "텍스트", icon : "code"},
	{value : 4, label : "폰트", icon : "font"},
];

$(function(){
	tabmenuEventInit();
	
});

function optimizerByContentInit(){
	$('#explorer .content').jstree({
		'core' : {
			'data' : jsonData,
			'themes' : {
				"variant" : "large",
			}
		},
	    /*'checkbox': {
	        'keep_selected_style': false // 선택된 스타일 유지
	    },
	    'plugins': ['checkbox', 'core'],*/
	}).on('select_node.jstree', function (e, data) {
		var selectedNodeId = data.node.id;
		selectResourceListByParentId(data.node.id);
		$("select[name=search_range]").val(1); // 폴더를 클릭하는 경우 강제로 폴더 검색으로 전환
	});
	
	// jstree 카운트 초기화 문제 해결
	$('#explorer .content').on("click.jstree", ".jstree-ocl", function (e)  {
	    if ((this).parentElement.classList.contains('jstree-closed')) {
	    	selectedNode = ($(this).nextAll(".jstree-anchor").attr("id"))
		     var node = $('#JSTree').jstree("get_node", selectedNode);
	    	//console.log("닫힘"+node.id);
	     }else{
	    	 jstreeCountInit();
	    	 console.log("열림");
	    	 selectResourceListByParentId();
	     }
	})	
	
	setTimeout(function(){
		$('#explorer .content').jstree(true).open_all();	
	},1000);

	setTimeout(function(){
		jstreeCountInit();
		selectResourceListByParentId();
		
	},1100);

	searchInit();
	
	
	// 타뷸레이터 업데이트 인터벌
	var tabulatorInterval = setInterval(function(){
		tabulatorUpdateInterval();
		
		/*
		// scrollTop = $("#resourceListModal").scrollTop();
		selectedRows = table_resource.getSelectedData();
		let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
		let updateData = selectResourceListByParentIdAjax(selectedNodeId);
		
		table_resource.setData(updateData).then(function(){
			// $("#resourceListModal").scrollTop(scrollTop);
			let data = table_resource.getData();
			for(let i = 0; i < selectedRows.length; i++){
				let targetData = data.find(function(row){
					return row.resource_no === selectedRows[i].resource_no;
				});
				if(targetData) {
					table_resource.selectRow(targetData.id);
				}else{
					console.log("해당 행을 찾는데 실패했습니다.");
				}
			}
		});*/
		
	}, 2000);
	
	
	setTimeout(function(){
		$('#preLoader').fadeOut(300);
	},2000);
	//로딩을위해 넣음 
	
	$(".jstree-node").on("click", function(){
		console.log("열림 / 닫힘");
	});
	
}

function jstreeCountInit(){
	$(".jstree .jstree-anchor").each(function(){
		if (!$(this).children(".count").length) {
			$(this).append(` <span class="count"></span>`);
		}
	});	
}

function drawResourceModal(resource_no){
	// console.log(selectResourceByResourceNo(resource_no));
	
	// 데이터 불러오기
	let result1 = selectResourceByResourceNo(resource_no);
	let result2 = selectResourceLogAllByResourceNo(resource_no);
	let result3 = selectPageAllByResourceNo(resource_no);
	let result3data = result3[0];
	let result3JSTreeData = JSON.parse(result3[1]);
	
	// 1번 탭 그리기
	let resource_new_size_type1 = fileSizeUnitFormatter(result1.resource_new_size_type1);
	let resource_new_size_type2 = fileSizeUnitFormatter(result1.resource_new_size_type2);
	let resource_status = "";
	switch(result1.resource_status){
		case -1 : 
			resource_status = `<span class="status status-gray">미적용</span>`;
			break;
		case 0 : 
			resource_status = `<span class="status status-yellow">최적화 대기</span>`;
			break;
		case 1 : 
			resource_status = `<span class="status status-green">최적화 완료</span>`;
			break;
	}
	
	let newCostPerByte = findSiteBySiteNo(result1.site_no).costPerByte;
	console.log(newCostPerByte);
	let cost_before = parseInt(result1.resource_new_size_type1 * result1.call_cnt * newCostPerByte);
	let cost_after = parseInt(result1.resource_new_size_type2 * result1.call_cnt * newCostPerByte);
	let html1 = `
		<table class="table table-bordered center">
		<colgroup>
			<col width="20%" />
			<col width="30%" />
			<col width="20%" />
			<col width="30%" />
		</colgroup>
		<tbody>
		<tr>
			<th>웹 컨텐츠 이름</th>
			<td>${result1.resource_org}</td>
			<th>최적화 상태</th>
			<td style="padding:6px;">${resource_status}</td>
		</tr>
		<tr>
			<th>최적화 전 누적 비용</th>
			<td>${comma(cost_before)}원</td>
			<th>최적화 후 누적 비용</th>
			<td>${result1.resource_new_size_type2 == null || result1.resource_new_size_type2 == 0 ? "<span class='gray'>최적화 전</span>" : comma(cost_after)+"원" }</td>
		</tr>
		<tr>
			<th>호출 횟수</th>
			<td>${comma(result1.call_cnt)}건</td>
			<th>절감 비용</th>
			<td style="padding:6px;">
				${result1.resource_new_size_type2 > 0 ? "<span style='color:#4e73df; font-weight:bold;'>"+comma((cost_before-cost_after)*-1)+"원</span>" : "<span class='gray'>최적화 전</span>" }
				${result1.resource_new_size_type1 > 0 && result1.resource_new_size_type2 > 0 && result1.resource_new_size_type1 != result1.resource_new_size_type2 ? decreaseRate(cost_before, cost_after) : ''}
			</td>
		</tr>
		</tbody>
		</table>
		<table class="table table-bordered center">
		<colgroup>
			<col width="50%" />
			<col width="50%" />
		</colgroup>
		<thead>
		<tr>
			<th>최적화 전</th>
			<th class="table-primary">최적화 후</th>
		</tr>
		<tr>
			<th>${resource_new_size_type1}</th>
			<th class="table-primary">
				${resource_new_size_type2}
				${result1.resource_new_size_type1 > 0 && result1.resource_new_size_type2 > 0 ? decreaseRate(result1.resource_new_size_type1, result1.resource_new_size_type2) : ''}
			</th>
		</tr>		
		</thead>
		<tbody>
		<tr>`;
		let resourcePrint = resourcePrintByType(result1);
	html1 += `<td>${resourcePrint.col1}</td>
			<td>${resourcePrint.col2}</td>
		</tr>
		</tbody>
		</table>
		`;
	
	// 2번 탭 그리기
	let html2 = `
		<div class="history-container">
			<div class="log">
				<ul>`;
					for(let i = 0; i<result2.length; i++){
						let resource_log_content = result2[i].resource_log_content;
						if(resource_log_content.includes("수집") || resource_log_content.includes("해제")){
							html2 += `<li>
								<p>${dateFormatter(result2[i].rgstr_dt)}</p>
								<p>${result2[i].resource_log_content}<br />(${fileSizeUnitFormatter(result2[i].resource_org_size)})</p>
							</li>`;
						}else{
							html2 += `<li>
								<p>${dateFormatter(result2[i].rgstr_dt)}</p>
								<p>${result2[i].resource_log_content}<br />
									(${fileSizeUnitFormatter(result2[i].resource_new_size_type1)} <ion-icon name="arrow-forward-outline" style="opacity:0.5;"></ion-icon> ${fileSizeUnitFormatter(result2[i].resource_new_size_type2)} ${decreaseRate(result2[i].resource_new_size_type1, result2[i].resource_new_size_type2)})</p>
							</li>`;
						}

					}
	html2 += ` </ul>
			</div>
			<div class="preview">
				<ul>`;
				for(let i = 0; i<result2.length; i++){
					let resource_log_content = result2[i].resource_log_content;
					let resourcePrint = resourcePrintByType(result2[i]);
					if(resource_log_content.includes("수집")){
						html2 += `<li>
							<table class="table table-bordered">
							<thead>
								<th>웹 컨텐츠 수집</th>
							</thead>
							<tbody>
								<td>${resourcePrint.col1}</td>
							</tbody>
							</table>						
						</li>`;
					}else{
						html2 += `<li>
							<table class="table table-bordered center">
							<thead>
							<tr>
								<th>최적화 전</th>
								<th>최적화 후</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>${resourcePrint.col1}</td>
								<td>${resourcePrint.col2}</td>
							</tr>
							</tbody>
							</table>
						</li>`;
					}
				}	
	html2 += `  </ul>
			</div>
		</div>
	`;
	if(result2.length == 0){
		html2 = `<div class="history-container">
			<div class="no-data">아직 해당 웹 컨텐츠의 최적화 이력이 존재하지 않습니다.</div>
		</div>`;
	}
	
	// 3번 탭 그리기
	let html3 = `
		<div class="page-container">
			<div class="page"></div>
			<div class="preview">
				<ul>`;
				for(let i = 0; i < result3data.length; i++){
					html3 += `<li data-page-no="${result3data[i].page_no}"></li>`;
				}
	html3 += ` </ul>
			</div>
		</div>
	`;
	if(result3data.length == 0){
		html3 = "데이터 없음!";
	}
		
	// 뿌리기
	$('#resourceModal .tabcontent li.content').eq(0).html(html1);
	$('#resourceModal .tabcontent li.content').eq(1).html(html2);
	$('#resourceModal .tabcontent li.content').eq(2).html(html3);
	
	// 1번 탭 절감율 0% 안내 멘트 추가
	if($("span.zero").length > 0){
		$("span.zero").click(function(){
			miniAlert(msg.savingRateInfo,"success");
		});
	}
	
	// 2번 탭 최적화 이력 마우스 클릭 이벤트 설정
	if(result2.length > 0){
		historyLogClickEventInit();		
	}
	
	// 3번 탭 JSTree 그리기
	$('#resourceModal .page-container .preview li').css({"display":"none"});
	$('#resourceModal .page-container .page').jstree({
		'core' : {
			'data' : result3JSTreeData
		},
	}).on('select_node.jstree', function (e, data) {
		let selectedNodeId = data.node.id;
		console.log('Selected Node ID:', selectedNodeId);
		$('#resourceModal .page-container .preview li').css({"display":"none"});
		$('#resourceModal .page-container .preview li').html("");
		$(`#resourceModal .page-container .preview li[data-page-no=${selectedNodeId}]`).css({"display":"block"});
		$(`#resourceModal .page-container .preview li[data-page-no=${selectedNodeId}]`).html(`<iframe src="/viewLogFile?page_no=${selectedNodeId}" width="100%" height="600px"></iframe>`);
	});
	setTimeout(function(){
		$('#resourceModal .page-container .page').jstree(true).open_all();
	},300);	
	
	$("#resourceModal .tabmenu li").eq(0).click();
	
	// 모달 띄우기
	$("#resourceModal").modal("show");
}

function tabmenuEventInit(){
	let targetMenu = $("#resourceModal .tabmenu"); 
	let targetContent = $("#resourceModal .tabcontent"); 
	targetContent.find("li").addClass("content");
	targetContent.find("li.content").css({"display":"none"});
	targetMenu.find("li").each(function(index, item){
		$(item).click(function(){
			targetMenu.find("li").removeClass("active");
			$(item).addClass("active");
			targetContent.find("li.content").css({"display":"none"});
			targetContent.find("li.content").eq(index).css({"display":"block"});
			if(index == 2){ // 3번 탭인 경우
				setTimeout(function(){
					$('#resourceModal .page-container .page').jstree(true).open_all();
					$(`#resourceModal .page-container .page li[role="treeitem"]`).eq(1).find("a").click();						
				},300);
				
			}
		});
	});
	$("#resourceModal .tabmenu li").eq(0).click();
}

function selectResourceByResourceNo(resource_no){
	let result = "";
	$.ajax({
		type: 'POST',
		url: '/selectResourceByResourceNo',
		data:{
			resource_no : resource_no,
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function selectResourceLogAllByResourceNo(resource_no){
	let result = "";
	$.ajax({
		type: 'POST',
		url: '/selectResourceLogAllByResourceNo',
		data:{
			resource_no : resource_no,
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function historyLogClickEventInit(){
	let target1 = $("#resourceModal .history-container .log li");
	let target2 = $("#resourceModal .history-container .preview li");
	target2.css({"display":"none"});
	target1.each(function(index, item){
		$(item).click(function(){
			target1.removeClass("active");
			$(item).addClass("active");
			target2.css({"display":"none"});
			target2.eq(index).css({"display":"block"});
		});
	});
	target1.eq(0).click();
}

function selectByPageNo(page_no){
	let result = "";
	$.ajax({
		type: 'GET',
		url: '/selectByPageNo',
		data:{
			page_no : page_no,
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function selectResourceByResourceOrg(resource_org){
	let result = "";
	$.ajax({
		type: 'POST',
		url: '/selectResourceByResourceOrg',
		data:{
			resource_org : resource_org,
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	
	return result;
}

function selectResourceListByParentId(resource_parent_no){
	
	let data = searchDataInit(resource_parent_no);
	let search_range = $("select[name=search_range]").val();
	
	table_resource = new Tabulator("#volist", {
		height:"100%",
		selectable:true,
	    pagination:true, //enable pagination
	    paginationMode:"remote", //enable remote pagination
	    sortMode: "remote",
	    ajaxURL:"/selectResourceListByParentId", //set url for ajax request
	    ajaxParams:data,	    
	    paginationSize:10, //optional parameter to request a certain number of rows per page
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
	        }
	    },	    
	    ajaxContentType : "application/json; charset=utf-8",
	    ajaxContentType:"json",
	    ajaxResponse:function(url,prarm,response){
 	    	// console.log(response);
	    	// console.log(prarm);
	    	// console.log("page : "+this.getPage());
	    	// console.log("size : "+this.getSize());
	    	$("#list_cnt span").html(response.list_cnt);
	    	for(let i=0;i<response.data.length;i++){
	    		// 절감률 계산
	    		response.data[i].saving_rate = decreaseRate(response.data[i].resource_new_size_type1, response.data[i].resource_new_size_type2);
	    
	    		// 상세보기 버튼
	    		response.data[i].detail_btn = `<a class="btn btn-primary  btn-sm btn-icon-split" onclick="drawResourceModal(${response.data[i].resource_no});">
	    			<span class="icon text-white-50"><i class="fas fa-search"></i></span>
	    			<span class="text">상세보기</span></a>`;
	    		if(response.data[i].resource_type==0){
	    			response.data[i].detail_btn = `<a class="btn btn-secondary btn-sm btn-icon-split" style="opacity:0.5;">
		    			<span class="icon text-white-50"><i class="fas fa-search"></i></span>
		    			<span class="text">상세보기</span></a>`;	    			
	    		}
	    		
	    	}
	    	// console.log(response);
	    	return response; 
	    },
	    paginationInitialPage: 1,
	    layout: "fitColumns",
	    columns: [
			{
				formatter:"rowSelection", 
				titleFormatter:"rowSelection", 
				titleFormatterParams:{
					rowRange:"active" //only toggle the values of the active filtered rows
				}, 
				hozAlign:"center", 
				headerSort:false,
				width: 50
			},	    	
	    	{
	    		title: "No",
	    		field: "row_no",
	    		width: 80,
	    		hozAlign: "right",
	    		headerSort:false,
	    	},
	    	{
	    		title: "No",
	    		field: "resource_no",
	    		width: 80,
	    		hozAlign: "right",
	    		headerSort:true,
	    		visible:false,
	    	},	    	
	    	{
	    		title: "구분",
	    		field: "resource_type",
	    		hozAlign: "center",
	    		headerSort:true,
	    		width: 60,
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
	    		}
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
	                	$('#explorer .content').jstree(true).deselect_all();
	                	$('#explorer .content').jstree(true).select_node(rowData['resource_no']);	                	
	                }
	            }	    		
	    	},
	    	{
	    		title: "상태",
	    		field: "resource_status",
	    		width: 120,
	    		hozAlign: "center",
	    		headerSort:true,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = "";
	    			let rowData = cell.getRow().getData();
	    			switch(cell.getValue()){
	    				case 1 : result = `<span class="status status-green">최적화 완료</span>`; break;
	    				case 11 : result = `<span class="status status-yellow">최적화 진행 중</span>`; break;
	    				case 0 : result = `<span class="status status-orage">최적화 대기</span>`; break;	    				
	    				case -1 : result = `<span class="status status-gray">미적용</span>`; break;
	    				case 2 : result = `<span class="status status-red">최적화 해제</span>`; break;
	    			}
	    			if(rowData['resource_type'] == 0){
	    				result = "";
	    			}
	    			if(rowData['resource_org_size'] < 0){
	    				result = `<ion-icon name="close-circle-outline" style="font-size:1.3em; color:#b4b4b4; position:relative; top:7px;"></ion-icon>`;
	    			}
	    			return result;
	    		}		    		
	    	},		    	
	    	{
	    		title: "원본 용량",
	    		field: "resource_new_size_type1",
	    		hozAlign: "right",
	    		headerSort:true,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = "";
	    			if(cell.getValue() < 0){
	    				result = `<ion-icon name="close-circle-outline" style="font-size:1.3em; color:#b4b4b4;"></ion-icon>`;
	    			}else{
	    				result = fileSizeUnitFormatter(cell.getValue());
	    			}
	    			return result;
	    		},    		
	    	},	    	
	    	{
	    		title: "최적화 용량",
	    		field: "resource_new_size_type2",
	    		hozAlign: "right",
	    		headerSort:true,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = "";
	    			if(cell.getValue() < 0){
	    				result = `<ion-icon name="close-circle-outline" style="font-size:1.3em;"></ion-icon>`;
	    			}else{
	    				result = fileSizeUnitFormatter(cell.getValue());
	    			}
	    			return result;
	    		},
	    	},	    	    	
	    	{
	    		title: "호출 횟수",
	    		field: "call_cnt",
	    		hozAlign: "right",
	    		headerSort:true,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let rowData = cell.getRow().getData();
	    			let result = comma(cell.getValue())+"회";
	    			if(rowData.resource_type == 0){
	    				result = "";
	    			}
	    			
	    			return result;
	    		}	    		
	    	},	    	
	    	{
	    		// title: `비용 절감율<ion-icon name="help-circle-outline" style="font-size: 1.3em; position:relative; top:5px;"></ion-icon>`,
	    		title: "비용 절감율",
	    		field: "saving_rate",
	    		hozAlign: "right",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue();
	    		},
	    		cellClick: function(e, cell){
	    			let result = cell.getValue();
	    			if($(result).hasClass("zero")){
	    				miniAlert(msg.savingRateInfo,"success");
	    			}
	    		}	    		
	    	},	    	
	    	{
	    		title: "상세보기",
	    		field: "detail_btn",
	    		hozAlign: "right",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue();
	    		}	    		
	    	},	    
	    ]
	});	
	table_resource.on("dataLoaded", function() {
		//	상위 디렉토리 만들기
		if(search_range != 0){
			setTimeout(function(){
				let parentDir = $("#volist .tabulator-row").eq(0).clone();
				parentDir.find(".tabulator-cell").html("");
				parentDir.find(`.tabulator-cell[tabulator-field="resource_type"]`).html("📁");
				parentDir.find(`.tabulator-cell[tabulator-field="resource_name"]`).html(`<ion-icon name="arrow-up-circle-outline" style="font-size:1.2em;"></ion-icon> 상위 디렉토리`);
				let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
				let parentNode = $('#explorer .content').jstree(true).get_node(selectedNodeId).parent;
				console.log(`selectedNodeId : ${selectedNodeId} | parentNode : ${parentNode}`);
				if(selectedNodeId !== undefined && parentNode != "#"){
					$("#volist .tabulator-table").prepend(parentDir);
				}
				parentDir.on("click", function(){
					// alert("!!");
					$('#explorer .content').jstree(true).deselect_all();
					$('#explorer .content').jstree(true).select_node(parentNode);
	
				});
			},100);
			// table_resource.redraw();
		}
		
		// 카운트
		let countArray = countResourceFolder(countResourceFolder);
		// console.log(`===== count Array =====`)
		// console.log(data);
		// console.log(countArray);
		for(let i = 0; i < countArray.length; i++){
			let target = $(".jstree").find(`li#${countArray[i].resource_no} a`);
			if(target.length > 0){
				target.eq(0).find(".count").html(`<span class="number selected">${comma(countArray[i].total_count)}</span>/<span class="number total">${comma(countArray[i].entire_count)}</span>`);
			}
		}			
	});
	table_resource.on("rowSelectionChanged", function(){
		let selectedData = table_resource.getSelectedData();
		const selectedItemOptimizeBtn = $("#selectedItemOptimizeBtn");
		const selectedItemUnbindBtn = $("#selectedItemUnbindBtn");
		console.log(selectedData.length);
		if(selectedData.length > 0){
			selectedItemOptimizeBtn.prop("disabled", false);
			selectedItemUnbindBtn.prop("disabled", false);
		}else{
			selectedItemOptimizeBtn.prop("disabled", true);
			selectedItemUnbindBtn.prop("disabled", true);			
		}
	});

}

function selectResourceListByParentIdAjax(resource_parent_no){
	let result = "";
	if(resource_parent_no == null || resource_parent_no == "undefined"){
		resource_parent_no = 0;
	}
	let search_disable = 0;
	let resource_status = $(".search .form-check input[name=resource_status]:checked").val();
	if(resource_status == 3){
		resource_status = 99;
		search_disable = 1;
	}
	let search_range = $(".search select[name=search_range]").val();
	let search_keyword = $(".search input[name=search_keyword]").val();	
	$.ajax({
		type: 'GET',
		url: '/selectResourceListByParentId',
		data : {
			size : 10,
			page : table_resource.getPage(),
	    	resource_parent_no : resource_parent_no,
	    	resource_status : resource_status,
	    	search_range : search_range,
	    	search_keyword : search_keyword,
	    	search_disable : search_disable,
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	
	return result;	
}

function searchDataInit(resource_parent_no){
	if(resource_parent_no == null || resource_parent_no == "undefined"){
		resource_parent_no = 0;
	}
	let search_disable = 0;
	
	// 상태 검색 설정
    let resource_status_array = [];
    $('input[name="resource_status"]:checked').each(function(){
    	resource_status_array.push($(this).val());
    });
    if (resource_status_array.length === 0) {
    	for(let i = 0; i < statusArray.length; i++){
    		resource_status_array.push(statusArray[i].value);
    	}
    }
    
    // 유형 검색 설정
    let resource_type_array = [];
    $('input[name="resource_type"]:checked').each(function(){
    	resource_type_array.push($(this).val());
    });
    if (resource_type_array.length === 0) {
    	for(let i = 0; i < typeArray.length; i++){
    		resource_type_array.push(typeArray[i].value);
    	}
    }    
    
    // console.log(resource_status_array);
	let search_range = $("select[name=search_range]").val();
	let search_keyword = $("input[name=search_keyword]").val();
	
	// 페이지 검색 추가
	let search_page = $("input[name=search_page]").val();
	if (search_page.trim() !== "") {
	    let page = selectPageByPageNo(search_page);
	    let page_name = page.page_name;
	    $("input[name=page_name]").val(page_name);
	}

	let data = {
	    	resource_parent_no : resource_parent_no,
	    	resource_status_array : resource_status_array,
	    	resource_type_array : resource_type_array,
	    	search_range : search_range,
	    	search_keyword : search_keyword,
	    	search_disable : search_disable,
	    	search_page : search_page
	    };	
	return data;
}


/***
 * 1. 함수명 : searchInit
 * 2. 작성일: 2023-12-00
 * 3. 작성자: 안재림
 * 4. 설명: 타뷸레이터 검색 조건 설정
 * 5. 수정일: 2024-02-14
 * ***/	
function searchInit() {

	// statusArray 뿌리기
	let html = "";
	for(let i = 0; i < statusArray.length; i++){
		html += `<li>
			<input type="checkbox" name="resource_status" class="btn-check" id="status-array-item${i}" autocomplete="off" value="${statusArray[i].value}">
			<label class="btn btn-primary-subtle" for="status-array-item${i}">
				<p class="icon"><i class="fas fa-${statusArray[i].icon}"></i></p>
				<p>${statusArray[i].label}</p>			
			</label>
		</li>`;
	}
	$(".search-status").html(html);
	
	html = "";
	// typeArray 뿌리기
	for(let i = 0; i < typeArray.length; i++){
		html += `<li>
			<input type="checkbox" name="resource_type" class="btn-check" id="type-array-item${i}" autocomplete="off" value="${typeArray[i].value}">
			<label class="btn btn-primary-subtle" for="type-array-item${i}">
				<p class="icon"><i class="fas fa-${typeArray[i].icon}"></i></p>
				<p>${typeArray[i].label}</p>
			</label>
		</li>`;
	}
	$(".search-type").html(html);
	
	searchCheckboxEvent("resource_status");
	searchCheckboxEvent("resource_type");
}

function searchCheckboxEvent(inputName){
    $(`input[name="${inputName}"]`).change(function(){
        let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
        selectResourceListByParentId(selectedNodeId);
        
        // 체크된 체크박스의 value와 label 가져오기
        const checkedValue = $(this).val();
        const checkedLabel = $(`label[for="${$(this).attr('id')}"]`).text();
        
        // 체크박스가 체크되었는지 확인
        const isChecked = $(this).prop('checked');
        
        // 다른 엘리먼트에 버튼 추가 또는 제거
        if (isChecked) {
            const buttonHtml = `<button class="remove-button btn btn-primary-subtle btn-rounded" data-checkbox-id="${$(this).attr('id')}">${checkedLabel} <ion-icon name="close-outline"></ion-icon></button>`;
            $('.filter-button-container').append(buttonHtml);
        } else {
            // 해당 value를 가진 버튼 제거
            $(`.remove-button[data-checkbox-id="${$(this).attr('id')}"]`).remove();
        }
    });
    
    // 추가된 버튼에 이벤트 리스너 추가
    $(document).on('click', '.remove-button', function(){
        const checkboxId = $(this).data('checkbox-id');
        // 해당 아이디를 가진 체크박스의 체크 해제
        $(`#${checkboxId}`).prop('checked', false);
        // 버튼 제거
        $(this).remove();
        let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
        selectResourceListByParentId(selectedNodeId);	        
    });	
}

function filterResetBtnEvent(){
	$('.remove-button').remove();
	$('.search-criteria-filter input[type="checkbox"]').prop('checked', false);
	$("input[name='search_keyword']").val("");
	$("input[name='search_page']").val("");
	$("input[name='page_name']").val("");
    let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
    selectResourceListByParentId(selectedNodeId);	
}

function searchEnterEvent(){
    if (event.keyCode === 13) { // Enter 키의 keyCode는 13입니다.
    	searchSubmitBtnEvent();
        return false; // 폼 제출 방지
    }
    return true;	
}

function searchSubmitBtnEvent(){
	let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
    selectResourceListByParentId(selectedNodeId);	
}

function optimizerBtnEvent(option){
	let result = null;
	$("#optimizeReadyModal #excuteBtn").off("click");
	if (option === undefined) { // 매개변수 없음 -> 전체 최적화
		result = selectResourceAllByCloudNo();
		$("#optimizeReadyModal #excuteBtn").on("click", function(){
			excuteOptimize();
		});
		
	}else if(option == "selected"){
		result = optimizeSelectedItem();
		if(result.length == 0){
			modalAlert("알림","웹 컨텐츠 폴더, 혹은 파일을 선택해주세요.");
			return;
		}
		console.log("selected");
		$("#optimizeReadyModal #excuteBtn").on("click", function(){
			excuteOptimize("selected");
		});		
	}else{
		return;
	}

	let html = `<div class="card card-primary shadow h-100 py-2">
		    <div class="card-body">
		        <div class="row no-gutters align-items-center">
		            <div class="col mr-2">
		                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1" style="opacity:0.5;">OPTIMIZATION</div>
		                <div class="h5 mb-0 font-weight-bold text-gray-800">총 ${result.length}건의 웹 컨텐츠 최적화를 진행합니다.</div>
		            </div>
		            <div class="col-auto">
		                <i class="fas fa-sync-alt fa-2x text-gray-300" style="opacity:0.5;"></i>
		            </div>
		        </div>
		    </div>
		</div>		
		<ul class="resource-list">`;
	for(let i = 0; i < result.length; i++){
		html += `<li>${result[i].resource_org}</li>`;
	}
	html += `</ul>`;
	$("#optimizeReadyModal .modal-body").html(html);
	$("#optimizeReadyModal").modal("show");
	
}

function optimizerDisableBtnEvent(){
	let result = optimizeSelectedItem();
	if(result.length == 0){
		modalAlert("알림","웹 컨텐츠 폴더, 혹은 파일을 선택해주세요.");
		return;
	}
	let html = `<div class="card card-danger shadow h-100 py-2">
		    <div class="card-body">
		        <div class="row no-gutters align-items-center">
		            <div class="col mr-2">
		                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1" style="opacity:0.5;">OPTIMIZATION</div>
		                <div class="h5 mb-0 font-weight-bold text-gray-800">총 ${result.length}건의 웹 컨텐츠 최적화를 해제합니다.</div>
		            </div>
		            <div class="col-auto">
		                <i class="fas fa-sync-alt fa-2x text-gray-300" style="opacity:0.5;"></i>
		            </div>
		        </div>
		    </div>
		</div>		
		<ul class="resource-list">`;
	for(let i = 0; i < result.length; i++){
		html += `<li>${result[i].resource_org}</li>`;
	}
	html += `</ul>`;
	$("#optimizeDisableModal .modal-body").html(html);
	$("#optimizeDisableModal").modal("show");
	
}

/***
 * 1. 함수명 : optimizeSelectedItem
 * 2. 작성일: 2023-12-27
 * 3. 작성자: 안재림
 * 4. 설명: 타뷸레이터에서 선택된 데이터 불러오기
 * 5. 수정일: 
 * ***/	
function optimizeSelectedItem(){
	let result = null;
	let selectedData = table_resource.getSelectedData();
	console.log(selectedData);
	for(let i = 0; i < selectedData.length; i++){
		selectedData[i].saving_rate = "";
	}
	console.log(selectedData);
	$.ajax({
		type: 'POST',
		url: '/optimizeSelectedItem',
		contentType: 'application/json', // 데이터 형식을 JSON으로 지정
		data:JSON.stringify(selectedData),
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

/***
 * 1. 함수명 : excuteOptimize
 * 2. 작성일: 2023-12-28
 * 3. 작성자: 안재림
 * 4. 설명: 
 * 5. 수정일: 
 * ***/	
function excuteOptimize(option){
	let url = "";
	let result = null;
	let selectedData = null;
	$("#optimizeReadyModal").modal("hide");
	
	if (option === undefined) { // 매개변수 없음 -> 전체 최적화
		url = "/excuteOptimizeAll";
	}else if(option === "selected"){
		url = '/excuteOptimizeSelectedItem';
		selectedData = table_resource.getSelectedData();
	}else{
		return;
	}
	
	let safeData = JSON.stringify(selectedData);
	safeData = safeData.replaceAll("[^a-zA-Z0-9]", "");
	// console.log(safeData);

	$.ajax({
		type: 'POST',
		url: url,
		contentType: 'application/json', // 데이터 형식을 JSON으로 지정
		data: safeData,
		async: false,
		success: function(res) {
			result = res.data;
			drawOptimizeStatusModal();
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

/***
 * 1. 함수명 : excuteOptimizeDisable
 * 2. 작성일: 2023-12-28
 * 3. 작성자: 안재림
 * 4. 설명: 
 * 5. 수정일: 
 * ***/	
function excuteOptimizeDisable(){
	let result = null;
	let selectedData = table_resource.getSelectedData();
	$("#optimizeDisableModal").modal("hide");
	for(let i = 0; i < selectedData.length; i++){
		selectedData[i].saving_rate = "";
	}
	$.ajax({
		type: 'POST',
		url: "/excuteOptimizeDisableSelectedItem",
		contentType: 'application/json', // 데이터 형식을 JSON으로 지정
		data:JSON.stringify(selectedData),
		async: false,
		success: function(res) {
			result = res.data;
			modalAlert("알림","선택한 웹 컨텐츠의 최적화를 해제했습니다.");
	        let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
	        selectResourceListByParentId(selectedNodeId);			
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function drawOptimizeStatusModal(){
	let result0 = selectResourceAllByResourceStatus(0);
	let html = `<div class="card card-warning shadow h-100 py-2">
	    <div class="card-body">
	        <div class="row no-gutters align-items-center">
	            <div class="col mr-2">
	                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1" style="opacity:0.5;">OPTIMIZATION</div>
	                <div class="h5 mb-0 font-weight-bold text-gray-800">총 ${result0.length}건의 웹 콘텐츠 최적화를 진행 중입니다. 잠시만 기다려주세요.</div>
	            </div>
	            <div class="col-auto">
	                <i class="fas fa-sync-alt fa-2x text-gray-300" style="opacity:0.5;"></i>
	            </div>
	        </div>
	    </div>
	</div>
	<ul class="resource-list">`;
	for(let i = 0; i < result0.length; i++){
		html += `<li>${result0[i].resource_org}</li>`;
	}
	html += `</ul>`;
	$("#optimizeStatusModal .modal-body").html(html);
	$("#optimizeStatusModal").modal("show");	
}


function optimizerByPageInit() {

	$('#explorer .content').jstree({
		'core' : {
			'data' : jsonData,
			'themes' : {
				"variant" : "large",
			}			
		}
	}).on('select_node.jstree', function (e, data) {
		var selectedNodeId = data.node.id;
		// console.log('Selected Node ID:', selectedNodeId);
		// console.log(selectByPageNo(selectedNodeId));
		let content = selectByPageNo(selectedNodeId).content;
		let convertedContent = escapeHtml(content);
		html = "<pre class='line-numbers language-html'><code class='language-html'>";
		html += convertedContent;
		html += "</code></pre>";
		$("#viewer .content").html(html);
		Prism.highlightAll();
		
		let regex = /\.(png|jpg|gif|mp4|avi|js|css|webp|svg)/g;
		let resourceList = selectResourceAllByPageNo(selectedNodeId);
		let index = 0;
		
		$("#viewer").find(".token.attr-value").each(function(){
			let resourceExists = false;
			let str = $(this).html();
			let tempElement = $(this).clone();
			tempElement.find("span").remove();
			let resource_org = tempElement.text(); 
			$(this).attr("data-resource-org", resource_org);			
			resourceExists = resourceList.some(item => item.resource_org == resource_org);
			
			if(regex.test(resource_org) || resourceExists){
				// console.log(`[${index}] ${resource_org}, ${resourceExists}`);
				$(this).attr("data-resource-seq", index);
				$(this).addClass("highlight");
				$(this).click(function(){
					let result = selectResourceByResourceOrg(resource_org);
					if(result != null){ // 해당 리소스가 DB에 존재하는 경우
						// alert(result.resource_no);
						let resource_no = result.resource_no;
						drawResourceModal(resource_no);
					}else{ // 없는 경우
						modalAlert("알림", "아직 등록되지 않은 웹 컨텐츠입니다.");
					}
					// $('#resourceModal').modal('show');
				});
				index++;
			}else{
				
			}
		});

		// 리소스 리스트 만들기
		let resourceListHtml = "";
		searchResourceList();
		
		// 리소스 리스트 클릭 이벤트 지정
		$("#resourceList .content li").each(function(){
			let resource_seq = $(this).attr("data-resource-seq");
			let resource_org = $(this).attr("data-resource-org");
			let targetElement = $("#viewer").find(`[data-resource-org="${resource_org}"]`);
			let origText = $(this).html();
			if (targetElement.length > 0) {
				$(this).html(`${origText} 🔗`);
			}
			$(this).click(function(){
				$("#resourceList .content li").removeClass("active");
				$(this).addClass("active");
				// console.log(targetElement);
				if (targetElement.length > 0) {
		            let viewerContent = $("#viewer .content");
		            let targetTop = targetElement.offset().top - viewerContent.offset().top + viewerContent.scrollTop();
		            viewerContent.animate({
		                scrollTop: targetTop
		            }, 500);
		        }else{
		        	miniAlert('해당 페이지에서 직접 작성되지 않은 웹 컨텐츠입니다.','success');
		        }
			});
		});
		
		// 프리뷰 이벤트 지정
		/*
		$("#fullscreenPreviewerBtn").off("click");
		$("#fullscreenPreviewerBtn").on("click", function(){
			$("body").css({"overflow":"hidden", "padding-right":"15px"});
			$("#fullscreenPreviewer").find("iframe").attr("src", `/viewLogFile?page_no=${selectedNodeId}`);
			$("#fullscreenPreviewer").fadeIn(100);
		});
		*/
		$("#previewer").find("iframe").attr("src", `/viewLogFile?page_no=${selectedNodeId}`);
		
		// 웹 컨텐츠 확인 버튼 지정
		$("#view-resource-btn").off("click");
		$("#view-resource-btn").on("click", function(){
			location.href=`/optimizerByContent?page_no=${selectedNodeId}`;
		});
		
	});
	
	setTimeout(function(){
		$('#explorer .content').jstree(true).open_all();
		// $('#explorer .content').jstree(true).select_node('li:first');
		$(`#explorer .content li[role="treeitem"]`).eq(1).find("a").click();
		
		for(let i = 0; i < jsonCount.length; i++){
			let target = $(".jstree").find(`li#${jsonCount[i].page_no} a`);
			if(target.length > 0){
				target.append(` <span class="gray">(${comma(jsonCount[i].count)})</span>`);
			}
		}
		$('#preLoader').fadeOut(500); 
	},300);
	
	// 카운트 추가

}

function searchResourceList(){
	let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
	let objectArray = selectResourceAllByPageNo(selectedNodeId);
	let searchTerm = $('#search-resource-name').val();
	if(searchTerm !== "" && searchTerm !== undefined && searchTerm !== null){
		// console.log("검색어 있음");
		objectArray = objectArray.filter(function(item) {
	        return item.resource_name.toLowerCase().includes(searchTerm); // "resource_name"을 소문자로 변환하여 비교
	    });	
	}
	
	let html = "";
	let order1Array = [];
	let order2Array = [];
	for(let i = 0; i < objectArray.length; i++){
		let resource_org = objectArray[i].resource_org;
		let targetElement = $("#viewer").find(`[data-resource-org="${resource_org}"]`);
		if(targetElement.length > 0){
			order1Array.push(objectArray[i]);
		}else{
			objectArray[i].class_name = "nolink";
			order2Array.push(objectArray[i]);
		}
	}
	let reorderArray = order1Array.concat(order2Array);

	for(let i = 0; i < reorderArray.length; i++){
		let resource_type = "";
		switch(reorderArray[i].resource_type){
			case 1 : resource_type = "🖼️"; break;
			case 2 : resource_type = "🎥"; break;
			case 3 : resource_type = "📄"; break;
			case 4 : resource_type = "🅰️"; break;
		}
		let dot = "";
		if(reorderArray[i].resource_name.length > 18){
			dot = "...";
		}
		html += `<li data-resource-org="${reorderArray[i].resource_org}" data-resource-seq="${i}" class="${reorderArray[i].class_name}">${resource_type} ${reorderArray[i].resource_name.substring(0, 18)}${dot} <button onclick="drawResourceModal(${reorderArray[i].resource_no});"><ion-icon name="search-outline"></ion-icon></button></li>`;
	}
	
	// return html;
	$("#resourceList .content .resource-list").html(html);
		
}

function searchResourceListEnterEvent(event){
    if (event.key === 'Enter') {
        // Enter 키 눌렀을 때 실행할 동작
        searchResourceList(); // 입력된 검색어를 처리하는 함수 호출
    }	
}

function clearResourceList(){
	$('#search-resource-name').val("");
	searchResourceList();
}

function fullscreenPreviewerClose(){
	$("#fullscreenPreviewer").find("iframe").attr("src", "");
	$("#fullscreenPreviewer").fadeOut(100);
	$("body").css({"overflow":"auto", "padding-right":"0px"});
}

function selectPageAllByResourceNo(resource_no){
	let result = [];
	$.ajax({
		type: 'POST',
		url: '/selectPageAllByResourceNo',
		data:{
			resource_no : resource_no,
		},
		async: false,
		success: function(res) {
			result.push(res.data);
			result.push(res.jstreeData);
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

/***
 * 1. 함수명 : selectResourceAllByPageNo
 * 2. 작성일: 2023-12-27
 * 3. 작성자: 안재림
 * 4. 설명: 페이지 번호로 해당 페이지의 리소스 받아오기
 * 5. 수정일: 
 * ***/	
function selectResourceAllByPageNo(page_no){
	let result = null;
	$.ajax({
		type: 'POST',
		url: '/selectResourceAllByPageNo',
		data:{
			page_no : page_no,
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}


function resourcePrintByType(object){
	// console.log("===== 출력 =====");
	// console.log(object);
	let result = {};
	switch(object.resource_type){
		case 1 : // 이미지
			result = {
				col1 : `<img src="view.do?image_path=${object.resource_new_type1}&image_name=" />`,
				col2 : `<img src="view.do?image_path=${object.resource_new_type2}&image_name=" />`, 
			} 
			break;
		case 2 : // 동영상
			result = {
				col1 : `<video id="my-video" class="video-js" controls preload="auto" width="100%" data-setup="{}" style="width:100%; height:auto;">
						<source src="view.do?image_path=${object.resource_new_type1}&image_name=" type="video/mp4">
						</video>`,
				col2 : `<video id="my-video" class="video-js" controls preload="auto" width="100%" data-setup="{}" style="width:100%; height:auto;">
						<source src="view.do?image_path=${object.resource_new_type2}&image_name=" type="video/mp4">
						</video>`,
			}
			break;
		case 3 : // 텍스트
			let text1 = escapeHtml(sendRequestToController(`/view?path=${object.resource_new_type1}`));
			let text2 = escapeHtml(sendRequestToController(`/view?path=${object.resource_new_type2}`));
			result = {
				col1 : `<div class="codeblock">${text1.slice(0, 500)}</div>`,
				col2 : `<div class="codeblock">${text2.slice(0, 500)}</div>`,
			}
			break;			
		case 4 : // 폰트
			result = {
				col1 : "폰트 압축 전",
				col2 : "폰트 압축 후",
			}
			break;					
	}
	if(!nullCheck(object.resource_new_type1)){result.col1 = "아직 해당 웹 컨텐츠가 스캔되지 않았습니다."}
	if(!nullCheck(object.resource_new_type2)){result.col2 = "아직 해당 웹 컨텐츠를 최적화하지 않았습니다."}
	if(object.resource_org_size < 0){
		result.col1 = "해당 웹 컨텐츠를 찾지 못했습니다.";
		result.col2 = "해당 웹 컨텐츠를 찾지 못했습니다.";
	}
	return result;
}

function selectResourceAllByCloudNo(){
	let result = "";
	$.ajax({
		type: 'POST',
		url: '/selectResourceAllByCloudNo',
		data:{},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function selectResourceAllByResourceStatus(resource_status){
	let result = "";
	$.ajax({
		type: 'POST',
		url: '/selectResourceAllByResourceStatus',
		data:{
			resource_status : resource_status
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function tabulatorUpdateInterval(){
	let result = null;
	let currentData = table_resource.getData();
	for(let i = 0; i < currentData.length; i++){
		currentData[i].saving_rate = "";
	}
	$.ajax({
		type: 'POST',
		url: '/tabulatorUpdateInterval',
		contentType: 'application/json', // 데이터 형식을 JSON으로 지정
		data:JSON.stringify(currentData),
		async: false,
		success: function(res) {
			result = res.data;
			// console.log(result);
			let rows = table_resource.getRows();
			for(let i = 0; i < result.length; i++){
				let filteredRows = rows.filter(function(row) {
				    return row.getData().resource_no === result[i].resource_no; // yourValue에는 원하는 값을 입력하세요
				});
				if (filteredRows.length > 0) {
				    let foundRowData = filteredRows[0].getData(); // 첫 번째 일치하는 행의 데이터 가져오기
			        let foundRow = filteredRows[0];
			        let currentData = foundRow.getData();
			        let updatedData = Object.assign({}, result[i]);
			        updatedData.row_no = currentData.row_no; // row_no 컬럼 원래 값 할당
			        updatedData.saving_rate = decreaseRate(updatedData.resource_new_size_type1, updatedData.resource_new_size_type2);
			        if(currentData.resource_type > 0){ // 폴더가 아닌 경우만 업데이트
			        	foundRow.update(updatedData);			        	
			        }
			       
				} else {
				    console.log("해당 값의 행을 찾을 수 없습니다.");
				}				
			
			}
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function intervalTest(){
	let result = null;
	let currentData = table_resource.getData();
	let testdata = [{resource_no : 1}, {resource_no : 2}];
	
	$.ajax({
		type: 'POST',
		url: '/intervalTest',
		contentType: 'application/json', // 데이터 형식을 JSON으로 지정
		data:JSON.stringify(currentData),
		async: false,
		success: function(res) {
	
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
	return result;
}

function sendRequestToController(url) {
	let result = "";
    $.ajax({
    	async: false,
        type: "GET", // GET 또는 POST 등 적절한 HTTP 메서드를 선택
        url: url,
        success: function(response) {
            console.log("Controller Response:", response);
            result = response+"...";
            // 여기에서 서버 응답(response)에 대한 처리를 수행할 수 있습니다.
        },
        error: function() {
            console.error("Failed to send request to the controller.");
            result = "해당 파일을 찾을 수 없습니다.";
        }
    });
    return result;
}

function countResourceFolder(resource_parent_no) {
	let data = searchDataInit(resource_parent_no);
	let result = "";
    let queryString = "";
    
    data.resource_status_array.forEach(status => {
        queryString += `&resource_status_array=${status}`;
    });
    
    data.resource_type_array.forEach(type => {
        queryString += `&resource_type_array=${type}`;
    });
    queryString += `&search_range=${data.search_range}`;
    queryString += `&search_keyword=${data.search_keyword}`;
    queryString += `&search_disable=${data.search_disable}`;
    queryString += `&search_page=${data.search_page}`;
	// console.log(queryString);
	$.ajax({
		type: 'GET',
		url: '/countResourceFolder',
		data:queryString,
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
    return result;
}

function selectPageByPageNo(page_no) {
	let result = "";
	$.ajax({
		type: 'GET',
		url: '/selectPageByPageNo',
		data:{
			page_no : page_no
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
    return result;
}

function selectPageByPageName(page_name) {
	let result = "";
	$.ajax({
		type: 'GET',
		url: '/selectPageByPageName',
		data:{
			page_name : page_name
		},
		async: false,
		success: function(res) {
			result = res.data;
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
    return result;
}

