package com.demo.new1.service;

import com.demo.new1.pojo.User;
import com.demo.new1.pojo.dto.UserDto;
import com.demo.new1.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService{
    @Autowired
    UserRepository userRepository;
    @Override
    public User add(UserDto user) {
        User userPojo = new User();
        BeanUtils.copyProperties(user, userPojo);
        System.out.println("准备保存用户: " + user);
        userRepository.save(userPojo);
        return userPojo;
    }
    @Override
    public User getUser(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> {
            throw new IllegalArgumentException("用户不存在");
        });
    }
    @Override
    public User edit(UserDto userDto) {
        User user = userRepository.findById(userDto.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        if (userDto.getUserName() != null) {
            user.setUserName(userDto.getUserName());
        }
        user.setPhone(userDto.getPhone());
        user.setEmail(userDto.getEmail());
        if (userDto.getPassword() != null) {
            user.setPassword(userDto.getPassword());
        }
        return userRepository.save(user);
    }
    @Override
    public void delete(Integer userId) {
        userRepository.deleteById(userId);
    }
    @Override
    public User findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    @Override
    public User findByIdentifierAndPassword(String identifier, String password) {
        User userByPhone = userRepository.findByPhone(identifier);
        if (userByPhone != null && userByPhone.getPassword().equals(password)) {
            return userByPhone;
        }
        User userByEmail = userRepository.findByEmail(identifier);
        if (userByEmail != null && userByEmail.getPassword().equals(password)) {
            return userByEmail;
        }
        return null;
    }
    @Override
    public boolean checkPassword(Integer userId, String currentPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        return user.getPassword().equals(currentPassword);
    }
    @Override
    public User updatePassword(Integer userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        user.setPassword(newPassword);
        return userRepository.save(user);
    }
}