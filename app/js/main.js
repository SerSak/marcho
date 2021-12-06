$(function () {

    $('.top-slider__inner').slick({
        dots: true,
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 2000,
    });

    $('.star').rateYo({
        starWidth: "20px",
        normalFill: "#ccccce",
        ratedFill: "#ffc35b",
        readOnly: true,
    });

});