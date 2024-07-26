
$(function(){
	tabmenuEventInit();
});

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
	let html1 = `<table class="table table-bordered center">
		<colgroup>
			<col width="14.28%" />
			<col width="14.28%" />
			<col width="14.28%" />
			<col width="14.28%" />
			<col width="14.28%" />
			<col width="14.28%" />
			<col width="14.28%" />
		</colgroup>
		<thead>
		<tr>
			<th>웹 컨텐츠 이름</th>
			<th>원본 용량</th>
			<th>최적화 용량</th>
			<th>호출 횟수</th>
			<th>최적화 전 비용</th>
			<th>최적화 후 비용</th>
			<th>절감 비용</th>
		</tr>
		</thead>
		<tbody>
		<tr>
			<td>${result1.resource_name}</td>
			<td>${resource_new_size_type1}</td>
			<td>${resource_new_size_type2}</td>
			<td>${comma(result1.resource_call_cnt)}건</td>
			<td>-</td>
			<td>-</td>
			<td>-</td>
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
			<th class="table-primary">${resource_new_size_type2} ${decreaseRate(result1.resource_new_size_type1, result1.resource_new_size_type2)}</th>
		</tr>		
		</thead>
		<tbody>
		<tr>`;
		let col1 = "";
		let col2 = "";
		switch(result1.resource_type){
			case 1 : // 이미지
				col1 = `<img src="view.do?image_path=${result1.resource_new_type1}&image_name=" />`;
				col2 = `<img src="view.do?image_path=${result1.resource_new_type2}&image_name=" />`;
				break;
			case 2 : // 동영상
				col1 = `<video id="my-video" class="video-js" controls preload="auto" width="100%" data-setup="{}">
					        <source src="view.do?image_path=${result1.resource_new_type1}&image_name=" type="video/mp4">
					    </video>`;
				col2 = `<video id="my-video" class="video-js" controls preload="auto" width="100%" data-setup="{}">
					        <source src="view.do?image_path=${result1.resource_new_type2}&image_name=" type="video/mp4">
					    </video>`;				
				break;
			case 3 : // 텍스트
				col1 = `텍스트 압축 전`;
				col2 = `텍스트 압축 후`;
				break;			
			case 4 : // 폰트
				col1 = `폰트 압축 전`;
				col2 = `폰트 압축 후`;
				break;					
		}
		if(!nullCheck(result1.resource_new_type1)){col1 = "아직 해당 웹 컨텐츠가 스캔되지 않았습니다."}
		if(!nullCheck(result1.resource_new_type2)){col2 = "아직 해당 웹 컨텐츠가 스캔되지 않았습니다."}
	html1 += `<td>${col1}</td>
			<td>${col2}</td>
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
						html2 += `<li>
							<p>${dateFormatter(result2[i].rgstr_dt)}</p>
							<p>${result2[i].resource_log_content}</p>
						</li>`;
					}
	html2 += ` </ul>
			</div>
			<div class="preview">
				<ul>`;
					for(let i = 0; i<result2.length; i++){
						html2 += `<li>
							<table class="table table-bordered center" style="margin:0; border:none;">
							<thead>
							<tr>
								<th>최적화 전</th>
								<th>최적화 후</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td><img src="view.do?image_path=${result2[i].resource_new_type1}&image_name=" /></td>
								<td><img src="view.do?image_path=${result2[i].resource_new_type2}&image_name=" /></td>
							</tr>
							</tbody>
							</table>
						</li>`;
					}	
	html2 += `  </ul>
			</div>
		</div>
	`;
	
	// 3번 탭 그리기
	let html3 = `
		<div class="page-container">
			<div class="page"></div>
			<div class="preview">
				<ul>`;
				for(let i = 0; i < result3data.length; i++){
					html3 += `<li data-page-no="${result3data[i].page_no}"><iframe src="/viewLogFile?page_no=${result3data[i].page_no}" width="100%" height="600px"></iframe></li>`;
				}
	html3 += ` </ul>
			</div>
		</div>
	`;
		
	// 뿌리기
	$('#resourceModal .tabcontent li.content').eq(0).html(html1);
	$('#resourceModal .tabcontent li.content').eq(1).html(html2);
	$('#resourceModal .tabcontent li.content').eq(2).html(html3);
	
	// 2번 탭 최적화 이력 마우스 클릭 이벤트 설정
	historyLogClickEventInit();
	
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
		$(`#resourceModal .page-container .preview li[data-page-no=${selectedNodeId}]`).css({"display":"block"});
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
		type: 'POST',
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

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
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

