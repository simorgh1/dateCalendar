/*
	Name: dateCalendar version 1.0
    Description: dateCalendar extends the Date object with Jalali, Hebrew and Islamic calendar. 
                 Conversion from a base calendar defined in CalendarType to all supported calendars is added.
                 Localized date outputs for Persian/English and Afghan
                 SpecialCalendar supports Royal and Iranian Calendar
                 TotalJulianDaysUtilToday and until a given date is added.
	Developer : Bahram Maravandi - @bahramMaravandi
	Lastupdate: 09-05-2014
    Documentation: ReadMe.md

*/

function DateCalendar(date, calendarType) {

    function myDate(y, m, d, w) {
        this.Year = y;
        this.Month = m;
        this.Day = d;
        this.WeekDay = w;
    }

    var _calendarType;
    var _local;
    var _special;
    var _format;
    var convertedDate;
    var _year, _month, _day, _weekDay;
    var inputDate;

    if (date == undefined) {
        var today = new Date();

        inputDate = new myDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getDay());
        _calendarType = CalendarType.Gregorian;
    }
    else {

        //todo validate date
        if (calendarType == undefined)
            _calendarType = CalendarType.Gregorian;
        else
            _calendarType = calendarType;

        var tmpDate = date.split("-");

        inputDate = new myDate(parseInt(tmpDate[0]), parseInt(tmpDate[1]), parseInt(tmpDate[2]));

    }

    var toJulianDay = function (date, calendarType) {

        var year = date.Year;
        var month = date.Month;
        var day = date.Day;

        var jDay;

        switch (calendarType) {

            // Convert Jalali date to julian day
            case CalendarType.Jalali:

                var epbase, epyear;

                epbase = year - ((year >= 0) ? 474 : 473);
                epyear = 474 + Utils.mod(epbase, 2820);

                jDay = day +
                        ((month <= 7) ?
                            ((month - 1) * 31) :
                            (((month - 1) * 30) + 6)
                        ) +
                        Math.floor(((epyear * 682) - 110) / 2816) +
                        (epyear - 1) * 365 +
                        Math.floor(epbase / 2820) * 1029983 +
                        (Epoch.Jalali.value - 1);

                break;

                // Convert Gregorian date to Julian day
            case CalendarType.Gregorian:

                jDay = (Epoch.Gregorian.value - 1) +
                        (365 * (year - 1)) +
                        Math.floor((year - 1) / 4) +
                        (-Math.floor((year - 1) / 100)) +
                        Math.floor((year - 1) / 400) +
                        Math.floor((((367 * month) - 362) / 12) +
                        ((month <= 2) ? 0 : (isLeapYear(year, calendarType) ? -1 : -2)) +
                        day);

                break;

                // Convert Islamic date to Julian day
            case CalendarType.Islamic:

                jDay = (day +
                        Math.ceil(29.5 * (month - 1)) +
                        (year - 1) * 354 +
                        Math.floor((3 + (11 * year)) / 30) +
                        Epoch.Islamic.value) - 1;

                break;

            case CalendarType.Hebrew:

                jDay = hebrew_to_jd(year, month, day);

                break;
        }

        return jDay;
    }

    var isLeapYear = function (year, calendarType) {

        var isLeapYear;

        switch (calendarType) {
            case CalendarType.Gregorian:
                isLeapYear = ((year % 4) == 0) &&
                (!(((year % 100) == 0) && ((year % 400) != 0)));
                break;

            case CalendarType.Jalali:
                isLeapYear = ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
                break;

            case CalendarType.Islamic:
                isLeapYear = ((((year * 11) + 14) % 30) < 11);
                break;
            case CalendarType.Hebrew:
                isLeapYear = Utils.mod(((year * 7) + 1), 19) < 7;
                break;
        }

        return isLeapYear;
    }

    var toJalali = function (date, calendarType) {

        var jd, year, month, day, depoch, cycle, cyear, ycycle, aux1, aux2, yday;

        //  Update Julian day
        jd = toJulianDay(date, calendarType) +
               (Math.floor(0 + 60 * (0 + 60 * 0) + 0.5) / 86400.0);

        var weekDay = Utils.julianWeekDay(jd);

        jd = Math.floor(jd) + 0.5;

        // first day of year 475
        var tmpDate = new myDate(475, 1, 1);

        depoch = jd - toJulianDay(tmpDate, CalendarType.Jalali);
        cycle = Math.floor(depoch / 1029983);
        cyear = Utils.mod(depoch, 1029983);

        if (cyear == 1029982) {
            ycycle = 2820;
        }
        else {
            aux1 = Math.floor(cyear / 366);
            aux2 = Utils.mod(cyear, 366);
            ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
                        aux1 + 1;
        }
        year = ycycle + (2820 * cycle) + 474;

        if (year <= 0) {
            year--;
        }

        tmpDate.Year = year;
        yday = (jd - toJulianDay(tmpDate, CalendarType.Jalali)) + 1;
        month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);

        tmpDate.Month = month;
        day = (jd - toJulianDay(tmpDate, CalendarType.Jalali)) + 1;

        tmpDate.Day = day;
        tmpDate.WeekDay = weekDay;

        return tmpDate;
    }

    var toGregorian = function (date, calendarType) {

        var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad, yindex, dyindex, year, yearday, leapadj;

        var jd = toJulianDay(date, calendarType);
        var weekDay = Utils.julianWeekDay(jd);

        wjd = Math.floor(jd - 0.5) + 0.5;
        depoch = wjd - Epoch.Gregorian.value;
        quadricent = Math.floor(depoch / 146097);
        dqc = Utils.mod(depoch, 146097);
        cent = Math.floor(dqc / 36524);
        dcent = Utils.mod(dqc, 36524);
        quad = Math.floor(dcent / 1461);
        dquad = Utils.mod(dcent, 1461);
        yindex = Math.floor(dquad / 365);
        year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;

        if (!((cent == 4) || (yindex == 4))) {
            year++;
        }

        // first day of Year
        var tmpDate = new myDate(year, 1, 1);

        yearday = wjd - toJulianDay(tmpDate, CalendarType.Gregorian);

        // first day of March
        tmpDate.Month = 3;

        leapadj = ((wjd < toJulianDay(tmpDate, CalendarType.Gregorian)) ? 0 : (isLeapYear(year, CalendarType.Gregorian) ? 1 : 2));

        var month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);

        // set first day of Month
        tmpDate.Month = month;

        day = (wjd - toJulianDay(tmpDate, CalendarType.Gregorian)) + 1;

        tmpDate.Day = day;
        tmpDate.WeekDay = weekDay;

        return tmpDate;
    }

    var toIslamic = function (date, calendarType) {

        var jd, year, month, day;

        jd = Math.floor(toJulianDay(date, calendarType)) + 0.5;

        var weekDay = Utils.julianWeekDay(jd);

        year = Math.floor(((30 * (jd - Epoch.Islamic.value)) + 10646) / 10631);

        // first day of current year
        var tmpDate = new myDate(year, 1, 1);

        month = Math.min(12,
                Math.ceil((jd - (29 + toJulianDay(tmpDate, CalendarType.Islamic))) / 29.5) + 1);
        tmpDate.Month = month;

        day = (jd - toJulianDay(tmpDate, CalendarType.Islamic)) + 1;
        tmpDate.Day = day;
        tmpDate.WeekDay = weekDay;

        return tmpDate;
    }

    var toHebrew = function (date, calendarType) {

        var jd = toJulianDay(date, calendarType);
        var hd = jd_to_hebrew(jd);
        var tmpDate = new myDate(hd[0], hd[1], hd[2]);

        return tmpDate;
    }

    var init = function (date) {

        if (date == undefined) return;

        _year = date.Year;
        _month = date.Month;
        _day = date.Day;
        _weekDay = date.WeekDay;
    }

    switch (_calendarType) {
        case CalendarType.Jalali:
            convertedDate = toJalali(inputDate, _calendarType);
            break;
        case CalendarType.Gregorian:
            convertedDate = toGregorian(inputDate, _calendarType);
            break;
        case CalendarType.Islamic:
            convertedDate = toIslamic(inputDate, _calendarType);
            break;
        case CalendarType.Hebrew:
            convertedDate = toHebrew(inputDate, _calendarType);
            break;
    }

    // initialize the dateCalendar using converted Date container class
    init(convertedDate);

    //public methods
    this.toString = function () {

        var output;

        if (_local == undefined) _local = Local.English;
        if (_format == undefined) _format = DisplayFormat.Long;

        var day = (_day < 10 ? '0' + _day : _day);
        day = Utils.formatNumber(day, _local);

        var year = _year;

        if (_special != undefined && _calendarType == CalendarType.Jalali) {
            switch (_special) {
                case SpecialCalendar.Royal:
                    year += 1180;
                    break;
                case SpecialCalendar.Iranian:
                    year += 2346;
                    break;
            }
        }

        year = Utils.formatNumber(year, _local);

        output = Resources.DayNames(_local, _calendarType, _format)[convertedDate.WeekDay] +
                    ' ' +
                    day +
                    ' ' +
                    Resources.MonthNames(_local, _calendarType, _format)[_month - 1] +
                    ' ' +
                    year;

        return output;

    }
    this.toLocalizedString = function (local, format, special) {

        if (local == undefined) local = _local;
        if (local == undefined) local = Local.English;
        if (format == undefined) format = _format;
        if (format == undefined) format = DisplayFormat.Long;

        var output;
        var calendar = this.getCalendarType();

        var day = (this.getDate() < 10 ? '0' + this.getDate() : this.getDate());
        day = Utils.formatNumber(day, local);

        var year = this.getFullYear();

        if (special != undefined && calendar == CalendarType.Jalali) {
            switch (special) {
                case SpecialCalendar.Royal:
                    year += 1180;
                    break;
                case SpecialCalendar.Iranian:
                    year += 2346;
                    break;
            }
        }

        year = Utils.formatNumber(year, local);

        output = Resources.DayNames(local, calendar, format)[this.getWeekDay()] + ' ' +
                    day + ' ' +
                    Resources.MonthNames(local, calendar, format)[this.getMonth() - 1] + ' ' +
                    year;

        return output;
    }

    this.getFullYear = function () { return _year; }
    this.getMonth = function () { return _month; }
    this.getDate = function () { return _day; }
    this.getDay = function () { return _weekDay; }
    this.getCalendarType = function () { return _calendarType; }

    this.toJalali = function () {

        if (_year == undefined || _month == undefined || _day == undefined) return;

        var tmpDate = new myDate(_year, _month, _day);
        var jalaliDate = toJalali(tmpDate, _calendarType);

        var jalaliDateString = jalaliDate.Year + '-' + jalaliDate.Month + '-' + jalaliDate.Day;
        var jalaliDateCalendar = new DateCalendar(jalaliDateString, CalendarType.Jalali);

        return jalaliDateCalendar;
    }
    this.toGregorian = function () {

        if (_year == undefined || _month == undefined || _day == undefined) return;

        var tmpDate = new myDate(_year, _month, _day);
        var gregorianDate = toGregorian(tmpDate, _calendarType);

        var gregorianDateString = gregorianDate.Year + '-' + gregorianDate.Month + '-' + gregorianDate.Day;
        var gregorianDateCalendar = new DateCalendar(gregorianDateString, CalendarType.Gregorian);

        return gregorianDateCalendar;
    }
    this.toIslamic = function () {

        if (_year == undefined || _month == undefined || _day == undefined) return;

        var tmpDate = new myDate(_year, _month, _day);
        var islamicDate = toIslamic(tmpDate, _calendarType);

        var islamicDateString = islamicDate.Year + '-' + islamicDate.Month + '-' + islamicDate.Day;
        var islamicDateCalendar = new DateCalendar(islamicDateString, CalendarType.Islamic);

        return islamicDateCalendar;
    }
    this.toHebrew = function () {

        if (_year == undefined || _month == undefined || _day == undefined) return;

        var tmpDate = new myDate(_year, _month, _day);
        var hebrewDate = toHebrew(tmpDate, _calendarType);

        var hebrewDateString = hebrewDate.Year + '-' + hebrewDate.Month + '-' + hebrewDate.Day;
        var hebrewDateCalendar = new DateCalendar(hebrewDateString, CalendarType.Hebrew);

        return hebrewDateCalendar;
    }
    this.totalJulianDaysUntilToday = function () {

        var dateNow = new DateCalendar();
        var jdNow = dateNow.toJulianDay();

        var thisGregorianDate = this.toGregorian();
        var thisJd = thisGregorianDate.toJulianDay();

        return jdNow - thisJd;
    }
    this.totalJulianDaysUntil = function (d) {

        var jd = d.toJulianDay();

        var thisGregorianDate = this.toGregorian();
        var thisJd = thisGregorianDate.toJulianDay();

        return jd - thisJd;
    }

    this.setLocal = function (local) {

        if (local == undefined) local = Local.English;
        _local = local;
    }
    this.setFormat = function (format) {

        if (format == undefined) format = DisplayFormat.Long;
        _format = format;
    }
}

