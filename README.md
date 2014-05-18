dateCalendar
============

dateCalendar HowTo and documentation, 
by @bahramMaravandi ,
slideshare http://goo.gl/pzYNQb 

dateCalendar extends the Date object, which is based on Gregorian Calendar, to Jalali, Islamic and Hebrew Calendars. Each Calendar (CalendarType) can be set after creating a new instance of Date.

Example: 

	var jalaliDate = new Date("1393-02-19");
	jalaliDate.setCalendarType(CalendarType.Jalali);

	var islamicDate = new Date("1435-07-05");
	islamicDate.setCalendarType(CalendarType.Islamic);

	var hebrewDate = new Date("5774-02-09");
	hebrewDate.setCalendarType(CalendarType.Hebrew);

	var date = new Date("2014-05-09");
	date.setCalendarType(CalendarType.Gregorian);  // CalendarType.Gregorian is the default CalendarType

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