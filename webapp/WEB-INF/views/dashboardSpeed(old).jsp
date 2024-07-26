<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="/WEB-INF/views/includes/config.jsp"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="utf-8" />
<title>${title }</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta content="Premium Multipurpose Admin & Dashboard Template" name="description" />
<meta content="Pichforest" name="author" />
<%@ include file="/WEB-INF/views/includes/plugin.jsp"%>

</head>


<body>
<!-- <body data-layout="horizontal"> -->

<!-- Begin page -->
<div id="layout-wrapper">

<%@ include file="/WEB-INF/views/includes/topbar.jsp"%>
<div class="layout-parent">     
<%@ include file="/WEB-INF/views/includes/sidebar.jsp"%>        

    <!-- ============================================================== -->
    <!-- Start right Content here -->
    <!-- ============================================================== -->
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid dashboard">
                <!-- start page content -->
<!-- ==================================================================================================== -->
<!-- ==================================================================================================== -->
<!-- ==================================================================================================== -->

<style>

.container-fluid h3 {font-size:18px!important; padding:0px 0px 10px 0px;}
.container-fluid .row {margin-left: calc(var(--bs-gutter-x) * -0.5); margin-right: calc(var(--bs-gutter-x) * -0.5); margin-bottom: 40px;}
.apex-charts {position:relative; z-index: 1; margin-top:20px;}
.donut-chart-value {position: absolute; z-index: 2; text-align: center; font-size:2em; font-weight: bold;position:absolute; top:60%; left:50%; transform:translate(-50%, -50%); color: #038edc;}
#speed-rate-donut-chart-value {}
#compress-rate-donut-chart-value {}
.card h4 {margin-top:20px;}

.stopwatch {}
.stopwatch .icon {position: relative; height:262px; margin:20px 0px 0px 0px;}
.stopwatch .icon i {position: absolute; top:-20px; left:50%; transform:translate(-50%, 0%); font-size:270px; color:#dcdcdc; z-index:1;}
#avg-load-sec-value {color: #f34e4e;}

.dashboard .card-body {padding:20px 30px 10px 30px;}
.dashboard .card .desc {margin:10px 0px 0px 0px;}
.dashboard .card .data-value {font-size: 2.5em; font-weight: bold; letter-spacing: -2px; word-spacing: -2px; margin:0 !important; color: var(--bs-blue); width:250px;}
.dashboard .card .data-value .icon {display: inline-block; background: var(--bs-blue); text-align:center; width:30px; height:30px; border-radius: 30px; position: relative; top:13px;}
.dashboard .card .data-value .icon i {color:#ffffff; font-size:17px; position: relative; top:-20px;}

.sample-chart-head {display: flex;}
.sample-chart-head .col1 {flex-shrink: 1; flex-grow: 1;}
.sample-chart-head .col2 {flex: 0 0 300px; padding:20px 0px 0px 0px;}

.type-icon {position: relative; width:100%;}
.type-icon img {width:40px; opacity:0.3; position:absolute; top:65px; left:50%; transform:translate(-50%, 0%); }

.content-load-stack {overflow: auto; height: 340px; margin:0px 20px 20px 0px; padding:0px 0px 20px 20px;}
.content-load-stack li {display: none; border-top:1px solid #dcdcdc; padding:10px 0px 10px 0px; margin:0;}

.compress-bar {background:#dcdcdc; height:12px;}

.content-load-stack label {display: inline-block; padding:3px 5px 3px 5px; border:1px solid #c8c8c8; color:#c8c8c8; border-radius: 5px; margin:0;}
.content-load-stack .optimized label {color:#038edc; border-color:#038edc;}
.content-load-stack th {text-align:center !important;}
.content-load-stack .speed-rate {color:#038edc; padding:0px 20px 0px 0px; font-weight: bold;}
</style>

<h3>콘텐츠 유형별 로딩 속도 향상 현황</h3>
<div class="row">

	<div class="col-lg-3">
		<div class="card card-body text-center" style="height:calc(50% - 10px);">
			<img src="${contextPath}/resources/img/temp-main-cont01.jpg" style="margin-top:7px;"  />
		</div>
		<div class="card card-body text-center" style="height:calc(50% - 10px);">
			<img src="${contextPath}/resources/img/temp-main-cont02.jpg" style="margin-top:7px;" />
		</div>		
	</div>
	<div class="col-lg-9">
		<div class="card card-body text-center h-100">
		<div class="row mb-3">
			<div class="col-lg-3">
				<div id="speed-rate-donut-chart" class="apex-charts" dir="ltr">
					<div id="speed-rate-donut-chart-value" class="donut-chart-value">내용</div>
					<div class="type-icon"><img src="${contextPath}/resources/img/icon-image.png" /></div>
				</div>
				<h4 class="card-title mb-2">이미지 콘텐츠 속도 향상률</h4>
				<p class="desc"><button class="btn btn-outline-secondary">자세히 보기</button></p> 
			</div>
			<div class="col-lg-3">
				<div id="compress-rate-donut-chart" class="apex-charts" dir="ltr">
					<div id="compress-rate-donut-chart-value" class="donut-chart-value">내용</div>
					<div class="type-icon"><img src="${contextPath}/resources/img/icon-video.png" /></div>
				</div> 
				<h4 class="card-title mb-2">동영상 콘텐츠 속도 향상률</h4>
				<p class="desc"><button class="btn btn-outline-secondary">자세히 보기</button></p>
			</div>
			<div class="col-lg-3">
				<div id="donut-chart3" class="apex-charts" dir="ltr">
					<div id="donut-chart3-value" class="donut-chart-value">내용</div>
					<div class="type-icon"><img src="${contextPath}/resources/img/icon-text.png" /></div>
				</div> 
				<h4 class="card-title mb-2">텍스트 콘텐츠 속도 향상률</h4>
				<p class="desc"><button class="btn btn-outline-secondary">자세히 보기</button></p>
			</div>
			<div class="col-lg-3">
				<div id="donut-chart4" class="apex-charts" dir="ltr">
					<div id="donut-chart4-value" class="donut-chart-value">내용</div>
					<div class="type-icon"><img src="${contextPath}/resources/img/icon-font.png" /></div>
				</div> 
				<h4 class="card-title mb-2">폰트 콘텐츠 속도 향상률</h4>
				<p class="desc"><button class="btn btn-outline-secondary">자세히 보기</button></p>
			</div>
		</div>
		</div>
	</div>
</div>

<h3 style="padding:30px 0px 10px 0px;">실시간 콘텐츠 로딩 속도 현황 <img src="${contextPath}/resources/img/icon-refresh.png" id="content-load-refresh" style="width:20px; position:relative; top:-3px;"/></h3>
<div class="row">
	<div class="col-lg-9">
		<div class="card card-body" style="padding:0;">
			<div style="padding:20px 20px 0px 20px;">
				<table width="100%" class="table mb-0">
			    <colgroup>
					<col width="200px" />
					<col width="*" />
					<col width="150px" />
					<col width="150px" />
			    </colgroup>
			    <thead class="table-light">
			    <tr align="center">
			    	<th>콘텐츠 이름</th>
			    	<th>로딩 속도</th>
			    	<th>콘텐츠 크기</th>
			    	<th>속도 향상률</th>
			    </tr>
			    </thead>		
				</table>
			</div>
			<ul id="content-load-stack" class="content-load-stack">
			</ul>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="card card-body " style="height:428px;">
			<h5 class="card-title mb-3 mt-1" style="font-size:15px;">로딩 속도 최적화가 필요한 곳</h5>
			<p style="color:#c8c8c8;">로딩 속도가 가장 느린 곳부터<br />내림차순으로 정렬한 순위입니다.</p>
			<img src="${contextPath}/resources/img/temp-main-cont03.jpg" class="mb-1" />
		</div>
	</div>
</div>
<script>
$(document).ready(function(){
	$(".dashboard-tab li:nth-child(2)").addClass("active");
   var rotation = function (){
    	  $("#content-load-refresh").rotate({
    	    angle:0,
    	    animateTo:360,
    	    duration: 2000,
    	    callback: rotation,
    	    easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
    	      return c*(t/d)+b;
    	    }
    	  });
    }
    rotation(); 
});
</script>

<script src="${contextPath}/resources/vendor/apexcharts/apexcharts.min.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/dashboard/dashboardSpeed.js"></script>

<!-- ==================================================================================================== -->
<!-- ==================================================================================================== -->
<!-- ==================================================================================================== -->
                <!-- // end page content -->
			</div>
            <!-- // end container-fluid -->
        </div>
        <!-- // End Page-content -->

        <%@ include file="/WEB-INF/views/includes/footer.jsp"%> 
    </div>
    <!-- end main content-->
    </div>

</div>
<!-- END layout-wrapper -->

<%@ include file="/WEB-INF/views/includes/rightbar.jsp"%> 
<script>
window.onload = function() {
	   
    $('#preLoader').fadeOut(300);
};
</script>
</body>

</html>