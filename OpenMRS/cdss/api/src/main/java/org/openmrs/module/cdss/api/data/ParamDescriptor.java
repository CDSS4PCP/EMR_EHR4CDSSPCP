package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;

@Getter
@NoArgsConstructor
public class ParamDescriptor implements Cloneable {

    @JsonIgnore
    String name;

    @JsonProperty(value = "type", required = true)
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String type;

    @Setter
    @JsonProperty(value = "value", required = true)
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private Object value;

    @Setter
    @JsonProperty(value = "allowedValues", required = false)
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private Object[] allowedValues;

    @JsonProperty(value = "default", required = false)
    @JsonView({InternalJsonView.class, WebJsonView.class})
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

    @Override
    protected ParamDescriptor clone() throws CloneNotSupportedException {
        ParamDescriptor clone = (ParamDescriptor) super.clone();
        clone.allowedValues = Arrays.copyOf(allowedValues, allowedValues.length);
        return clone;
    }
}
