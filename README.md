dateCalendar
============

dateCalendar HowTo and documentation, by @bahramMaravandi 


dateCalendar extends the Date object which is based on Gregorian Calendar to Jalali, Islamic and Hebrew Calendar. Each Calendar (CalendarType) could be set after creating a new instance of Date

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

	default toString() method would use gregorian month and day names

	var jalaliDate = new Date("1393-02-19");
	jalaliDate.setCalendarType(CalendarType.Jalali);
	jalaliDate.toString()
	
	Tue Feb 19 1393 01:00:00 GMT+0100 (W. Europe Standard Time)

	method toLocalizedString() fixes this problem

	jalaliDate.toLocalizedString()
	
	Jome 19 Ordibehesht 1393

	jalaliDate.toLocalizedString(Local.Persian)

	جمعه ۱۹ اردیبهشت ۱۳۹۳

	jalaliDate.toLocalizedString(Local.Afghan)

	سه شنبه ۱۹ ثور ۱۳۹۳

	there are two special calendars for Jalali calendar

	jalaliDate.toLocalizedString(Local.Persian, CalendarType.Jalali, DisplayFormat.Long, SpecialCalendar.Royal)

	سه شنبه ۱۹ اردیبهشت ۲۵۷۳

	jalaliDate.toLocalizedString(Local.Persian, CalendarType.Jalali, DisplayFormat.Long, SpecialCalendar.Iranian)

	سه شنبه ۱۹ اردیبهشت ۳۷۳۹

	var islamicDate = new Date("1435-07-09");
	islamicDate.setCalendarType(CalendarType.Islamic);
	islamicDate.toLocalizedString()

	al-jum`a 09 Rajab 1435
	
	islamicDate.toLocalizedString(Local.Persian)

	الجمعة‬ ۰۹ رجب ۱۴۳۵

	var hebrewDate = new Date("5774-02-09");
	hebrewDate.setCalendarType(CalendarType.Hebrew);
	hebrewDate.toLocalizedString()

	Yom Shishi 09 Iyyar 5774

	hebrewDate.toLocalizedString(Local.Persian)

	یوم شیشی ۰۹ یار ۵۷۷۴

	Each date has also the method toJulianDay() and isLeapYear()

	With totalJulianDaysUntilToday() and totalJulianDaysUntil(aDate) methods it is possible to calculate the total days count between to events

	Example:

		var birthDate = new Date("1350-06-16");
		birthDate.setCalendarType(CalendarType.Jalali);

		var today = new Date("1393-02-19");
		today.setCalendarType(CalendarType.Jalali);

		birthDate.totalJulianDaysUntil(today);

		15585 // how many days am i old unitl today

dateCalendar has some unitTests using QUnit, to start the unitTests, just open dateCalendarTests.html in your browser. unitTest methods are in dateCalendarTests.js

Local could be in addition to English and Persian enhanced to arabic and hebrew. for colaboration or any issues please contact me at @bahramMaravandi