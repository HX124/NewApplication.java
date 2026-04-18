package com.demo.new1.controller;

import com.demo.new1.pojo.ResponseMessage;
import com.demo.new1.pojo.User;
import com.demo.new1.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.demo.new1.pojo.dto.UserDto;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    IUserService userService;

    // ========== 验证码 ==========
    @PostMapping("/send-captcha")
    public ResponseMessage<String> sendCaptcha(@RequestBody SendCaptchaRequest request) {
        System.out.println("发送验证码到: " + request.getPhone());
        return ResponseMessage.success("验证码已发送");
    }

    // ========== 注册 ==========
    @PostMapping("/register")
    public ResponseMessage<User> register(@RequestBody RegisterRequest request) {
        System.out.println("=== 注册开始 ===");
        System.out.println("userName: " + request.getUserName());
        System.out.println("phone: " + request.getPhone());
        System.out.println("email: " + request.getEmail());
        System.out.println("captcha: " + request.getCaptcha());

        if (!"123456".equals(request.getCaptcha())) {
            return ResponseMessage.error("验证码错误");
        }

        UserDto userDto = new UserDto();
        userDto.setUserName(request.getUserName());
        userDto.setPhone(request.getPhone());
        userDto.setEmail(request.getEmail());
        userDto.setPassword(request.getPassword());

        User savedUser = userService.add(userDto);
        System.out.println("=== 注册成功，用户ID: " + savedUser.getUserId() + " ===");
        return ResponseMessage.success(savedUser);
    }

    // ========== 更新用户信息（手机/邮箱/昵称）==========
    @PutMapping
    public ResponseMessage<User> updateUser(@RequestBody UserDto userDto) {
        System.out.println("=== 更新用户信息 ===");
        System.out.println("userId: " + userDto.getUserId());
        System.out.println("userName: " + userDto.getUserName());
        System.out.println("phone: " + userDto.getPhone());
        System.out.println("email: " + userDto.getEmail());

        User updatedUser = userService.edit(userDto);
        return ResponseMessage.success(updatedUser);
    }

    // ========== 修改密码 ==========
    @PutMapping("/password")
    public ResponseMessage<String> updatePassword(@RequestBody UpdatePasswordRequest request) {
        System.out.println("=== 修改密码 ===");
        System.out.println("userId: " + request.getUserId());

        boolean isValid = userService.checkPassword(request.getUserId(), request.getCurrentPassword());
        if (!isValid) {
            return ResponseMessage.error("当前密码错误");
        }

        String newPassword = request.getNewPassword();
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$^_*#&])[a-zA-Z0-9@$^_*#&]{8,}$";
        if (!newPassword.matches(passwordRegex)) {
            return ResponseMessage.error("密码必须包含数字、字母、特殊字符(@$^_*#&)，长度最低为8位");
        }

        userService.updatePassword(request.getUserId(), newPassword);
        return ResponseMessage.success(null);
    }

    // ========== 密码登录 ==========
    @PostMapping("/login")
    public ResponseMessage<User> login(@RequestBody LoginRequest request) {
        System.out.println("=== 密码登录 ===");
        System.out.println("identifier: " + request.getIdentifier());

        User user = userService.findByIdentifierAndPassword(request.getIdentifier(), request.getPassword());
        if (user == null) {
            return ResponseMessage.error("用户名或密码错误");
        }

        System.out.println("=== 登录成功，用户ID: " + user.getUserId() + " ===");
        return ResponseMessage.success(user);
    }

    // ========== 验证码登录 ==========
    @PostMapping("/login-by-captcha")
    public ResponseMessage<User> loginByCaptcha(@RequestBody LoginByCaptchaRequest request) {
        System.out.println("=== 验证码登录 ===");
        System.out.println("phone: " + request.getPhone());

        if (!"123456".equals(request.getCaptcha())) {
            return ResponseMessage.error("验证码错误");
        }

        User user = userService.findByPhone(request.getPhone());
        if (user == null) {
            return ResponseMessage.error("用户不存在");
        }

        System.out.println("=== 验证码登录成功，用户ID: " + user.getUserId() + " ===");
        return ResponseMessage.success(user);
    }

    // ========== 查询用户 ==========
    @GetMapping("/{userId}")
    public ResponseMessage<User> getUser(@PathVariable Integer userId) {
        User user = userService.getUser(userId);
        return ResponseMessage.success(user);
    }

    // ========== 删除用户 ==========
    @DeleteMapping("/{userId}")
    public ResponseMessage<String> deleteUser(@PathVariable Integer userId) {
        userService.delete(userId);
        return ResponseMessage.success(null);
    }

    // ========== 内部请求类 ==========
    public static class SendCaptchaRequest {
        private String phone;
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class RegisterRequest {
        private String userName;
        private String phone;
        private String email;
        private String password;
        private String captcha;
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }
    }

    public static class LoginRequest {
        private String identifier;
        private String password;
        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginByCaptchaRequest {
        private String phone;
        private String captcha;
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }
    }

    public static class UpdatePasswordRequest {
        private Integer userId;
        private String currentPassword;
        private String newPassword;
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}