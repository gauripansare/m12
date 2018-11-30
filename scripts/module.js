var userAgentCustom = window.navigator.userAgent;
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1;
var isIE11version = !!navigator.userAgent.match(/Trident.*rv\:11\./);
var isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var CurClientWidth = window.innerWidth;
var Macbrowser = navigator.userAgent.indexOf('Chrome');
var Macos = navigator.userAgent.indexOf('Mac');
var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var isIpad = userAgentCustom.match(/iPad/i)
var isIphone = navigator.userAgent.indexOf('iPhone') > -1
var isIEEdge = /Edge/.test(navigator.userAgent)
var isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)
var animTime = 1000;

if (isIphone != null) {
    animTime = 3000;
}

jQuery.fn.extend({
    k_enable: function () {
        return this.removeClass('disabled').attr("aria-disabled", "false").removeAttr("disabled");
    },
    k_disable: function () {
        this.addClass('disabled').attr("aria-disabled", "true").attr("disabled", "disabled");
        if (isIE11version) {
            $(this).removeAttr("disabled")
        }
        return;
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
        GetReviewData: function () {
            return reviewData;
        },
        SetReviewData: function (rData) {
            reviewData = rData;
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
                if (fdkurl != undefined && fdkurl != "") {
                    fdkurl = _Settings.dataRoot + fdkurl;
                    $("#div_feedback").show();
                    $("#div_feedback").css("display", "inline-block");
                    $("#div_feedback .div_fdkcontent").load(fdkurl, function () {
                        //this.SetFeedbackTop()
                        $("body").animate({
                            scrollTop: $(document).height()
                        }, 1000);
                    });
                }
            }
        },
        DisplayInstructorReviewMode: function () {
            $(".reviewDiv").remove();
            var pageDetailData = this.GetPageDetailData();
            if (pageDetailData != undefined && pageDetailData.EmbedSettings != undefined) {
                this.ViewTextEntryInReviewMode();
            }
            else {
                var reviewData = this.GetPageReviewData();
                if (reviewData != undefined && reviewData.Positions != undefined && reviewData.Positions.length > 0) {
                    for (var i = 0; i < reviewData.Positions.length; i++) {
                        var posObj = reviewData.Positions[i];
                        var appendImage = $(".wrapperimage");
                        var ht = appendImage.height();
                        if (ht < 597)
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
            }

            this.ShowFeedbackReviewMode();
            $(".divHotSpot").addClass("disabled")
            $(".divHotSpot").attr("aria-disabled", "true");
            $(".divHotSpot").attr("disabled", "true");

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

        GetReviewData: function () {
            return reviewData;
        },

        AddReviewData: function (textentryObjId, isCorrect) {
            var found = false;
            var pageReviewData;
            var textentryObj = $("input#" + textentryObjId)
            var str = textentryObj.val().trim();
            var objId = textentryObjId;
            reviewData = this.GetReviewData();
            for (var r = 0; r < reviewData.length; r++) {
                if (reviewData[r].pageId == _Navigator.GetCurrentPage().pageId && objId == reviewData[r].objId) {
                    var sameText = false;
                    if (reviewData[r].textEntry != undefined) {
                        for (var i = 0; i < reviewData[r].textEntry.length; i++) {
                            if (reviewData[r].textEntry[i] == str) {
                                sameText = true;
                                break;
                            }
                        }
                        if (!sameText) {
                            if (reviewData[r].textEntry.length < 2) {
                                reviewData[r].textEntry.push(str);
                            }
                            else {
                                reviewData[r].textEntry.splice(0, 1);
                                reviewData[r].textEntry.push(str);
                            }
                        }
                    }
                    else {
                        reviewData[r].textEntry = [str];
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
        DisplayReviewModeForTextEntry: function () {
            $(".EmbededElement").hide();
            var reviewData = this.GetPageReviewData();
            var pageDetailData = this.GetPageDetailData();
            if (reviewData != undefined && reviewData.textEntry != undefined && reviewData.textEntry.length > 0) {
                var p = "";
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
            if (rposX < 0 || rposY < 0) {//gp if module is attmpted using accessibility
                rposX = hotspotObj.position().left + 20;
                rposY = hotspotObj.position().top + 20;
            }
            var currentPageData = _Navigator.GetCurrentPage();
            var page = this.GetPageDetailData();
            if (page.EmbedSettings != undefined) {
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
            this.LoadHotSpot();
            this.ApplycontainerWidth();
            if ($("#div_feedback").length > 0) {
                if (_Navigator.GetCurrentPage().pageId != "p14") {
                    $("#div_feedback").hide();
                }
            }
            $("#submitbtn").k_disable();
            if (_Navigator.IsAnswered()) {
                this.ViewTextEntryInReviewMode();
                this.DisplayInstructorReviewMode();
                this.ShowFeedbackReviewMode();

            }
            if (_Navigator.GetCurrentPage().hinturl != undefined) {
                $(".hintlink").show();
            }
            if (_Navigator.GetCurrentPage().hasActivity) {
                $(".hintlink").k_enable();
            }
            else {
                $(".hintlink").k_disable();
            }
            if (isFirefox) {
                $('#footer-navigation').css('display', 'table');
            }
            $("h2.pageheading").attr("tabindex", "-1");
            if (isIE11version) {
                $(".hintlink").css("padding-left", "68px");
                $("input[type='text']").css("border", "none");
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
                        if (eventname != undefined && !isAndroid && !isIOS) {
                            htmlForDivHotspotImage += "<button type='button' hsId='" + hsId + "'  id='divHotspots" + i + "_" + hsId + "' class='divHotSpotdbl divHotSpotCommon' style=' width:" + pwdth + ";height:" + phight + ";left:" + pleft + ";top:" + ptop + ";' action='" + hotspotdata.Hotspots[i].action + "' role='button' aria-label='" + accessText + "'/>";
                        }
                        else {
                            htmlForDivHotspotImage += "<button type='button' hsId='" + hsId + "'  id='divHotspots" + i + "_" + hsId + "' class='divHotSpot divHotSpotCommon' style=' width:" + pwdth + ";height:" + phight + ";left:" + pleft + ";top:" + ptop + ";' action='" + hotspotdata.Hotspots[i].action + "' role='button' aria-label='" + accessText + "'/>";
                        }
                    }
                    $(".wrapperimage").append(htmlForDivHotspotImage)
                }

            }
        },
        PresenterMode: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = this.GetPageDetailData();

            var appendImage = $(".wrapperimage");
            if (pageData != undefined) {
                if (pageData.inputSettings != undefined) {
                    $("input[type='text']").addClass("greenspan");
                    $("input[type='text']").k_disable();
                    if (currentPageData.pageId == "p3") {
                        for (var i = 0; i < pageData.answerset.length; i++) {
                            $("#" + pageData.inputSettings[i].inputid).val(pageData.answerset[i]);
                        }
                    }
                    else {
                        for (var i = 0; i < pageData.inputSettings.length; i++) {
                            $("#" + pageData.inputSettings[i].inputid).val(pageData.inputSettings[i].answerset);
                        }
                    }
                }
                else if (pageData.ImageHotSpots != undefined) {
                    var posObj = pageData.ImageHotSpots.Hotspots[0];
                    var _div = "<div class='reviewDiv Correct' style='z-index:5;width:39px;height:39px;position:absolute;left:" + posObj.left + ";top:" + posObj.top + ";'><img src='assets/images/review-correct.png' style='width:39px;height:35px;' /></div>";
                    $(".divHotSpot").addClass("hotspotclicked");
                    $(".divHotSpot").addClass("disabled");
                    appendImage.append(_div);
                }
                if (pageData.correctfeedback != undefined) {
                    $("#div_feedback").show();
                    $("#div_feedback .div_fdkcontent").load(_Settings.dataRoot + pageData.correctfeedback, function () {
                        $("#div_feedback p:first").attr("tabindex", "-1")
                        $("#div_feedback p:first").attr("role", "text");
                        if (isIOS) {
                            $("#div_feedback p:first").attr("role", "text");
                        }
                    });
                }
            }
            $("#linknext").k_enable();
            _Navigator.SetPageStatus(true);
            _Navigator.UpdateProgressBar();
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
            debugger;
            if (_Navigator.IsRevel()) {
                LifeCycleEvents.OnInteraction("Hotspot click.")
            }
            if (_Navigator.IsAnswered())
                return;
            var action = _hotspot.attr("action")
            this.AddHotspotClick(_hotspot, event);
            var score = 0;
            var nextpgid = "";
            var pageData = this.GetPageDetailData();
            isCorrect = true;
            if (pageData.ImageHotSpots != undefined) {
                for (var i = 0; i < pageData.ImageHotSpots.Hotspots.length; i++) {
                    if (pageData.ImageHotSpots.Hotspots[i].HotspotId == _hotspot.attr("hsid")) {
                        //if (pageData.ImageHotSpots.Hotspots[i].score != undefined && pageData.ImageHotSpots.Hotspots[i].score != "") {
                        //score = parseInt(pageData.ImageHotSpots.Hotspots[i].score);
                        nextpgid = pageData.ImageHotSpots.Hotspots[i].nextPageId;
                        //}
                        if (pageData.ImageHotSpots.Hotspots[i].correct != undefined) {
                            isCorrect = pageData.ImageHotSpots.Hotspots[i].correct;
                        }
                    }
                }
            }
            this.AddHotspotClick(_hotspot, event, isCorrect);
            _Navigator.SetPageScore(score)
            switch (action) {
                case "next":
                    _Navigator.SetPageStatus(true);
                    if (nextpgid != undefined && nextpgid != "") {
                        var ndata = _Navigator.SetNextPageId(nextpgid)
                        _Navigator.LoadPage(nextpgid);
                    }
                    else {
                        this.HotspotNext();
                    }
                    break;
                case "feedback":
                    _Navigator.SetPageStatus(true);
                    this.HotspotFeedback(_hotspot);
                case "inputcheck":
                    _ModuleCommon.OnSubmit();
                    break;
                default:
                    break;
            }
            _Navigator.GetBookmarkData();
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

            if (_Navigator.IsRevel()) {
                LifeCycleEvents.OnFeedback()
            }
            var pageData = this.GetPageDetailData();
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.EmbedSettings.feedbackurl;
            $("input").k_disable();
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()   
                $("#div_feedback .div_fdkcontent p:first").attr("tabindex", "-1")
                if (iOS) {
                    $("#div_feedback p:first").attr("role", "text")
                }
                // if (isIE11version) {
                //     $("#div_feedback .div_fdkcontent p:first").focus();
                //     $('html,body').animate({ scrollTop: document.body.scrollHeight }, animTime, function () {
                //     });
                // }
                // else {
                //     $('html,body').animate({ scrollTop: document.body.scrollHeight }, animTime, function () {
                //         $("#div_feedback .div_fdkcontent p:first").focus();

                //     });
                // }
                window.scrollTo(0, document.body.scrollHeight);
                $("#div_feedback p:first").focus();

            });
            this.EnableNext();
        },
        HotspotFeedback: function (_hotspot) {
            if (_Navigator.IsRevel()) {
                LifeCycleEvents.OnFeedback()
            }
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
            $("input").k_disable();
            $(".divHotSpot").k_disable();
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()   
                $("#div_feedback p:first").attr("tabindex", "-1")
                if (iOS) {
                    $("#div_feedback p:first").attr("role", "text")
                }

                window.scrollTo(0, document.body.scrollHeight);
                $("#div_feedback p:first").focus();
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
            $("input[type='text']").k_disable();
            $("#submitbtn").k_disable();
            if (_Navigator.IsAnswered())
                return;
            var pageData = this.GetPageDetailData();
            var currentPageData = _Navigator.GetCurrentPage();
            var inputtextids = $("input[type='text']").map(function () {
                return $(this).attr("id");
            });
            var inputvalarr = $("input[type='text']").map(function () {
                return $(this).val();
            });
            var fdbkurl = "";
            if (currentPageData.pageId == "p3") {
                if ((inputvalarr[0] == 3 && inputvalarr[1] == 5) || (inputvalarr[0] == 5 && inputvalarr[1] == 3)) {
                    fdbkurl = _Settings.dataRoot + pageData.correctfeedback;
                    for (var i = 0; i < inputtextids.length; i++) {
                        this.AddReviewData(inputtextids[i], true)
                        $("#" + inputtextids[i]).addClass("greenspan").addClass("correct");
                    }
                    _Navigator.SetPageStatus(true);
                    $("#linknext").k_enable();
                    this.SetTextEntryAccessibility(inputtextids);
                    _Navigator.GetBookmarkData();
                }
                else {
                    fdbkurl = _Settings.dataRoot + pageData.incorrectfeedback;
                    for (var i = 0; i < inputtextids.length; i++) {
                        this.AddReviewData(inputtextids[i], false);
                        $("#" + inputtextids[i]).addClass("redspan").addClass("incorrect");
                    }
                    this.SetTextEntryAccessibility(inputtextids);
                }
            }
            else {
                //Generic
                var isAllCorrect = true;
                for (var i = 0; i < pageData.inputSettings.length; i++) {
                    if ($.trim($("#" + inputtextids[i]).val()) == pageData.inputSettings[i].answerset) {
                        this.AddReviewData(pageData.inputSettings[i].inputid, true)
                        $("#" + inputtextids[i]).addClass("correct").addClass("greenspan");
                    }
                    else {
                        isAllCorrect = false;
                        this.AddReviewData(pageData.inputSettings[i].inputid, false)
                        $("#" + inputtextids[i]).addClass("incorrect").addClass("redspan");
                    }
                }
                if (isAllCorrect) {
                    fdbkurl = _Settings.dataRoot + pageData.correctfeedback;
                    $("#linknext").k_enable();
                    _Navigator.SetPageStatus(true);
                }
                else {
                    fdbkurl = _Settings.dataRoot + pageData.incorrectfeedback;
                }
                this.SetTextEntryAccessibility(inputtextids);
                _Navigator.GetBookmarkData();
            }
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkurl, function () {
                $("#div_feedback p:first").attr("tabindex", "-1");
                $("#continuebtn").attr("tabindex", "0");                 
                if (isIOS) {
                    $("#div_feedback p:first").attr("role", "text");
                }
                window.scrollTo(0, document.body.scrollHeight);
                $("#div_feedback p:first").focus();
            });
        },
        AddReviewData: function (textentryObjId, isCorrect) {
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
                        if (reviewData[r].textEntry[reviewData[r].textEntry.length - 1] == str) {
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
        ViewTextEntryInReviewMode: function () {
            //var reviewData = ITSimModule.GetReviewDataForTextEntry();
            // var settings = PageSettings[gCurrPageObj.PageId];
            // var embedSettings = settings.EmbedSettings;
            $("input[type='text']").k_disable();
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = _ModuleCommon.GetPageDetailData();
            if (reviewData != undefined) {
                for (var i = 0; i < reviewData.length; i++) {
                    var rData = reviewData[i];
                    if (pageData != undefined) {
                        var labeltext = "";
                        if (pageData.inputSettings != undefined) {
                            for (j = 0; j < pageData.inputSettings.length; j++) {
                                if (rData.objId == pageData.inputSettings[j].inputid) {
                                    var txtObj = $("#" + pageData.inputSettings[j].reviewid);

                                    for (k = 0; k < rData.textEntry.length; k++) {
                                        var tEntry = rData.textEntry[k].trim();
                                        if (k == 0) {
                                            if (rData.textEntry.length == 1) { //rData.isCorrect
                                                $("#" + rData.objId).val(rData.textEntry[k]).css({ "color": ColorCodes.green, "font-weight": "bold" });
                                                $("#" + rData.objId).attr("aria-hidden", "true");
                                                $("#" + rData.objId).after("<label class='Accessibility'>Correct value entered " + rData.textEntry[k] + "</label>");
                                            }
                                            else {
                                                $("#" + rData.objId).val(rData.textEntry[k]).css({ "color": ColorCodes.red, "font-weight": "bold" });
                                                $("#" + rData.objId).attr("aria-hidden", "true");
                                            }
                                        }
                                        if (k == 1) {
                                            txtObj.html("<p style='color:green;font-weight:bold;font-size: 12px; font-family: Arial;'>" + rData.textEntry[k] + "</p>");
                                            txtObj.show();
                                            txtObj.attr("aria-hidden", "true");
                                            txtObj.after("<label class='Accessibility'>Incorrect value entered " + rData.textEntry[k - 1] + " and Correct value entered " + rData.textEntry[k] + "</label>");
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            _Navigator.GetBookmarkData();
        },
        OnContinue: function () {
            if (_Navigator.GetCurrentPage().pageId != "p15") {
                $("input[type='text']").val("");
                $("input[type='text']").removeClass("redspan").removeClass("greenspan");
                $("input[type='text']").removeClass("correct").removeClass("incorrect");
                $("label.Accessibility").remove();
                $("input[type='text']").removeAttr("aria-hidden")
                $("#submitbtn").k_disable();
            }
            $("input[type='text'].incorrect").removeAttr("aria-hidden")
            $(".hotspotclicked").removeClass("hotspotclicked");
            $("input[type='text']").k_enable();
            $(".divHotSpot").k_enable();
            $("#div_feedback .div_fdkcontent").html("");
            $("#div_feedback").hide();
            $(".pageheading").attr("tabindex", "-1")
            window.scrollTo(0, document.body.scrollHeight)
            $(".pageheading").focus();
        },
        InputChek: function () {

        },
        AppendFooter: function () {
            if ($(".presentationModeFooter").length == 0) {
                var str = '<div class="presentationModeFooter">Presentation Mode</div>';
                $("footer").append($(str));
                $("footer").show();
                $("#linknext").k_enable();
            }
        },
        AppendScormReviewFooter: function () {
            if ($(".ScormReviewFooter").length == 0) {
                var str = '<div class="ScormReviewFooter"> Review Mode</div>';
                $("footer").append($(str));
                $("footer").show();
                $("#linknext").k_enable();
            }
        },
        SetTextEntryAccessibility: function (inputtextids) {
            var inputid = inputtextids;
            for (var i = 0; i < inputid.length; i++) {
                if ($("#" + inputid[i]).hasClass("correct")) {
                    $("#" + inputid[i]).attr("aria-hidden", "true");
                    $("#" + inputid[i]).after("<label class='Accessibility'>Correct value entered " + $("#" + inputid[i]).val());
                }
                else {
                    $("#" + inputid[i]).attr("aria-hidden", "true");
                    $("#" + inputid[i]).after("<label class='Accessibility'>Incorrect value entered " + $("#" + inputid[i]).val());
                }
            }
        }
    }
})();
$(document).ready(function () {
    $('.maxlengthinput').on('keydown keyup change', function(){
        var char = $(this).val();
        var charLength = $(this).val().length;
        if(charLength < 2){
            $(this).val(char.substring(0, 2));
        }
    });
    _Navigator.Initialize();
    $('body').attr({ "id": "thebody", "onmousedown": "document.getElementById('thebody').classList.add('no-focus');", "onkeydown": "document.getElementById('thebody').classList.remove('no-focus');" })
});

/*function AppendFooter() {
    if ($(".levelfooterdiv").length == 0) {
        var str = '<div class="levelfooterdiv"><div class="navBtn prev" onClick="GoToPrev()" role="button" tabindex = 195 aria-label="Previous"><a href="#"></a></div><div style="display: inline-block;width: 2px;"></div><div class="boxleveldropdown" style="width: 150px;"  role="button" tabindex = 196 aria-label="Scorecard"><span class="leftarrow"></span><ul class="levelmenu"><li class="uparrow" style = "width: 100px; margin-left: -8px;"><span class="menutitle" >Scorecard</span><div class="levelsubMenu" tabindex = 197 role="text">Total Score - <br>Activity Score - </div><a class="menuArrow"></a></div><div style="display: inline-block;width: 2px;"></div><div class="navBtn next" onClick="GoToNext()" role="button" tabindex = 198 aria-label="Next"><a href="#"></a></div></div>';
        $("#wrapper").append($(str));
        $(".navBtn.prev").css({
            "opacity": ".5",
            "pointer-events": "none"
        });
        $(".navBtn.prev").attr("aria-disabled","true")
    }
}*/

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
        try {
            if ($(".navBtn.prev").css("pointer-events") == "none") {
                return;
            }
            else {
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
            if ($(".navBtn.next").css("pointer-events") == "none") {
                return;
            }
            else {
                _Navigator.Next();
                if (_Navigator.GetCurrentPage().nextPageId != undefined && _Navigator.GetCurrentPage().nextPageId != "") {
                    enableobj($(".navBtn.next"));
                } else {
                    disableobj($(".navBtn.next"));
                }
                if (_Navigator.GetCurrentPage().prevPageId != undefined && _Navigator.GetCurrentPage().prevPageId != "") {
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
