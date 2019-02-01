

var numOfQuestion = 4
var numOfPagesInModule = 1 + numOfQuestion
var currentQuestionIndex = 0;
var introHTML = "";
var visitedNumberOfPages = 0;
var gRecordData = null;
var AssessmentScore = 0;
var isFirstQAnswered = false
var _Assessment = (function () {
	return {
		StartRecordPlayer: function () {
			//show record title
			window.document.title = gRecordData.RecordTitle
			$("#header-title").find("h1").text(gRecordData.RecordTitle)


			// init global var
			AssessmentScore = gRecordData.AssessmentScore;
			visitedNumberOfPages = gRecordData.VisitedNumberOfPages
			if (gRecordData.Status == "NotStarted") {
				//randomize questions
				gRecordData.Questions = this.Shuffle(gRecordData.Questions)
			}
			else {
				// set currentQuestionIndex by looping through last visited question
				for (var a = 0; a < gRecordData.Questions.length; a++) {
					if (gRecordData.Questions[a].UserSelectedOptionId == "") {
						currentQuestionIndex = a;
					}
				}

				// if its not landing page
				if (gRecordData.LastVisitedPage != "1") {

				}
			}

		},
		SetCurrentQuestionIndex: function(questionIndex){
			currentQuestionIndex = questionIndex;
		},
		Shuffle: function (array) {
			var currentIndex = array.length, temporaryValue, randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		},
		ShowQuestion: function () {
			//addCSS("styles/questionPlaceholder.css");fz
			$(".question-band").empty();
			$(".intro-content-question").hide();
			currQustion = gRecordData.Questions[currentQuestionIndex]
			if (gRecordData.Status == "NotStarted") {
				gRecordData.Status = "Started";
			}
			$("#QuetionText").html("<span style='font-size:0px'>Question Number </span>" + (currentQuestionIndex + 1) + ") " + currQustion.QuestionText)
			if (currQustion.UserSelectedOptionId == "") {
				// randomize options
				gRecordData.Questions[currentQuestionIndex].Options = this.Shuffle(currQustion.Options)
			}
			currQustion.Options = gRecordData.Questions[currentQuestionIndex].Options;

			for (var i = 0; i < currQustion.Options.length; i++) {
				optionObj = $(".Option").clone();
				optionObj.attr("id", "label" + currQustion.Options[i].OptionId)
				optionObj.find("input").attr("id", currQustion.Options[i].OptionId)
				optionObj.find("input").attr("name", "radiobutton")
				optionObj.find(".inpputtext .ltext").html(currQustion.Options[i].OptionText)
				optionObj.find(".inpputtext").attr("for", currQustion.Options[i].OptionId)
				optionObj.removeClass("Option")
				optionObj.show();
				$(".question-band").append(optionObj)
				if (currQustion.UserSelectedOptionId == currQustion.Options[i].OptionId) {
					$("#" + currQustion.Options[i].OptionId).trigger("click");
					isFirstQAnswered = true
				}
				if (isIE11version || isIEEdge || isSafari) {
					optionObj.find("input").attr("aria-label", optionObj.find(".inpputtext").text());
					optionObj.find(".inpputtext").attr("aria-hidden", "true")
				}
			}
			$(".question-band .assessmentradio").unwrap();
			$("#Questioninfo").text("Performance Check: Mini-Quiz: Question " + parseInt(currentQuestionIndex + 1) + " of 4")

			if (gRecordData.Status == "Completed") {
				$(".intro-content-question").show();
			}
			else {
				$(".intro-content-question").fadeIn(600)
			}

			$("#Questioninfo").focus();
			if (gRecordData.Status != "Completed") {
				$("#linknext").k_disable();
				if (currentQuestionIndex != 0) {
					$("#linkprevious").k_disable();
				}
			}
			if (_Navigator.IsPresenterMode()) {
				this.ShowQuestionPresenterMode();
				$("#linknext").k_enable()
			}
			if (isFirefox || isIE11version){
				this.AsseementFFCustomCheckboxAccessbility();
			}
			if (gRecordData.Questions[currentQuestionIndex].IsAnswered) {
				this.ShowUserReviewMode();
			}
			/*
			if (gRecordData.Questions[currentQuestionIndex].IsAnswered) {
				this.ShowUserReviewMode();
			}*/
			if (_Navigator.IsReviewMode()) {
				$("input[type='radio']").prop("readonly", "readonly");
				$("input[type='radio']").k_disable();
				$("#linkprevious").k_enable()
				$("#linknext").k_enable()
			}
			_Navigator.UpdateProgressBar();
			$(".assessmentSubmit").link_k_disable();
			_Navigator.GetBookmarkData();
		},
		ShowQuestionPresenterMode: function () {
			/*$(".assessmentSubmit").hide();
			var currQuestion = gRecordData.Questions[currentQuestionIndex];
			var correctoption = currQuestion.Options.filter(function (item) {
				return item.IsCorrect;
			})[0];
			$("#" + correctoption.OptionId).prop("checked", "true");
			$("input[type='radio']").k_disable();
			var iscorrectimg = $("#" + correctoption.OptionId).prev(".iscorrect").find("img")
			$("#" + correctoption.OptionId).closest("label").css("position", "relative");
			iscorrectimg.attr("src", "assets/images/tick-icon-correct-1.png");
			iscorrectimg.attr({ "alt": "", "aria-hidden": "true" });
			iscorrectimg.closest("span").show();
			iscorrectimg.attr("aria-label", "Correct option selected");
			gRecordData.Questions[currentQuestionIndex].IsAnswered = true;*/
			$("#linknext").k_enable();
			$("#linkprevious").k_enable();
		},
		ShowUserReviewMode: function () {
			$(".assessmentSubmit").hide();
			var currQuestion = gRecordData.Questions[currentQuestionIndex];
			var correctoption = currQuestion.Options.filter(function (item) {
				return item.IsCorrect;
			})[0];


			var iscorrectimg = $("#" + correctoption.OptionId).prev("span").find("img")
			//$("#" + correctoption.OptionId).closest("div").css("position", "relative");
			iscorrectimg.attr("src", "assets/images/tick-icon-correct-1.png")
			iscorrectimg.attr({ "alt": "", "aria-hidden": "true" });
			iscorrectimg.closest("span").show();
			if (correctoption.OptionId == currQuestion.UserSelectedOptionId) {
				//iscorrectimg.attr("aria-label","Correct option selected");
				$("#" + correctoption.OptionId).attr("aria-label", "Correct option selected " + $("#" + correctoption.OptionId).next(".inpputtext").text())
				$("#" + correctoption.OptionId).prop("checked", "true");
				$("#" + correctoption.OptionId).next(".inpputtext").attr("aria-hidden", "true")
			}
			else {

				//$("#" + currQuestion.UserSelectedOptionId).closest("div").css("position", "relative");
				$("#" + correctoption.OptionId).attr("aria-label", "Correct option " + $("#" + correctoption.OptionId).next(".inpputtext").text());
				iscorrectimg = $("#" + currQuestion.UserSelectedOptionId).prev("span").find("img")
				$("#" + currQuestion.UserSelectedOptionId).attr("aria-label", "Incorrect option selected " + $("#" + currQuestion.UserSelectedOptionId).next(".inpputtext").text())
				$("#" + currQuestion.UserSelectedOptionId).prop("checked", "true");
				iscorrectimg.attr("src", "assets/images/incorrect-v1-1.png")
				iscorrectimg.attr({ "alt": "", "aria-hidden": "true" });
				//iscorrectimg.attr("aria-label","Incorrect option selected");

				$("#" + correctoption.OptionId).next(".inpputtext").attr("aria-hidden", "true")
				$("#" + currQuestion.UserSelectedOptionId).next(".inpputtext").attr("aria-hidden", "true")
				iscorrectimg.closest("span").show();

			}

			$("input[type='radio']").prop("readonly", "readonly");
			$("input[type='radio']").k_disable();

			if (isIE11version) {
				//$("input[type='radio']").removeAttr("aria-disabled");
				//ATUL this.SetCustomarialabelforRadio();
				//$("input[type='radio']").removeAttr("disabled")
			}
			$(".assessmentSubmit").hide();
			$("#linknext").k_enable();
		},
		ShowSummary: function () {
			var score = 0;
			for (var b = 0; b < gRecordData.Questions.length; b++) {
				questionObj = $("#Question").clone();
				currQustion = gRecordData.Questions[b]
				questionObj.find(".quetiontext").html("<span style='font-size:0px'>Question Number </span><span>" + (b + 1) + ") &nbsp;</span>" + currQustion.QuestionText)
				var radioname = "radio" + gRecordData.Questions[b].QuestionId;

				questionObj.find(".question-band").empty();

				var feedbacktext = "";
				for (var i = 0; i < currQustion.Options.length; i++) {
					optionObj = $(".Option").clone();
					optionObj.find("input").attr("id", "question" + gRecordData.Questions[b].QuestionId + currQustion.Options[i].OptionId)
					optionObj.find("input").attr("name", "radiobutton"+gRecordData.Questions[b].QuestionId )
					if(isFirefox){
						optionObj.find("input").attr("aria-label", currQustion.Options[i].OptionText)
					}
					optionObj.find(".inpputtext .ltext").html(currQustion.Options[i].OptionText)
					optionObj.find(".inpputtext").attr("for", "question" + gRecordData.Questions[b].QuestionId + currQustion.Options[i].OptionId)
					optionObj.removeClass("Option");
					optionObj.find("input").attr("name", radioname)
					optionObj.show();
					//questionObj.find(".question-band").append(optionObj)
					if (gRecordData.Questions[b].IsAnswered) { //ATUL 
					if (isIE11version || isIEEdge || isSafari) {
						optionObj.find("input").attr("aria-label", optionObj.find(".inpputtext").text());
						optionObj.find(".inpputtext").attr("aria-hidden", "true")
					}
					var iscorrectimg = optionObj.find(".iscorrect").find("img")
					if (currQustion.Options[i].IsCorrect) {
						iscorrectimg.attr("src", "assets/images/tick-icon-correct-1.png")
						iscorrectimg.closest("span").show();
						//iscorrectimg.attr("aria-label", "Correct option");
						if (_Navigator.IsPresenterMode()) {
							optionObj.find("input").prop("checked", "true");
						}
						optionObj.find("input").attr("aria-label", "Correct option " + optionObj.find(".inpputtext").text())
						optionObj.find(".inpputtext").attr("aria-hidden", "true");


					}
					if (currQustion.UserSelectedOptionId == currQustion.Options[i].OptionId) {
						if (!currQustion.Options[i].IsCorrect) {
							iscorrectimg.attr("src", "assets/images/incorrect-v1-1.png")
							//iscorrectimg.attr("aria-label", "Incorrect option selected");
							feedbacktext = currQustion.IncorrectFeedback;
							optionObj.find("input").attr("aria-label", "Incorrect option selected " + optionObj.find(".inpputtext").text())
						}
						else {
							//iscorrectimg.attr("aria-label", "Correct option selected");
							optionObj.find("input").attr("aria-label", "Correct option selected " + optionObj.find(".inpputtext").text())
							score++;
							feedbacktext = currQustion.CorrectFeedback;
						}
						optionObj.find("input").prop("checked", "true");
						iscorrectimg.closest("span").show();
						optionObj.find(".inpputtext").attr("aria-hidden", "true");

					}
					iscorrectimg.attr({ "alt": "", "aria-hidden": "true" });
					}
					questionObj.find(".question-band").append(optionObj)

				}
				var fdk = $(".questionfdk").clone();
				fdk.removeClass("questionfdk");
				fdk.html("<div>" + feedbacktext + "</div>");
				fdk.show()
				questionObj.append(fdk);
				questionObj.show();
				questionObj.find(".question-band").addClass("summaryoptions");
				$("#Summary").append(questionObj);

				questionObj.find(".question-band label").css("position", "relative");

				$("#Summary").find("input[type='radio']").prop("readonly", "readonly");
				$("#Summary").find("input[type='radio']").k_disable();
				if (isIE11version) {
					//	$("#Summary").find("input[type='radio']").removeAttr("aria-disabled");

				}

			}

			//$("#Summary input[type='radio']").each(function(){$(this).unwrap()});
			if (isIE11version) {
				this.SetCustomarialabelforRadio();

			}
			if (gRecordData.Score == undefined || gRecordData.Score == "") {
				gRecordData.Score = score;
			}
			var perscore = gRecordData.Score / parseInt(gRecordData.AssessmentScore) * 100;
			$("#ScoreSummary").text("Score: " + perscore + "%");
			if (gRecordData.Status == "Started" && !_Navigator.IsReviewMode()) {
				gRecordData.Status = "Completed";
				gRecordData.Score = score;

				this.SetScore(perscore);
			}
			if (_Navigator.IsPresenterMode()) {
				//$("#ScoreSummary").text("Score: 100%");
				gRecordData.Status = "Completed";
			}
			_Navigator.UpdateProgressBar();
			$("#progressdiv").focus();
		},
		SetScore: function (perscore) {
			if (_Navigator.IsScorm() && !_Navigator.IsReviewMode()) {
				_ScormUtility.SetScore(perscore);
				_ScormUtility.Scormcomplete()
			}
		},
		SetCustomarialabelforRadio: function () {
			$(".question-band input[type='radio']").each(function () {
				var ischecked = "\n radio button unavailable"
				if ($(this).prop("checked") == "true" || $(this).prop("checked") == true) {
					ischecked = ischecked + " checked "
				}
				else {
					ischecked = ischecked + " not checked "
				}
				var radioalabel = "";
				if ($(this).attr("aria-label") != undefined) {
					radioalabel = $(this).attr("aria-label");
				}
				else {
					radioalabel = $(this).next(".inpputtext").text();
				}
				radioalabel = ischecked + radioalabel;
				radioalabel = "<label class='Accessibility'>" + radioalabel + "</label>";
				$(this).prev(".iscorrect").before(radioalabel);
				$(this).attr("aria-hidden", "true");
				$(this).next().attr("aria-hidden", "true");
				$(this).attr("disabled", "true");

			})
		},
		Getbookmarkdata: function () {
			var assessmentobj = {};
			assessmentobj.currentQuestionIndex = currentQuestionIndex;
			assessmentobj.status = gRecordData.Status;
			assessmentobj.score = gRecordData.Score;
			var qdata = [];
			for (var i = 0; i < gRecordData.Questions.length; i++) {
				if (gRecordData.Questions[i].IsAnswered) {
					var obj = { qid: gRecordData.Questions[i].QuestionId, optionid: gRecordData.Questions[i].UserSelectedOptionId }
					qdata.push(obj)
				}
			}
			assessmentobj.Qdata = qdata;
			return assessmentobj;
		},
		Setbookmarkdata: function (assessmentobj) {
			currentQuestionIndex = assessmentobj.currentQuestionIndex;
			gRecordData.Status = assessmentobj.status;
			gRecordData.Score = assessmentobj.score;
			if (assessmentobj.Qdata.length == gRecordData.Questions.length) {
				gRecordData.Status = "Completed";
			}
			if (assessmentobj.Qdata != undefined && assessmentobj.Qdata.length > 0) {
				for (var i = 0; i < gRecordData.Questions.length; i++) {
					for (j = 0; j < assessmentobj.Qdata.length; j++) {
						if (assessmentobj.Qdata[j].qid == gRecordData.Questions[i].QuestionId) {
							gRecordData.Questions[i].UserSelectedOptionId = assessmentobj.Qdata[j].optionid;
							gRecordData.Questions[i].IsAnswered = true;
						}
					}
				}
			}
		},
		AsseementFFCustomCheckboxAccessbility: function () {            
			var radioboxarray = $("input[type='radio']").map(function () {
				return $(this).attr("id");
			}).get();
			for (var i = 0; i < radioboxarray.length; i++) {
				var aria_label = $("label[for='" + radioboxarray[i] + "'] .ltext").html();
				$("label[for='" + radioboxarray[i] + "'] ").attr("aria-hidden", "true");
				$("#" + radioboxarray[i]).attr("aria-label", aria_label);

			}
	}

	}
})();











