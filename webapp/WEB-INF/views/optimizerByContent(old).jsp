<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="/WEB-INF/views/includes/config.jsp"%>
<c:set var="mn" value="2" />
<c:set var="sn" value="2" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">
<title>${title }</title>
<script>
var jsonCount = ${jsonCount};
</script>
<%@ include file="/WEB-INF/views/includes/plugin.jsp"%>
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/optimizer/optimizerCommon.js"></script>
</head>

<body id="page-top">

	<!-- Page Wrapper -->
	<div id="wrapper">

		<%@ include file="/WEB-INF/views/includes/sidebar.jsp"%>

		<!-- Content Wrapper -->
		<div id="content-wrapper" class="d-flex flex-column">

			<!-- Main Content -->
			<div id="content">

				<%@ include file="/WEB-INF/views/includes/topbar.jsp"%>

				<!-- Begin Page Content -->
				<div class="container-fluid">

<!-- ========================================================================================== -->
<!-- ========================================================================================== -->
<!-- ========================================================================================== -->

<script>
var jsonData = JSON.parse('${jsonData}');
$(document).ready(function(){
	optimizerByContentInit();
	$('#preLoader').fadeOut(300); 
});
</script>

<c:set var="tabno" value="2" />
<%@ include file="/WEB-INF/views/optimizer/tabmenu.jsp"%>

<div>

</div>

<div id="optimizer-container">
	<div id="explorer">
		<div class="title">웹 컨텐츠 탐색기</div>
		<div class="content"></div>	
	</div>
	<div id="viewer">
		<div class="title">웹 컨텐츠 목록</div>
		<div class="content">
			<div class="search-container">
				<div class="count" id="list_cnt">총 <span>0</span>건</div>
				<div class="search">
					<div class="form-check">
						<ul>	
							<li>
								<input class="form-check-input" type="radio" name="resource_status" id="radio01" value="99" checked>
								<label class="form-check-label" for="radio01">전체</label>
							</li>
							<li>
								<input class="form-check-input" type="radio" name="resource_status" id="radio02" value="1">
								<label class="form-check-label" for="radio02">최적화 완료</label>
							</li>
							<li>
								<input class="form-check-input" type="radio" name="resource_status" id="radio03" value="0">
								<label class="form-check-label" for="radio03">최적화 대기</label>
							</li>
							<li>
								<input class="form-check-input" type="radio" name="resource_status" id="radio04" value="-1">
								<label class="form-check-label" for="radio04">미적용</label>
							</li>
							<li>
								<input class="form-check-input" type="radio" name="resource_status" id="radio05" value="2">
								<label class="form-check-label" for="radio05">최적화 해제</label>
							</li>
							<li>
								<input class="form-check-input" type="radio" name="resource_status" id="radio06" value="3">
								<label class="form-check-label" for="radio06">없는 컨텐츠</label>
							</li>															
							<li>
								<select name="search_range">
									<option value="0">전체 검색</option>
									<option value="1" selected>폴더 내 검색</option>
								</select>
								<input type="text" name="search_keyword" placeholder="웹 컨텐츠 이름을 입력하세요." onkeypress="searchEnterEvent();" /> <button onclick="searchSubmitBtnEvent();" class="btn btn-sm btn-outline-primary" style="position:relative; top:-2px;">검색</button>
							</li>								
						</ul>
					</div>				
				</div>
			</div>
			<div id="volist">
			</div>
		</div>
	</div>
</div>

<div class="btn-container">
	<button class="btn btn-primary btn-lg btn-icon-split" onclick="optimizerBtnEvent();">
		<span class="icon text-white-50"><i class="fas fa-sync-alt"></i></span>
		<span class="text">전체 최적화</span>
	</button>
	<button class="btn btn-primary btn-lg btn-icon-split" onclick="optimizerBtnEvent('selected');">
		<span class="icon text-white-50"><i class="fas fa-check-square"></i></span>
		<span class="text">선택 항목 최적화</span>
	</button>
	<button class="btn btn-secondary btn-lg btn-icon-split" onclick="optimizerDisableBtnEvent();">
		<span class="icon text-white-50"><i class="fas fa-check-square"></i></span>
		<span class="text narrow">선택 항목 최적화 해제</span>
	</button>	
</div>

<div class="modal fade" id="resourceModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">웹 컨텐츠 상세보기</h5>
				<button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
			</div>
			<div class="modal-body">
				<div class="tabmenu">
					<ul>
						<li><a href="#">최적화 확인</a></li>
						<li><a href="#">최적화 이력</a></li>
						<li><a href="#">웹 컨텐츠 사용 확인</a></li>
					</ul>
				</div>
				<div class="tabcontent">
					<ul>
						<li>1</li>
						<li>2</li>
						<li>3</li>
					</ul>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" type="button" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="optimizeReadyModal" tabindex="-1" role="dialog" aria-labelledby="optimizeReadyModal" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">알림</h5>
				<button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
			</div>
			<div class="modal-body">
				내용
			</div>
			<div class="modal-footer">
				<button id="excuteBtn" class="btn btn-primary">최적화 진행</button>
				<button class="btn btn-secondary" type="button" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="optimizeStatusModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">알림</h5>
				<button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
			</div>
			<div class="modal-body">
				내용
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" type="button" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="optimizeDisableModal" tabindex="-1" role="dialog" aria-labelledby="optimizeReadyModal" aria-hidden="true">
	<div class="modal-dialog" role="document" style="max-width: 1200px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">알림</h5>
				<button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
			</div>
			<div class="modal-body">
				내용
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" onclick="excuteOptimizeDisable();">최적화 해제</button>
				<button class="btn btn-secondary" type="button" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>

<div id="saving_rate_info" class="shadow">원본 웹 컨텐츠가 이미 최적화된 상태이기 때문에 원본을 사용하는 경우 비용 절감률이 0%로 출력됩니다.</div>


<!-- ========================================================================================== -->
<!-- ========================================================================================== -->
<!-- ========================================================================================== -->

				</div>
				<!-- /.container-fluid -->

			</div>
			<!-- End of Main Content -->

			<%@ include file="/WEB-INF/views/includes/footer.jsp"%>

		</div>
		<!-- End of Content Wrapper -->

	</div>
	<!-- End of Page Wrapper -->

</body>

</html>