package org.openmrs.module.cdss.api.data;

import java.util.Comparator;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;
import java.util.function.ToIntFunction;
import java.util.function.ToLongFunction;

class RuleIdComparator implements Comparator<Rule> {
	
	@Override
	public int compare(Rule o1, Rule o2) {
		return o1.getId() - o2.getId();
	}
	
	@Override
	public Comparator<Rule> reversed() {
		return Comparator.super.reversed();
	}
	
	@Override
	public Comparator<Rule> thenComparing(Comparator<? super Rule> other) {
		return Comparator.super.thenComparing(other);
	}
	
	@Override
	public <U> Comparator<Rule> thenComparing(Function<? super Rule, ? extends U> keyExtractor,
	        Comparator<? super U> keyComparator) {
		return Comparator.super.thenComparing(keyExtractor, keyComparator);
	}
	
	@Override
	public <U extends Comparable<? super U>> Comparator<Rule> thenComparing(Function<? super Rule, ? extends U> keyExtractor) {
		return Comparator.super.thenComparing(keyExtractor);
	}
	
	@Override
	public Comparator<Rule> thenComparingInt(ToIntFunction<? super Rule> keyExtractor) {
		return Comparator.super.thenComparingInt(keyExtractor);
	}
	
	@Override
	public Comparator<Rule> thenComparingLong(ToLongFunction<? super Rule> keyExtractor) {
		return Comparator.super.thenComparingLong(keyExtractor);
	}
	
	@Override
	public Comparator<Rule> thenComparingDouble(ToDoubleFunction<? super Rule> keyExtractor) {
		return Comparator.super.thenComparingDouble(keyExtractor);
	}
}

class RuleVaccineComparator implements Comparator<Rule> {
	
	@Override
	public int compare(Rule o1, Rule o2) {
		int val1 = o1.getVaccine().compareTo(o2.getVaccine());
		
		if (val1 != 0) {
			RuleIdComparator cmp = new RuleIdComparator();
			return cmp.compare(o1, o2);
		}
		
		return val1;
	}
	
	@Override
	public Comparator<Rule> reversed() {
		return Comparator.super.reversed();
	}
	
	@Override
	public Comparator<Rule> thenComparing(Comparator<? super Rule> other) {
		return Comparator.super.thenComparing(other);
	}
	
	@Override
	public <U> Comparator<Rule> thenComparing(Function<? super Rule, ? extends U> keyExtractor,
	        Comparator<? super U> keyComparator) {
		return Comparator.super.thenComparing(keyExtractor, keyComparator);
	}
	
	@Override
	public <U extends Comparable<? super U>> Comparator<Rule> thenComparing(Function<? super Rule, ? extends U> keyExtractor) {
		return Comparator.super.thenComparing(keyExtractor);
	}
	
	@Override
	public Comparator<Rule> thenComparingInt(ToIntFunction<? super Rule> keyExtractor) {
		return Comparator.super.thenComparingInt(keyExtractor);
	}
	
	@Override
	public Comparator<Rule> thenComparingLong(ToLongFunction<? super Rule> keyExtractor) {
		return Comparator.super.thenComparingLong(keyExtractor);
	}
	
	@Override
	public Comparator<Rule> thenComparingDouble(ToDoubleFunction<? super Rule> keyExtractor) {
		return Comparator.super.thenComparingDouble(keyExtractor);
	}
}

public class Rule {
	
	private Integer id;
	
	private String vaccine;
	
	public Rule(Integer id, String vaccine) {
		this.id = id;
		this.vaccine = vaccine;
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getVaccine() {
		return vaccine;
	}
	
	public void setVaccine(String vaccine) {
		this.vaccine = vaccine;
	}
}