var Utils = {

    formatNumber: function (number, local) {

        if (number == undefined) return;

        var tmp = number;
        tmp = tmp.toString();
        var length = tmp.length;

        for (var i = 0; i < 10; i++) {
            var reg = new RegExp(i, "g");
            tmp = tmp.replace(reg, Resources.Digits(local)[i]);
        }

        return tmp;
    },

    julianWeekDay: function (jd) {

        return this.mod(Math.floor((jd + 1.5)), 7);
    },

    // Modulus function which works for non-integers.
    mod: function (a, b) {

        return a - (b * Math.floor(a / b));
    },


}

var CalendarType = {

    Jalali: { value: 1, name: "Jalali" },
    Gregorian: { value: 2, name: "Gregorian" },
    Islamic: { value: 3, name: "Islamic" },
    Hebrew: { value: 4, name: "Hebrew" }

}

var Epoch = {

    Jalali: { value: 1948320.5 },
    Gregorian: { value: 1721425.5 },
    Islamic: { value: 1948439.5 },
    Hebrew: { value: 347995.5 }

}

var Local = {

    English: { value: 1, name: "EN-US" },
    Persian: { value: 2, name: "FA-IR" },
    Afghan: { value: 2, name: "FA-AF" }
}

var DisplayFormat = {

    //    Abbreviation: { value: 1 },
    Short: { value: 2 },
    Long: { value: 3 }
}