var table_resource = null;
function selectResourceListByParentId(resource_parent_no){
	if(resource_parent_no == null || resource_parent_no == "undefined"){
		resource_parent_no = 0;
	}
	
	let resource_status = $(".search .form-check input[name=resource_status]:checked").val();
	let search_range = $(".search select[name=search_range]").val();
	let search_keyword = $(".search input[name=search_keyword]").val();
	
	table_resource = new Tabulator("#volist", {
		selectable:true,
	    pagination:true, //enable pagination
	    paginationMode:"remote", //enable remote pagination
	    sortMode: "remote",
	    ajaxURL:"/selectResourceListByParentId", //set url for ajax request
	    ajaxParams:{
	    	resource_parent_no : resource_parent_no,
	    	resource_status : resource_status,
	    	search_range : search_range,
	    	search_keyword : search_keyword,
	    },	    
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
	    		response.data[i].detail_btn = `<a class="btn btn-primary  btn-icon-split" onclick="drawResourceModal(${response.data[i].resource_no});">
	    			<span class="icon text-white-50"><i class="fas fa-search"></i></span>
	    			<span class="text">상세보기</span></a>`;
	    		if(response.data[i].resource_type==0){
	    			response.data[i].detail_btn = `<a class="btn btn-secondary  btn-icon-split" style="opacity:0.5;">
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
		    			case 0 : 
		    				result += `📁`;
		    				break;
		    			case 1 : 
		    				result += `🖼️`;
		    				break;
		    			case 2 : 
		    				result += `🎥`;
		    				break;
		    			case 3 : 
		    				result += `📄`;
		    				break;
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
	    		width: 80,
	    		hozAlign: "center",
	    		headerSort:true,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			let result = "";
	    			let rowData = cell.getRow().getData();
	    			switch(cell.getValue()){
	    				case 0 : result = `<ion-icon name="close-circle" style="color:#dc3545; font-size:1.5em;"></ion-icon>`; break;
	    				case 1 : result = `<ion-icon name="checkmark-circle" style="color:#0ec831; font-size:1.5em;"></ion-icon>`; break;
	    				case -1 : result = `<ion-icon name="eye-off" style=" font-size:1.5em;"></ion-icon>`; break;
	    			}
	    			if(rowData['resource_type'] == 0){
	    				result = "";
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
	    			return fileSizeUnitFormatter(cell.getValue());
	    		}	    		
	    	},	    	
	    	{
	    		title: "최적화 용량 1",
	    		field: "resource_new_size_type2",
	    		hozAlign: "right",
	    		headerSort:true,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return fileSizeUnitFormatter(cell.getValue());
	    		}
	    	},	    	
	    	{
	    		title: "최적화 용량 2",
	    		field: "resource_new_size_type2",
	    		hozAlign: "right",
	    		headerSort:true,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return fileSizeUnitFormatter(cell.getValue());
	    		},
	    		visible: false,
	    	},	    	
	    	{
	    		title: "호출 횟수",
	    		field: "resource_call_cnt",
	    		hozAlign: "right",
	    		headerSort:true,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue()+"회";
	    		}	    		
	    	},	    	
	    	{
	    		title: "비용 절감율",
	    		field: "saving_rate",
	    		hozAlign: "right",
	    		headerSort:false,
	    		width: 150,
	    		formatter: function(cell, formatterParams, onRendered) {
	    			return cell.getValue();
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
}

function searchInit() {
    $(".search .form-check input[name=resource_status]").click(function() {
        let resource_status = $(this).val();
        let selectedNodeId = $('#explorer .content').jstree(true).get_selected()[0];
        selectResourceListByParentId(selectedNodeId);
        // console.log(resource_status);
    });
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

function selectedItemBtnEvent(){
	let selectedData = table_resource.getSelectedData();
	console.log(selectedData);

	$.ajax({
		type: 'POST',
		url: '/optimizeSelectedItem',
		contentType: 'application/json', // 데이터 형식을 JSON으로 지정
		data:JSON.stringify(selectedData),
		async: false,
		success: function(res) {
			$("#resultModal .modal-body").html(displayData(res.data));
			$("#resultModal").modal("show");
		},
	    error: function onError (error) {
	        console.error(error);
	    }
	});
}

function optimizerByPageInit() {

	$('#explorer .content').jstree({
		'core' : {
			'data' : jsonData
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
		
		let regex = /\.(png|jpg|gif)/g;
		let resourceList = [];
		let index = 0;
		$("#viewer").find(".token.attr-value").each(function(){
			let str = $(this).html();
			if(regex.test(str)){
				$(this).attr("data-resource-seq", index);
				resourceList.push($(this));
				$(this).addClass("highlight");
				$(this).click(function(){
					let tempElement = $(this).clone();
					tempElement.find("span").remove();
					let resource_org = tempElement.text(); 
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
		let resourceListHtml = "<ul>";
		for(let i = 0; i < resourceList.length; i++){
			resourceListHtml += "<li data-resource-seq='"+resourceList[i].attr("data-resource-seq")+"'>"+resourceList[i].html()+"</li>";
		}
		resourceListHtml += "</ul>";
		$("#resourceList .content").html(resourceListHtml);
		
		// 리소스 리스트 클릭 이벤트 지정
		$("#resourceList .content li").each(function(){
			$(this).click(function(){
				$("#resourceList .content li").removeClass("active");
				$(this).addClass("active");
				let resource_seq = $(this).attr("data-resource-seq");
				let targetElement = $("#viewer").find("[data-resource-seq="+resource_seq+"]");
				if (targetElement.length > 0) {
		            let viewerContent = $("#viewer .content");
		            let targetTop = targetElement.offset().top - viewerContent.offset().top + viewerContent.scrollTop();
		            viewerContent.animate({
		                scrollTop: targetTop
		            }, 500);
		        }	
			});
		});
		
	});
	
	setTimeout(function(){
		$('#explorer .content').jstree(true).open_all();
	},300);
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

function optimizerByContentInit(){
	$('#explorer .content').jstree({
		'core' : {
			'data' : jsonData
		},
	    /*'checkbox': {
	        'keep_selected_style': false // 선택된 스타일 유지
	    },
	    'plugins': ['checkbox', 'core'],*/
	}).on('select_node.jstree', function (e, data) {
		var selectedNodeId = data.node.id;
		console.log('Selected Node ID:', selectedNodeId);
		// $("#viewer").html(selectedNodeId);
		selectResourceListByParentId(data.node.id);
	});
	setTimeout(function(){
		$('#explorer .content').jstree(true).open_all();
	},300);
	
	selectResourceListByParentId();
	searchInit();
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
