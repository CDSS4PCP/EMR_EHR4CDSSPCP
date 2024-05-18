package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.openmrs.module.cdss.api.data.CdssUsage;

import java.io.IOException;

public class CdssUsageSerializer extends StdSerializer<CdssUsage> {
	
	public CdssUsageSerializer(Class<CdssUsage> t) {
		super(t);
	}
	
	public CdssUsageSerializer() {
		this(null);
	}
	
	@Override
	public void serialize(CdssUsage cdssUsage, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
	        throws IOException {
		jsonGenerator.writeStartObject();
		
		if (cdssUsage.getVaccine() == null) {
			throw new IOException("Required field \"vaccine\" was null when serializing \"CdssUsage\"");
		}
		jsonGenerator.writeStringField("vaccine", cdssUsage.getVaccine());
		
		if (cdssUsage.getPatientId() == null) {
			throw new IOException("Required field \"patientId\" was null when serializing \"CdssUsage\"");
		}
		jsonGenerator.writeStringField("patientId", cdssUsage.getPatientId());
		
		if (cdssUsage.getTimestamp() == null) {
			throw new IOException("Required field \"timestamp\" was null when serializing \"CdssUsage\"");
		}
		jsonGenerator.writeFieldName("timestamp");
		jsonGenerator.writeStartArray();
		jsonGenerator.writeNumber(cdssUsage.getTimestamp().getYear());
		jsonGenerator.writeNumber(cdssUsage.getTimestamp().getMonthValue());
		jsonGenerator.writeNumber(cdssUsage.getTimestamp().getDayOfMonth());
		jsonGenerator.writeNumber(cdssUsage.getTimestamp().getHour());
		jsonGenerator.writeNumber(cdssUsage.getTimestamp().getMinute());
		jsonGenerator.writeNumber(cdssUsage.getTimestamp().getSecond());
		jsonGenerator.writeEndArray();
		
		if (cdssUsage.getRule() == null) {
			throw new IOException("Required field \"rule\" was null when serializing \"CdssUsage\"");
		}
		jsonGenerator.writeStringField("rule", cdssUsage.getRule());
		
		if (cdssUsage.getRecommendation1() == null) {
			throw new IOException("Required field \"recommendation1\" was null when serializing \"CdssUsage\"");
		}
		jsonGenerator.writeFieldName("recommendations");
		jsonGenerator.writeStartArray();
		
		if (cdssUsage.getRecommendation1() != null && !cdssUsage.getRecommendation1().isEmpty())
			writeRecommendation(jsonGenerator, cdssUsage.getRecommendation1(), 1);
		
		if (cdssUsage.getRecommendation2() != null && !cdssUsage.getRecommendation2().isEmpty())
			writeRecommendation(jsonGenerator, cdssUsage.getRecommendation2(), 2);
		
		if (cdssUsage.getRecommendation3() != null && !cdssUsage.getRecommendation3().isEmpty())
			writeRecommendation(jsonGenerator, cdssUsage.getRecommendation3(), 3);
		
		if (cdssUsage.getRecommendation4() != null && !cdssUsage.getRecommendation4().isEmpty())
			writeRecommendation(jsonGenerator, cdssUsage.getRecommendation4(), 4);
		
		if (cdssUsage.getRecommendation5() != null && !cdssUsage.getRecommendation5().isEmpty())
			writeRecommendation(jsonGenerator, cdssUsage.getRecommendation5(), 5);
		
		if (cdssUsage.getRecommendation6() != null && !cdssUsage.getRecommendation6().isEmpty())
			writeRecommendation(jsonGenerator, cdssUsage.getRecommendation6(), 6);
		jsonGenerator.writeEndArray();
		
		if (cdssUsage.getStatus() == null) {
			throw new IOException("Required field \"status\" was null when serializing \"CdssUsage\"");
		}
		jsonGenerator.writeStringField("status", cdssUsage.getStatus());
		jsonGenerator.writeStringField("uuid", cdssUsage.getUuid());
		
		jsonGenerator.writeEndObject();
	}
	
	private void writeRecommendation(JsonGenerator jsonGenerator, String recommendation, int priority) throws IOException {
		jsonGenerator.writeStartObject();
		jsonGenerator.writeNumberField("priority", priority);
		jsonGenerator.writeStringField("recommendation", recommendation);
		jsonGenerator.writeEndObject();
	}
}
