package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
public class ParamDescriptor {

    @Getter
    @JsonIgnore
    String name;

    @Getter
    @JsonProperty("type")
    private String type;
    @Getter
    @Setter
    @JsonProperty("value")
    private Object value;


    @Getter
    @JsonProperty(value = "default", required = false)
    private Object defaultValue;

    public ParamDescriptor(String type, Object defaultValue) {
        this.type = type;
        this.defaultValue = defaultValue;
    }

    public ParamDescriptor(String type) {
        this.type = type;
    }
}
