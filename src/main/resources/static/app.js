// API Base URL
const API_URL = ''; // Để rỗng vì Frontend được phục vụ chung host với Backend

// State Management
let savedToken = localStorage.getItem('token');
if (savedToken === 'undefined') {
    savedToken = null;
    localStorage.removeItem('token');
}
let state = {
    token: savedToken || null,
    username: localStorage.getItem('username') || null,
    todos: [],
    currentPage: 0,
    totalPages: 1,
    pageSize: 10,
    editingTaskId: null
};

// DOM Elements
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');
const authMessage = document.getElementById('authMessage');

const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const taskForm = document.getElementById('taskForm');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formMessage = document.getElementById('formMessage');

// Task Form Inputs
const taskIdInput = document.getElementById('taskId');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskPriorityInput = document.getElementById('taskPriority');
const taskStatusInput = document.getElementById('taskStatus');
const taskDueDateInput = document.getElementById('taskDueDate');
const saveTaskBtn = document.getElementById('saveTaskBtn');

// Filter & Sort inputs
const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');
const sortBy = document.getElementById('sortBy');
const sortDir = document.getElementById('sortDir');

// Loader & List
const tasksLoader = document.getElementById('tasksLoader');
const noTasksMessage = document.getElementById('noTasksMessage');
const tasksList = document.getElementById('tasksList');
const pageInfo = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

// Toast Notification
const toast = document.getElementById('toast');

// --- Helper Functions ---

// Show Toast Alert
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Format Date string from backend (ISO format) to local readable string
function formatDisplayDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format datetime-local value (YYYY-MM-DDTHH:mm) into backend format (YYYY-MM-DD HH:mm:ss)
function formatDateTimeForBackend(dateTimeStr) {
    if (!dateTimeStr) return null;
    return dateTimeStr.replace('T', ' ') + ':00';
}

// Format ISO string to datetime-local input format (YYYY-MM-DDTHH:mm)
function formatDateTimeForInput(dateTimeStr) {
    if (!dateTimeStr) return '';
    return dateTimeStr.substring(0, 16);
}

// Toggle sections based on auth state
function updateUIForAuth() {
    if (state.token) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        userDisplay.innerHTML = `<i class="fa-solid fa-circle-user"></i> Xin chào, <strong>${state.username}</strong>`;
        
        // Đặt mặc định hạn chót là ngày mai
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
        taskDueDateInput.value = tomorrow.toISOString().slice(0, 16);
        
        fetchTasks();
    } else {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        state.todos = [];
        renderTasks();
    }
}

// API headers helper
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
    };
}

// --- Event Listeners for Auth ---

// Toggle Forms
toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    authMessage.className = 'alert-message';
});

toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    authMessage.className = 'alert-message';
});

// Submit Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.className = 'alert-message';
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/api/v1/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            state.token = data.accessToken;
            state.username = username;
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('username', username);
            
            showToast('Đăng nhập thành công!');
            updateUIForAuth();
            loginForm.reset();
        } else {
            authMessage.textContent = data.message || 'Sai tên đăng nhập hoặc mật khẩu!';
            authMessage.className = 'alert-message error';
        }
    } catch (error) {
        authMessage.textContent = 'Lỗi kết nối đến server!';
        authMessage.className = 'alert-message error';
    }
});

// Submit Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.className = 'alert-message';
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/api/v1/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authMessage.textContent = 'Đăng ký thành công! Quay lại đăng nhập.';
            authMessage.className = 'alert-message success';
            registerForm.reset();
            
            setTimeout(() => {
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
                authMessage.className = 'alert-message';
            }, 1500);
        } else {
            authMessage.textContent = data.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại!';
            authMessage.className = 'alert-message error';
        }
    } catch (error) {
        authMessage.textContent = 'Lỗi kết nối đến server!';
        authMessage.className = 'alert-message error';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    state.token = null;
    state.username = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showToast('Đã đăng xuất!');
    updateUIForAuth();
});

// --- Tasks CRUD Operations ---

