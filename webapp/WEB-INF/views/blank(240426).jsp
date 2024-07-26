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
            <div class="container-fluid">
                <!-- start page title -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-flex align-items-center justify-content-between">
                            <h4 class="mb-0">Sales Analytics</h4>

                            <div class="page-title-right">
                                <ol class="breadcrumb m-0">
                                    <li class="breadcrumb-item"><a href="javascript: void(0);">Dashonic</a></li>
                                    <li class="breadcrumb-item active">Sales Analytics</li>
                                </ol>
                            </div>

                        </div>
                    </div>
                </div>
                <!-- end page title -->
                <!-- start page content -->
                <div style="height:1200px;">
                	내용 어쩌구
                </div>
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

</body>

</html>