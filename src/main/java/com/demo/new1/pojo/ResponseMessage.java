package com.demo.new1.pojo;

import org.springframework.http.HttpStatus;

public class ResponseMessage<T> {
    private Integer code;//不同的code代表不同的情况发生
    private String message;
    private T data;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ResponseMessage(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ResponseMessage() {
    }

    //接口请求成功
    public static <T> ResponseMessage<T> success(T data){
        ResponseMessage<T> responseMessage = new ResponseMessage<>();  // ✅ 这里加了 <T>
        responseMessage.setCode(HttpStatus.OK.value());//200
        responseMessage.setMessage("success");
        responseMessage.setData(data);
        return responseMessage;
    }

    public static <T> ResponseMessage<T> success(){
        ResponseMessage<T> responseMessage = new ResponseMessage<>();  // ✅ 这里加了 <T>
        responseMessage.setCode(HttpStatus.OK.value());//200
        responseMessage.setMessage("success");
        responseMessage.setData(null);
        return responseMessage;
    }

    public static <T> ResponseMessage<T> error(String message){
        ResponseMessage<T> responseMessage = new ResponseMessage<>();  // ✅ 这里加了 <T>
        responseMessage.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());// 500
        responseMessage.setMessage(message);
        responseMessage.setData(null);
        return responseMessage;
    }
}