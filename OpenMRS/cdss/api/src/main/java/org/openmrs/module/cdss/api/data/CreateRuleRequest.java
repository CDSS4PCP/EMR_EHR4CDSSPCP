package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class CreateRuleRequest {
    @JsonProperty(value = "libraryName", required = true)
    public String libraryName;

    @JsonProperty(value = "libraryVersion", required = true)
    public String libraryVersion;

    @JsonProperty(value = "description", required = false)
    public String description;

    @JsonProperty(value = "ruleRole", required = true)
    public RuleRole ruleRole;
    @JsonProperty(value = "cql", required = true)
    public String cql;
    @JsonProperty(value = "elm", required = false)
    public String elm;
    @JsonProperty(value = "params", required = true)
    Map<String, ParamDescriptor> params;
    @JsonProperty(value = "libraries", required = false)
    Map<String, ModifyRuleRequestRuleDescriptor> libraries;

    @Override
    public String toString() {
        return "CreateRuleRequest{" +
                "libraryName='" + libraryName + '\'' +
                ", libraryVersion='" + libraryVersion + '\'' +
                ", description='" + description + '\'' +
                ", ruleRole=" + ruleRole +
                ", cql='" + cql + '\'' +
                ", elm='" + elm + '\'' +
                ", params=" + params +
                ", libraries=" + libraries +
                '}';
    }
}
