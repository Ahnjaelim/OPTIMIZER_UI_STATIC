<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
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
<meta content="Premium Multipurpose Admin & Dashboard Template"
	name="description" />
<meta content="Pichforest" name="author" />
<%@ include file="/WEB-INF/views/includes/plugin.jsp"%>

<style>
.dashboard .row1 {height:20%; overflow:hidden;}
.dashboard .row2 {height:20%; overflow:hidden;}
.dashboard .row3 {height:40%; overflow:hidden;}
.dashboard .row4 {height:20%; overflow:hidden;}
.dashboard .card-body {padding:1em 1em 0em 1em !important;}
.dashboard .card-content {height:calc(100% - 35px);}
.dashboard .card-content.chart {height:calc(100% - 45px); margin:-5px 0px 0px -15px;}
.card .sub-title {margin:10px 0px 0px 0px; color:rgba(255,255,255,0.3);}
.card .value {font-size:2em; font-weight: bold;  color:rgba(255,255,255,0.3);}
.card .value strong {color:#ffffff;}
.card .value span {font-weight: normal; font-size:15px;}
.card .progress {background: rgba(255,255,255,0.1);}

.content-load-stack {}
.content-load-stack li {display: none; border-top:1px solid rgba(255,255,255, 0.1); padding:3px 0px 3px 0px; margin:0;}
.compress-bar {background:rgba(255,255,255,0.1); height:12px; border-radius: 15px;}
.content-load-stack label {display: inline-block; padding:2px 5px 2px 5px; border:1px solid rgba(255,255,255, 0.3); color:rgba(255,255,255, 0.3); border-radius: 5px; margin:0; font-size:0.8em;}
.content-load-stack .optimized label {color:#038edc; border-color:#038edc;}
.content-load-stack th {text-align:center !important;}
.content-load-stack .speed-rate {/*color:#038edc;*/ padding:0px 20px 0px 0px; font-weight: bold;}
.content-load-stack .size {color:rgba(255,255,255, 0.3); font-size:0.8em;}
.content-load-stack .optimized .size {color:#038edc;}

#top-animation {position: relative;}
#cylinder {position: absolute; top:40%; left:50%; transform:translate(-50%, -50%); z-index:2;}
#cylinder ul {margin:0px auto 0px auto;}
#cylinder ul li {float:left; width:10px; max-width: 10px;}
#cylinder ul li img {height:70px;}
#cylinder .wrap {display:flex;}
#cylinder .value {margin:0; padding:0; text-align:center; font-weight: normal; font-size:1.2em; color:#ffffff; position: relative; left:13px;}

#top-animation .content {position: absolute; top:0; left: 0; color:#ffffff; font-size:0.6em; z-index:1;}
#top-animation .content.type1 {}
#top-animation .content.type2 {color:#ff0000 !important;}
#top-animation .content.type3 {color:#ffdd3e !important;}
#top-animation .content.type4 {color:#038edc !important;}


.apexcharts-tooltip {background: rgba(3, 39, 60, 0.8) !important;  /*filter: blur(10px);*/  border:1px solid #234e67;  color: #FFFFFF;}
.apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-title {background:#234e67 !important;}  
</style>

<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

</head>

<body class="dashboard" data-bs-theme="dark" data-topbar="dark" data-sidebar="dark">
	<div id="layout-wrapper">
		<%@ include file="/WEB-INF/views/includes/topbar.jsp"%>
		<div class="layout-parent">
<!--  ==================================================================================================== -->		
<div class="row row1">
	<div class="col-lg-12 h-100">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">최적화 현황</h4>
				<div class="card-content" id="top-animation">
					<div id="cylinder">
						<div class="wrap">
							<div class="type01">
								<p class="value">3</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
								</ul>
							</div>
							<div class="type02">
								<p class="value">3</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type02.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type02.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type02.png" style=""  /></li>
								</ul>
							</div>
							<div class="type03">
								<p class="value">3</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type03.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type03.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type03.png" style=""  /></li>
								</ul>
							</div>
							<div class="type04">
								<p class="value">3</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type04.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type04.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type04.png" style=""  /></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row row2">
	<div class="col-lg-3 h-100">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">이미지 웹 콘텐츠</h4>
				<p class="sub-title">최적화 현황</p>
				<p class="value"><strong>150</strong>/200<span>건</span></p>
				<div class="progress animated-progess custom-progress mt-2">
					<div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-3 h-100">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">동영상 웹 콘텐츠</h4>
				<p class="sub-title">최적화 현황</p>
				<p class="value"><strong>150</strong>/200<span>건</span></p>
				<div class="progress animated-progess custom-progress mt-2">
					<div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
					</div>
				</div>				
			</div>
		</div>
	</div>
	<div class="col-lg-3 h-100">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">텍스트 웹 콘텐츠</h4>
				<p class="sub-title">최적화 현황</p>
				<p class="value"><strong>150</strong>/200<span>건</span></p>
				<div class="progress animated-progess custom-progress mt-2">
					<div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
					</div>
				</div>				
			</div>
		</div>
	</div>
	<div class="col-lg-3 h-100">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">폰트 웹 콘텐츠</h4>
				<p class="sub-title">최적화 현황</p>
				<p class="value"><strong>150</strong>/200<span>건</span></p>
				<div class="progress animated-progess custom-progress mt-2">
					<div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
					</div>
				</div>				
			</div>
		</div>
	</div>
</div>

<div class="row row3">
	<div class="col-lg-4">
		<div class="card h-50-tune">
			<div class="card-body">
				<h4 class="card-title">현재 콘텐츠 로딩 속도</h4>
				<div class="card-content chart">
					<div id="temp-chart01"></div>
				</div>
			</div>		
		</div>
		<div class="card h-50-tune">
			<div class="card-body">
				<h4 class="card-title">오늘 콘텐츠 로딩 속도</h4>
				<div class="card-content chart">
					<div id="temp-chart02"></div>
				</div>
			</div>		
		</div>
	</div>
	<div class="col-lg-8">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">유형별 웹 콘텐츠 압축율 및 로딩 속도 향상율</h4>
				<div class="card-content chart">
					<div id="temp-chart03"></div>
				</div>
			</div>		
		</div>
	</div>
</div>

<div class="row row4">
	<div class="col-lg-8">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">실시간 콘텐츠 로딩 속도 현황 <img src="${contextPath}/resources/img/icon-refresh.png" id="content-load-refresh" style="width:16px; position:relative; top:-2px;"/></h4>
				<div class="card-content" id="content-load-stack-outer" style="margin:10px 0px 0px 0px">
					<div id="content-load-stack-inner" style="height:100px; overflow:auto;"  data-simplebar>
						<ul id="content-load-stack" class="content-load-stack">
						</ul>
					</div>
				</div>
			</div>		
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">로딩 속도 최적화가 필요한 웹 콘텐츠</h4>
				<div class="card-content chart" style="position:relative; left:15px; margin-right: -17px;">
					<div id="temp-chart04"></div>
				</div>
			</div>		
		</div>
	</div>
</div>


<script>
$(document).ready(function(){
	$('#preLoader').fadeOut(300);
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
    
    // $(".card").resizable();
});

</script>
	
<script src="${contextPath}/resources/vendor/apexcharts/apexcharts.min.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/dashboard/dashboardSpeed.js"></script>
<script src="${contextPath}/resources/vendor/simplebar/simplebar.min.js"></script>

<!--  ==================================================================================================== -->		
		</div>
	</div>


</body>
</html>