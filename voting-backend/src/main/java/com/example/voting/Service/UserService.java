package com.example.voting.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthenticatedAuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.voting.Modal.User;
import com.example.voting.Repository.UserRepository;

@Service
public class UserService  {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;
      @Autowired
    private UserDetailsService userDetailsService;

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

   @Autowired
private BCryptPasswordEncoder passwordEncoder;

public User createUser(User user){
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    if (user.getRole()==null) {
            user.setRole("ROLE_USER");
        }
    return userRepository.save(user);
}

    public List<User> getAll(){
        return userRepository.findAll();
    }

    public User getById(Integer id){
        return userRepository.findById(id).orElse(null);
    }
     public User updateUser(Integer id, User user){
        user.setId(id);
        return userRepository.save(user);
    }

    public void deleteUserById(Integer id){
        userRepository.deleteById(id);
    }

    public void deleteUsers(){
        userRepository.deleteAll();
    }

   public String verify(User user) {
    Authentication authentication=authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            user.getUsername(),
            user.getPassword()
        )
    );
    if (authentication.isAuthenticated()) {
          UserDetails userDetails=
                    userDetailsService.loadUserByUsername(user.getUsername());
        String token=jwtService.generateToken(userDetails);
        
        System.out.println(token);
        return token ;
    } else {
        return "Fail";
    }

}

}

