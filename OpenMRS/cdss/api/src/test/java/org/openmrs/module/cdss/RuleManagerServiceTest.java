package org.openmrs.module.cdss;

import org.junit.Test;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class RuleManagerServiceTest extends BaseModuleContextSensitiveTest {



	@Autowired
	RuleManagerService ruleManagerService;


    @Test
    public void test1() {
        boolean b = true;
        assertThat(b, is(true));
    }

    @Test
    public void checkAllRulesByVaccine() {


        String[] rules = ruleManagerService.getRules();
        assertThat(rules.length > 0, is(true));


    }

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
