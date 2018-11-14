//--created for standard clearpoint projects SCORM API detection and to handle API functionalities - karthick [v17jan07]--//


/*******************************************************************************
**
** SCORM 1.2 communication Wrapper functions
** 
******************************************************************************************/


var objAPI		= null;				// Handle to the LMS SCORM API object
var strCMITrue 		= "true"
var strCMIFalse 	= "false"
var strEmptyString 	= ""
var bDisableAPINotFoundError = false;	// Enable or Disable the SCORM API not found error message.
var strSuspendData = "";
var bSCORM12Enabled; 
var debug = false;

/******************************************************************************************
**
** Function LMSGetLastError() 
** Inputs:	None
** Return:	The error code (integer format) that was set by the last LMS function call
**
** Description:
** Call the LMSGetLastError function which will be implemented by the LMS, 
** if the LMS is compliant with the SCORM.
**
******************************************************************************************/
function GetLastError()
{
	var nResult = 0
	if (objAPI != null){
		nResult = objAPI.GetLastError()
		return nResult;
	}
	else{
		handleSCORMError();
		return null;
	}
}


/******************************************************************************************
**
** Function LMSGetErrorString(errorCode)
** Inputs:	errorCode - Error Code(integer format)
** Return:	The textual description that corresponds to the input error code 
**
** Description:
** Call the LMSGetErrorString function which will be implemented by the LMS, 
** if the LMS is compliant with the SCORM.
**
******************************************************************************************/
function GetErrorString(nErrorCode)
{
	var strResult = ""
	if (objAPI != null){
		strResult = objAPI.GetErrorString(nErrorCode)
		return strResult;
	}
	else{
		handleSCORMError();
		return false;
	}
} 

/******************************************************************************************
**
** Function LMSGetDiagnostic(errorCode) 
** Inputs:	errorCode - Error Code(integer format), or null
** Return:	The vendor specific textual description that corresponds to the input error code 
**
** Description:
** Call the LMSGetDiagnostic function which will be implemented by the LMS, 
** if the LMS is compliant with the SCORM.
**
******************************************************************************************/
function GetDiagnostic(nErrorCode) 
{
	var strResult = ""
	if (objAPI != null){
		if(nErrorCode == null)
			strResult = objAPI.GetDiagnostic(nErrorCode);
		else
			strResult = objAPI.GetDiagnostic(strCMIEmptyString);

		return strResult;
	}
	else{
		handleSCORMError();
		return false;
	}
} 


function handleSCORMError()
{
	if (objAPI == null){
		if(bDisableAPINotFoundError == false){
			fShowAlert("Unable to locate the LMS SCORM API Adaptor. SCORM tracking will be disabled.");
		}
		return true;
	}
	else{
		var nErrorCode = GetLastError();
		if(nErrorCode == 0){
			return false; 
		}
		else{
			var strError = GetDiagnostic(null);
			fShowAlert("LMS returned SCORM API Error Code " + nErrorCode + ".\n" + strError);
			return true;
		}
	}
}

// returns LMS API object (or null if not found)
function findAPI(win){

  // look in this window  
  if (typeof(win) != 'undefined' ? typeof(win.API) != 'undefined' : false){
    if (win.API != null )  return win.API;
  }
  // look in this window's frameset kin (except opener)
  if (win.frames.length > 0)  for (var i = 0 ; i < win.frames.length ; i++);{

    if (typeof(win.frames[i]) != 'undefined' ? typeof(win.frames[i].API) != 'undefined' : false){

       if (win.frames[i].API != null)  return win.frames[i].API;
    }
  }
  return null;
}


// cpSCORM_getAPI, which calls findAPI as needed
function getAPI(){

  var myAPI = null;
  var tries = 0, triesMax = 100;
  while (tries < triesMax && myAPI == null){
    window.status = 'Looking for API object ' + tries + '/' + triesMax;
    myAPI = findAPI(window);
    if (myAPI == null && typeof(window.parent) != 'undefined') myAPI = findAPI(window.parent)
    if (myAPI == null && typeof(window.top) != 'undefined') myAPI = findAPI(window.top);
    if (myAPI == null && typeof(top.opener) != 'undefined') if (top.opener != null && !top.opener.closed) myAPI = findAPI(top.opener);
    tries++;
  }  
  alert("API FOUND")
  return myAPI;  
}





/******************************************************************************************
**
** Function	: LMSInitialize()
** Parameter: None
** Return	: true indicating that the LMSInitialize("") was successful, false otherwise.
**
** Description:
** This function indicates to the LMS API Adapter that the SCO is going to communicate with the LMS.  
** It is a requirement of the SCO that it call this function before calling any other API functions.
**
******************************************************************************************/

