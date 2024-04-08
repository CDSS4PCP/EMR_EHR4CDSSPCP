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
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.DistinctResultTransformer;
import org.hibernate.transform.ResultTransformer;
import org.hibernate.transform.Transformers;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
		getSession().saveOrUpdate(usage);
		return usage;
	}
	
	public List<CdssUsage> getUsages() {
		
		//        return getSession().createSQLQuery(
		//                "SELECT cdss_usage_id,cdss_usage_vaccine,cdss_usage_patient,cdss_usage_date FROM openmrs.cdss_usage").list();
		//
		//		ProjectionList pl = Projections.projectionList();
		//		pl.add(Projections.property("id"));
		//		pl.add(Projections.property("patient.id"));
		//		pl.add(Projections.property("vaccine"));
		//		pl.add(Projections.property("timestamp"));
		//		pl.add(Projections.property("uuid"));
		//		List l = getSession().createCriteria(CdssUsage.class).setProjection(pl).list();
		//		return (List<CdssUsage>) l;
		
		List l = getSession().createCriteria(CdssUsage.class).setFetchSize(1).list();
		return (List<CdssUsage>) l;
	}
}
