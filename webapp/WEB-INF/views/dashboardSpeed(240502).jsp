<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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

<style>
:root {
	--color-blue: #077cd3;
	--color-dark-blue: #274c63;
	--color-light-blue: #009cff;
	--color-red: #f14639;
	--color-yellow: #ffc107;
	--color-green: #1aa52a;
	--color-opacity50: rgba(255,255,255,0.5);
}
.dashboard .row1 {height:20%; overflow:hidden;}
.dashboard .row2 {height:40%; overflow:hidden;}
.dashboard .row3 {height:40%; overflow:hidden;}
.dashboard .row3 .h-100 {height:calc(100% - 0px) !important;}

.dashboard .card-body {padding:1em 1em 0em 1em !important; position: relative;}
.dashboard .card-content {height:calc(100% - 35px); position: relative;}
.dashboard .card-content.chart {height:calc(100% - 45px); margin:-5px 0px 0px -15px;}
.dashboard .card-content.treemap-chart {margin:-5px -30px -5px 0px;}
.dashboard .card-content.radial-chart {position: relative; }
.dashboard .card-content #radial-chart01 {position: relative; z-index: 1;}
.radial-chart-value {text-align:center; top:100px; left:50%; transform:translate(-50%, 0%); font-size:2.5em; font-weight: bold; position: absolute; z-index: 2; width:100%; color:#077cd3;} 
.radial-chart-value ion-icon {position:relative; top:0px; font-size:0.8em;} 
.radial-chart-desc {text-align:center; position: relative; top:-40px;}
.radial-chart-desc strong {color:var(--color-blue);}
.chart-label {position: absolute; right:15px; top:15px; color:var(--color-opacity50);}

.card .sub-title {margin:10px 0px 0px 0px; color:rgba(255,255,255,0.3);}
.card .value {font-size:2em; font-weight: bold;  color:rgba(255,255,255,0.3);}
.card .value strong {color:#ffffff;}
.card .value span {font-weight: normal; font-size:15px;}
.card .progress {background: rgba(255,255,255,0.1);}

#top-animation {position: relative;}
#cylinder {position: absolute; top:40%; left:50%; transform:translate(-50%, -50%); z-index:2;}
#cylinder ul {margin:0px auto 0px auto;}
#cylinder ul li {float:left; width:10px; max-width: 10px;}
#cylinder ul li img {height:70px;}
#cylinder .wrap {display:flex;}
#cylinder .value {margin:0; padding:0; text-align:center; font-weight: normal; font-size:1.2em; color:#ffffff; position: relative; left:13px;}

#top-animation .content {position: absolute; top:0; left: 0; color:#ffffff; font-size:0.6em; z-index:1; opacity: 0.7;}
#top-animation .content.unoptimized {font-size:2em;}
#top-animation .content.type1 {color:#038edc !important;}
#top-animation .content.type2 {color:#0cda46 !important;}
#top-animation .content.type3 {color:#ffdd3e !important;}
#top-animation .content.type4 {color:#ff0000 !important;}

#table-outer {margin:15px 0px 0px 0px;}
#table-inner {height:200px; overflow:auto;}
#table-inner th,
#table-inner td {border-color: rgba(255,255,255,0.3) !important;;}
#table-inner .active th,
#table-inner .active td {background:rgba(0, 143, 251, 0.5);}

/* 스크롤바의 폭 너비 */
#table-inner::-webkit-scrollbar {
    width: 5px;  
}

#table-inner::-webkit-scrollbar-thumb {
    background: rgba(0, 143, 251, 0.3); /* 스크롤바 색상 */
    border-radius: 10px; /* 스크롤바 둥근 테두리 */
}

#table-inner::-webkit-scrollbar-track {
    background: rgba(220, 20, 60, 0);  /*스크롤바 뒷 배경 색상*/
}