function Initialize() {
	var strResult = strCMIFalse
	alert(objAPI);
	if (objAPI != null){
		
		strResult = objAPI.Initialize(strEmptyString)
		if(strResult == strCMITrue){
			return true;
		}
		else{
			handleSCORMError();
			return false;
		}
	}
	else{
		handleSCORMError();
		return false;
	}
} 

/******************************************************************************************
**
** Function LMSFinish()
** Inputs:	None
** Return:	true indicating that the LMSFinish("") was successful, false otherwise.
**
** Description:
** The SCO must call this when it has determined that it no longer needs to communicate with the LMS
**
******************************************************************************************/
function Terminate()
{
	var strResult = strCMIFalse
	if (objAPI != null){
		LMSSetSessionTime();
		strResult = objAPI.Terminate(strEmptyString)
		if(strResult == strCMITrue){
			return true;
		}
		else{
			handleSCORMError();
			return false;
		}
	}
	else{
		handleSCORMError();
		return false;
	}
}


/******************************************************************************************
**
** Function LMSCommit() 
** Inputs:	None
** Return:	None
**
** Description:
** Call the LMSCommit function which will be implemented by the LMS, 
** if the LMS is compliant with the SCORM.
**
******************************************************************************************/
function Commit()
{
	var strResult = strCMIFalse
	if (objAPI != null){
		strResult = objAPI.Commit(strEmptyString)
		if(strResult == strCMITrue){
			return true;
		}
		else{
			handleSCORMError();
			return false;
		}
	}
	else{
		handleSCORMError();
		return false;
	}
} 

/******************************************************************************************
**
** Function LMSGetValue(name) 
** Inputs:	name - string representing the cmi data model defined category or 
**				   element (e.g. cmi.core.student_id)
** Return:	The value presently assigned by the LMS to the cmi data model 
**			element defined by the element or category identified by the name
**			input value.
**
** Description:	
** Wraps the call to the LMS LMSGetValue method
**
******************************************************************************************/
function GetValue(strDataModel)
{
	var strResult = ""
	if (objAPI != null){
		strResult = objAPI.GetValue(strDataModel)
		if (handleSCORMError() == false){
			return strResult;
		}
		else{
			return null;
		}
	}
	else{
		handleSCORMError();
		return null;
	}
}

/******************************************************************************************
**
** Function LMSSetValue(name, value) 
** Inputs:	name - string representing the cmi data model defined category or element
**			value - the value that the named element or category will be assigned
** Return:	true/false
**
** Description:
** Wraps the call to the LMS LMSSetValue method. Returns true if call was successful else returns false
**
******************************************************************************************/
function SetValue(strDataModel, strValue) 
{
	var strResult = strCMIFalse
	if (objAPI != null){
		strResult = objAPI.SetValue(strDataModel, strValue)
		if(strResult == strCMITrue){
			return true;
		}
		else{
			handleSCORMError();
			return false;
		}
	}
	else{
		handleSCORMError();
		return false;
	}
}


/******************************************************************************************
**
** Function LMSGetStudentID() 
** Inputs:	none
** Return:	Unique Identifier used by the LMS to identify student OR null if the call failed
**
** Description:
** Note: The student_id is a read only field in SCORM and there is no corresponding SetValue
**
******************************************************************************************/
function LMSGetStudentID()
{
	return(GetValue("cmi.learner_id"))
}

/******************************************************************************************
**
** Function LMSGetStudentName()
** Inputs:	none
** Return:	Full name of the Stdent as stored by the LMS
**
** Description:
** Note: The student_name is a read only field in SCORM and there is no corresponding SetValue
**
******************************************************************************************/
function LMSGetStudentName()
{
	return(GetValue("cmi.learner_name"))
}

/******************************************************************************************
**
** Function LMSGetLessonLocation()
** Inputs:	none
** Return:	null if the call fails OR character data that was sent by the SCO to the LMS by calling the 
**          LMSSetLessonLocation function
**
** Description:
** 
**
******************************************************************************************/
function LMSGetLessonLocation()
{
	return(GetValue("cmi.location"))
}

/******************************************************************************************
**
** Function LMSSetLessonLocation()
** Inputs:	String containing a maximum of 255 characters
** Return:	True if the call was successful else returns false
**
******************************************************************************************/
function LMSSetLessonLocation(strData)
{
	return(SetValue("cmi.location", strData))
}

// passed, failed, completed, incomplete, browsed, not attempted
function LMSGetLessonStatus()
{
	return(GetValue("cmi.completion_status"))
}


function LMSSetLessonStatus(strData)
{
	if(strData != "not attempted"){
		return(SetValue("cmi.completion_status", strData))
	}	
}

function LMSGetRawScore()
{
	return(GetValue("cmi.score.raw"))
}

