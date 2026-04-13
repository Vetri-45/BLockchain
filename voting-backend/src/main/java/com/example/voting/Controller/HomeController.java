
package com.example.voting.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@ResponseBody

public class HomeController {
   @GetMapping("/home")
    public String home(){
        return "Welcome to the Voting System";
    }
    @GetMapping("/dashboard")
    public String dashboard(){
        return "Login Successful";
    }

}