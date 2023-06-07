package org.openmrs.module.cdss;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.Action;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

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
	
	@Test
	public void checkActions() {
		SampleData sampleData = new SampleData();
		try {
			sampleData.loadSampleDataJson();
		}
		catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
		
		List<Action> actions = sampleData.getActions();
		System.out.println(actions);
		assertThat(actions.size(), is(4));
	}
	
}