.apexcharts-tooltip {background: rgba(3, 39, 60, 0.8) !important;  /*filter: blur(10px);*/  border:1px solid #234e67;  color: #FFFFFF;}
.apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-title {background:#234e67 !important;}
.apexcharts-datalabels {color:#ffffff !important;}  
.apexcharts-pie-label {fill:#ffffff !important;}

#pie-chart01 {width: 40%; position: relative; z-index:1;}
#pie-chart01 p {position:absolute; bottom:-5px; text-align:Center; width:100%;}
#mix-chart01 {width: 60%;}

.row3 .card-content .progress {position: absolute; bottom:0; left:0; width:100%;}
.row3 .card-content .count {position: absolute; bottom:10px; left:0; width:100%;}
.row3 .card-content .count p {width:50%;}
.row3 .card-content .count p:nth-child(1) {color: rgba(255,255,255,0.3);}
.row3 .card-content .count p strong {color:var(--color-blue);}
.row3 .card-content .count p:nth-child(2) {text-align:right;}

.more {position: absolute; right:-5px; top:-24px; font-size:20px; color: rgba(255,255,255,0.3);}

.row3 [data-status-level="3"] {/*opacity: 1; background: rgba(255,255,255,0.1);*/}

.row3 [data-status-level="0"] .card-content .count p strong {color:var(--color-red);}
.row3 [data-status-level="1"] .card-content .count p strong {color:var(--color-yellow);}
.row3 [data-status-level="2"] .card-content .count p strong {color:var(--color-green);}
.row3 [data-status-level="3"] .card-content .count p strong {}

.status-txt {padding:5px 0px 0px 0px;}

.row3 [data-status-level="0"] .status-txt {color:var(--color-red);}
.row3 [data-status-level="1"] .status-txt {color:var(--color-yellow);}
.row3 [data-status-level="2"] .status-txt {color:var(--color-green);}
.row3 [data-status-level="3"] .status-txt {color:var(--color-blue);}

.status-txt strong {display: inline-block; padding:3px 3px 3px 3px; font-size: 0.8em; border-radius: 3px; color:#04273c;}
.row3 [data-status-level="0"] .status-txt strong {background-color: var(--color-red);}
.row3 [data-status-level="1"] .status-txt strong {background-color: var(--color-yellow);}
.row3 [data-status-level="2"] .status-txt strong {background-color: var(--color-green);}
.row3 [data-status-level="3"] .status-txt strong {color: var(--color-blue); border:1px solid var(--color-blue);}

.row3 [data-status-level="0"] .progress-bar {background-color: var(--color-red);}
.row3 [data-status-level="1"] .progress-bar {background-color: var(--color-yellow);}
.row3 [data-status-level="2"] .progress-bar {background-color: var(--color-green);}
.row3 [data-status-level="3"] .progress-bar {background-color: var(--color-blue);}

.apexcharts-tooltip-custom {background: rgba(3, 45, 70, 0.8); border:1px solid #234e67; padding:10px; border-radius: 10px;}
.apexcharts-tooltip-custom strong {color:var(--color-blue) !important;}
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
								<p class="value">0</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type01.png" style=""  /></li>
								</ul>
							</div>
							<div class="type02">
								<p class="value">0</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type02.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type02.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type02.png" style=""  /></li>
								</ul>
							</div>
							<div class="type03">
								<p class="value">0</p>
								<ul>
									<li><img src="${contextPath}/resources/img/cylinder-type03.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type03.png" style=""  /></li>
									<li><img src="${contextPath}/resources/img/cylinder-type03.png" style=""  /></li>
								</ul>
							</div>
							<div class="type04">
								<p class="value">0</p>
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
	<div class="col-lg-4">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">로딩 속도 최적화가 필요한 웹 콘텐츠</h4>
				<div class="card-content treemap-chart">
					<div id="temp-chart04"></div>
				</div>
			</div>		
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card h-100">
			<div class="card-body">
				<h4 class="card-title">로딩 속도 최적화가 필요한 웹 콘텐츠 목록</h4>
				<div class="card-content" id="table-outer">
					<div id="table-inner"  data-mdb-perfect-scrollbar='true' >
						<table class="table mb-0">
						<thead class="table-light">
							<tr>
								<th>#</th>
								<th>웹 콘텐츠 이름</th>
								<th>원본 용량</th>
								<th>호출 횟수</th>
								<th>상태</th>
								<th>최적화</th>
							</tr>
						</thead>
						<tbody>
						<tr>
							<td>1</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>2</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>3</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>4</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>5</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>6</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>7</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>8</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>9</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
						<tr>
							<td>10</td>
							<td>image01.png</td>
							<td>10MB</td>
							<td>10,000회</td>
							<td>최적화 전</td>
							<td><button type="button" class="btn btn-primary btn-sm">최적화</button></td>
						</tr>	
	
						</tbody><!-- end tbody-->
						</table><!-- end table-->
					</div>
				</div>
			</div>		
		</div>
	</div>	
	<div class="col-lg-4">
		<div class="card h-50-tune">
			<div class="card-body">
				<h4 class="card-title">현재 콘텐츠 로딩 속도</h4>
				<p class="chart-label"><span style="color:var(--color-dark-blue);">■</span> 최적화 전 <span style="color:var(--color-blue);">■</span> 최적화 후</p>
				<div class="card-content chart">
					<div id="temp-chart01"></div>
				</div>
			</div>		
		</div>
		<div class="card h-50-tune">
			<div class="card-body">
				<h4 class="card-title">오늘 콘텐츠 로딩 속도</h4>
				<p class="chart-label"><span style="color:var(--color-dark-blue);">■</span> 최적화 전 <span style="color:var(--color-blue);">■</span> 최적화 후</p>
				<div class="card-content chart">
					<div id="temp-chart02"></div>
				</div>
			</div>		
		</div>
	</div>	
</div>

<div class="row row3">
	<div class="col-lg-2">
		<div class="card  h-100">
			<div class="card-body">
				<div class="card-content radial-chart">
					<div id="radial-chart01" style="height: 100%;"></div>
					<div id="radial-chart01-value" class="radial-chart-value">
						<span>67%</span>
						<ion-icon name="chevron-up-circle-outline"></ion-icon>
					</div>
					<div class="radial-chart-desc">
						웹 콘텐츠 평균 로딩 속도<br />
						<strong>67% 향상</strong>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-2">
		<div class="card  h-100">
			<div class="card-body">
				<div class="card-content radial-chart">
					<div id="radial-chart02" style="height: 100%;"></div>
					<div id="radial-chart02-value" class="radial-chart-value">
						<span>67%</span>
						<ion-icon name="checkmark-circle-outline"></ion-icon>
					</div>
					<div class="radial-chart-desc">
						<strong>600</strong><span style="color: rgba(255, 255, 255, 0.3);">/1000건</span><br />최적화 완료
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card  h-100">
			<div class="card-body">
				<h4 class="card-title">로딩 속도 최적화가 필요한 웹 콘텐츠 유형</h4>
				<div class="card-content">
					<div class="d-flex h-100" style="margin-right: -15px;">
						<div id="pie-chart01">
							<p>웹 콘텐츠 유형별 트래픽 비중</p>
						</div>
						<div id="mix-chart01"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-2">
		<div class="card  h-50-tune" data-status-level="2">
			<div class="card-body">
				<h4 class="card-title">이미지 웹 콘텐츠 최적화 현황</h4>
				<div class="card-content">
					<p class="status-txt"><strong>양호</strong> 최적화가 거의 완료되었습니다</p>
					<div class="count d-flex">
						<p><strong>200</strong>/250건</p>
						<p>80%</p>
					</div>
					<div class="progress animated-progess custom-progress mt-2">
						<div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
						</div>
					</div>
					<p class="more"><ion-icon name="add-outline"></ion-icon></p>
				</div>
			</div>
		</div>
		<div class="card  h-50-tune" data-status-level="1">
			<div class="card-body">
				<h4 class="card-title">동영상 웹 콘텐츠 최적화 현황</h4>
				<div class="card-content">
					<p class="status-txt"><strong>보통</strong> 최적화가 필요합니다</p>
					<div class="count d-flex">
						<p><strong>125</strong>/250건</p>
						<p>50%</p>
					</div>				
					<div class="progress animated-progess custom-progress mt-2">
						<div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="50">
						</div>
					</div>
					<p class="more"><ion-icon name="add-outline"></ion-icon></p>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-2">
		<div class="card  h-50-tune" data-status-level="0">
			<div class="card-body">
				<h4 class="card-title">텍스트 웹 콘텐츠 최적화 현황</h4>
				<div class="card-content">
					<p class="status-txt"><strong>나쁨</strong> 최적화가 필요합니다</p>
					<div class="count d-flex">
						<p><strong>50</strong>/250건</p>
						<p>20%</p>
					</div>				
					<div class="progress animated-progess custom-progress mt-2">
						<div class="progress-bar" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="20">
						</div>
					</div>
					<p class="more"><ion-icon name="add-outline"></ion-icon></p>
				</div>
			</div>
		</div>
		<div class="card  h-50-tune" data-status-level="3">
			<div class="card-body">
				<h4 class="card-title">폰트 웹 콘텐츠 최적화 현황</h4>
				<div class="card-content">
					<p class="status-txt"><strong>완료</strong> 모든 최적화가 완료되었습니다</p>
					<div class="count d-flex">
						<p><strong>200</strong>/250건</p>
						<p>100%</p>
					</div>				
					<div class="progress animated-progess custom-progress mt-2">
						<div class="progress-bar" role="progressbar" style="width: 100%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
						</div>
					</div>
					<p class="more"><ion-icon name="add-outline"></ion-icon></p>
				</div>
			</div>
		</div>
	</div>
</div>
	
<script src="${contextPath}/resources/vendor/apexcharts/apexcharts.min.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/dashboard/dashboardSpeed.js"></script>
<script src="${contextPath}/resources/vendor/simplebar/simplebar.min.js"></script>

<script>
$(document).ready(function(){
	$(".switch-btn .switch-speed").addClass("active");
	/*var rotation = function (){
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
    rotation();*/
    
    activeTopMenu(0);
    setTimeout(function(){
		$('#preLoader').fadeOut(300);
    },0);
});

</script>

<!--  ==================================================================================================== -->		
		</div>
	</div>


</body>
</html>