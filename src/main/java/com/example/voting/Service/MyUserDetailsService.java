package com.example.voting.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.voting.Modal.User;
import com.example.voting.Repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService 
{

    @Autowired
    private UserRepository userRepository;
    
    
    @Override
    public UserDetails loadUserByUsername(String username)throws UsernameNotFoundException{
       User user = userRepository.findByUsername(username)
       .orElseThrow(() -> new UsernameNotFoundException("User not found"));
       return new org.springframework.security.core.userdetails.User(
             user.getUsername(), 
             user.getPassword(), 
             List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }
}
