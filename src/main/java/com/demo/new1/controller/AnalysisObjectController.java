package com.demo.new1.controller;

import com.demo.new1.pojo.AnalysisObject;
import com.demo.new1.pojo.ResponseMessage;
import com.demo.new1.pojo.dto.AnalysisObjectDto;
import com.demo.new1.service.IAnalysisObjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analysisObject")
public class AnalysisObjectController {
    @Autowired
    IAnalysisObjectService analysisObjectService;
    //增加
    @PostMapping//URL:localhost:8088/analysisObject
    public ResponseMessage<AnalysisObject> add(@Validated @RequestBody AnalysisObjectDto analysisObject){
        AnalysisObject analysisObjectNew=analysisObjectService.add(analysisObject);
        return ResponseMessage.success(analysisObjectNew);
    }
    //查询
    @GetMapping("/{analysisObjectId}")//URL:localhost:8088/analysisObject/ID(具体是多少传多少)
    public ResponseMessage get(@PathVariable Integer analysisObjectId){
        AnalysisObject analysisObjectNew=analysisObjectService.getAnalysisObject(analysisObjectId);
        return ResponseMessage.success(analysisObjectNew);

    }
    //修改
    @PutMapping//URL:localhost:8088/analysisObject
    public ResponseMessage edit(@Validated @RequestBody AnalysisObjectDto analysisObject){
        AnalysisObject analysisObjectNew=analysisObjectService.edit(analysisObject);
        return ResponseMessage.success(analysisObjectNew);
    }
    //删除
    @DeleteMapping("/{analysisObjectId}")//URL:localhost:8088/analysisObject/ID(具体是多少传多少)
    public  ResponseMessage delete(@PathVariable Integer analysisObjectId){
        analysisObjectService.delete(analysisObjectId);
        return ResponseMessage.success();
    }
}
