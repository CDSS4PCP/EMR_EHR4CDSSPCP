package org.openmrs.module.cdss;

import org.junit.Test;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.test.BaseModuleContextSensitiveTest;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class RuleManagerServiceTest extends BaseModuleContextSensitiveTest {
	
	@Test
	public void checkAllRulesByVaccine() {
		RuleManagerService serv = Context.getService(RuleManagerService.class);
		
		List<Rule> actual = serv.getRulesByVaccine("MMR");
		System.out.println(actual);
		
		actual.sort(new Rule.RuleVaccineComparator());
		
		System.out.println(actual);
		List<Rule> expected = new ArrayList<Rule>();
		//		expected.add(new Rule(1, "MMR"));
		//		expected.add(new Rule(2, "MMR"));
		//		expected.add(new Rule(3, "MMR"));
		//		expected.add(new Rule(5, "MMR"));
		//		expected.add(new Rule(12, "MMR"));
		//		expected.add(new Rule(22, "MMR"));
		System.out.println(actual);
		
		assertThat(actual, is(expected));
		
	}
	
	@Test
	public void checkAddingNewVaccine() {
		RuleManagerService serv = Context.getService(RuleManagerService.class);
		
		serv.registerNewVaccine("Polio");
		
		List<String> expected = new ArrayList<String>();
		expected.add("MMR");
		expected.add("HPV");
		expected.add("Polio");
		
		System.out.println(serv.getLoadedVaccineRulesets());
		
		assertThat(serv.getLoadedVaccineRulesets(), is(expected));
		
	}
	
}
