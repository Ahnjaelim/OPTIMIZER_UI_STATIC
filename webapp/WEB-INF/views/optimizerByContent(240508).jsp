<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="/WEB-INF/views/includes/config.jsp"%>
<c:set var="mn" value="2" />
<c:set var="sn" value="1" />
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="utf-8" />
<title>${title }</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta content="Premium Multipurpose Admin & Dashboard Template" name="description" />
<meta content="Pichforest" name="author" />
<%@ include file="/WEB-INF/views/includes/plugin.jsp"%>
<script>
// var jsonCount = ${jsonCount};
</script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/optimizer/optimizerCommon.js"></script>

<script>
var jsonData = JSON.parse('${jsonData}');
$(document).ready(function(){
	optimizerByContentInit();
	
});
</script>
</head>


<body data-bs-theme="dark" data-topbar="dark" data-sidebar="dark">
	<div id="layout-wrapper">
		<%@ include file="/WEB-INF/views/includes/topbar.jsp"%>
		<div class="layout-parent">
			<%@ include file="/WEB-INF/views/includes/sidebar.jsp"%>
			<div class="main-content">
				<div class="page-content">
	

<!-- ==================================================================================================== -->

<div class="page-title-box d-flex align-items-center justify-content-between">
	<h4 class="mb-0">웹 콘텐츠별 최적화</h4>
	<div class="page-title-right">
		<ol class="breadcrumb m-0">
			<li class="breadcrumb-item"><a href="javascript: void(0);">Apps</a></li>
			<li class="breadcrumb-item active">Gallery</li>
		</ol>
	</div>
</div>
<!-- 
<div class="row">
	<div class="col-xl-3 col-sm-6">
		<div class="card">
			<div class="card-body">
				이미지 최적화 현황
			</div>
		</div>
	</div>
	<div class="col-xl-3 col-sm-6">
		<div class="card">
			<div class="card-body">
				이미지 최적화 현황
			</div>
		</div>
	</div>
	<div class="col-xl-3 col-sm-6">
		<div class="card">
			<div class="card-body">
				이미지 최적화 현황
			</div>
		</div>
	</div>
	<div class="col-xl-3 col-sm-6">
		<div class="card">
			<div class="card-body">
				이미지 최적화 현황
			</div>
		</div>
	</div>
	
</div> -->

<div class="card" style="margin-bottom:20px;">
<div class="card-body">
	<div class="row search-criteria-filter">
	    <div class="col-md-6">
	            <h3 class="card-title">웹 컨텐츠 유형 선택</h3>
	            <ul class="search-type">
	            </ul>
	
	    </div><!-- end col -->
	    <div class="col-md-6">
	            <h3 class="card-title">웹 컨텐츠 진행 상태 선택</h3>
				<ul class="search-status">	
				</ul>	
	
	    </div><!-- end col -->
	</div>
	
	<div class="filter-button-container">
		<button class="btn btn-outline-primary btn-rounded" onclick="filterResetBtnEvent();"><i class="icon nav-icon" data-feather="rotate-cw"></i> 검색 초기화</button>
	</div>
</div>
</div>

<div id="optimizer-container">
	<div id="explorer" class="card">
		<div class="content"></div>	
	</div>
	<div id="viewer" class="card">
		<div class="content">
			<div class="search-container">
				<div class="count" id="list_cnt">총 <span>0</span>건</div>
				<div style="border:1px solid rgba(255,255,255,0.1); font-size:0.8em; flex:0 0 80px; text-align: center; padding-top: 5px;">페이지</div>
				<input type="text" name="page_name" value="" class="form-control form-control-sm" readonly />
				<input type="hidden" name="search_page" value="${param.page_no }" class="form-control form-control-sm" />
				<select name="search_range" class="form-select form-select-sm">
					<option value="0" selected>전체 검색</option>
					<option value="1">폴더 내 검색</option>
				</select>
				<input class="form-control form-control-sm" type="text" name="search_keyword" placeholder="웹 컨텐츠 이름을 입력하세요." onkeypress="searchEnterEvent();" />
				<button onclick="searchSubmitBtnEvent();" class="btn btn-sm btn-outline-primary" id="search-btn">검색</button>
			</div>
			<div id="volist">
			</div>
		</div>
	</div>
</div>

<div class="card-group" style="padding:12px 0px 0px 0px;">
	    <div class="card card-body">
	        <h4 class="card-title mb-1">전체 최적화</h4>
	        <p class="card-text" style="color:var(--bs-gray);">조회된 모든 항목에 대하여 최적화를 진행합니다</p>
	        <button class="btn btn-primary" onclick="optimizerBtnEvent();">전체 최적화 진행</button>
	    </div>
	    <div class="card card-body">
	        <h4 class="card-title mb-1">선택 항목 최적화</h4>
	        <p class="card-text" style="color:var(--bs-gray);">선택한 항목에 대하여 최적화를 진행합니다</p>
	        <button class="btn btn-primary" onclick="optimizerBtnEvent('selected');" disabled id="selectedItemOptimizeBtn">선택 최적화 진행</button>
	    </div>
	    <div class="card card-body">
	        <h4 class="card-title mb-1">선택 항목 최적화 해제</h4>
	        <p class="card-text" style="color:var(--bs-gray);">선택한 항목에 대하여 최적화를 해제합니다</p>
	        <button class="btn btn-secondary" onclick="optimizerDisableBtnEvent();" disabled id="selectedItemUnbindBtn">선택 최적화 해제</button>
	    </div>
</div>

<div class="modal fade" id="optimizeReadyModal" tabindex="-1" role="dialog" aria-labelledby="optimizeReadyModal" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">알림</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				내용
			</div>
			<div class="modal-footer">
				<button id="excuteBtn" class="btn btn-primary">최적화 진행</button>
				<button class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">닫기</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="optimizeStatusModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">알림</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				내용
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" type="button" data-bs-dismiss="modal" aria-label="Close">닫기</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="optimizeDisableModal" tabindex="-1" role="dialog" aria-labelledby="optimizeReadyModal" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">알림</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				내용
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" onclick="excuteOptimizeDisable();">최적화 해제</button>
				<button class="btn btn-secondary" type="button" data-bs-dismiss="modal" aria-label="Close">닫기</button>
			</div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/optimizer/commonModal.jsp"%> 

<!-- ==================================================================================================== -->

					<%@ include file="/WEB-INF/views/includes/footer.jsp"%> 
				</div>
			</div>
		</div>
	</div>


</body>
</html>