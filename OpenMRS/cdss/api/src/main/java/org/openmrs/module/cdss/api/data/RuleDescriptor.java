package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
public class RuleDescriptor implements Cloneable {
    @Getter
    @JsonProperty("id")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String id;

    @Getter
    @JsonProperty("libraryName")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String libraryName;

    @Getter
    @JsonProperty("version")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String version;

    @Getter
    @JsonProperty("cqlFilePath")
    @JsonView({InternalJsonView.class})
    private String cqlFilePath;

    @Getter
    @JsonProperty("elmFilePath")
    @JsonView({InternalJsonView.class})
    private String elmFilePath;

    @Getter
    @Setter
    @JsonProperty("description")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String description;


    @Getter
    @Setter
    @JsonProperty("derivedFrom")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String derivedFrom;


    @Getter
    @JsonProperty("role")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private RuleRole role;

    @Getter
    @Setter
    @JsonProperty("enabled")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private boolean enabled;

    @Getter
    @Setter
    @JsonProperty(value = "vaccine", required = false)
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private String vaccine;

    @Getter
    @Setter
    @JsonProperty("params")
    @JsonView({InternalJsonView.class, WebJsonView.class})
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
        return "RuleDescriptor{" + "id='" + id + '\'' + ", version='" + version + '\'' + ", cqlFilePath='" + cqlFilePath + '\'' + ", elmFilePath='" + elmFilePath + '\'' + ", description='" + description + '\'' + ", role=" + role + ", enabled=" + enabled + ", params=" + params + '}';
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