function LMSSetRawScore(strData)
{	
	LMSSetMinScore("0");
	LMSSetMaxScore("100");
	return(SetValue("cmi.score.raw", strData))
}


function LMSGetMaxScore()
{
	return(GetValue("cmi.score.max"))
}

function LMSSetMaxScore(strData)
{
	return(SetValue("cmi.score.max", strData))
}

function LMSGetMinScore()
{
	return(GetValue("cmi.score.min"))
}

function LMSSetMinScore(strData)
{
	return(SetValue("cmi.score.min", strData))
}


function LMSGetSuspendData()
{
	var strTemp = ""
	strTemp = GetValue("cmi.suspend_data");
	if(strTemp == null)
	{
		return(strSuspendData)
	}
	else
	{
		return(strTemp)
	}
}

// maximum of 4096 characters
function LMSSetSuspendData(strData)
{
	strSuspendData = strData;
	return(SetValue("cmi.suspend_data",strData))
}



// read the current time on the computer clock when the page is opened
var startTime = new Date();
var startHour = startTime.getHours();
var startMinutes = startTime.getMinutes();
var startSeconds = startTime.getSeconds();

//calulating the session time
function computeSessionTime() { 
	var formattedTime
	if ( startTime != 0 ){
	 var tmEndTime = new Date().getTime();	 
	 var elapsedSeconds = ( (tmEndTime - startTime) / 1000 );
	 formattedTime = convertTotalSeconds( elapsedSeconds ); 
	}
	else
	{
	 formattedTime = "00:00:00.0";
	}
	//alert(formattedTime)
	return formattedTime;

} 



function convertTotalSeconds(ts)
{
   var sec = (ts % 60);

   ts -= sec;
   var tmp = (ts % 3600);  //# of seconds in the total # of minutes
   ts -= tmp;              //# of seconds in the total # of hours

   // convert seconds to conform to CMITimespan type (e.g. SS.00)
   sec = Math.round(sec*100)/100;
   
   var strSec = new String(sec);
   var strWholeSec = strSec;
   var strFractionSec = "";

   if (strSec.indexOf(".") != -1)
   {
      strWholeSec =  strSec.substring(0, strSec.indexOf("."));
      strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
   }
   
   if (strWholeSec.length < 2)
   {
      strWholeSec = "0" + strWholeSec;
   }
   strSec = strWholeSec;
   
   if (strFractionSec.length)
   {
      strSec = strSec+ "." + strFractionSec;
   }


   if ((ts % 3600) != 0 )
      var hour = 0;
   else var hour = (ts / 3600);
   if ( (tmp % 60) != 0 )
      var min = 0;
   else var min = (tmp / 60);

   if ((new String(hour)).length < 2)
      hour = "0"+hour;
   if ((new String(min)).length < 2)
      min = "0"+min;

   var rtnVal = hour+":"+min+":"+strSec;

   return rtnVal;
}



// format is hhhh:mm:ss.ss
function LMSSetSessionTime()
{
	return(SetValue("cmi.session_time",computeSessionTime()))
	//return(LMSSetValue("cmi.core.session_time","0000:12:30"))
	
	
}

//time-out, suspend, logout, "" (empty string -- used for normal exit)
function LMSSetExit(strData)
{
	return(SetValue("cmi.exit",strData))
}

function LMSGetCredit()
{
	return(GetValue("cmi.credit"))
}

function LMSGetEntry()
{
	return(GetValue("cmi.entry"))
}

function LMSGetLessonMode()
{
	return(GetValue("cmi.mode"))
}


function LMSGetTotalTime()
{
	return(GetValue("cmi.total_time"))
}



function LMSGetLaunchData()
{
	return(GetValue("cmi.launch_data"))
}

function LMSSetQuestionData(Question,qid) {
	fShowAlert("Question,qid "+qid)
	var tmCurrentTime = new Date().getTime(); // Get Current Time

	SetValue("cmi.interactions." + qid + ".id", Question.id)
	SetValue("cmi.interactions." + qid + ".time", computeTime(tmCurrentTime))
	SetValue("cmi.interactions." + qid + ".student_response", Question.useranswer)
	SetValue("cmi.interactions." + qid + ".result", Question.status)
}


function fInitiateAPIDetection()
{
	objAPI = getAPI();
	
	if(objAPI == null){
		// SCORM API was not found
		handleSCORMError();
		bSCORM12Enabled = false;
	}
	else{
		fShowAlert("API found.");
		bSCORM12Enabled = true;
	}
	Initialize();
}	

function fShowAlert(lAlertMsg)
{
	if(debug == 1)
	{
		alert(lAlertMsg);
	}
	else
	{
		window.status = lAlertMsg;
	}
}


//fInitiateAPIDetection();
