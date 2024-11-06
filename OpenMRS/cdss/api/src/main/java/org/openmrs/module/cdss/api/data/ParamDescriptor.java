package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;

@Getter
@NoArgsConstructor
public class ParamDescriptor {

    @JsonIgnore
    String name;

    @JsonProperty("type")
    private String type;

    @Setter
    @JsonProperty("value")
    private Object value;

    @Setter
    @JsonProperty("allowedValues")
    private Object[] allowedValues;

    @JsonProperty(value = "default", required = false)
    private Object defaultValue;

    public ParamDescriptor(String type, Object defaultValue) {
        this.type = type;
        this.defaultValue = defaultValue;
    }

    public ParamDescriptor(String type) {
        this.type = type;
    }

    public ParamDescriptor(ParamDescriptor descriptor) {
        this.type = descriptor.type;
        this.defaultValue = descriptor.defaultValue;
        this.allowedValues = descriptor.allowedValues;
        this.value = descriptor.value;
    }

    @Override
    public String toString() {
        return "ParamDescriptor{" +
                "name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", value=" + value +
                ", allowedValues=" + Arrays.toString(allowedValues) +
                ", defaultValue=" + defaultValue +
                '}';
    }
}
