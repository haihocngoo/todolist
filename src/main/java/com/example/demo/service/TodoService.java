package com.example.demo.service;

import com.example.demo.dto.request.TodoRequest;
import com.example.demo.dto.response.TodoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TodoService {
    TodoResponse createTodo(TodoRequest request, Long userId);

    Page<TodoResponse> getAllTodos(Long userId, Pageable pageable);

    TodoResponse getTodoById(Long id, Long userId);

    TodoResponse updateTodo(Long id, TodoRequest request, Long userId);

    void deleteTodo(Long id, Long userId);
}
