package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
public class RuleDescriptor implements Cloneable {
    @Getter
    @JsonProperty("id")
    private String id;

    @Getter
    @JsonProperty("libraryName")
    private String libraryName;

    @Getter
    @JsonProperty("version")
    private String version;

    @Getter
    @JsonProperty("cqlFilePath")
    private String cqlFilePath;

    @Getter
    @JsonProperty("elmFilePath")
    private String elmFilePath;

    @Getter
    @Setter
    @JsonProperty("description")
    private String description;


    @Getter
    @Setter
    @JsonProperty("derivedFrom")
    private String derivedFrom;


    @Getter
    @JsonProperty("role")
    private RuleRole role;

    @Getter
    @Setter
    @JsonProperty("enabled")
    private boolean enabled;

    @Getter
    @Setter
    @JsonProperty("params")
    private Map<String, ParamDescriptor> params;


    public RuleDescriptor(String id, String libraryName, String version, String cqlFilePath, String elmFilePath, RuleRole role) {
        this.id = id;
        this.libraryName = libraryName;
        this.version = version;
        this.cqlFilePath = cqlFilePath;
        this.elmFilePath = elmFilePath;
        this.role = role;
    }

    @Override
    public String toString() {
        return "RuleDescriptor{" +
                "id='" + id + '\'' +
                ", version='" + version + '\'' +
                ", cqlFilePath='" + cqlFilePath + '\'' +
                ", elmFilePath='" + elmFilePath + '\'' +
                ", description='" + description + '\'' +
                ", role=" + role +
                ", enabled=" + enabled +
                ", params=" + params +
                '}';
    }

    @Override
    protected RuleDescriptor clone() throws CloneNotSupportedException {
        RuleDescriptor clonedRuleDescriptor = new RuleDescriptor(id, libraryName, version, cqlFilePath, elmFilePath, role);
        Map<String, ParamDescriptor> newParams = new HashMap<>();
        for (Map.Entry<String, ParamDescriptor> entry : params.entrySet()) {
            newParams.put(entry.getKey(), entry.getValue().clone());
        }
        clonedRuleDescriptor.params = newParams;
        return clonedRuleDescriptor;
    }
}
