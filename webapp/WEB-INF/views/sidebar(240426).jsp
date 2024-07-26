<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- ========== Left Sidebar Start ========== -->
<div class="vertical-menu" style="display:none;">

    <!-- LOGO -->
    <div class="navbar-brand-box">
        <a href="/" class="logo logo-dark">
            <span class="logo-sm">
                <img src="${contextPath}/resources/img/logo-sm.jpg" alt="" height="22">
            </span>
            <span class="logo-lg">
                <img src="${contextPath}/resources/img/logo.jpg" alt="" height="22">
            </span>
        </a>

        <a href="/" class="logo logo-light">
            <span class="logo-lg">
                <img src="${contextPath}/resources/img/logo.jpg" alt="" height="22">
            </span>
            <span class="logo-sm">
                <img src="${contextPath}/resources/img/logo.jpg" alt="" height="22">
            </span>
        </a>
    </div>

    <div data-simplebar class="sidebar-menu-scroll">

        <!--- Sidemenu -->
        <div id="sidebar-menu">
            <!-- Left Menu Start -->
            <button type="button" class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"><i class="fa fa-fw fa-bars"></i></button>
            <ul class="metismenu list-unstyled" id="side-menu">
                <li class="menu-title" data-key="t-dashboards">OPTIMIZER</li>

                <li>
                    <a href="/">
                        <i class="fas fa-house"></i> <span class="menu-item" data-key="t-sales">비용 최적화 현황</span>
                    </a>
                </li>
                <li>
                    <a href="/dashboardSpeed">
                        <i class="fas fa-house"></i> <span class="menu-item" data-key="t-sales">속도 최적화 현황</span>
                    </a>
                </li>

                <li>
                    <a href="/optimizerByContent">
                        <i class="fas fa-folder-open"></i> <span class="menu-item" data-key="t-sales">웹 컨텐츠 최적화</span>
                    </a>
                </li>

                <li>
                    <a href="/optimizerByPage">
                        <i class="fas fa-window-maximize"></i> <span class="menu-item" data-key="t-analytics">웹 페이지 최적화</span>
                    </a>
                </li>
                
                <li>
                    <a href="/trafficCost">
                        <i class="fas fa-calendar-check"></i> <span class="menu-item" data-key="t-analytics">비용 절감 현황</span>
                    </a>
                </li>
                
                <li>
                    <a href="/costOpt">
                        <i class="fas fa-money-bill"></i> <span class="menu-item" data-key="t-analytics">최적화 비용 예측</span>
                    </a>
                </li>

                <li class="menu-title" data-key="t-applications">SETTING</li>

                <li>
                    <a href="/siteManage">
                        <i class="fas fa-desktop"></i>
                        <span class="menu-item" data-key="t-siteManage">사이트 관리</span>
                    </a>
                </li>
                <li>
                    <a href="/cloudManage">
                        <i class="fas fa-cloud"></i>
                        <span class="menu-item" data-key="t-cloudManage">클라우드 관리</span>
                    </a>
                </li>
                <li>
                    <a href="/userManage">
                        <i class="fas fa-user"></i>
                        <span class="menu-item" data-key="t-userManage">사용자 관리</span>
                    </a>
                </li>
                <li>
                    <a href="#" id="changePasswd">
                        <i class="fas fa-lock"></i>
                        <span class="menu-item" data-key="t-changePasswd">비밀번호 변경</span>
                    </a>
                </li>
                <li>
                    <a href="/inspLog">
                        <i class="fas fa-clipboard"></i>
                        <span class="menu-item" data-key="t-inspLog">감사 로그</span>
                    </a>
                </li>

                

<!--                 <li> -->
<!--                     <a href="apps-gallery.html"> -->
<!--                         <i class="icon nav-icon" data-feather="image"></i> -->
<!--                         <span class="menu-item" data-key="t-gallery">Gallery</span> -->
<!--                     </a> -->
<!--                 </li> -->

<!--                 <li> -->
<!--                     <a href="javascript: void(0);" class="has-arrow"> -->
<!--                         <i class="icon nav-icon" data-feather="briefcase"></i> -->
<!--                         <span class="menu-item" data-key="t-projects">Projects</span> -->
<!--                     </a> -->
<!--                     <ul class="sub-menu" aria-expanded="false"> -->
<!--                         <li><a href="projects-grid.html" data-key="t-p-grid">Projects Grid</a></li> -->
<!--                         <li><a href="projects-list.html" data-key="t-p-list">Projects List</a></li> -->
<!--                         <li><a href="projects-overview.html" data-key="t-p-overview">Project Overview</a></li> -->
<!--                         <li><a href="projects-create.html" data-key="t-create-new">Create New</a></li> -->
<!--                     </ul> -->
<!--                 </li> -->

            </ul>
        </div>
        <!-- Sidebar -->
    </div>
