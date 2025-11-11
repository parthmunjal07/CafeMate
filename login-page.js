// ============================================
// UPDATED LOGIN PAGE JAVASCRIPT CODE
// Replace the existing JavaScript in login_page.html with this code
// ============================================

let currentRole = null;
let passwordVisible = false;

// Role Selection
function selectRole(role) {
    currentRole = role;
    
    // Update UI
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => card.classList.remove('selected'));
    event.target.closest('.role-card').classList.add('selected');

    // Show form after a brief delay
    setTimeout(() => {
        showLoginForm();
    }, 300);
}

// Show Login Form
function showLoginForm() {
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('loginFormContainer').classList.add('active');

    // Update form based on role
    if (currentRole === 'student') {
        document.getElementById('formHeaderIcon').textContent = '🎓';
        document.getElementById('formTitle').textContent = 'Student Login';
        document.getElementById('userIdLabel').textContent = 'Roll Number';
        document.getElementById('userIdInfo').textContent = 'E.g., CSE2024001';
        document.getElementById('userIdPrefix').textContent = 'CSE';
        document.getElementById('userId').placeholder = 'Enter your roll number';
        document.getElementById('emailLabel').textContent = 'Email Address';
    } else if (currentRole === 'admin') {
        document.getElementById('formHeaderIcon').textContent = '👔';
        document.getElementById('formTitle').textContent = 'Admin Login';
        document.getElementById('userIdLabel').textContent = 'Employee ID';
        document.getElementById('userIdInfo').textContent = 'E.g., EMP001234';
        document.getElementById('userIdPrefix').textContent = 'EMP';
        document.getElementById('userId').placeholder = 'Enter your employee ID';
        document.getElementById('emailLabel').textContent = 'Employee Email';
    }

    // Clear form
    document.getElementById('loginForm').reset();
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('successMessage').classList.remove('show');
}

// Go Back
function goBack() {
    document.getElementById('loginFormContainer').classList.remove('active');
    document.getElementById('roleSelection').style.display = 'flex';
    currentRole = null;

    // Reset role card selection
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => card.classList.remove('selected'));
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    passwordVisible = !passwordVisible;
    const passwordInput = document.getElementById('userPassword');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (passwordVisible) {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const userPassword = document.getElementById('userPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    // Reset messages
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    // Validation
    if (!userId) {
        showError(errorDiv, currentRole === 'student' ? 'Please enter your roll number' : 'Please enter your employee ID');
        return;
    }

    if (!userEmail) {
        showError(errorDiv, 'Please enter your email address');
        return;
    }

    if (!userPassword) {
        showError(errorDiv, 'Please enter your password');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        showError(errorDiv, 'Please enter a valid email address');
        return;
    }

    // Simulate loading
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.classList.add('loading');
    loginBtn.innerHTML = '<span class="spinner"></span> Logging in...';

    // Simulate API call (2 second delay)
    setTimeout(() => {
        loginBtn.classList.remove('loading');
        loginBtn.textContent = originalText;

        // Mock authentication (replace with real API call)
        if (validateCredentials(userId, userEmail, userPassword)) {
            // Save login data if remember me is checked
            if (rememberMe) {
                localStorage.setItem('canteenUser', JSON.stringify({
                    role: currentRole,
                    userId: userId,
                    userEmail: userEmail
                }));
            }

            showSuccess(successDiv, 'Login successful! Redirecting...');

            // Store current user in session
            sessionStorage.setItem('currentUser', JSON.stringify({
                role: currentRole,
                userId: userId,
                userEmail: userEmail,
                loginTime: new Date().toISOString()
            }));

            // Redirect based on role after 1.5 seconds
            setTimeout(() => {
                if (currentRole === 'student') {
                    window.location.href = './student-page.html';
                } else if (currentRole === 'admin') {
                    window.location.href = './admin-page.html';
                }
            }, 500);
        } else {
            showError(errorDiv, 'Invalid credentials. Please try again.');
        }
    }, 1000);
}

// Mock validation function (replace with real API validation)
function validateCredentials(userId, userEmail, userPassword) {
    // Mock database of users
    const mockUsers = {
        student: [
            { userId: 'CSE2024001', email: 'student@example.com', password: 'pass123' },
            { userId: 'CSE2024002', email: 'john@example.com', password: 'password123' }
        ],
        admin: [
            { userId: 'EMP001234', email: 'admin@canteen.com', password: 'admin123' },
            { userId: 'EMP001235', email: 'manager@canteen.com', password: 'manager123' }
        ]
    };

    const users = mockUsers[currentRole] || [];
    return users.some(user => 
        user.userId === userId && 
        user.email === userEmail && 
        user.password === userPassword
    );
}

// Show Error Message
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show Success Message
function showSuccess(element, message) {
    element.textContent = message;
    element.classList.add('show');
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Placeholder functions for links
function showSignup() {
    alert('Sign up page would be shown here');
}

function showForgotPassword() {
    alert('Forgot password page would be shown here');
}

// Auto-fill if user was previously logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('canteenUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        // Could auto-login or pre-fill form here
        console.log('Previously logged in user:', user.userId);
    }
});
