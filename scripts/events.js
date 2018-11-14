var hotspotclicked = false;;
var hotspot;
$(document).on("click", ".divHotSpot", function (event) {
    if (_Navigator.IsPresenterMode()) {
        return;
    }
    event.preventDefault();
    $(this).k_disable()
    if (hotspotclicked || _Navigator.IsAnswered())
        return;
    hotspotclicked = true;
    $(this).addClass("hotspotclicked")
    hotspot = $(this);
    setTimeout(function () {
        hotspotclicked = false;
        _ModuleCommon.HotspotClick(hotspot, event);

    }, 400)

});

$(document).on("click", "#linkprevious", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Prev();
});
$(document).on("click", "#linknext", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Next();
});
$(document).on("click", ".hintlink", function (event) {
    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        event.preventDefault();
        return;
    }
    if ($(this).hasClass("expanded")) {
        $(".hintlink").removeClass("expanded")
        $(".hintlink").attr("aria-expanded", "false")
        $(".hintcontainer").slideUp(100);
        $(".pageheading").focus();
        open = "close";
    }
    else {
        $(".hintcontainer").slideDown(100, function () {
            $(".hintlink").addClass("expanded");
            $(".hintlink").attr("aria-expanded", "true");
            $(".hintcontainer .hintcontent").find("p:first").attr("tabindex", "-1")
            if (iOS) {
                $(".hintcontainer .hintcontent").find("p:first").attr("role", "text")
            }
            $(".hintcontainer .hintcontent").find("p:first").focus();
        });
    }
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnInteraction("Hint button click. Hint " + open)
    }

});
$(document).on("click", ".closehintlink", function (event) {

    $(".hintlink").removeClass("expanded")
    $(".hintlink").attr("aria-expanded", "false")
    $(".hintcontainer").slideUp(100, function () { $("h2.pageheading").focus(); });
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnInteraction("Hint button click. Hint closed")
    }
});

$(document).on("click", "#submitbtn", function (event) {
    _ModuleCommon.OnSubmit();
});

$(document).on("click", "#continuebtn", function (event) {
    _ModuleCommon.OnContinue();
});

$(document).on("keydown", "input.EmbededElement", function (event) {
    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        event.preventDefault();
        return;
    }
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        _ModuleCommon.InputEnter($(this));
    }
});

$(window).resize(function () {
    _ModuleCommon.OrientationChange();
});

$(window).resize(function () {
});

$(document).on('click', ".activityimg", function (event) {
    if ($(".divHotSpot").hasClass("disabled") || $(".divHotSpot").length == 0)
        return;
    _ModuleCommon.AddEditPropertiesClick(event);
});

$(document).on('click', ".startbtn", function (event) {
    //_Navigator.Next();
    _Navigator.LoadPage("p13");
});
$(document).on('click', ".reviewsubmit", function (event) {
    _Navigator.Next();
});
$(document).on('mouseover', ".hintlink", function (event) {
    $(".hintlink .hintlinkspan").css({ "color": "#b22222", "border-bottom": "1px solid #b22222" })
    $(this).find("path").css({ "fill": "#b22222" })
});

$(document).on('mouseout', ".hintlink", function (event) {
    $(".hintlink .hintlinkspan").css({ "color": "#047a9c", "border-bottom": "1px solid #047a9c" })
    $(this).find("path").css({ "fill": "#047a9c" })
});
$(document).on('input', "input[type='text']", function (event) {

    if ($(this).val().length > 0)
        $("#submitbtn").k_enable();
    else
        $("#submitbtn").k_disable();
});

$(document).on("change", ".assessmentradio", function (event) {
    $(".assessmentSubmit").k_enable();

});
$(document).on("click", ".assessmentSubmit", function (event) {
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnSubmit();
    }
    gRecordData.Questions[currentQuestionIndex].UserSelectedOptionId = $("input[type='radio']:checked").attr("id");
    gRecordData.Questions[currentQuestionIndex].IsAnswered = true;
    _Navigator.GetBookmarkData();
    _Navigator.Next();
});





$(document).on('click', ".inputcircle", function (event) {
    $(this).next(".inpputtext").trigger("click");
});
window.onload = function () {
    _ScormUtility.Init();
}

window.onunload = function () {
    _ScormUtility.End();
}
function mouseenter() {
    $(".hintlink .hintlinkspan").css({ "color": "#b22222", "border-bottom": "1px solid #b22222" })
    $(".hintlink").find("path").css({ "fill": "#b22222" })
}

function mouseleave() {
    $(".hintlink .hintlinkspan").css({ "color": "#047a9c", "border-bottom": "1px solid #047a9c" })
    $(".hintlink").find("path").css({ "fill": "#047a9c" })
}
