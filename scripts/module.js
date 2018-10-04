jQuery.fn.extend({
    k_enable: function () {
        return this.removeClass('disabled').attr("aria-disabled", "false").removeAttr("disabled");
    },
    k_disable: function () {
        return this.addClass('disabled').attr("aria-disabled", "true").attr("disabled", "disabled");
    },
    k_IsDisabled: function () {
        if (this.hasClass('disabled')) { return true; } else { return false; }
    }
});
var _ModuleCommon = (function () {
    var reviewData = [];
    return {
        EnableNext: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            if (currentPageData.nextPageId != undefined && currentPageData.nextPageId != "") {
                $("#linknext").k_enable();
            }
        },
        GetPageReviewData: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            if (reviewData != undefined && reviewData.length > 0) {
                for (var i = 0; i < reviewData.length; i++) {
                    if (reviewData[i].pageId == currentPageData.pageId) {
                        return reviewData[i];
                    }
                }
            }

        },
        GetPageDetailData: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = _PData[currentPageData.pageId];
            return pageData;
        },
        ShowFeedbackReviewMode: function () {
            var pageData = this.GetPageDetailData();
            var fdkurl = "";
            if (pageData != undefined) {
                if (pageData.inputSettings != undefined) {
                    fdkurl = pageData.correctfeedback;
                }
                fdkurl = _Settings.dataRoot + fdkurl;
                $("#div_feedback").show();
                $("#div_feedback").css("display", "inline-block");
                $("#div_feedback .div_fdkcontent").load(fdkurl, function () {
                    //this.SetFeedbackTop()
                    $('html,body').animate({ scrollTop: 0 }, 0, function () { });
                });
            }
        },
        DisplayInstructorReviewMode: function () {
            $(".reviewDiv").remove();
            var pageDetailData = this.GetPageDetailData();
            
            var reviewData = this.GetPageReviewData();
            if (reviewData != undefined && reviewData.Positions != undefined && reviewData.Positions.length > 0) {
                for (var i = 0; i < reviewData.Positions.length; i++) {
                    var posObj = reviewData.Positions[i];
                    var appendImage = $(".wrapperimage");
                    var ht = appendImage.height();
                    if(ht < 597)
                    ht = 597;
                    while ((posObj.posY + 40) > ht) {
                        posObj.posY = posObj.posY - 2;
                    }
                    if (posObj.isCorrect) {
                        var _div = "<div class='reviewDiv Correct' style='z-index:5;width:39px;height:39px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-correct.png' style='width:39px;height:35px;' /></div>";
                        appendImage.append(_div);


                    } else {
                        var _divI = "<div class='reviewDiv InCorrect' style='z-index:5;width:39px;height:35px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-incorrect.png' style='width:39px;height:35px;' /></div>";

                        appendImage.append(_divI);
                    }
                }
            }
            
            //this.ShowFeedbackReviewMode();
            $(".divHotSpot").addClass("disabled")

        },
        InstructorReviewModeForTextEntry: function () {
            $(".EmbededElement").hide();
            var reviewData = this.GetPageReviewData();
            var pageDetailData = this.GetPageDetailData();
            if (reviewData != undefined && reviewData.textEntry != undefined && reviewData.textEntry.length > 0) {
                
                for (i = 0; i < reviewData.textEntry.length; i++) {
                    if (reviewData.textEntry[i] != undefined && reviewData.textEntry[i] != "") {
                        var tEntry = reviewData.textEntry[i].trim().toLowerCase();
                        if (pageDetailData.EmbedSettings.validatearray.indexOf(tEntry) >= 0) {
                            if (reviewData.isCorrect && i == 0) {
                                $(".textentryreview1").html("<span class='OpenSansFont greenspan' style='font-weight:bold;font-size: 13px; '>" + reviewData.textEntry[i] + "</span>")
                            }
                            else {
                                $(".textentryreview2").html("<span class='OpenSansFont greenspan'  style='font-weight:bold;font-size: 13px;padding-left:5px; '>" + reviewData.textEntry[i] + "</span>");
                                $(".textentryreview2").show();
                            }
                        }
                        else {
                            $(".textentryreview1").html("<span class='OpenSansFont redspan'  style='font-weight:bold;font-size: 13px; '>" + reviewData.textEntry[i] + "</span>")
                        }
                    }

                }
                $(".textentryreview1").show();
            }
        },
        DisplayUserReviewMode: function () {
            $(".reviewDiv").remove();
            var pageDetailData = this.GetPageDetailData();
            if (pageDetailData != undefined && pageDetailData.EmbedSettings != undefined) {
                
                this.DisplayReviewModeForTextEntry();
            }
            else {
                var reviewData = this.GetPageReviewData();
                if (reviewData != undefined && reviewData.Positions != undefined && reviewData.Positions.length > 0) {
                    var posObj = reviewData.Positions[reviewData.Positions.length - 1];
                    var appendImage = $(".wrapperimage");
                    var ht = appendImage.height();
                    while ((posObj.posY + 40) > ht) {
                        posObj.posY = posObj.posY - 2;
                    }
                    if (posObj.isCorrect) {
                        var _div = "<div class='reviewDiv Correct' style='z-index:5;width:39px;height:39px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-correct.png' style='width:39px;height:35px;' /></div>";
                        appendImage.append(_div);


                    } else {
                        var _divI = "<div class='reviewDiv InCorrect' style='z-index:5;width:39px;height:35px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-incorrect.png' style='width:39px;height:35px;' /></div>";

                        appendImage.append(_divI);
                    }

                }
            }
            this.ShowFeedbackReviewMode();


        },
        DisplayReviewModeForTextEntry: function () {
            $(".EmbededElement").hide();
            var reviewData = this.GetPageReviewData();
            var pageDetailData = this.GetPageDetailData();
            if (reviewData != undefined && reviewData.textEntry != undefined && reviewData.textEntry.length > 0) {
               
                if (reviewData.textEntry[reviewData.textEntry.length - 1] != undefined && reviewData.textEntry[reviewData.textEntry.length - 1] != "") {
                    var tEntry = reviewData.textEntry[reviewData.textEntry.length - 1].trim().toLowerCase();
                    if (pageDetailData.EmbedSettings.validatearray.indexOf(tEntry) >= 0) {
                        $(".textentryreview1").html("<span class='OpenSansFont' style='color:green;font-weight:bold;font-size: 13px; '>" + reviewData.textEntry[reviewData.textEntry.length - 1] + "</span>")
                    }

                }
                $(".textentryreview1").show();
            }
        },
        AddHotspotClick: function (hotspotObj, event) {

            //$(".divHotSpot").remove();
            if (_Navigator.IsAnswered()) {
                return;
            }
            var imgObj = $(".activityimg");
            var posX = imgObj.offset().left;
            var posY = imgObj.offset().top;
            var found = false;

            var rposX;
            var rposY;
            if (event != undefined && event.pageX != undefined) {
                rposX = (event.pageX - posX);
                rposY = (event.pageY - posY);
            }
            if(rposX <0 || rposY <0){//gp if module is attmpted using accessibility
                rposX = hotspotObj.position().left + 20;
                rposY = hotspotObj.position().top + 20;
            }
            var currentPageData = _Navigator.GetCurrentPage();
            var page = this.GetPageDetailData();
            if (page.EmbedSettings != undefined)
            {
                return;
            }
            for (var r = 0; r < reviewData.length; r++) {
                if (reviewData[r].pageId == currentPageData.pageId) {
                    var sameclick = false;
                    var posindex = 0;
                    if (reviewData[r].Positions != undefined) {
                        for (var i = 0; i < reviewData[r].Positions.length; i++) {
                            if (reviewData[r].Positions[i].posX == rposX && reviewData[r].Positions[i].posY == rposY) {
                                sameclick = true;
                                posindex = i;
                                break;
                            }
                        }
                        if (!sameclick) {
                            var position = { posX: rposX, posY: rposY, isCorrect: true };
                            if (reviewData[r].Positions.length < 3) {
                                reviewData[r].Positions.push(position);
                            }
                            else {
                                reviewData[r].Positions.splice(0, 1);
                                reviewData[r].Positions.push(position);
                            }
                        }
                        else {
                            if (reviewData[r].Positions[posindex].isCorrect == undefined || reviewData[r].Positions[posindex].isCorrect == false) {
                                reviewData[r].Positions[posindex].isCorrect = true;
                            }
                        }
                    }
                    else {
                        var position = { posX: rposX, posY: rposY, isCorrect: true };
                        reviewData[r].Positions = [position]
                    }

                    found = true;
                }
            }

            if (!found) {
                var _obj = {};
                _obj.pageId = currentPageData.pageId;
                var position = { posX: rposX, posY: rposY, isCorrect: true };
                _obj.Positions = [position]
                reviewData.push(_obj);

            }

        },
        AddEditPropertiesClick: function (event) {
            if (_Navigator.IsAnswered()) {
                return;
            }
            var pageDetailData = this.GetPageDetailData();
            if (pageDetailData.EmbedSettings != undefined)
                return;
            var imgObj = $(".activityimg");
            var posX = imgObj.offset().left;
            var posY = imgObj.offset().top;
            var found = false;

            var rposX = (event.pageX - posX);
            var rposY = (event.pageY - posY);
            if (isNaN(rposX) || isNaN(rposY))
                return;

            var currentPageData = _Navigator.GetCurrentPage();
            for (var r = 0; r < reviewData.length; r++) {
                if (reviewData[r].pageId == currentPageData.pageId) {
                    var sameclick = false;
                    if (reviewData[r].Positions != undefined) {
                        for (var i = 0; i < reviewData[r].Positions.length; i++) {
                            if (reviewData[r].Positions[i].posX == rposX && reviewData[r].Positions[i].posy == rposY) {
                                sameclick = true;
                                break;
                            }
                        }
                        if (!sameclick) {
                            var position = { posX: rposX, posY: rposY, isCorrect: false };
                            if (reviewData[r].Positions.length < 3) {
                                reviewData[r].Positions.push(position);
                            }
                            else {
                                reviewData[r].Positions.splice(0, 1);
                                reviewData[r].Positions.push(position);
                            }
                        }
                    }
                    else {
                        var position = { posX: rposX, posY: rposY, isCorrect: false };
                        reviewData[r].Positions = [position]
                    }

                    found = true;
                }
            }

            if (!found) {
                var _obj = {};
                _obj.pageId = currentPageData.pageId;
                var position = { posX: rposX, posY: rposY, isCorrect: false };
                _obj.Positions = [position]
                reviewData.push(_obj);
            }

        },
        OnPageLoad: function () {
            debugger;
            this.LoadHotSpot();
            this.ApplycontainerWidth();
            $("#div_feedback").hide();
            if(_Navigator.GetCurrentPage().dfdbk == true){
                $("#div_feedback").show();
            }
            $("#submitbtn").k_disable();
            if (_Navigator.IsAnswered()) {
                this.ViewTextEntryInReviewMode();
                this.DisplayInstructorReviewMode();
                this.ShowFeedbackReviewMode();

            }
            if(_Navigator.GetCurrentPage().hinturl != undefined){
                $(".hintlink").show();
            }
            if (_Navigator.GetCurrentPage().hasActivity) {
                $(".hintlink").k_enable();
            }
            else{
                $(".hintlink").k_disable();
            }
        },
        LoadHotSpot: function () {
           
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = _PData[currentPageData.pageId];

            if (pageData != undefined) {

                var hotspotdata = pageData.ImageHotSpots;
                var htmlForDivHotspotImage = "";
                if (pageData.ImageHotSpots != undefined) {
                    for (var i = 0; i < hotspotdata.Hotspots.length; i++) {
                        var currImg = $("img")
                        var orw = currImg.width();
                        var orh = currImg.height();

                        var hsId = hotspotdata.Hotspots[i].HotspotId;

                        var pwdth = hotspotdata.Hotspots[i].width;
                        var phight = hotspotdata.Hotspots[i].height;
                        var pleft = hotspotdata.Hotspots[i].left;
                        var ptop = hotspotdata.Hotspots[i].top;
                        var accessText = hotspotdata.Hotspots[i].accessText;
                        if ((hotspotdata.Hotspots[i].left + "").indexOf("px") != -1) {
                            pleft = getPerc(Number(hotspotdata.Hotspots[i].left.replace("px", "").replace("%", "")), orw) + "%";
                            ptop = getPerc(Number(hotspotdata.Hotspots[i].top.replace("px", "").replace("%", "")), orh) + "%";
                        }

                        var eventname = hotspotdata.Hotspots[i].eventName;
                        if(eventname!=undefined )
                        {
                            htmlForDivHotspotImage += "<button type='button' hsId='" + hsId + "'  id='divHotspots" + i + "_" + hsId + "' class='divHotSpotdbl divHotSpotCommon' style=' width:" + pwdth + ";height:" + phight + ";left:" + pleft + ";top:" + ptop + ";' action='" + hotspotdata.Hotspots[i].action + "' role='button' aria-label='" + accessText + "'/>";
                        }
                        else
                        {
                        htmlForDivHotspotImage += "<button type='button' hsId='" + hsId + "'  id='divHotspots" + i + "_" + hsId + "' class='divHotSpot divHotSpotCommon' style=' width:" + pwdth + ";height:" + phight + ";left:" + pleft + ";top:" + ptop + ";' action='" + hotspotdata.Hotspots[i].action + "' role='button' aria-label='" + accessText + "'/>";
                        }
                    }
                    $(".wrapperimage").append(htmlForDivHotspotImage)
                }

            }
        },
        PresenterMode:function(){
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = this.GetPageDetailData();
           

            if(currentPageData.pageId == "p3" && pageData.EmbedSettings!=undefined)
            {
                $("input[type='text']").addClass("greenspan");
                $("input[type='text']").val(pageData.EmbedSettings.validatearray[0]);
                $("input[type='text']").k_disable();

            }
            $(".divHotSpot").addClass("hotspotclicked");
            $(".divHotSpot").addClass("disabled");
           
            
            $("#linknext").k_enable();
        },
        ApplycontainerWidth: function () {
            
            var innerWidth = $(window).width();

            $("#header-title img").attr("src", "assets/images/logo.png")

            if (innerWidth < 850) {
                if ($(".activityContainer").find(".activityimg").length > 0) {
                    var marginleft = $(".intro-content:first").css("margin-left");
                    marginleft = marginleft.substring(0, marginleft.indexOf("px"))

                    var imgcntwidth = innerWidth - (marginleft * 2);
                    $(".activity").css({ "width": imgcntwidth + "px" })
                }
                if (innerWidth <= 500) {
                    $("#header-title img").attr("src", "assets/images/pearson-logo-v1.png")
                }
            }
            else {
                $(".activity").css({ "width": "auto" })
            }

        },
        OrientationChange: function () {

            this.ApplycontainerWidth();

        },
        HotspotClick: function (_hotspot, event) {
            if (_Navigator.IsAnswered())
                return;
            var action = _hotspot.attr("action")
            this.AddHotspotClick(_hotspot, event);
            var score = 0;
            var pageData = this.GetPageDetailData();
            if (pageData.ImageHotSpots != undefined) {
                for (var i = 0; i < pageData.ImageHotSpots.Hotspots.length; i++) {
                    if (pageData.ImageHotSpots.Hotspots[i].HotspotId == _hotspot.attr("hsid")) {
                        if (pageData.ImageHotSpots.Hotspots[i].score != undefined && pageData.ImageHotSpots.Hotspots[i].score != "") {
                            score = parseInt(pageData.ImageHotSpots.Hotspots[i].score);
                        }
                    }
                }
            }
            _Navigator.SetPageScore(score)
            switch (action) {
                case "next":
                    _Navigator.SetPageStatus(true);
                    this.HotspotNext();
                    break;
                case "feedback":
                    _Navigator.SetPageStatus(true);
                    this.HotspotFeedback(_hotspot);
                    break;
                case "inputcheck":
                    _ModuleCommon.OnSubmit();
                    break;
                default:
                    break;
            }
        },
        SetFeedbackTop: function () {
            var ptop = Number($("#div_feedback").position().top);
            var pheight = Number($("#div_feedback").outerHeight());
            var pdiff = (_Settings.minHeight + _Settings.topMargin) - (ptop + pheight);
            if (pdiff > 0) {
                $("#div_feedback").css("margin-top", (pdiff + 35) + "px");
            }
        },
        InputFeedback: function () {
            
            var pageData = this.GetPageDetailData();
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.EmbedSettings.feedbackurl;
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });
            $("input").k_disable();
            this.EnableNext();
        },
        HotspotFeedback: function (_hotspot) {
            
            var pageData = this.GetPageDetailData();
            var url = "";
            if (pageData.ImageHotSpots != undefined) {
                for (var i = 0; i < pageData.ImageHotSpots.Hotspots.length; i++) {
                    if (pageData.ImageHotSpots.Hotspots[i].HotspotId == _hotspot.attr("hsid")) {
                        url = pageData.ImageHotSpots.Hotspots[i].feedbackurl;
                    }
                }
            }
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + url;
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });

            this.EnableNext();
        },
        HotspotNext: function () {
            _Navigator.Next();
        },
        InputNext: function () {
            _Navigator.Next();
        },
        OnSubmit: function () {
            debugger;
            $("input[type='text']").k_disable();
            $("#submitbtn").k_disable();
            if (_Navigator.IsAnswered())
                return;
            var pageData = this.GetPageDetailData();
            var currentPageData = _Navigator.GetCurrentPage();
            var inputtextids =  $("input[type='text']").map(function () {
                return $(this).attr("id");
            });
            var inputvalarr = $("input[type='text']").map(function () {
                return $(this).val();
            });
            var fdbkurl = "";
            if(currentPageData.pageId == "p3"){
                if((inputvalarr[0] == 3 && inputvalarr[1] == 5) || (inputvalarr[0] == 5 && inputvalarr[1] == 3)){
                    fdbkurl = _Settings.dataRoot + pageData.correctfeedback;
                    for(var i=0; i<inputtextids.length; i++){
                        this.AddReviewData(inputtextids[i], true)
                    }
                    _Navigator.SetPageStatus(true);
                    $("#linknext").k_enable();
                }
                else{
                    fdbkurl = _Settings.dataRoot + pageData.incorrectfeedback;
                    for(var i=0; i<inputtextids.length; i++){
                        this.AddReviewData(inputtextids[i], false)
                    }
                }
            }
            else{
                //Generic
                var isAllCorrect = true;
                for(var i=0; i<pageData.inputSettings.length; i++){
                    if($("#" + inputtextids[i]).val() == pageData.inputSettings[i].answerset){
                        this.AddReviewData(pageData.inputSettings[i].inputid, true)
                    }
                    else{
                        isAllCorrect = false;
                        this.AddReviewData(pageData.inputSettings[i].inputid, false)
                    }
                }
                if(isAllCorrect){
                    fdbkurl = _Settings.dataRoot + pageData.correctfeedback;
                    $("#linknext").k_enable();
                    _Navigator.SetPageStatus(true);
                }
                else{
                    fdbkurl = _Settings.dataRoot + pageData.incorrectfeedback;
                }         
            }
            $("#div_feedback .div_fdkcontent").load(fdbkurl, function () {
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });
            $("#div_feedback").show();
        },
        AddReviewData: function (textentryObjId, isCorrect) {
            debugger
            var found = false;
            var pageReviewData;
            var textentryObj = $("input#" + textentryObjId)
            var str = textentryObj.val().trim();
            var objId = textentryObjId;
            reviewData = this.GetReviewData();
            for (var r = 0; r < reviewData.length; r++) {
              if (reviewData[r].pageId == _Navigator.GetCurrentPage().pageId && objId == reviewData[r].objId) {
                var sameText = false;
                if (reviewData[r].textEntry != undefined && reviewData[r].textEntry.length > 0) {
                    if (reviewData[r].textEntry[reviewData[r].textEntry.length-1] == str) {
                      sameText = true;
                      
                    }
                  if (!sameText) {
                    if (reviewData[r].textEntry.length < 2) {
                      reviewData[r].textEntry.push(str);
                    }
                    else {
                      reviewData[r].textEntry.splice(0, 1);
                      reviewData[r].textEntry.push(str);
                      
                    }
                    reviewData[r].isCorrect = isCorrect;
                  }
                }
                else {
                  reviewData[r].textEntry = [str];
                  reviewData[r].isCorrect = isCorrect;
                }
                found = true;
                
              }
            }
          
            if (!found) {
              var _obj = {};
              _obj.pageId = _Navigator.GetCurrentPage().pageId;
              _obj.textEntry = [str];
              _obj.isCorrect = isCorrect;
              _obj.objId = objId;
              reviewData.push(_obj);
            }
            /*ITSimModule.SetReviewData(reviewData)
            if (isCorrect) {
              fSetScoreForReviewMode();
            }*/
        },
        GetReviewData: function () {
            return reviewData;
        },
         ViewTextEntryInReviewMode:function() {
            debugger;
            //var reviewData = ITSimModule.GetReviewDataForTextEntry();
            // var settings = PageSettings[gCurrPageObj.PageId];
            // var embedSettings = settings.EmbedSettings;
        $("input[type='text']").k_disable();
          var currentPageData = _Navigator.GetCurrentPage();
          var pageData = _ModuleCommon.GetPageDetailData();
            if (reviewData != undefined) {
              for (var i = 0; i < reviewData.length; i++) {
                var rData = reviewData[i];
                if(pageData != undefined){
                    if (pageData.inputSettings != undefined) {
                    for (j = 0; j < pageData.inputSettings.length; j++) {
                        if (rData.objId == pageData.inputSettings[j].inputid) {
                        var txtObj = $("#"+pageData.inputSettings[j].reviewid);
                        
                        for (k = 0; k < rData.textEntry.length; k++) {
                            var tEntry = rData.textEntry[k].trim();
                            if (k == 0) {
                            if (rData.textEntry.length == 1) { //rData.isCorrect
                                $("#" + rData.objId).val( rData.textEntry[k] ).css({"color": ColorCodes.green, "font-weight": "bold"});
                            }
                            else {
                                $("#" + rData.objId).val(rData.textEntry[k] ).css({"color": ColorCodes.red, "font-weight": "bold"});
                            }
                            }
                            if (k == 1) {
                            txtObj.html("<p style='color:green;font-weight:bold;font-size: 12px; font-family: Arial;'>" + rData.textEntry[k] + "</p>");
                            txtObj.show();
                            }
                        }
                        break;
                        }
                    }
                    }
                }
              }
            }
          },
        OnContinue: function() {
            debugger;
            if(_Navigator.GetCurrentPage().pageId != "p15"){
                $("input[type='text']").val("");
                $("#submitbtn").k_disable();
            }
            $(".hotspotclicked").removeClass("hotspotclicked");
            $("input[type='text']").k_enable();
            $(".divHotSpot").k_enable();
            $("#div_feedback .div_fdkcontent").html("");
            $("#div_feedback").hide();
            $('html,body').animate({ scrollTop: document.body.scrollHeigh }, 500, function () { });
        },
        InputChek: function() {

        }
    }
})();
$(document).ready(function () {
    _Navigator.Start();   
    //if (_Settings.enableCache) {
    //    _Caching.InitAssetsCaching();
    //    _Caching.InitPageCaching();
    //}
    $('body').attr({ "id": "thebody", "onmousedown": "document.getElementById('thebody').classList.add('no-focus');", "onkeydown": "document.getElementById('thebody').classList.remove('no-focus');" })
});

