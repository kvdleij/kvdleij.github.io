'use strict';

(function ($) {
    function readURL(input) {

        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
                let image = $(document.createElement("img")).attr("src", e.target.result).appendTo("article");
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    function createGrid(width, height) {
        $(".grid .grid__cell").remove();
        let imgWidth = $("article img").outerWidth();
        let imgHeight = $("article img").outerHeight();

        $(".grid").css("width", imgWidth);
        $(".grid").css("height", imgHeight);

        let rows = Math.floor(imgHeight / height);
        let columns = Math.floor(imgWidth / width);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                let $span = $(document.createElement("span")).addClass("grid__cell");
                $span.css({
                    "top": y * height,
                    "left": x * width,
                    "width": width,
                    "height": height
                });
                $span.appendTo("article .grid");
            }
        }
    }

    function saveAnim(element) {
        console.log(element);
    }

    function removeAnim(element) {
        console.log(element);
    }

    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }

    $(document).ready(function () {
        $("#sprite").change(function () {
            readURL(this);
        });

        if ($("#sprite-width").val() !== "" && $("#sprite-height").val() !== "") {
            let sprWidth = $("#sprite-width").val();
            let sprHeight = $("#sprite-height").val();

            if (sprWidth !== "" && sprHeight !== "") {
                createGrid(sprWidth, sprHeight);
                $("#addNew").removeAttr("disabled");
            }
        }

        $("#sprite-width, #sprite-height").change(function () {
            let sprWidth = $("#sprite-width").val();
            let sprHeight = $("#sprite-height").val();

            if (sprWidth !== "" && sprHeight !== "") {
                createGrid(sprWidth, sprHeight);
                $("#addNew").removeAttr("disabled");
            }
        });

        let editing = false;
        let anims = 0;
        let frame = 0;

        $("main").on("click", "#addNew", function () {
            if (!editing) {
                editing = true;
                $(this).attr("disabled", true);

                let animFieldset = $("#animPlaceholder").clone().insertAfter($("#animPlaceholder"));
                $(animFieldset).attr("id", "anim-" + anims);
            }
        });

        $(".grid__cell").on("click", function () {
            if (editing && !$(this).hasClass("grid__cell--active")) {
                $(this).addClass("grid__cell--active");
                $(this).html("<span>" + frame + "</span>");

                let frameInfo = $("#framePlaceholder").clone().insertBefore($("#anim-" + anims + " #framePlaceholder"));
                $(frameInfo).attr("id", "frame-" + frame);

                let animationName = $("#anim-" + anims).find("input[name='animName']").val();
                let frameName = animationName + "-" + pad(frame, 3);

                $(frameInfo).find("span").text(frameName);
                $(this).attr("id", frameName);

                frame++;
            }
        });

        $("main").on("click", ".anim-controls .save-anim", function () {
            saveAnim($(this).parent(".anim-controls"));
        });

        $("main").on("click", ".anim-controls .remove-anim", function () {
            removeAnim($(this).parent(".anim-controls"));
        });

        $("main").on("click", ".frame-remove", function() {
           let frame = $(this).closest(".frame").find("span").text();
           $("#" + frame).removeClass("grid__cell--active").find("span").remove();
           $(this).closest(".frame").remove();
        });

        $("main").on("mousedown", ".frame-highlight", function(){
           let frame = $(this).prev("span").text();
           $("#" + frame).addClass("grid__cell--highlight");
        });

        $("main").on("mouseup", ".frame-highlight", function(){
            let frame = $(this).prev("span").text();
            $("#" + frame).removeClass("grid__cell--highlight");
        });
    });

})(jQuery);
