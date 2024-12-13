package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static org.openmrs.module.cdss.CDSSUtil.decodeCql;
import static org.openmrs.module.cdss.CDSSUtil.encodeCql;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ModifyRuleRequestRuleDescriptor {
    @JsonProperty(value = "id", required = true)
    public String id;
    @JsonProperty(value = "version", required = false)
    String version;
    @JsonProperty(value = "content", required = true)
    String content;

    @JsonIgnore
    public String getCqlContent() {
        return decodeCql(content);
    }

    @JsonIgnore
    public void setCqlContent(String cql) {
        this.content = encodeCql(cql);
    }

}
