/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.cdss.api.dao;

import org.hibernate.criterion.Restrictions;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.api.data.EngineUsage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("cdss.CDSSDao")
public class CDSSDao {
	
	@Autowired
	DbSessionFactory sessionFactory;
	
	private DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	public Item getItemByUuid(String uuid) {
		return (Item) getSession().createCriteria(Item.class).add(Restrictions.eq("uuid", uuid)).uniqueResult();
	}
	
	public Item saveItem(Item item) {
		getSession().saveOrUpdate(item);
		return item;
	}
	
	public EngineUsage saveEngineUsage(EngineUsage usage) {
		getSession().saveOrUpdate(usage);
		return usage;
	}
	
	public List<EngineUsage> getUsages() {
		
		return (List<EngineUsage>) getSession().createSQLQuery(
		    "SELECT cdss_usage_id,cdss_usage_vaccine,cdss_usage_patient,cdss_usage_date FROM openmrs.cdss_usage").list();
		//		return (List<EngineUsage>) (getSession().createCriteria(EngineUsage.class).list());
		
	}
}
