/*

	Name: dateCalendar version 1.0
    Description: dateCalendar extends the Date object with Jalali, Hebrew and Islamic calendar. 
                 Conversion from a base calendar defined in CalendarType to all supported calendars is added.
                 Localized date outputs for Persian/English and Afghan
                 SpecialCalendar supports Royal and Iranian Calendar
                 TotalJulianDaysUtilToday and until a given date is added.
	Developer : Bahram Maravandi - @bahramMaravandi
	Lastupdate: 09-05-2014

*/

Date.prototype.setCalendarType = function (calendarType) {

    this.calendarType = calendarType;

}

Date.prototype.getCalendarType = function () {

    // Gregorian is the defualt calendar type
    if (this.calendarType == undefined) {
        this.calendarType = CalendarType.Gregorian;
        //console.log('Default Gregorian CalendarType is used.')
    }

    return this.calendarType;
}

// Converts the current date with the specified CalendarType to gregorian Date
Date.prototype.toGregorian = function () {

    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad, yindex, dyindex, year, yearday, leapadj;

    var jd = this.toJulianDay();
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
    var aDate = new Date(year, 0, 1);

    aDate.setCalendarType(CalendarType.Gregorian);

    yearday = wjd - aDate.toJulianDay();

    // first day of March
    aDate.setMonth(2);

    leapadj = ((wjd < aDate.toJulianDay()) ? 0 : (aDate.isLeapYear() ? 1 : 2));

    var month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);

    // set first day of Month
    aDate.setMonth(month - 1);

    day = (wjd - aDate.toJulianDay()) + 1;

    aDate.setDate(day);
    aDate.weekDay = weekDay;

    return aDate;
}

// Converts the current date with the specified CalendarType to jalali Date
Date.prototype.toJalali = function () {

    var jd, year, month, day, depoch, cycle, cyear, ycycle, aux1, aux2, yday;

    //  Update Julian day
    jd = this.toJulianDay() +
           (Math.floor(0 + 60 * (0 + 60 * 0) + 0.5) / 86400.0);

    var weekDay = Utils.julianWeekDay(jd);

    jd = Math.floor(jd) + 0.5;

    // first day of year 475
    var aDate = new Date(475, 0, 1);
    aDate.setCalendarType(CalendarType.Jalali);

    depoch = jd - aDate.toJulianDay();
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

    aDate.setYear(year);
    yday = (jd - aDate.toJulianDay()) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);

    aDate.setMonth(month - 1);
    day = (jd - aDate.toJulianDay()) + 1;

    aDate.setDate(day);
    aDate.weekDay = weekDay;

    return aDate;
}

// Converts the current date with the specified CalendarType to islamic date
Date.prototype.toIslamic = function () {

    var jd, year, month, day;

    jd = Math.floor(this.toJulianDay()) + 0.5;

    var weekDay = Utils.julianWeekDay(jd);

    year = Math.floor(((30 * (jd - Epoch.Islamic.value)) + 10646) / 10631);

    // first day of current year
    var aDate = new Date(year, 0, 1);
    aDate.setCalendarType(CalendarType.Islamic);

    month = Math.min(12,
            Math.ceil((jd - (29 + aDate.toJulianDay())) / 29.5) + 1);
    aDate.setMonth(month - 1);

    day = (jd - aDate.toJulianDay()) + 1;
    aDate.setDate(day);
    aDate.weekDay = weekDay;

    return aDate;
}

Date.prototype.toHebrew = function () {

    var jd, year, month, day, i, count, first;

    jd = this.toJulianDay();

    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - Epoch.Hebrew.value) * 98496.0) / 35975351.0);
    year = count - 1;

    var hd = new Date(count, 7 - 1, 1);
    hd.setCalendarType(CalendarType.Hebrew);
    var cjd = hd.toJulianDay();

    for (i = count; jd >= cjd ; i++) {
        year++;
        hd.setYear(i + 1);
        cjd = hd.toJulianDay();
    }

    hd.setYear(year);
    hd.setMonth(0);

    first = (jd < hd.toJulianDay()) ? 7 : 1;
    month = first;

    hd.setMonth(first - 1);
    hd.setDate(Utils.hebrewMonthDays(year, first));

    for (i = first; jd > hd.toJulianDay() ; i++) {
        month++;
        hd.setMonth(i);
        hd.setDate(Utils.hebrewMonthDays(year, i + 1));
    }

    hd.setDate(1);
    hd.setMonth(month - 1);

    day = (jd - hd.toJulianDay()) + 1;
    hd.setDate(day);

    return hd;
}

