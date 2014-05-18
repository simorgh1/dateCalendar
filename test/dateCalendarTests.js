/// <reference path="../src/js/dateCalendar.js" />

test("Initialize DateCalendar no-param", function () {

    var dateCal = new DateCalendar();
    var today = new Date();

    equal(dateCal.getFullYear(), today.getFullYear(), "Should be Year " + dateCal.getFullYear());
    equal(dateCal.getMonth(), today.getMonth() + 1, "Should be Month " + dateCal.getMonth());
    equal(dateCal.getDate(), today.getDate(), "Should be Day " + dateCal.getDate());

});

test("Initialize Gregorian DateCalendar with param", function () {

    var dateCal = new DateCalendar("2014-05-18", CalendarType.Gregorian);
    var today = new Date("2014-05-18");

    equal(dateCal.getFullYear(), today.getFullYear(), "Should be Year " + dateCal.getFullYear());
    equal(dateCal.getMonth(), today.getMonth() + 1, "Should be Month " + dateCal.getMonth());
    equal(dateCal.getDate(), today.getDate(), "Should be Day " + dateCal.getDate());
});

test("Initialize Gregorian DateCalendar - convert to Jalali", function () {

    var dateCal = new DateCalendar("2014-05-18", CalendarType.Gregorian);
    var jalaliDateCal = dateCal.toJalali();

    equal(jalaliDateCal.getFullYear(), 1393, "Should be Year 1393");
    equal(jalaliDateCal.getMonth(), 2, "Should be Month 2");
    equal(jalaliDateCal.getDate(), 28, "Should be Day 28");
});

test("Initialize Gregorian DateCalendar - convert to Islamic", function () {

    var dateCal = new DateCalendar("2014-05-18", CalendarType.Gregorian);
    var islamicDateCal = dateCal.toIslamic();

    equal(islamicDateCal.getFullYear(), 1435, "Should be Year 1435");
    equal(islamicDateCal.getMonth(), 7, "Should be Month 7 , Rajab");
    equal(islamicDateCal.getDate(), 18, "Should be Day 18");
});

test("Initialize Gregorian DateCalendar - convert to Hebrew", function () {

    var dateCal = new DateCalendar("2014-05-18", CalendarType.Gregorian);
    var hebrewDateCal = dateCal.toHebrew();

    equal(hebrewDateCal.getFullYear(), 5774, "Should be Year 5774");
    equal(hebrewDateCal.getMonth(), 2, "Should be Month 2 , Iyyar");
    equal(hebrewDateCal.getDate(), 18, "Should be Day 18");
});