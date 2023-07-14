package org.openmrs.module.cdss;

import org.junit.Test;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.api.RuleEngineService;
import org.openmrs.test.BaseModuleContextSensitiveTest;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

public class RuleEngineServiceTest extends BaseModuleContextSensitiveTest {
	
	@Test
	public void shouldSetupContext() {
		assertNotNull(Context.getService(RuleEngineService.class));
	}
	
	//	@Test
	//	public void checkLoadedRulesets() {
	//		RuleRunnerService serv = Context.getService(RuleRunnerService.class);
	//		assertThat(Arrays.asList("MMR", "HPV"), is(serv.getLoadedVaccineRulesets()));
	//	}
	
	@Test
	public void checkNullPatient() {
		RuleEngineService serv = Context.getService(RuleEngineService.class);
		assertThat(null, is(serv.getAllResults(null)));
	}
	
	@Test
	public void checkNullPatientNullVaccine() {
		RuleEngineService serv = Context.getService(RuleEngineService.class);
		assertThat(null, is(serv.getResult(null, null)));
	}
	
}