Date.prototype.toJulianDay = function () {

    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var day = this.getDate();

    var jDay;

    switch (this.getCalendarType()) {

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
                    ((month <= 2) ? 0 : (this.isLeapYear() ? -1 : -2)) +
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

            var mon, months;

            months = Utils.hebrewMonths(year);
            jDay = Epoch.Hebrew.value + Utils.hebrewDelay1(year) + Utils.hebrewDelay2(year) + day + 1;

            if (month < 7) {
                for (mon = 7; mon <= months; mon++) {
                    jDay += Utils.hebrewMonthDays(year, mon);
                }
                for (mon = 1; mon < month; mon++) {
                    jDay += Utils.hebrewMonthDays(year, mon);
                }
            }
            else {
                for (mon = 7; mon < month; mon++) {
                    jDay += Utils.hebrewMonthDays(year, mon);
                }
            }

            break;
    }

    return jDay;
}

Date.prototype.getWeekDay = function () {

    if (this.weekDay == undefined)
        this.weekDay = Utils.julianWeekDay(this.toJulianDay());

    return this.weekDay;
}

Date.prototype.isLeapYear = function () {

    var year = this.getFullYear();
    var isLeapYear;

    switch (this.getCalendarType()) {
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

Date.prototype.toLocalizedString = function (local, calendar, format, special) {

    var output;

    if (calendar == undefined)
        calendar = this.getCalendarType();

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

    output = Resources.DayNames(local, calendar, format)[this.getWeekDay()] + ' ' + day + ' ' + Resources.MonthNames(local, calendar, format)[this.getMonth()] + ' ' + year;

    return output;
}

Date.prototype.totalJulianDaysUntilToday = function () {

    var dateNow = new Date();
    var jdNow = dateNow.toJulianDay();

    var thisGregorianDate = this.toGregorian();
    var thisJd = thisGregorianDate.toJulianDay();

    return jdNow - thisJd;
}

Date.prototype.totalJulianDaysUntil = function (d) {

    var jd = d.toJulianDay();

    var thisGregorianDate = this.toGregorian();
    var thisJd = thisGregorianDate.toJulianDay();

    return jd - thisJd;
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

    hebrewDelay1: function (year) {

        var months, days, parts;

        months = Math.floor(((235 * year) - 234) / 19);
        parts = 12084 + (13753 * months);
        day = (months * 29) + Math.floor(parts / 25920);

        if (Utils.mod((3 * (day + 1)), 7) < 3) {
            day++;
        }

        return day;
    },

    // Check for delay in start of new year due to length of adjacent years
    hebrewDelay2: function (year) {
        var last, present, next;

        last = Utils.hebrewDelay1(year - 1);
        present = Utils.hebrewDelay1(year);
        next = Utils.hebrewDelay1(year + 1);

        return ((next - present) == 356) ? 2 : (((present - last) == 382) ? 1 : 0);
    },

    // Hebrew months in leap year are 13 instead of 12
    hebrewMonths: function (year) {

        var hd = new Date(year, 0, 1);
        hd.setCalendarType(CalendarType.Hebrew);

        return hd.isLeapYear() ? 13 : 12;
    },

    // The days count in a hebrew year
    hebrewDays: function (year) {

        var hd1 = new Date(year + 1, 7 - 1, 1);
        hd1.setCalendarType(CalendarType.Hebrew);

        var hd2 = new Date(year, 7 - 1, 1);
        hd2.setCalendarType(CalendarType.Hebrew);

        return hd1.toJulianDay() - hd2.toJulianDay();
    },

    //  How many days are in a given month of a given year
    hebrewMonthDays: function (year, month) {

        //  First of all, dispose of fixed-length 29 day months

        if (month == 2 || month == 4 || month == 6 || month == 10 || month == 13) {
            return 29;
        }

        //  If it's not a leap year, Adar has 29 days
        var hd = new Date(year, 0, 1);
        hd.setCalendarType(CalendarType.Hebrew);

        if (month == 12 && !hd.isLeapYear(year)) {
            return 29;
        }

        //  If it's Heshvan, days depend on length of year

        if (month == 8 && !(Utils.mod(Utils.hebrewDays(year), 10) == 5)) {
            return 29;
        }

        //  Similarly, Kislev varies with the length of year

        if (month == 9 && (Utils.mod(Utils.hebrewDays(year), 10) == 3)) {
            return 29;
        }

        //  Nope, it's a 30 day month

        return 30;
    }
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
                                monthNames = new Array("ژانویه", "فوریه", "مارس", "آوریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتبر", "نوامبر", "دسامبر");
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
                                monthNames = new Array("ژانویه", "فوریه", "مارس", "آوریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتبر", "نوامبر", "دسامبر");
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