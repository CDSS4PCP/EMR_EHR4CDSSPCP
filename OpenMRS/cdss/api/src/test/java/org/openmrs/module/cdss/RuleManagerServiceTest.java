package org.openmrs.module.cdss;

import org.junit.Test;
import org.openmrs.test.BaseModuleContextSensitiveTest;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class RuleManagerServiceTest extends BaseModuleContextSensitiveTest {
	
	@Test
	public void test1() {
		boolean b = true;
		assertThat(b, is(true));
	}
	
	//	@Test
	//	public void checkAllRulesByVaccine() {
	//		RuleManagerService serv = Context.getService(RuleManagerService.class);
	//
	//		List<Rule> actual = serv.getRulesByVaccine("MMR");
	//		System.out.println(actual);
	//
	//		actual.sort(new Rule.RuleVaccineComparator());
	//
	//		System.out.println(actual);
	//		List<Rule> expected = new ArrayList<Rule>();
	//		//		expected.add(new Rule(1, "MMR"));
	//		//		expected.add(new Rule(2, "MMR"));
	//		//		expected.add(new Rule(3, "MMR"));
	//		//		expected.add(new Rule(5, "MMR"));
	//		//		expected.add(new Rule(12, "MMR"));
	//		//		expected.add(new Rule(22, "MMR"));
	//		System.out.println(actual);
	//
	//		assertThat(actual, is(expected));
	//
	//	}
	
	//	@Test
	//	public void checkAddingNewVaccine() {
	//		RuleManagerService serv = Context.getService(RuleManagerService.class);
	//
	//		serv.addVaccine("Polio");
	//
	//		List<String> expected = new ArrayList<String>();
	//		expected.add("MMR");
	//		expected.add("HPV");
	//		expected.add("Polio");
	//
	//		System.out.println(serv.getLoadedVaccineRulesets());
	//
	//		assertThat(serv.getLoadedVaccineRulesets(), is(expected));
	//
	//	}
	
	//    @Test
	//    public void checkActions() {
	//        SampleData sampleData = new SampleData();
	//        try {
	//            sampleData.loadSampleDataJson();
	//        } catch (UnsupportedEncodingException e) {
	//            throw new RuntimeException(e);
	//        }
	//        RuleManagerService serv = Context.getService(RuleManagerService.class);
	//        List<Action> actions = serv.getAllActions();
	//
	//        assertThat(actions.size(), is(4));
	//
	//
	//    }
}
