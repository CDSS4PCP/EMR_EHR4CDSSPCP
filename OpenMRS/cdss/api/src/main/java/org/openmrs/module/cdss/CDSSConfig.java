/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.cdss;

import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Contains module's config.
 */
@Component("cdss.CDSSConfig")
public class CDSSConfig {
	
	public final static String MODULE_PRIVILEGE = "CDSS Privilege";
	
	public static final int RULE_MINIMUM_AGE = 0;
	
	public static final int RULE_MAXIMUM_AGE = 99999;
	
	public static final ArrayList<String> VACCINE_CODES = new ArrayList<String>();
	
}
