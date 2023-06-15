package org.openmrs.module.cdss;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class SampleData {
	
	private final Logger log = Logger.getLogger(getClass());
	
	private JSONArray source;
	
	private List<Rule> rules;
	
	private List<Action> actions;
	
	public void loadSampleDataJson() throws UnsupportedEncodingException {
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream inputStream = classloader.getResourceAsStream("sampleData/rules.json");
		
		assert inputStream != null;
		
		source = new JSONArray(new JSONTokener(inputStream));
		//        JSONObject obj = new JSONObject(jsonString);
		rules = new ArrayList<Rule>(source.length() + 10);
		actions = new ArrayList<Action>(source.length() + 10);
		
		for (int i = 0; i < source.length(); i++) {
			String vaccine = source.getJSONObject(i).getString("vaccine");
			Integer minAge = source.getJSONObject(i).getInt("min_age");
			Integer maxAge = source.getJSONObject(i).getInt("max_age");
			
			String specialCondition = source.getJSONObject(i).get("special_condition") != JSONObject.NULL ? (String) source
			        .getJSONObject(i).get("special_condition") : null;
			//            String medicalConditions =  source.getJSONObject(i).get("medical_conditions") != JSONObject.NULL ? (String)source.getJSONObject(i).get("medical_conditions") : null;
			
			//            JSONObject previousRecord = source.getJSONObject(i).get("previous_record") != JSONObject.NULL ? source.getJSONObject(i).getJSONObject("previous_record") : null;
			
			JSONArray actionsJsonArray = source.getJSONObject(i).getJSONArray("actions");
			HashSet<String> actionSet = new HashSet<String>();
			Action[] actionsForRule = new Action[actionsJsonArray.length()];
			
			for (int j = 0; j < actionsJsonArray.length(); j++) {
				String actionString = (String) actionsJsonArray.get(j);
				actionSet.add(actionString);
				
				Action action = findExistingAction(10, actionString);
				if (action == null) {
					action = new Action();
					action.setPriority(10);
					action.setDisplayString(actionString);
				}
				
				actionsForRule[j] = action;
				
				if (!actions.contains(action)) {
					actions.add(action);
				}
				
			}
			
			Rule rule = new Rule();
			rule.setVaccine(vaccine);
			rule.setMinimumAge(minAge);
			rule.setMaximumAge(maxAge);
			rule.setSpecialCondition(specialCondition);
			//            rule.setMedicalCondition(null);
			//            rule.setPreviousRecord(null);
			rule.setActions(actionsForRule);
			
			rules.add(rule);
			
		}
		
	}
	
	public List<Rule> getRules() {
		return rules;
	}
	
	public Rule getRuleById(Integer id) {
		List<Rule> rules = getRules();
		for (Rule rule : rules) {
			if (rule.getId().equals(id)) {
				return rule;
			}
		}
		return null;
	}
	
	public List<Action> getActions() {
		
		return actions;
	}
	
	public boolean addAction(Action action) {
		if (!actions.contains(action)) {
			return actions.add(action);
		}
		return false;
	}
	
	private Action findExistingAction(Integer priority, String displayText) {
		
		for (Action action : actions) {
			if (action.getPriority().equals(priority) && action.getDisplayString().equals(displayText)) {
				return action;
			}
		}
		return null;
	}
	
	public Action getActionById(Integer id) {
		List<Action> actions = getActions();
		for (Action action : actions) {
			if (action.getId().equals(id)) {
				return action;
			}
		}
		return null;
	}
	
	public boolean addRule(Rule rule) {
		return rules.add(rule);
	}
	
	public Boolean modifyRule(int ruleId, Rule rule) {
		int index = -1;
		for (int i = 0; i < rules.size(); i++) {
			Rule prevRule = rules.get(i);
			if (prevRule.getId() == ruleId) {
				index = i;
			}
		}
		if (index > -1) {
			return rules.set(index, rule) != null;
		}
		return false;
	}
	
	public Boolean deleteRule(int ruleId) {
		int index = -1;
		for (int i = 0; i < rules.size(); i++) {
			Rule prevRule = rules.get(i);
			if (prevRule.getId() == ruleId) {
				index = i;
			}
		}
		if (index > -1) {
			
			return rules.remove(index) == null;
		}
		return false;
	}
}
