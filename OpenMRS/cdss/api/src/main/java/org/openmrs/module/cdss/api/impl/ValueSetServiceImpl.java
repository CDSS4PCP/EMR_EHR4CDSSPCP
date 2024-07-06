package org.openmrs.module.cdss.api.impl;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.api.ValueSetService;
import org.openmrs.module.cdss.api.util.ValueSetResponse;

import java.io.IOException;
import java.util.Base64;

public class ValueSetServiceImpl extends BaseOpenmrsService implements ValueSetService {
	
	private static final String SvsUrl = "https://vsac.nlm.nih.gov/vsac/svs/RetrieveValueSet";
	
	private final Logger log = Logger.getLogger(getClass());
	
	private OkHttpClient client;
	
	@Override
	public void onStartup() {
		log.info("CDSS ValueSet Service started");
		// Create Http client
		client = new OkHttpClient();
	}

	/**
	 * Retrieves a FHIR ValueSet from a specified URL using the provided API key, OID, version, and offset.
	 *
	 * @param apiKey the API key for authentication
	 * @param oid the OID (Object Identifier) of the ValueSet
	 * @param version the version of the ValueSet (optional)
	 * @param offset the offset for pagination (optional)
	 * @return a ValueSetResponse object containing the HTTP status code and the content of the response
	 * @throws APIAuthenticationException if there is an issue with API authentication
	 */
	@Override
	public ValueSetResponse getFhirValueSet(String apiKey, String oid, String version, Integer offset)
	        throws APIAuthenticationException {
		
		// Encode basic authentication string
		byte[] encodedBytes = Base64.getEncoder().encode(String.format(":%s", apiKey).getBytes());
		String encoded = new String(encodedBytes);
		
		// Build the url parameters
		StringBuilder paramsBuilder = new StringBuilder();
		if (version != null || offset != null)
			paramsBuilder.append("?");
		
		if (version != null)
			paramsBuilder.append(String.format("%s=%s", "version", version));
		
		if (version != null && offset != null)
			paramsBuilder.append("&");
		
		if (offset != null)
			paramsBuilder.append(String.format("%s=%s", "offset", offset));
		
		String url = String.format("https://cts.nlm.nih.gov/fhir/ValueSet/%s/$expand%s", oid, paramsBuilder.toString());
		// Send the request
		Request rq = new Request.Builder().get().url(url).header("Authorization", "Basic " + encoded).build();
		
		// Return response
		try {
			Response rs = client.newCall(rq).execute();
			
			String result = rs.body().string();
			rs.body().close();
			
			return new ValueSetResponse(rs.code(), result);
			
		}
		catch (IOException e) {
			return null;
		}
	}

	/**
	 * Retrieves a SVS ValueSet from a specified URL using the provided API key, OID, and version.
	 *
	 * @param apiKey the API key for authentication
	 * @param oid the OID (Object Identifier) of the ValueSet
	 * @param version the version of the ValueSet (optional)
	 * @return a ValueSetResponse object containing the HTTP status code and the content of the response
	 * @throws APIAuthenticationException if there is an issue with API authentication
	 */
	@Override
	public ValueSetResponse getSvsValueSet(String apiKey, String oid, String version) throws APIAuthenticationException {
		// Encode basic authentication string
		byte[] encodedBytes = Base64.getEncoder().encode(String.format(":%s", apiKey).getBytes());
		String encoded = new String(encodedBytes);
		
		// Build the url parameters
		String params = String.format("%s=%s", "id", oid);
		if (version != null)
			params = String.format("%s=%s&%s=%s", "id", oid, "version", version);
		
		String url = String.format("%s?%s", "https://vsac.nlm.nih.gov/vsac/svs/RetrieveValueSet", params);
		
		// Send the request
		Request rq = new Request.Builder().get().url(url).header("Authorization", "Basic " + encoded).build();
		
		// Return response
		try {
			Response rs = client.newCall(rq).execute();
			String result = rs.body().string();
			rs.body().close();
			
			return new ValueSetResponse(rs.code(), result);
			
		}
		catch (IOException e) {
			return null;
		}
	}
}
