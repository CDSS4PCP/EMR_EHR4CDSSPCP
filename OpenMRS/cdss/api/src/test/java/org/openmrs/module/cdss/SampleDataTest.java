package org.openmrs.module.cdss;

import org.junit.Test;

import java.io.UnsupportedEncodingException;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.hamcrest.core.Is.is;

public class SampleDataTest extends RuleRunnerServiceTest {
	
	@Test
	public void checkSampleDataLoad() {
		SampleData sampleData = new SampleData();
		try {
			sampleData.loadSampleDataJson();
		}
		catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
		
		assertNotNull(sampleData.getRules());
	}
}
