<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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
<meta charset="utf-8" />
<title>${title }</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta content="Premium Multipurpose Admin & Dashboard Template" name="description" />
<meta content="Pichforest" name="author" />
<%@ include file="/WEB-INF/views/includes/plugin.jsp"%>
<script>
var jsonCount = ${jsonCount };
$(document).ready(function(){
	$('#preLoader').fadeOut(300); 
});
</script>
<script type="text/javascript" src="${contextPath}/resources/js/api/optimizer-api.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/optimizer/optimizer-common.js"></script>
<link rel="stylesheet" href="${contextPath}/resources/css/optimizer/optimizer-common.css" />
</head>

<body data-bs-theme="dark" data-topbar="dark" data-sidebar="dark" id="optimizer-by-page">
	<div id="layout-wrapper">
		<%@ include file="/WEB-INF/views/includes/topbar.jsp"%>
		<div class="layout-parent">
			<%@ include file="/WEB-INF/views/includes/sidebar.jsp"%>
			<div class="main-content">
				<div class="page-content">
				
<!-- ==================================================================================================== -->

<script type="text/javascript">
var jsonData = JSON.parse('${jsonData}');
$(document).ready(function(){
	setTimeout(function(){
		$('#preLoader').fadeOut(500);
	},1500);
	optimizerByPageInit();
});
</script>

<div class="page-title-box d-flex align-items-center justify-content-between">
	<h4 class="mb-0">웹 페이지별 최적화</h4>
	<div class="page-title-right">
		<ol class="breadcrumb m-0">
			<li class="breadcrumb-item"><a href="javascript: void(0);">최적화 관리</a></li>
			<li class="breadcrumb-item active">웹 페이지별 최적화</li>
		</ol>
	</div>
</div>

<div id="optimizer-container" class="page card-group">
	<div id="explorer" class="card" style="border-radius: 5px 0px 0px 5px;">
		<div class="title">웹 페이지 목록</div>
		<div class="d-flex jstree-page-legend">
			<p class="col">웹 페이지 목록</p>
			<p class="col" style="text-align:right; padding-right:15px;">Lazyload 적용<buttton class="btn-info btn-popover" data-popover-content="Lazyload는 페이지가 처음 로드될 때 모든 미디어 파일을 즉시 로드하지 않고, 필요한 최소한의 콘텐츠만 로드하는 기술입니다. 웹 페이지의 초기 로드 속도를 높이고, 사용자의 대역폭을 절약하며, 웹 페이지의 성능을 향상시키는 데 도움을 줍니다." data-popover-width="500"><ion-icon name="help-circle"></ion-icon></p>
		</div>
		<div class="content" style="padding-top:10px;"></div>
	</div>
	<div id="resourceList" class="card">
		<div class="title">웹 콘텐츠 목록</div>
		<div class="content">
			<ul class="resource-list">
			</ul>
		</div>
		<div class="resource-list-search">
			<input type="text" placeholder="검색어를 입력하세요." id="search-resource-name" onkeypress="searchResourceListEnterEvent(event);" />
			<button onclick="searchResourceList();" class="btn"><i class="fas fa-search"></i></button>
			<button onclick="clearResourceList();" class="btn" style="display:none;"><ion-icon name="close-outline"></ion-icon></button>
		</div>
	</div>
	<div id="viewer" class="card" style="border-right:1px solid rgba(255,255,255,0.2);">
		<div class="title">소스코드 미리보기 <button id="view-resource-btn" style="display:none;">웹 컨텐츠 확인</button></div>
		<div class="content"></div>
	</div>
	<div id="previewer" style="display:none;">
		<div class="title">미리보기</div>
		<iframe src="" width="100%" height="100%" frameborder="0"></iframe>	
	</div>
</div>

<div id="thumbnail" style="display:none;">
<div class="table-summary preview">
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

<div id="fullscreenPreviewer">
	<div class="head">
		<p class="title">웹 페이지 미리 보기</p>
		<p class="close"><button onclick="fullscreenPreviewerClose();"><ion-icon name="close-outline"></ion-icon></button></p>
	</div>
	<iframe src="" width="100%" height="100%" frameborder="0"></iframe>
</div>

<!-- ==================================================================================================== --> 
               		<%@ include file="/WEB-INF/views/includes/footer.jsp"%> 
				</div>
			</div>
		</div>
	</div>


</body>
</html>