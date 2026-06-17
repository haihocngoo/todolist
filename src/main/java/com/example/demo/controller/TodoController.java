package com.example.demo.controller;

import com.example.demo.dto.request.TodoRequest;
import com.example.demo.dto.response.TodoResponse;
import com.example.demo.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/todos")
public class TodoController {
    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody TodoRequest request,
            HttpServletRequest httpServletRequest) {

        Long userId = (Long) httpServletRequest.getAttribute("CURRENT_USER_ID");
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập để thực hiện tính năng này!");
        }
        TodoResponse response = todoService.createTodo(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<TodoResponse>> getAllTodos(
            HttpServletRequest httpServletRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Long userId = (Long) httpServletRequest.getAttribute("CURRENT_USER_ID");
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập để thực hiện tính năng này!");
        }
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TodoResponse> todos = todoService.getAllTodos(userId, pageable);

        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id,
                                                    HttpServletRequest httpServletRequest) {

        Long userId = (Long) httpServletRequest.getAttribute("CURRENT_USER_ID");
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập để thực hiện tính năng này!");
        }
        TodoResponse response = todoService.getTodoById(id ,userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(@PathVariable Long id,
                                                   @Valid @RequestBody TodoRequest request,
                                                   HttpServletRequest httpServletRequest) {

        Long userId = (Long) httpServletRequest.getAttribute("CURRENT_USER_ID");
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập để thực hiện tính năng này!");
        }
        TodoResponse response = todoService.updateTodo(id ,request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest) {

        Long userId = (Long) httpServletRequest.getAttribute("CURRENT_USER_ID");
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập để thực hiện tính năng này!");
        }

        todoService.deleteTodo(id, userId);
        return ResponseEntity.ok("Work deleted successfully (Soft Delete).");
    }
}
