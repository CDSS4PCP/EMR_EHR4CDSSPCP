package org.openmrs.module.cdss.api.util;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class TimeUtil {

    private static final int DAYS_IN_WEEK = 7;
    private static final int MONTHS_IN_YEAR = 12;

    /**
     * Get the current time as a Date
     *
     * @return Current time as a Date
     */
    public static Date getCurrentTime() {

        Calendar calendar = new GregorianCalendar();
        return calendar.getTime();
    }

    /**
     * Get the number of days between two dates
     *
     * @param date1 First date. Must be before date2.
     * @param date2 Second date. Must be after date1.
     * @return Number of days. If exceeds integer size, Integer.MAX_VALUE is returned.
     */
    public static int getNumberOfDays(Date date1, Date date2) {

        long numDays = date2.getTime() - date1.getTime();
        if (numDays < Integer.MAX_VALUE)
            return (int) numDays;
        return Integer.MAX_VALUE;

    }

    /**
     * Get the number of weeks between two dates
     *
     * @param date1 First date. Must be before date2.
     * @param date2 Second date. Must be after date1.
     * @return Number of weeks.
     */
    public static int getNumberOfWeeks(Date date1, Date date2) {

        return getNumberOfDays(date1, date2) / DAYS_IN_WEEK;

    }


    /**
     * Get the number of months between two dates. Note, this is exact number of months, when a month is considered to be
     * a time period of the day to the same day in the next month.
     * Example: A month is from March 18 to April 18. A month is not March 18 to April 17 and 2 months are between March 18 and May 18.
     *
     * @param date1 First date. Must be before date2.
     * @param date2 Second date. Must be after date1.
     * @return Number of months.
     */
    public static int getNumberOfMonths(Date date1, Date date2) {
        int numMonths = 0;
        GregorianCalendar calendar1 = new GregorianCalendar();
        calendar1.setTime(date1);

        GregorianCalendar calendar2 = new GregorianCalendar();
        calendar2.setTime(date1);
        calendar2.add(Calendar.MONTH, 1);

        while (date2.after(calendar1.getTime()) && date2.after(calendar2.getTime())) {
            if (date2.after(calendar1.getTime()) && date2.before(calendar2.getTime())) {
                return numMonths;
            } else if (date2.after(calendar1.getTime()) && date2.after(calendar2.getTime())) {
                numMonths++;
                calendar2.add(Calendar.MONTH, 1);
                calendar1.add(Calendar.MONTH, 1);
            }
        }
        if (calendar2.getTime().getDay() == date2.getDay()) {
            return numMonths + 1;
        }

        return numMonths;
    }

    /**
     * Get the number of years between two dates
     *
     * @param date1 First date. Must be before date2.
     * @param date2 Second date. Must be after date1.
     * @return Number of years.
     */
    public static int getNumberOfYears(Date date1, Date date2) {
        int numMonths = getNumberOfMonths(date1, date2);
        return numMonths / MONTHS_IN_YEAR;
    }


}
