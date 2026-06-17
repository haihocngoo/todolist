# 📝 Hệ Thống Quản Lý Công Việc (Todo Management API) với JWT & Docker

Dự án là một hệ thống RESTful API hoàn chỉnh phục vụ việc quản lý công việc cá nhân (Todo List), hỗ trợ cơ chế xác thực người dùng bảo mật cao và cô lập dữ liệu giữa các tài khoản khác nhau. Hệ thống được đóng gói môi trường bằng Docker, sẵn sàng đưa lên môi trường thực tế (Production-Ready).

---

## 🛠️ Công Nghệ Sử Dụng

* **Backend:** Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security.
* **Xác thực (Authentication):** JSON Web Token (JWT) mã hóa phi trạng thái (Stateless), mật khẩu băm chuẩn **BCrypt**.
* **Cơ sở dữ liệu:** MySQL 8.0 độc lập trong môi trường **Docker Container**.
* **Quản lý thư viện:** Gradle.
* **Kiểm soát dữ liệu:** Jakarta Validation (Chặn và lọc dữ liệu lỗi đầu vào).
* **Frontend:** HTML5, CSS (Bootstrap 5) & JavaScript (Fetch API) tích hợp trực tiếp trong gói tĩnh của Spring Boot.

---

## ✨ Các Tính Năng Cốt Lõi

1.  **Quản lý Người dùng (User Management):** Đăng ký tài khoản mới và Đăng nhập hệ thống để nhận chuỗi mã khóa bảo mật `accessToken` (JWT).
2.  **CRUD Todo Bảo Mật:** Thêm, sửa, xóa, xem danh sách công việc. Hệ thống tự động bóc tách Token để nhận diện `userId`, đảm bảo người dùng này **không thể** xem hoặc sửa công việc của người dùng khác.
3.  **Xóa mềm (Soft Delete):** Khi xóa một công việc, hệ thống chỉ cập nhật cờ `is_deleted = true` chứ không xóa hẳn trong Database, giúp bảo toàn dữ liệu.
4.  **Phân trang & Sắp xếp động:** API lấy danh sách Todo hỗ trợ phân trang (`page`, `size`) và sắp xếp (`sortBy`, `sortDir`) giúp tối ưu hiệu năng khi dữ liệu phình to.
5.  **Quản lý lỗi tập trung (Global Exception Handler):** Bắt toàn bộ lỗi nghiệp vụ và trả về định dạng JSON đồng nhất cho phía Frontend/Client.

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án


### Bước 1: Khởi chạy Cơ sở dữ liệu bằng Docker
Mở Terminal tại thư mục chứa file `docker-compose.yml` của dự án và chạy câu lệnh ngầm:
```
docker-compose up -d
```
###Bước 2: Chạy ứng dụng Backend Spring Boot
Mở dự án bằng phần mềm IntelliJ IDEA.

Đợi Gradle tải xong các thư viện.

Tìm đến file DemoApplication.java và nhấn nút Run/Chạy (Hình tam giác xanh lá cây).

Hệ thống sẽ tự động tạo cấu trúc bảng trong MySQL Docker và kích hoạt Server tại cổng 8080.

###Bước 3: Trải nghiệm giao diện Frontend trực quan
Hệ thống giao diện đã được tích hợp sẵn tại tầng tĩnh của Server. Bạn chỉ cần mở trình duyệt web (Chrome, Edge, Firefox) và truy cập thẳng vào đường dẫn:

```
http://localhost:8080
```
###Cấu Trúc Thư Mục Dự Án Chính
todolist/
├── src/
│   └── main/
│       ├── java/com/example/demo/
│       │   ├── config/          # Cấu hình Spring Security, CORS, JWT Filter, BCrypt
│       │   ├── controller/      # Nơi tiếp nhận Request và định nghĩa Endpoint REST API
│       │   ├── dto/             # Các lớp hứng dữ liệu đầu vào (Request) và đầu ra (Response)
│       │   ├── entity/          # Ánh xạ cấu hình bảng dữ liệu (User, Todo)
│       │   ├── exception/       # Bộ xử lý và gom lỗi tập trung @RestControllerAdvice
│       │   ├── repository/      # Tầng giao tiếp truy vấn cơ sở dữ liệu MySQL
│       │   └── service/         # Nơi xử lý toàn bộ logic nghiệp vụ (Business Logic)
│       └── resources/
│           ├── static/          # Chứa file giao diện tĩnh index.html phục vụ người dùng
│           └── application.properties # Cấu hình kết nối DB, Hibernate, Port hệ thống
├── docker-compose.yml           # File cấu hình môi trường đóng gói MySQL Container
└── .gitignore                   # Cấu hình chặn các tệp tin rác của IntelliJ/Gradle khi đẩy Git
