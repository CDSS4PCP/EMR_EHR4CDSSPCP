package org.openmrs.module.cdss.api.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.serialization.CdssUsageDeserializer;
import org.openmrs.module.cdss.api.serialization.CdssUsageSerializer;

public class CdssServiceImpl implements CDSSService {
	
	private ObjectMapper objectMapper;
	
	private SimpleModule simpleModule;
	
	@Override
	public ObjectMapper getCdssObjectMapper() {
		return objectMapper;
	}
	
	@Override
	public void onStartup() {
		objectMapper = new ObjectMapper();
		simpleModule = new SimpleModule();
		simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
		simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
		objectMapper.registerModule(simpleModule);
		
	}
	
	@Override
	public void onShutdown() {
		
	}
}