var SpecialCalendar = {

    Royal: { value: 1, name: "Persian Royal Calendar" },
    Iranian: { value: 2, name: "Iranian Calendar" }
}

var Resources = {
    // full day names
    DayNames: function (local, calendar, format) {

        var dayNames;

        if (local == undefined) local = Local.English;
        if (calendar == undefined) calendar = CalendarType.Gregorian;
        if (format == undefined) format = DisplayFormat.Short;
        if (local == Local.Afghan) local = Local.Persian;

        switch (local) {
            case Local.English:
                switch (calendar) {
                    case CalendarType.Gregorian:
                        switch (format) {
                            case DisplayFormat.Long:
                                dayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                                break;
                            case DisplayFormat.Short:
                                dayNames = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
                                break;
                        }
                        break;
                    case CalendarType.Jalali:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("Yekshanbe", "Doshanbe", "Seshanbe", "Chaharshanbe", "Panjshanbe", "Jome", "Shanbe");
                                break;

                        }
                        break;
                    case CalendarType.Islamic:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("al-'ahad", "al-'ithnayn", "ath-thalatha'", "al-'arb`a'", "al-khamis", "al-jum`a", "as-sabt");
                                break;
                        }
                        break;
                    case CalendarType.Hebrew:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("Yom Rishon", "Yom Sheini", "Yom Shlishi", "Yom R'vi'i", "Yom Chamishi", "Yom Shishi", "Yom Shabbat");
                                break;
                        }
                        break;
                }
                break;

            case Local.Persian:
                switch (calendar) {
                    case CalendarType.Gregorian:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه");
                                break;
                        }
                        break;
                    case CalendarType.Jalali:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه");
                                break;
                        }
                        break;
                    case CalendarType.Islamic:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("الأحد‬", "‫الاثنين", "الثلاثاء‬", "‫الأربعاء", "الخميس‬", "الجمعة‬", "السبت‬");
                                break;
                        }
                        break;
                    case CalendarType.Hebrew:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                dayNames = new Array("یوم ریشون", "یوم شینی", "یوم شلیشی", "یوم اروی", "یوم چامیشی", "یوم شیشی", "یوم شابات");
                                break;
                        }
                        break;
                }
                break;
        }

        return dayNames;
    },

    // full Month names
    MonthNames: function (local, calendar, format) {

        var monthNames;

        if (local == undefined) local = Local.English;
        if (calendar == undefined) calendar = CalendarType.Gregorian;
        if (format == undefined) format = DisplayFormat.Short;

        switch (local) {
            case Local.English:
                switch (calendar) {
                    case CalendarType.Gregorian:
                        switch (format) {
                            case DisplayFormat.Long:
                                monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                                break;
                            case DisplayFormat.Short:
                                monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
                                break;
                        }
                        break;

                    case CalendarType.Jalali:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Day", "Bahman", "Esfand");
                                break;
                        }
                        break;

                    case CalendarType.Islamic:

                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("Muharram", "Safar", "Rabi`al-Awwal", "Rabi`ath-Thani", "Jumada l-Ula", "Jumada t-Tania", "Rajab", "Sha`ban", "Ramadan", "Shawwal", "Dhu l-Qa`da", "Dhu l-Hijja");
                                break;
                        }
                        break;

                    case CalendarType.Hebrew:

                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("Nisan", "Iyyar", "Sivan", "Tammuz", "Av", "Elul", "Tishri", "Heshvan", "Kislev", "Teveth", "Shevat");
                                break;
                        }
                        break;
                }
                break;

            case Local.Persian:
                switch (calendar) {
                    case CalendarType.Gregorian:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر");
                                break;
                        }
                        break;

                    case CalendarType.Jalali:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند");
                                break;
                        }
                        break;

                    case CalendarType.Islamic:

                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانیه", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه");
                                break;
                        }
                        break;

                    case CalendarType.Hebrew:

                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("نیسان", "یار", "سیوان", "تموز", "آو", "اِلول", "تیشری", "حِشوان", "کیسلِو", "طِوِت", "شِواط", "اَدار ۱", "اَدار ۲");
                                break;
                        }
                        break;
                }
                break;

            case Local.Afghan:
                switch (calendar) {
                    case CalendarType.Gregorian:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر");
                                break;
                        }
                        break;

                    case CalendarType.Jalali:
                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت");
                                break;
                        }
                        break;

                    case CalendarType.Islamic:

                        switch (format) {
                            case DisplayFormat.Long:
                            case DisplayFormat.Short:
                                monthNames = new Array("محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانیه", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه");
                                break;
                        }
                        break;
                }
                break;
        }

        return monthNames;
    },

    Digits: function (local) {

        var digits;

        if (local == undefined) local = Local.English;
        if (local == Local.Afghan) local = Local.Persian;

        switch (local) {
            case Local.Persian:
                digits = new Array("۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹");
                break;

            case Local.English:
                digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
                break;
        }

        return digits;
    }
}

