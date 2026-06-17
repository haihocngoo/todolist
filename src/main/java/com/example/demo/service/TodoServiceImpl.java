package com.example.demo.service;

import com.example.demo.dto.request.TodoRequest;
import com.example.demo.dto.response.TodoResponse;
import com.example.demo.entity.Todo;
import com.example.demo.entity.User;
import com.example.demo.repository.TodoRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TodoServiceImpl implements TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    public TodoServiceImpl(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TodoResponse createTodo(TodoRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setStatus(request.getStatus());
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());
        todo.setCreatedAt(LocalDateTime.now());
        todo.setUpdatedAt(LocalDateTime.now());
        todo.setDeleted(false);
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);
        return mapToResponse(savedTodo);
    }

    @Override
    public Page<TodoResponse> getAllTodos(Long userId, Pageable pageable) {
        Page<Todo> todoPage = todoRepository.findByUserIdAndIsDeletedFalse(userId, pageable);
        return todoPage.map(this::mapToResponse);
    }

    @Override
    public TodoResponse getTodoById(Long id, Long userId) {
        Todo todo = todoRepository.findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));
        return mapToResponse(todo);
    }

    @Override
    public TodoResponse updateTodo(Long id, TodoRequest request, Long userId) {
        Todo todo = todoRepository.findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setStatus(request.getStatus());
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());
        todo.setUpdatedAt(LocalDateTime.now());

        Todo updatedTodo = todoRepository.save(todo);
        return mapToResponse(updatedTodo);
    }

    public void  deleteTodo(Long id, Long userId) {
        Todo todo = todoRepository.findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));
        todo.setDeleted(true);
        todo.setUpdatedAt(LocalDateTime.now());
        todoRepository.save(todo);
    }

    private TodoResponse mapToResponse(Todo todo) {
    return new TodoResponse(
            todo.getId(),
            todo.getTitle(),
            todo.getDescription(),
            todo.getStatus(),
            todo.getPriority(),
            todo.getDueDate(),
            todo.getCreatedAt()
        );
    }
}
