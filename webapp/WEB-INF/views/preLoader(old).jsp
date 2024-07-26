<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="utf-8" />
<title>${title }</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta content="Premium Multipurpose Admin & Dashboard Template" name="description" />
<meta content="Pichforest" name="author" />
<style>

:root {
	--color-dark-bg: #03273c;
}
#preLoader{
	position: fixed; /* 페이지 스크롤에 고정 */
    top: 0; /* 상단에 위치 */
    left: 0; /* 왼쪽에 위치 */
    width: 100%; /* 너비는 화면 전체 */
    height: 100%; /* 높이는 화면 전체 */
    background-color: rgba(3, 39, 60, 0.8); /* 반투명한 흰색 배경 */
    z-index: 99999999; /* 다른 요소 위에 표시 */
    display: flex; /* 내부 요소를 수평으로 정렬하기 위해 Flexbox 사용 */
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */

}

.load {
  position: fixed; /* 페이지 스크롤에 고정 */
    top: 0; /* 상단에 위치 */
    left: 0; /* 왼쪽에 위치 */
    width: 100%; /* 너비는 화면 전체 */
    height: 100%; /* 높이는 화면 전체 */
    background-color: rgb(255 255 255 / 91%); /* 반투명한 흰색 배경 */
    z-index: 1000; /* 다른 요소 위에 표시 */
    display: flex; /* 내부 요소를 수평으로 정렬하기 위해 Flexbox 사용 */
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
}

.load_gears {
  z-index: -2;
  width: 150px;
/*   height: 150px; */
  top: -120px !important;
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.gear {
  position: absolute;
  width: 80px;
  height: 80px;
  margin: auto;
  background: #038edc;
  border-radius: 50%;
  animation-name: spin;
  animation-duration:6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  top: -5px;
  left: 0;
  right: 0;
}
.gear .center {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  width: 40px;
  height: 40px;
  background: var(--color-dark-bg);
  border-radius: 50%;
}

.bar {
  position: absolute;
  top: -10px;
  left: 28px;
  z-index: 1;
  width: 22px;
  height: 100px;
  background: #038edc;
}
.bar:nth-child(2) {
  transform: rotate(45deg);
}
.bar:nth-child(3) {
  transform: rotate(90deg);
}
.bar:nth-child(4) {
  transform: rotate(135deg);
}

.gear-two {
  left: -90px;
  top: 68px;
  width: 55px;
  height: 55px;
  background: #61adda;
  animation-name: spin-reverse;
}
.gear-two .bar {
  background: #61adda;
  width: 14px;
  height: 70px;
  left: 20px;
  top: -8px;
}
.gear-two .center {
  width: 28px;
  height: 28px;
  left: 13px;
  top: 13px;
}
.gear-three {
  left: 90px;
  top: 68px;
  width: 55px;
  height: 55px;
  background: #576e81;
  animation-name: spin-reverse;
}
.gear-three .bar {
  background: #576e81;
  width: 14px;
  height: 70px;
  left: 20px;
  top: -8px;
}
.gear-three .center {
  width: 28px;
  height: 28px;
  left: 13px;
  top: 13px;
}

@-webkit-keyframes spin {
  50% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  50% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spin-reverse {
  50% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
@keyframes spin-reverse {
  50% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
</style>

</head>


<body>

<!-- <div id="preLoader"> -->
<%-- 	<img src="${pageContext.request.contextPath}/resources/img/preloader.gif" style="width:350px; height:350px;"/>	 --%>
<!-- </div> -->



<!-- partial:index.partial.html -->
<div class="load" id="preLoader">
  <div class="load_gears"> 
    <div class="gear">
      <div class="center"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="gear gear-two">
      <div class="center"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="gear gear-three">
      <div class="center"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>
</div>

</body>

</html>