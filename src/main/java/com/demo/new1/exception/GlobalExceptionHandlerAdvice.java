package com.demo.new1.exception;

import com.demo.new1.pojo.ResponseMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;



@RestControllerAdvice//用于统一处理
public class GlobalExceptionHandlerAdvice {



    @ExceptionHandler({Exception.class})//所有异常的统一处理
    public ResponseMessage handlerException(Exception e, HttpServletRequest request, HttpServletResponse response){

        return new ResponseMessage(500,"error",null);

    }
}
