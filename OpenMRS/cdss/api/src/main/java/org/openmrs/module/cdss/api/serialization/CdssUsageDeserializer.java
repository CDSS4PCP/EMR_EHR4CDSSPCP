package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import org.openmrs.module.cdss.api.data.CdssUsage;

import java.io.IOException;

public class CdssUsageDeserializer extends StdDeserializer<CdssUsage> {
	
	protected CdssUsageDeserializer(Class<?> vc) {
		super(vc);
	}
	
	public CdssUsageDeserializer() {
		this(null);
	}
	
	@Override
	public CdssUsage deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException,
	        JacksonException {
		return null;
	}
}
