package com.demo.new1.service;

import com.demo.new1.pojo.AnalysisObject;
import com.demo.new1.pojo.dto.AnalysisObjectDto;
import com.demo.new1.repository.AnalysisObjectRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalysisObjectService implements IAnalysisObjectService{
    @Autowired
    AnalysisObjectRepository analysisObjectRepository;
    @Override
    public AnalysisObject add(AnalysisObjectDto analysisObject) {
        AnalysisObject analysisObjectPojo=new AnalysisObject();
        BeanUtils.copyProperties(analysisObject,analysisObjectPojo);
        analysisObjectRepository.save(analysisObjectPojo);
        return analysisObjectPojo;
    }

    @Override
    public AnalysisObject getAnalysisObject(Integer analysisObjectId) {
        return analysisObjectRepository.findById(analysisObjectId)
                .orElseThrow(() -> new IllegalArgumentException("分析对象不存在"));
    }
    @Override
    public AnalysisObject edit(AnalysisObjectDto analysisObject) {
        AnalysisObject analysisObjectPojo=new AnalysisObject();
        BeanUtils.copyProperties(analysisObject,analysisObjectPojo);
        analysisObjectRepository.save(analysisObjectPojo);
        return analysisObjectPojo;
    }

    @Override
    public void delete(Integer analysisObjectId) {
        analysisObjectRepository.deleteById(analysisObjectId);
    }
}
