package org.openmrs.module.cdss;

import org.junit.Test;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.api.RuleRunnerService;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

public class RuleRunnerServiceTest extends BaseModuleContextSensitiveTest {
	
	@Test
	public void shouldSetupContext() {
		assertNotNull(Context.getService(RuleRunnerService.class));
	}
	
	//	@Test
	//	public void checkLoadedRulesets() {
	//		RuleRunnerService serv = Context.getService(RuleRunnerService.class);
	//		assertThat(Arrays.asList("MMR", "HPV"), is(serv.getLoadedVaccineRulesets()));
	//	}
	
	@Test
	public void checkNullPatient() {
		RuleRunnerService serv = Context.getService(RuleRunnerService.class);
		assertThat(null, is(serv.getAllResults(null, null)));
	}
	
	@Test
	public void checkNullPatientNullVaccine() {
		RuleRunnerService serv = Context.getService(RuleRunnerService.class);
		assertThat(null, is(serv.getResult(null, null, null)));
	}
	
}
