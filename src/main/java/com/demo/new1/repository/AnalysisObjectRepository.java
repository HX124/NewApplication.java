package com.demo.new1.repository;

import com.demo.new1.pojo.AnalysisObject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisObjectRepository extends CrudRepository<AnalysisObject,Integer> {
}
