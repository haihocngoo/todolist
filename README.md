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
## 📂 Cấu Trúc Thư Mục Dự Án Chính

Dưới đây là sơ đồ tổ chức mã nguồn của hệ thống Backend Spring Boot theo mô hình chuẩn hướng đối tượng và phân tách tầng xử lý:

```text
todolist/
├── .gradle/                     # Thư mục cấu hình tự sinh của Gradle (Đã chặn đẩy Git)
├── .idea/                       # Thư mục cấu hình không gian làm việc của IntelliJ (Đã chặn đẩy Git)
├── build/                       # File mã nguồn sau khi biên dịch (Đã chặn đẩy Git)
├── gradle/                      # Thư mục chứa gói wrapper để đồng bộ phiên bản Gradle
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── config/          # Cấu hình hệ thống (Spring Security, cấu hình CORS, JWT Filter, BCrypt)
│   │   │   ├── controller/      # Tầng tiếp nhận Request từ Client và định nghĩa các Endpoint RESTful API
│   │   │   ├── dto/             # Các lớp trung chuyển dữ liệu (Request hứng data đầu vào, Response trả data đầu ra)
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── LoginResponse.java
│   │   │   ├── entity/          # Các lớp ánh xạ trực tiếp xuống cấu trúc bảng trong Cơ sở dữ liệu (User, Todo)
│   │   │   ├── exception/       # Bộ xử lý và gom lỗi tập trung của hệ thống sử dụng @RestControllerAdvice
│   │   │   ├── repository/      # Tầng giao tiếp và thực thi các câu lệnh truy vấn xuống MySQL (Spring Data JPA)
│   │   │   ├── security/        # Các lớp bổ trợ bảo mật (JwtTokenProvider xử lý tạo/mã hóa mã token)
│   │   │   │   └── JwtTokenProvider.java
│   │   │   ├── service/         # Tầng xử lý toàn bộ logic nghiệp vụ (Business Logic) chính của dự án
│   │   │   └── DemoApplication.java # File chạy chính khởi động toàn bộ ứng dụng Spring Boot
│   │   └── resources/
│   │       ├── static/          # Chứa các tài nguyên tĩnh phục vụ giao diện người dùng hiển thị trên trình duyệt
│   │       │   └── index.html   # File giao diện Frontend (HTML, CSS Bootstrap, JS Fetch API)
│   │       ├── templates/       # Thư mục chứa các mẫu giao diện render phía Server (nếu có)
│   │       └── application.properties # File cấu hình kết nối DB MySQL, cấu hình Hibernate, Port chạy mạng
│   └── test/                    # Thư mục chứa các kịch bản kiểm thử mã nguồn (Unit Test / Integration Test)
│       └── java/com/example/demo/
│           └── DemoApplicationTests.java
├── .gitattributes               # File cấu hình thuộc tính của hệ thống Git
├── .gitignore                   # File định nghĩa danh sách các tệp tin rác cần bỏ qua, không đẩy lên GitHub
├── build.gradle                 # File cấu hình chính quản lý thư viện và phiên bản của dự án Gradle
├── docker-compose.yml           # File định nghĩa cấu hình môi trường đóng gói container độc lập cho MySQL 8.0
├── gradlew                      # File thực thi Gradle trên môi trường Linux/macOS
├── gradlew.bat                  # File thực thi Gradle trên môi trường Windows
├── HELP.md                      # File hướng dẫn mặc định do Spring Initializr tự sinh ban đầu
├── README.md                    # File tài liệu hướng dẫn chạy dự án bằng Tiếng Việt (chính là file này)
└── settings.gradle              # File khai báo tên dự án để Gradle quản lý cấu trúc biên dịch
