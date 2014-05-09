/// <reference path="../src/js/dateCalendar.js" />

test("DateCalendar type Test", function () {

    var dc = new Date();

    dc.setCalendarType(CalendarType.Jalali);

    var res = dc.getCalendarType();

    equal(res, CalendarType.Jalali, "Should be Jalali");

});

test("Convert a Jalali Date to Gregorian", function () {

    var dcal = new Date("1393-02-15");
    dcal.setCalendarType(CalendarType.Jalali);

    var gregDate = dcal.toGregorian();

    equal(gregDate.getFullYear(), 2014, "Year 2014");
    equal(gregDate.getMonth() +1, 5, "Month 5");
    equal(gregDate.getDate(), 5, "Day 5");

});

test("Convert a Gregorian Date to Jalali", function () {

    var dcal = new Date("2014-05-05");
    dcal.setCalendarType(CalendarType.Gregorian);

    var jalaliDate = dcal.toJalali();

    equal(jalaliDate.getFullYear(), 1393, "Year 1393");
    equal(jalaliDate.getMonth() + 1, 2, "Month 2");
    equal(jalaliDate.getDate(), 15, "Day 15");

});

test("Convert a Gregorian Date to Islamic", function () {

    var dcal = new Date("2014-05-05");
    dcal.setCalendarType(CalendarType.Gregorian);

    var islamicDate = dcal.toIslamic();

    equal(islamicDate.getFullYear(), 1435, "Year 1435");
    equal(islamicDate.getMonth() + 1, 7, "Month 7");
    equal(islamicDate.getDate(), 5, "Day 5");

});

test("Convert a Gregorian Date to Hebrew", function () {

    var dcal = new Date("2014-05-09");
    dcal.setCalendarType(CalendarType.Gregorian);

    var hebrewDate = dcal.toHebrew();

    equal(hebrewDate.getFullYear(), 5774, "Year 5774");
    equal(hebrewDate.getMonth() + 1, 2, "Month 2 lyyar");
    equal(hebrewDate.getDate(), 9, "Day 9");

});

test("Count of Julian days until a date", function () {

    var today = new Date("2014-05-09");
    today.setCalendarType(CalendarType.Gregorian);

    var fromDate = new Date("2013-01-06");
    fromDate.setCalendarType(CalendarType.Gregorian);

    var diff = fromDate.totalJulianDaysUntil(today);

    equal(diff, 488, "488 days");

});