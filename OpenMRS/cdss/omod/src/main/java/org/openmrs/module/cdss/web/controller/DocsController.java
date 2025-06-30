package org.openmrs.module.cdss.web.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DocsController extends CdssRestController {


    @GetMapping(value = {"/cdss/docs.form"}, produces = {MediaType.TEXT_HTML_VALUE})
    public String index() {
        return "module/cdss/docs/index";
    }


    @GetMapping(value = {"/cdss/docs/rule-service.form"}, produces = {MediaType.TEXT_HTML_VALUE})
    public String ruleService() {
        return "module/cdss/docs/rule-service";
    }

    @GetMapping(value = {"/cdss/docs/cdss-service.form"}, produces = {MediaType.TEXT_HTML_VALUE})
    public String cdssService() {
        return "module/cdss/docs/cdss-service";
    }


}
