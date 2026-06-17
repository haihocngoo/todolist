package com.example.demo.dto.request;

import com.example.demo.entity.Priority;
import com.example.demo.entity.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class TodoRequest {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    private String title;


    private String description;

    @NotNull(message = "Trạng thái công việc không được để trống")
    private Status status;

    @NotNull(message = "Mức độ ưu tiên không được để trống")
    private Priority priority;

    @NotNull(message = "Ngày hết hạn không được để trống")
    @Future(message = "Ngày hết hạn phải là một thời điểm trong tương lai")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dueDate;

    public TodoRequest() {}

    public TodoRequest(String title, String description, Status status, Priority priority, LocalDateTime dueDate) {


        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
    }


    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}
