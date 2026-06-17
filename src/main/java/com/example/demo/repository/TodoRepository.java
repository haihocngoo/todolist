package com.example.demo.repository;

import com.example.demo.entity.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    Page<Todo> findByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);

    java.util.Optional<Todo> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);
}
