

//
//________SUSPENDED DATA FORMAT________________
//	PageStatus=1,0,1,1,1,1,1||INTERNALPASSEDSCORE=100
//



function Scorm12InterfaceManager()
{
	this.API = null;
	this.LMS_INTEGRATION_ENABLED = false;
	this.CLASSNAME = "Scorm12InterfaceManager";
	this.initialize = null;
	this.Course = "";
	this.suspended_data = "";
	this.lesson_location = "";
	this.lesson_status = "not attempted";
	this.score = "";
	this.course_completed = "false";
	this.student_name = "lastname, firstname";	
}

Scorm12InterfaceManager.prototype.init = function() {	
	this.Course = Course;
	this.LMS_INTEGRATION_ENABLED = this.Course.LMS_INTEGRATION_ENABLED;
	if(this.LMS_INTEGRATION_ENABLED == true) {
		this.API = objAPI;
		this.getValuesFromLMS();
	} else {
		this.API = "LOCAL";
	}
	
	this.initialize = true;
	
	
	this.getValuesFromLMS();
	
	if(this.lesson_status.toString().toLowerCase() == "not attempted") {
		this.sendValuesToLMS("lesson_status", "incomplete");
	}
	
	if(this.lesson_status.toString().toLowerCase() == "completed" || this.lesson_status.toString().toLowerCase() == "passed") {
		this.course_completed = "true";
	}  else {
		this.course_completed = "false";
	}	
	
	//this.assign_LOCAL_TEST_DATA();
}

Scorm12InterfaceManager.prototype.assign_LOCAL_TEST_DATA = function() {
	//this.suspended_data = "PageStatus=1,1,1,1,1||INTERNALPASSEDSCORE=100";
	//this.lesson_status = "completed";
	//this.course_completed = "true";
}

Scorm12InterfaceManager.prototype.close = function() {
	Terminate();
}

Scorm12InterfaceManager.prototype.getValuesFromLMS = function() {
	if(this.API != null && this.API != "LOCAL") {
		this.suspended_data = LMSGetSuspendData();
		this.lesson_location = LMSGetLessonLocation();
		this.lesson_status = LMSGetLessonStatus();
		this.score = LMSGetRawScore();
		this.student_name = LMSGetStudentName();
	}
}

Scorm12InterfaceManager.prototype.sendValuesToLMS = function(data_type, data) {
	if(data_type == "suspended_data") {
		var s = this.addAddtionsToSuspendedData(data)
		LMSSetSuspendData(s);
	} else if(data_type == "lesson_location") {
		LMSSetLessonLocation(data);
	} else if(data_type == "score") {
		LMSSetRawScore(data);
	} else if(data_type == "lesson_status") {
		LMSSetLessonStatus(data);
	}
	Commit();
}

Scorm12InterfaceManager.prototype.addAddtionsToSuspendedData = function(data) {
	var PS;
	var result_string = "";
	
	PS = data;
	if(this.Course.LMS_INTERNAL_PASSED_SCORE != "") {
		result_string = PS + "||" + "INTERNALPASSEDSCORE=" + this.Course.LMS_INTERNAL_PASSED_SCORE;
	} else {
		result_string = PS;
	}
	return result_string;
}
Scorm12InterfaceManager.prototype.getVariableValueFromSuspendedData = function(variable) {
	var data_array = new Array();
	var temp_array = new Array();
	
	if(this.suspended_data == "") {
		return "";
	} else {
		data_array = this.suspended_data.split("||");
		for(var i=0; i < data_array.length; i++) {
			var temp_array = data_array[i].split("=");
			if(temp_array[0] == variable) {
				if(temp_array[1] == undefined) {
					return "";
				}
				return temp_array[1];
			}
		}
		return "";
	}
}
Scorm12InterfaceManager.prototype.close = function() {
	if(this.API != null && this.API != "LOCAL") {
		Terminate();
	}
}

