//to be refactored
function hebrew_leap(year) {
    return Utils.mod(((year * 7) + 1), 19) < 7;
}

//  How many months are there in a Hebrew year (12 = normal, 13 = leap)

function hebrew_year_months(year) {
    return hebrew_leap(year) ? 13 : 12;
}

//  Test for delay of start of new year and to avoid
//  Sunday, Wednesday, and Friday as start of the new year.

function hebrew_delay_1(year) {
    var months, days, parts;

    months = Math.floor(((235 * year) - 234) / 19);
    parts = 12084 + (13753 * months);
    day = (months * 29) + Math.floor(parts / 25920);

    if (Utils.mod((3 * (day + 1)), 7) < 3) {
        day++;
    }
    return day;
}

//  Check for delay in start of new year due to length of adjacent years

function hebrew_delay_2(year) {
    var last, present, next;

    last = hebrew_delay_1(year - 1);
    present = hebrew_delay_1(year);
    next = hebrew_delay_1(year + 1);

    return ((next - present) == 356) ? 2 :
                                     (((present - last) == 382) ? 1 : 0);
}

//  How many days are in a Hebrew year ?

function hebrew_year_days(year) {
    return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
}

//  How many days are in a given month of a given year

function hebrew_month_days(year, month) {
    //  First of all, dispose of fixed-length 29 day months

    if (month == 2 || month == 4 || month == 6 ||
        month == 10 || month == 13) {
        return 29;
    }

    //  If it's not a leap year, Adar has 29 days

    if (month == 12 && !hebrew_leap(year)) {
        return 29;
    }

    //  If it's Heshvan, days depend on length of year

    if (month == 8 && !(Utils.mod(hebrew_year_days(year), 10) == 5)) {
        return 29;
    }

    //  Similarly, Kislev varies with the length of year

    if (month == 9 && (Utils.mod(hebrew_year_days(year), 10) == 3)) {
        return 29;
    }

    //  Nope, it's a 30 day month

    return 30;
}

//  Finally, wrap it all up into...

function hebrew_to_jd(year, month, day) {
    var jd, mon, months;

    months = hebrew_year_months(year);
    jd = Epoch.Hebrew.value + hebrew_delay_1(year) +
         hebrew_delay_2(year) + day + 1;

    if (month < 7) {
        for (mon = 7; mon <= months; mon++) {
            jd += hebrew_month_days(year, mon);
        }
        for (mon = 1; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    } else {
        for (mon = 7; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    }

    return jd;
}

/*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                      This works by making multiple calls to
                      the inverse function, and is this very
                      slow.  */

function jd_to_hebrew(jd) {
    var year, month, day, i, count, first;

    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - Epoch.Hebrew.value) * 98496.0) / 35975351.0);
    year = count - 1;
    for (i = count; jd >= hebrew_to_jd(i, 7, 1) ; i++) {
        year++;
    }
    first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;
    for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)) ; i++) {
        month++;
    }
    day = (jd - hebrew_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}