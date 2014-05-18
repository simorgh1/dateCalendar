DateCalendar
============

DateCalendar HowTo and documentation, 
by @bahramMaravandi ,
slideshare http://goo.gl/pzYNQb 

DateCalendar is a date class with multiple calendar support and conversion for Jalali, Islamic and Hebrew Calendars.
Standard Date class supports Gregorian Calendar and has no conversion support and uses the system local settings.

Example: 

	var jalaliDate = new DateCalendar("1393-02-19", CalendarType.Jalali);

	var islamicDate = new DateCalendar("1435-07-05", CalendarType.Islamic);

	var hebrewDate = new DateCalendar("5774-02-09", CalendarType.Hebrew);

	var date = new DateCalendar("2014-05-09", CalendarType.Gregorian);

Every date object with the defined CalendarType could be converted to other CalendarTypes

Example:

	var date = jalaliDate.toGregorian();
	var islamicDate = jalaliDate.toIslamic();
	var hebrewDate = jalaliDate.toHebrew();

With the method toLocalizedString() you could write the converted date to the calendar specific localization. Every calendar has its own day name and month name

Example:

	var jalaliDate = new DateCalendar("1393-02-19", CalendarType.Jalali);
	jalaliDate.toString()
	
	Jome 19 Ordibehesht 1393

	jalaliDate.toLocalizedString(Local.Persian)

	جمعه ۱۹ اردیبهشت ۱۳۹۳

	jalaliDate.toLocalizedString(Local.Afghan)

	جمعه ۱۹ ثور ۱۳۹۳

	there are two special calendars for Jalali calendar

	jalaliDate.toLocalizedString(Local.Persian, CalendarType.Jalali, DisplayFormat.Long, SpecialCalendar.Royal)

	جمعه ۱۹ اردیبهشت ۲۵۷۳

	jalaliDate.toLocalizedString(Local.Persian, CalendarType.Jalali, DisplayFormat.Long, SpecialCalendar.Iranian)

	جمعه ۱۹ اردیبهشت ۳۷۳۹

	var islamicDate = new DateCalendar("1435-07-09", CalendarType.Islamic);
	islamicDate.toLocalizedString()

	al-jum`a 09 Rajab 1435
	
	islamicDate.toLocalizedString(Local.Persian)

	الجمعة‬ ۰۹ رجب ۱۴۳۵

	var hebrewDate = new DateCalendar("5774-02-09", CalendarType.Hebrew);
	hebrewDate.toLocalizedString()

	Yom Shishi 09 Iyyar 5774

	hebrewDate.toLocalizedString(Local.Persian)

	یوم شیشی ۰۹ یار ۵۷۷۴

	Each date has also the method toJulianDay() and isLeapYear()

	With totalJulianDaysUntilToday() and totalJulianDaysUntil(aDate) methods 
		it is possible to calculate the total days count between two events

	Example:

		var aDate = new DateCalendar("1350-06-16", CalendarType.Jalali);
		var today = new DateCalendar("1393-02-19", CalendarType.Jalali);

		aDate.totalJulianDaysUntil(today);

		15585 // how many days unitl today

dateCalendar has some unitTests using QUnit, to start the unitTests, just open dateCalendarTests.html in your browser. unitTest methods are in dateCalendarTests.js

In addition to English and Persian, the Local could be also enhanced to arabic and hebrew. For collaboration or any issues please contact me at @bahramMaravandi