</div>
<!-- Left Sidebar End -->

<!-- 비밀번호 모달 -->


<!-- Modal -->
<div class="modal fade" id="changePasswdModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" style="max-width: 640px;">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">사용자 비밀번호 확인</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       	<form name="insertUser">				
					<div class="input-group mb-1">
						<span class="input-group-text"><label style="font-size:10px;color: red;">*</label>현재 비밀번호</span>
						<input type="password" name="lgn_pswd_2" class="form-control" placeholder="">
					</div>
				</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        <button type="button" class="btn btn-primary" id="checkUser">확인</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="changePasswdModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" style="max-width: 640px;">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">사용자 비밀번호 변경</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form name="insertUser">
					<div class="input-group mb-1">
						<span class="input-group-text"><label style="font-size:10px;color: red;">*</label>비밀번호</span>
						<input type="password" name="lgn_pswd_up_2" class="form-control" placeholder="">
						<label style="font-size: 12px;color: red;">비밀번호는 10~20자로 영문 대소문자, 숫자, 특수문자 3가지 이상을 조합해야 합니다.<br>사용가능 특수문자: ~!@#$%^*()_-=</label>
					</div>
					<div class="input-group mb-1">
						<span class="input-group-text"><label style="font-size:10px;color: red;">*</label>비밀번호 확인</span>
						<input type="password" name="lgn_pswdCheck_up_2" class="form-control" placeholder="">
					</div>
				</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        <button type="button" class="btn btn-primary" id="updatePassBtn">수정</button>
      </div>
    </div>
  </div>
</div>

<script>
function toggleSize(elementClass) {
    $('.' + elementClass).toggleClass('expanded');
    if(elementClass=="vertical-menu"){
    	if($("body").attr("data-sidebar-size")=="sm"){
    		$("body").attr("data-sidebar-size","lg");    		
    	}else{
    		$("body").attr("data-sidebar-size","sm");
    	}
    }
}

//비밀번호 모달

$("#changePasswd").click(function(){
	console.log("비밀번호 변경");
    $("input[name=lgn_pswd_2]").val('');
    
	$('#changePasswdModal').modal('show');
});	

$("#checkUser").click(function(){
	checkUser();
});

$("#updatePassBtn").click(function(){
	updatePassBtn();
});

$("input[name=lgn_pswd_2]").on("keydown",function(key){   
    if(key.keyCode==13) {
        return false;
    }
});

function checkUser() {
	var lgn_pswd = $("input[name=lgn_pswd_2]").val();
	
	if(lgn_pswd == null || lgn_pswd == '') {
		alertify.warning('비밀번호를 입력해주세요.');
	}else {
		$.ajax({
			type : 'post',
			url : '/updatePasswdChk',
			data : {
				lgn_pswd: lgn_pswd,
			},
			dataType : 'json',
			error: function(xhr, status, error){
				// alert(error);
			},
			success : function(json){				
				if(json.msg == 'T') {
					$("input[name=lgn_pswd_2]").val('');
					$("input[name=lgn_pswd_up_2]").val('');
					$("input[name=lgn_pswdCheck_up_2]").val('');
				    
					$('#changePasswdModal').modal('hide');
					$('#changePasswdModal2').modal('show');
				}else {
					alertify.warning(json.msg);
				}
			}
		});	
	}
}

function updatePassBtn() {
		var lgn_pswd_up = $("input[name=lgn_pswd_up_2]").val();
		var lgn_pswdCheck_up = $("input[name=lgn_pswdCheck_up_2]").val();
			
		if(lgn_pswd_up == null || lgn_pswd_up == '') {
			alertify.warning('비밀번호 입력해주세요.');
		}else if(lgn_pswdCheck_up == null || lgn_pswdCheck_up == '') {
			alertify.warning('비밀번호 확인을 입력해주세요.');
		}else if(lgn_pswd_up != lgn_pswdCheck_up) {
			alertify.warning('비밀번호 확인이 일치하지 않습니다.');
		}else {
		$.ajax({
			type : 'post',
			url : '/updatePasswd',
			data : {
				lgn_pswd: lgn_pswd_up,
			},
			dataType : 'json',
			error: function(xhr, status, error){
				// alert(error);
			},
			success : function(json){				
				if(json.responseMessage != 'T') {
					alertify.warning(json.responseMessage);
				}else {
					alertify.success('비밀번호 수정이 완료되었습니다.');	
					
					location.reload(true);
				}
			}
		});	
	}
}
// 비밀번호 모달

</script>
