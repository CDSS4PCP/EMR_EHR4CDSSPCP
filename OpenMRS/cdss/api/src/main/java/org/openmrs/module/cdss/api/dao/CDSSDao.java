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

import org.apache.log4j.Logger;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("cdss.CDSSDao")
public class CDSSDao {
	
	private final Logger log = Logger.getLogger(getClass());
	
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
	
	public CdssUsage saveEngineUsage(CdssUsage usage) {
		Transaction tx = getSession().beginTransaction();
		
		if (usage.getUuid() == null) {
			usage.setUuid(UUID.randomUUID().toString());
		}
		CdssUsage existingUsage = getUsage(usage.getVaccine(), usage.getPatientId(), usage.getRule(),
		    usage.getRecommendation(), usage.getStatus());
		if (existingUsage == null) {
			getSession().saveOrUpdate(usage);
			tx.commit();
			return usage;
		} else {
			return null;
		}
	}
	
	public CdssUsage getUsage(int id) {
		return (CdssUsage) getSession().createCriteria(CdssUsage.class).add(Restrictions.eq("id", id)).uniqueResult();
	}
	
	public CdssUsage getUsage(String vaccine, String patient, String rule, String recommendation, String status) {
		return (CdssUsage) getSession().createCriteria(CdssUsage.class).add(Restrictions.eq("vaccine", vaccine))
		        .add(Restrictions.eq("patientId", patient)).add(Restrictions.eq("rule", rule))
		        .add(Restrictions.eq("recommendation", recommendation))
		        //				.add(Restrictions.eq("status", status))
		        .uniqueResult();
	}
	
	public List<CdssUsage> getUsages() {
		
		List l = getSession().createCriteria(CdssUsage.class).setFetchSize(1).list();
		return (List<CdssUsage>) l;
	}
	
}
