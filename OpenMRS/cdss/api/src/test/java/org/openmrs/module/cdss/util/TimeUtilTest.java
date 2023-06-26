package org.openmrs.module.cdss.util;

import org.junit.Test;
import org.openmrs.module.cdss.api.util.TimeUtil;

import java.util.Calendar;
import java.util.GregorianCalendar;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class TimeUtilTest {
	
	@Test
	public void checkGetNumberMonthsExactDay() {
		
		GregorianCalendar calendar1 = new GregorianCalendar();
		GregorianCalendar calendar2 = new GregorianCalendar();
		calendar1.set(2023, Calendar.JUNE, 24);
		calendar2.set(2023, Calendar.JULY, 24);
		calendar1.getTime();
		
		int numMonths = TimeUtil.getNumberOfMonths(calendar1.getTime(), calendar2.getTime());
		assertThat(numMonths, is(1));
	}
	
	@Test
	public void checkGetNumberMonthsPlusOneDay() {
		
		GregorianCalendar calendar1 = new GregorianCalendar();
		GregorianCalendar calendar2 = new GregorianCalendar();
		calendar1.set(2023, Calendar.JUNE, 24);
		calendar2.set(2023, Calendar.JULY, 25);
		calendar1.getTime();
		
		int numMonths = TimeUtil.getNumberOfMonths(calendar1.getTime(), calendar2.getTime());
		assertThat(numMonths, is(1));
	}
	
	@Test
	public void checkGetNumberMonthsMinusOneDay() {
		
		GregorianCalendar calendar1 = new GregorianCalendar();
		GregorianCalendar calendar2 = new GregorianCalendar();
		calendar1.set(2023, Calendar.JUNE, 24);
		calendar2.set(2023, Calendar.JULY, 23);
		calendar1.getTime();
		
		int numMonths = TimeUtil.getNumberOfMonths(calendar1.getTime(), calendar2.getTime());
		assertThat(numMonths, is(0));
	}
	
	@Test
	public void checkGetNumberMonthsExactHalfYear() {
		
		GregorianCalendar calendar1 = new GregorianCalendar();
		GregorianCalendar calendar2 = new GregorianCalendar();
		calendar1.set(2023, Calendar.JANUARY, 24);
		calendar2.set(2023, Calendar.JULY, 24);
		calendar1.getTime();
		
		int numMonths = TimeUtil.getNumberOfMonths(calendar1.getTime(), calendar2.getTime());
		assertThat(numMonths, is(6));
	}
	
	@Test
	public void checkLeapYear() {
		
		GregorianCalendar calendar1 = new GregorianCalendar();
		GregorianCalendar calendar2 = new GregorianCalendar();
		calendar1.set(2020, Calendar.FEBRUARY, 29);
		calendar2.set(2021, Calendar.MARCH, 29);
		
		int numMonths = TimeUtil.getNumberOfMonths(calendar1.getTime(), calendar2.getTime());
		assertThat(numMonths, is(13));
	}
	
	@Test
	public void checkManyYears() {
		
		GregorianCalendar calendar1 = new GregorianCalendar();
		GregorianCalendar calendar2 = new GregorianCalendar();
		calendar1.set(1965, Calendar.MAY, 18);
		calendar2.set(2025, Calendar.MAY, 18);
		
		int numMonths = TimeUtil.getNumberOfMonths(calendar1.getTime(), calendar2.getTime());
		assertThat(numMonths, is((2025 - 1965) * 12));
	}
}