// Fetch tasks from server
async function fetchTasks() {
    if (!state.token) return;
    
    tasksLoader.classList.remove('hidden');
    noTasksMessage.classList.add('hidden');
    
    const sortByVal = sortBy.value;
    const sortDirVal = sortDir.value;
    
    try {
        const url = `${API_URL}/api/v1/todos?page=${state.currentPage}&size=${state.pageSize}&sortBy=${sortByVal}&sortDir=${sortDirVal}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            state.todos = data.content || [];
            state.totalPages = data.totalPages || 1;
            
            renderTasks();
            updatePagination();
        } else {
            if (response.status === 401 || response.status === 403) {
                // Token expired/invalid
                logoutBtn.click();
            } else {
                showToast('Không thể lấy danh sách công việc!', 'error');
            }
        }
    } catch (error) {
        showToast('Lỗi kết nối lấy danh sách công việc!', 'error');
    } finally {
        tasksLoader.classList.add('hidden');
    }
}

// Render tasks to HTML (with Client-side filtering)
function renderTasks() {
    tasksList.innerHTML = '';
    
    const filterStatusVal = filterStatus.value;
    const filterPriorityVal = filterPriority.value;
    
    // Client-side filtering on the fetched page contents
    const filteredTodos = state.todos.filter(todo => {
        const matchesStatus = filterStatusVal === 'ALL' || todo.status === filterStatusVal;
        const matchesPriority = filterPriorityVal === 'ALL' || todo.priority === filterPriorityVal;
        return matchesStatus && matchesPriority;
    });
    
    if (filteredTodos.length === 0) {
        noTasksMessage.classList.remove('hidden');
        return;
    }
    
    noTasksMessage.classList.add('hidden');
    
    filteredTodos.forEach(todo => {
        const priorityClass = `priority-${todo.priority.toLowerCase()}`;
        const statusClass = `status-${todo.status.toLowerCase()}`;
        const isCompleted = todo.status === 'COMPLETED';
        
        const card = document.createElement('div');
        card.className = `task-card ${priorityClass} ${statusClass}`;
        
        // Check due soon (within 24 hours) for non-completed tasks
        let dueSoonClass = '';
        if (!isCompleted && todo.dueDate) {
            const diffMs = new Date(todo.dueDate) - new Date();
            if (diffMs > 0 && diffMs < 86400000) { // ít hơn 24 giờ
                dueSoonClass = 'due-soon';
            }
        }
        
        card.innerHTML = `
            <div class="task-main">
                <div class="task-title-row">
                    <button class="task-checkbox-btn" onclick="toggleTaskStatus(${todo.id}, '${todo.status}')">
                        <i class="${isCompleted ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                    </button>
                    <span class="task-title">${todo.title}</span>
                </div>
                ${todo.description ? `<p class="task-description">${todo.description}</p>` : ''}
                <div class="task-meta">
                    <div class="meta-item badge badge-${todo.priority.toLowerCase()}">
                        <i class="fa-solid fa-circle-exclamation"></i> ${todo.priority}
                    </div>
                    <div class="meta-item badge badge-${todo.status.toLowerCase()}">
                        <i class="fa-solid fa-spinner"></i> ${todo.status}
                    </div>
                    <div class="meta-item ${dueSoonClass}">
                        <i class="fa-regular fa-clock"></i> Hạn: ${formatDisplayDate(todo.dueDate)}
                    </div>
                    <div class="meta-item">
                        <i class="fa-regular fa-calendar-plus"></i> Tạo lúc: ${formatDisplayDate(todo.createdAt)}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn edit" onclick="startEditTask(${todo.id})" title="Chỉnh sửa">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="action-btn delete" onclick="deleteTask(${todo.id})" title="Xóa">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        
        tasksList.appendChild(card);
    });
}

// Update Pagination controls state
function updatePagination() {
    pageInfo.textContent = `Trang ${state.currentPage + 1} / ${state.totalPages}`;
    prevPageBtn.disabled = state.currentPage === 0;
    nextPageBtn.disabled = state.currentPage >= state.totalPages - 1;
}

