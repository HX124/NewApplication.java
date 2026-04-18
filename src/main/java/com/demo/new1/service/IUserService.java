package com.demo.new1.service;

import com.demo.new1.pojo.User;
import com.demo.new1.pojo.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface IUserService {
    //插入用户
    User add(UserDto user);
    //查询用户
    User getUser(Integer userId);
    //修改用户
    User edit(UserDto user);
    //删除用户
    void delete(Integer userId);
    User findByPhone(String phone);
    User findByEmail(String email);
    // 根据手机号或邮箱和密码查询用户
    User findByIdentifierAndPassword(String identifier, String password);
    // 验证当前密码是否正确
    boolean checkPassword(Integer userId, String currentPassword);
    // 修改密码
    User updatePassword(Integer userId, String newPassword);
}