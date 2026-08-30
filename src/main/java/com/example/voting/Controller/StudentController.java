// package com.example.student.Controller;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import com.example.student.Modal.Student;
// import com.example.student.Service.StudentService;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import java.util.List;
// import java.util.Optional;

// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestParam;

// @RestController
// @RequestMapping("/api")
// public class StudentController{
//     private final StudentService stud;
//     private StudentController(StudentService stud){
//         this.stud=stud;
//     }
//     @PostMapping("/student")
//     public Student createStudent(@RequestBody Student student) {   
//         return stud.createStudent(student);
//     }
//     @GetMapping("/students")
//     public List<Student> getAllStudents() {
//         return stud.getAll();
//     }
//     @GetMapping("/student/{id}")
//     public Optional<Student> getStudentById(@PathVariable Integer id){
//         return stud.getStudentById(id);
//     }

//     @DeleteMapping("/students")
//     public String deletingAllStudents(){
//         stud.deletingAll();
//         return "Deleted all successfully...";
//     }

//     @DeleteMapping("/student/{id}")
//     public String deleteId(@PathVariable Integer id){
//         stud.deletingIdValue(id);
//         return "Delete id value successfully...";
//     }

//     @PutMapping("/student/{id}")
//     public Student updateStudent(@PathVariable Integer id, @RequestBody Student student){
//         return stud.updateByID(id, student);
//     }  
// }