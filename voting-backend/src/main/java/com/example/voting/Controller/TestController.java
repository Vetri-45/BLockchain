package com.example.voting.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/admin/test")
    public String admin() {
        return "Admin access granted";
    }

    @GetMapping("/user/test")
public String user() {
    return "User access granted";
}
    

}
