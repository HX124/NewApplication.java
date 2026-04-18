package com.demo.new1.repository;

import com.demo.new1.pojo.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    User findByPhone(String phone);
    User findByEmail(String email);
}