// Handle Form Submit (Create or Edit)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.className = 'alert-message';
    
    const payload = {
        title: taskTitleInput.value,
        description: taskDescriptionInput.value,
        priority: taskPriorityInput.value,
        status: taskStatusInput.value,
        dueDate: formatDateTimeForBackend(taskDueDateInput.value)
    };
    
    const isEdit = state.editingTaskId !== null;
    const url = isEdit ? `${API_URL}/api/v1/todos/${state.editingTaskId}` : `${API_URL}/api/v1/todos`;
    const method = isEdit ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(isEdit ? 'Cập nhật công việc thành công!' : 'Tạo công việc thành công!');
            resetTaskForm();
            fetchTasks();
        } else {
            formMessage.textContent = data.message || 'Có lỗi xảy ra, vui lòng thử lại!';
            formMessage.className = 'alert-message error';
        }
    } catch (error) {
        formMessage.textContent = 'Lỗi kết nối đến server!';
        formMessage.className = 'alert-message error';
    }
});

// Prepare form for editing
window.startEditTask = function(id) {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    
    state.editingTaskId = id;
    formTitle.textContent = 'Chỉnh Sửa Công Việc';
    cancelEditBtn.classList.remove('hidden');
    saveTaskBtn.innerHTML = 'Cập nhật <i class="fa-solid fa-circle-check"></i>';
    
    taskIdInput.value = todo.id;
    taskTitleInput.value = todo.title;
    taskDescriptionInput.value = todo.description || '';
    taskPriorityInput.value = todo.priority;
    taskStatusInput.value = todo.status;
    taskDueDateInput.value = formatDateTimeForInput(todo.dueDate);
    
    formMessage.className = 'alert-message';
    // Cuộn lên form nếu ở giao diện di động
    taskForm.scrollIntoView({ behavior: 'smooth' });
};

// Reset Task Form to default create mode
function resetTaskForm() {
    state.editingTaskId = null;
    formTitle.textContent = 'Tạo Công Việc Mới';
    cancelEditBtn.classList.add('hidden');
    saveTaskBtn.innerHTML = 'Lưu Công Việc <i class="fa-solid fa-floppy-disk"></i>';
    taskForm.reset();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
    taskDueDateInput.value = tomorrow.toISOString().slice(0, 16);
    
    formMessage.className = 'alert-message';
}

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetTaskForm();
});

// Delete Task (Soft Delete)
window.deleteTask = async function(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này không?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/v1/todos/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (response.ok) {
            showToast('Xóa công việc thành công!');
            fetchTasks();
        } else {
            showToast('Không thể xóa công việc!', 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối khi xóa công việc!', 'error');
    }
};

// Toggle Task Status (PENDING / IN_PROGRESS -> COMPLETED)
window.toggleTaskStatus = async function(id, currentStatus) {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    const payload = {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        status: nextStatus,
        dueDate: todo.dueDate ? todo.dueDate.replace('T', ' ').substring(0, 19) : null
    };
    
    try {
        const response = await fetch(`${API_URL}/api/v1/todos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            showToast('Đã cập nhật trạng thái công việc!');
            fetchTasks();
        } else {
            showToast('Cập nhật trạng thái thất bại!', 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối!', 'error');
    }
};

// --- Pagination, Sorting & Filtering event listeners ---

prevPageBtn.addEventListener('click', () => {
    if (state.currentPage > 0) {
        state.currentPage--;
        fetchTasks();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (state.currentPage < state.totalPages - 1) {
        state.currentPage++;
        fetchTasks();
    }
});

// Filters & Sorts change triggers fetch
filterStatus.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);

sortBy.addEventListener('change', () => {
    state.currentPage = 0;
    fetchTasks();
});

sortDir.addEventListener('change', () => {
    state.currentPage = 0;
    fetchTasks();
});

// --- Initialize App ---
updateUIForAuth();
