package org.openmrs.module.cdss;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class CDSSUtil {

    public static String decodeCql(String encodedCql) {
        byte[] bytes = encodedCql.getBytes(StandardCharsets.UTF_8);
        byte[] decoded = Base64.getDecoder().decode(bytes);
        String decodedCql = new String(decoded, StandardCharsets.UTF_8);
        return decodedCql;
    }


    public static String encodeCql(String cql) {
        byte[] bytes = cql.getBytes(StandardCharsets.UTF_8);
        byte[] encoded = Base64.getEncoder().encode(bytes);
        String encodedCql = new String(encoded, StandardCharsets.UTF_8);
        return encodedCql;
    }
}
