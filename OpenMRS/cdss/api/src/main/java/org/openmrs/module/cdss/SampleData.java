package org.openmrs.module.cdss;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class SampleData {
	
	private JSONArray source;
	
	private List<Rule> rules;
	
	public void loadSampleDataJson() throws UnsupportedEncodingException {
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream inputStream = classloader.getResourceAsStream("sampleData/rules.json");
		
		assert inputStream != null;
		
		source = new JSONArray(new JSONTokener(inputStream));
		//        JSONObject obj = new JSONObject(jsonString);
		rules = new ArrayList<Rule>(source.length() + 10);
		
		for (int i = 0; i < source.length(); i++) {
			String vaccine = source.getJSONObject(i).getString("vaccine");
			Integer minAge = source.getJSONObject(i).getInt("min_age");
			Integer maxAge = source.getJSONObject(i).getInt("max_age");
			
			String specialCondition = source.getJSONObject(i).get("special_condition") != JSONObject.NULL ? (String) source
			        .getJSONObject(i).get("special_condition") : null;
			//            String medicalConditions =  source.getJSONObject(i).get("medical_conditions") != JSONObject.NULL ? (String)source.getJSONObject(i).get("medical_conditions") : null;
			
			//            JSONObject previousRecord = source.getJSONObject(i).get("previous_record") != JSONObject.NULL ? source.getJSONObject(i).getJSONObject("previous_record") : null;
			
			JSONArray actionsJsonArray = source.getJSONObject(i).getJSONArray("actions");
			
			Action[] actions = new Action[actionsJsonArray.length()];
			for (int j = 0; j < actionsJsonArray.length(); j++) {
				String actionString = (String) actionsJsonArray.get(j);
				
				Action action = new Action();
				action.setDisplayString(actionString);
				actions[j] = action;
			}
			
			Rule rule = new Rule();
			rule.setVaccine(vaccine);
			rule.setMinimumAge(minAge);
			rule.setMaximumAge(maxAge);
			rule.setSpecialCondition(specialCondition);
			//            rule.setMedicalCondition(null);
			//            rule.setPreviousRecord(null);
			rule.setActions(actions);
			
			rules.add(rule);
			
		}
		
	}
	
	public List<Rule> getRules() {
		return rules;
	}
}