function AppendFooter() {
    debugger;
    if ($(".levelfooterdiv").length == 0) {
        var str = '<div class="levelfooterdiv"><div class="navBtn prev" onClick="GoToPrev()" role="button" tabindex = 195 aria-label="Previous"><a href="#"></a></div><div style="display: inline-block;width: 2px;"></div><div class="boxleveldropdown" style="width: 150px;"  role="button" tabindex = 196 aria-label="Scorecard"><span class="leftarrow"></span><ul class="levelmenu"><li class="uparrow" style = "width: 100px; margin-left: -8px;"><span class="menutitle" >Scorecard</span><div class="levelsubMenu" tabindex = 197 role="text">Total Score - <br>Activity Score - </div><a class="menuArrow"></a></div><div style="display: inline-block;width: 2px;"></div><div class="navBtn next" onClick="GoToNext()" role="button" tabindex = 198 aria-label="Next"><a href="#"></a></div></div>';
        $("#wrapper").append($(str));
        $(".navBtn.prev").css({
            "opacity": ".5",
            "pointer-events": "none"
        });
        $(".navBtn.prev").attr("aria-disabled","true")
    }
}

function DisplaySubmenu() {
    if ($(".levelsubMenu").is(":visible")) {
        $(".levelsubMenu").hide();
        $('.rightarrow').removeClass('fa-chevron-up').addClass('fa-chevron-right');
    } else {
        $(".levelsubMenu").show();
        $('.rightarrow').removeClass('fa-chevron-right').addClass('fa-chevron-up');
    }
}
var mTreeObj = {
    Goto: function (pageid) {
        _Navigator.LoadPage(pageid);
    },
    GoToPrev: function () {
        debugger;
        try {
            if ($(".navBtn.prev").css("pointer-events") == "none") {
                return;
            }
            else
            {
                _Navigator.Prev();
                if (_Navigator.GetCurrentPage().nextPageId != undefined && _Navigator.GetCurrentPage().nextPageId != "") {
                    enableobj($(".navBtn.next"));
                } else {
                    disableobj($(".navBtn.next"));
                }
                if (_Navigator.GetCurrentPage().PrevPageId != undefined && _Navigator.GetCurrentPage().PrevPageId != "") {
                     enableobj($(".navBtn.prev"));
                } else {
                    disableobj($(".navBtn.prev"));
                }
            }
        } catch (expn) {
            //menuNodeIndex++;
            alert(expn.message);
        }
    },
    GoToNext: function () {
        try {
            debugger;
            if ($(".navBtn.next").css("pointer-events") == "none") {
                return;
            } 
            else{
                _Navigator.Next();
                    if (_Navigator.GetCurrentPage().nextPageId != undefined && _Navigator.GetCurrentPage().nextPageId != "") {
                        enableobj($(".navBtn.next"));
                    } else {
                        disableobj($(".navBtn.next"));
                    }
                    if (_Navigator.GetCurrentPage().prevPageId != undefined &&_Navigator.GetCurrentPage().prevPageId != "") {
                        enableobj($(".navBtn.prev"));
                    } else {
                        disableobj($(".navBtn.prev"));
                    }
                }
            
        } catch (expn) {
            //menuNodeIndex--;
            alert(expn.message);
        }
    }
};



function disableobj(obj) {
    obj.css({
        "opacity": ".5",
        "pointer-events": "none"
    });
    obj.attr("aria-disabled", "true");
}
function enableobj(obj) {
    obj.css({
        "opacity": "1",
        "pointer-events": ""
    });
    obj.attr("aria-disabled", "false");
}
