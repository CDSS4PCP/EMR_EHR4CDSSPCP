package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class ModifyRuleRequest {

    @JsonProperty(value = "rule", required = true)
    public ModifyRuleRequestRuleDescriptor rule;

    @JsonProperty(value = "params", required = true)
    Map<String, ParamDescriptor> params;

    @JsonProperty(value = "libraries", required = false)
    Map<String, ModifyRuleRequestRuleDescriptor> libraries;

}
