package com.demo.new1.service;

import com.demo.new1.pojo.AnalysisObject;
import com.demo.new1.pojo.dto.AnalysisObjectDto;
import org.springframework.stereotype.Service;

@Service
public interface IAnalysisObjectService {
    //增加分析对象
    AnalysisObject add(AnalysisObjectDto analysisObject);
    //查询分析对象
    AnalysisObject getAnalysisObject(Integer analysisObjectId);
    //修改分析对象
    AnalysisObject edit(AnalysisObjectDto analysisObject);
    //删除分析对象
    void delete(Integer analysisObjectId);
}
