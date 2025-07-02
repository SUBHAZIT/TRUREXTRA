 // DOM Elements
        const themeToggle = document.querySelector('.theme-toggle');
        const body = document.body;
        const loginModal = document.querySelector('.login-modal');
        const signupModal = document.querySelector('.signup-modal');
        const forgotModal = document.querySelector('.forgot-modal');
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        const getStartedBtn = document.querySelector('.get-started-btn');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const loginLinks = document.querySelectorAll('.login-link');
        const signupLinks = document.querySelectorAll('.signup-link');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('signup-confirm-password');
        const passwordStrengthBar = document.querySelector('.password-strength-bar');
        const passwordChecks = document.querySelectorAll('.password-requirement i');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const forgotForm = document.getElementById('forgot-form');
        const userAvatar = document.querySelector('.user-avatar');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        const helpBtn = document.querySelector('.help-btn');
        const logoutLink = document.querySelector('.dropdown-item.logout');
        const passwordMismatch = document.getElementById('password-mismatch');
        const completeProfileBtn = document.getElementById('complete-profile');
        const profileSection = document.querySelector('.profile-section');
        const verificationSection = document.querySelector('.verification-section');
        const forgotPasswordLinks = document.querySelectorAll('.forgot-password');
        const resetPasswordBtn = document.getElementById('reset-password-btn');
        const dashboardBtn = document.querySelector('.dashboard-btn');
        const userDropdown = document.querySelector('.user-dropdown');
        const profileEmail = document.getElementById('profile-email');
        const verificationEmail = document.getElementById('verification-email');
        const profileName = document.getElementById('profile-name');
        const verifyOtpBtn = document.getElementById('verify-otp');
        const otpInputs = document.querySelectorAll('.otp-input');
        const resendOtpLink = document.querySelector('.resend-otp');
        const userTypeSelectors = document.querySelectorAll('.user-type-selector');
        const userTypeBtns = document.querySelectorAll('.user-type-btn');
        const profilePictureInput = document.getElementById('profile-picture-input');
        const profilePicturePreview = document.getElementById('profile-picture-preview');
        const avatarInitialPreview = document.getElementById('avatar-initial-preview');
        const verificationLoading = document.querySelector('.verification-loading');
        const verificationSuccess = document.querySelector('.verification-success');
        const dashboard = document.getElementById('dashboard');
        const studentDashboard = document.getElementById('student-dashboard');
        const recruiterDashboard = document.getElementById('recruiter-dashboard');
        const mentorDashboard = document.getElementById('mentor-dashboard');
        const organizerDashboard = document.getElementById('organizer-dashboard');
        const heroSection = document.getElementById('hero');
        const featuresSection = document.getElementById('features');
        const studentName = document.getElementById('student-name');
        const recruiterName = document.getElementById('recruiter-name');
        const mentorName = document.getElementById('mentor-name');
        const organizerName = document.getElementById('organizer-name');
        const problemSolveBtns = document.querySelectorAll('.problem-solve-btn');
        const codingContainer = document.getElementById('coding-container');
        const codingCloseBtn = document.getElementById('coding-close');
        const codingTitle = document.getElementById('coding-title');
        const codingProblemTitle = document.getElementById('coding-problem-title');
        const codingProblemDifficulty = document.getElementById('coding-problem-difficulty');
        const codingProblemContent = document.getElementById('coding-problem-content');
        const codingEditor = document.getElementById('coding-editor');
        const codingRunBtn = document.getElementById('coding-run-btn');
        const codingSubmitBtn = document.getElementById('coding-submit-btn');
        const codingResult = document.getElementById('coding-result');
        const codingResultContent = document.getElementById('coding-result-content');
        const codingLanguageSelect = document.getElementById('coding-language');
        const firebaseConfig = {
            apiKey: "AIzaSyBvOkBjrvlrXgmzSxM1vExE1y6Z4RqNEkE",
            authDomain: "trurextra-demo.firebaseapp.com",
        };

        // Coding problems data
        const codingProblems = {
            'two-sum': {
                title: 'Two Sum',
                difficulty: 'easy',
                description: `
                    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                    <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                    <p>You can return the answer in any order.</p>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 1:</div>
                        <div class="coding-problem-example-content">
                            Input: nums = [2,7,11,15], target = 9
                            Output: [0,1]
                            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 2:</div>
                        <div class="coding-problem-example-content">
                            Input: nums = [3,2,4], target = 6
                            Output: [1,2]
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 3:</div>
                        <div class="coding-problem-example-content">
                            Input: nums = [3,3], target = 6
                            Output: [0,1]
                        </div>
                    </div>
                `,
                testCases: [
                    {
                        input: 'nums = [2,7,11,15], target = 9',
                        output: '[0,1]'
                    },
                    {
                        input: 'nums = [3,2,4], target = 6',
                        output: '[1,2]'
                    },
                    {
                        input: 'nums = [3,3], target = 6',
                        output: '[0,1]'
                    }
                ],
                defaultCode: {
                    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`,
                    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here`,
                    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
                    'c++': `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`
                }
            },
            'add-two-numbers': {
                title: 'Add Two Numbers',
                difficulty: 'medium',
                description: `
                    <p>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>
                    <p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 1:</div>
                        <div class="coding-problem-example-content">
                            Input: l1 = [2,4,3], l2 = [5,6,4]
                            Output: [7,0,8]
                            Explanation: 342 + 465 = 807.
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 2:</div>
                        <div class="coding-problem-example-content">
                            Input: l1 = [0], l2 = [0]
                            Output: [0]
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 3:</div>
                        <div class="coding-problem-example-content">
                            Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
                            Output: [8,9,9,9,0,0,0,1]
                        </div>
                    </div>
                `,
                testCases: [
                    {
                        input: 'l1 = [2,4,3], l2 = [5,6,4]',
                        output: '[7,0,8]'
                    },
                    {
                        input: 'l1 = [0], l2 = [0]',
                        output: '[0]'
                    },
                    {
                        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
                        output: '[8,9,9,9,0,0,0,1]'
                    }
                ],
                defaultCode: {
                    javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    // Your code here
};`,
                    python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here`,
                    java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Your code here
    }
}`,
                    'c++': `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Your code here
    }
};`
                }
            },
            'median-sorted-arrays': {
                title: 'Median of Two Sorted Arrays',
                difficulty: 'hard',
                description: `
                    <p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.</p>
                    <p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 1:</div>
                        <div class="coding-problem-example-content">
                            Input: nums1 = [1,3], nums2 = [2]
                            Output: 2.00000
                            Explanation: merged array = [1,2,3] and median is 2.
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 2:</div>
                        <div class="coding-problem-example-content">
                            Input: nums1 = [1,2], nums2 = [3,4]
                            Output: 2.50000
                            Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
                        </div>
                    </div>
                `,
                testCases: [
                    {
                        input: 'nums1 = [1,3], nums2 = [2]',
                        output: '2.00000'
                    },
                    {
                        input: 'nums1 = [1,2], nums2 = [3,4]',
                        output: '2.50000'
                    }
                ],
                defaultCode: {
                    javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // Your code here
};`,
                    python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # Your code here`,
                    java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Your code here
    }
}`,
                    'c++': `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Your code here
    }
};`
                }
            },
            'palindrome-number': {
                title: 'Palindrome Number',
                difficulty: 'easy',
                description: `
                    <p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.</p>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 1:</div>
                        <div class="coding-problem-example-content">
                            Input: x = 121
                            Output: true
                            Explanation: 121 reads as 121 from left to right and from right to left.
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 2:</div>
                        <div class="coding-problem-example-content">
                            Input: x = -121
                            Output: false
                            Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
                        </div>
                    </div>
                    
                    <div class="coding-problem-example">
                        <div class="coding-problem-example-title">Example 3:</div>
                        <div class="coding-problem-example-content">
                            Input: x = 10
                            Output: false
                            Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
                        </div>
                    </div>
                `,
                testCases: [
                    {
                        input: 'x = 121',
                        output: 'true'
                    },
                    {
                        input: 'x = -121',
                        output: 'false'
                    },
                    {
                        input: 'x = 10',
                        output: 'false'
                    }
                ],
                defaultCode: {
                    javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // Your code here
};`,
                    python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Your code here`,
                    java: `class Solution {
    public boolean isPalindrome(int x) {
        // Your code here
    }
}`,
                    'c++': `class Solution {
public:
    bool isPalindrome(int x) {
        // Your code here
    }
};`
                }
            }
        };

        // Current user state
        let currentUser = null;
        let userType = 'student';
        let profilePictureFile = null;
        let currentProblem = null;

        // Theme Toggle
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Modal Toggle
        function toggleModal(modal) {
            modal.classList.toggle('active');
            document.body.style.overflow = modal.classList.contains('active') ? 'hidden' : '';
        }

        function closeAllModals() {
            [loginModal, signupModal, forgotModal].forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }

        loginBtn.addEventListener('click', () => toggleModal(loginModal));
        signupBtn.addEventListener('click', () => toggleModal(signupModal));
        getStartedBtn.addEventListener('click', () => toggleModal(signupModal));

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                toggleModal(modal);
            });
        });

        loginLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                closeAllModals();
                toggleModal(loginModal);
            });
        });

        signupLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                closeAllModals();
                toggleModal(signupModal);
            });
        });

        // Forgot password links
        forgotPasswordLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                closeAllModals();
                toggleModal(forgotModal);
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });

        // Mobile Menu Toggle
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // User Type Selection
        userTypeSelectors.forEach(selector => {
            selector.addEventListener('click', (e) => {
                if (e.target.classList.contains('user-type-btn')) {
                    // Remove active class from all buttons in this selector
                    const buttons = selector.querySelectorAll('.user-type-btn');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    e.target.classList.add('active');
                    
                    // Update user type
                    userType = e.target.dataset.userType;
                }
            });
        });

        // Profile Picture Upload
        profilePictureInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                profilePictureFile = file;
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Remove any existing image
                    const existingImg = profilePicturePreview.querySelector('img');
                    if (existingImg) {
                        existingImg.remove();
                    }
                    
                    // Hide the initial
                    avatarInitialPreview.style.display = 'none';
                    
                    // Create and append the new image
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    profilePicturePreview.appendChild(img);
                };
                
                reader.readAsDataURL(file);
            }
        });

        // Password Strength Checker
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                const password = passwordInput.value;
                let strength = 0;
                
                // Check length
                if (password.length >= 8) {
                    strength += 1;
                    passwordChecks[0].className = 'fas fa-check requirement-met';
                } else {
                    passwordChecks[0].className = 'fas fa-check';
                }
                
                // Check for numbers
                if (/\d/.test(password)) {
                    strength += 1;
                    passwordChecks[1].className = 'fas fa-check requirement-met';
                } else {
                    passwordChecks[1].className = 'fas fa-check';
                }
                
                // Check for special chars
                if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                    strength += 1;
                    passwordChecks[2].className = 'fas fa-check requirement-met';
                } else {
                    passwordChecks[2].className = 'fas fa-check';
                }
                
                // Update strength bar
                passwordStrengthBar.className = 'password-strength-bar';
                if (strength === 1) {
                    passwordStrengthBar.classList.add('weak');
                } else if (strength === 2) {
                    passwordStrengthBar.classList.add('medium');
                } else if (strength === 3) {
                    passwordStrengthBar.classList.add('strong');
                }
            });
        }

        // Password match validation
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                passwordMismatch.style.display = 'block';
            } else {
                passwordMismatch.style.display = 'none';
            }
        });

        // Form Validation
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                // Show loading state
                const submitBtn = loginForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Logging in...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Successful login
                    currentUser = {
                        email: email,
                        name: email.split('@')[0],
                        initial: email.charAt(0).toUpperCase(),
                        type: userType
                    };
                    
                    // Update UI for logged in state
                    loginBtn.style.display = 'none';
                    signupBtn.style.display = 'none';
                    dashboardBtn.classList.add('visible');
                    userDropdown.classList.add('visible');
                    document.getElementById('avatar-initial').textContent = currentUser.initial;
                    
                    // Show dashboard and hide main content
                    dashboard.classList.add('active');
                    heroSection.style.display = 'none';
                    featuresSection.style.display = 'none';
                    
                    // Show appropriate dashboard based on user type
                    showDashboard(currentUser.type);
                    
                    // Update dashboard names
                    studentName.textContent = currentUser.name;
                    recruiterName.textContent = currentUser.name;
                    mentorName.textContent = currentUser.name;
                    organizerName.textContent = currentUser.name;
                    
                    // Close modal
                    closeAllModals();
                    
                    // Reset form
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show welcome message
                    showNotification(`Welcome back, ${currentUser.name}! (${currentUser.type})`);
                }, 1500);
            });
        }

        // Show appropriate dashboard based on user type
        function showDashboard(type) {
            // Hide all dashboards first
            studentDashboard.style.display = 'none';
            recruiterDashboard.style.display = 'none';
            mentorDashboard.style.display = 'none';
            organizerDashboard.style.display = 'none';
            
            // Show the correct dashboard
            switch(type) {
                case 'student':
                    studentDashboard.style.display = 'block';
                    break;
                case 'recruiter':
                    recruiterDashboard.style.display = 'block';
                    break;
                case 'mentor':
                    mentorDashboard.style.display = 'block';
                    break;
                case 'organizer':
                    organizerDashboard.style.display = 'block';
                    break;
                default:
                    studentDashboard.style.display = 'block';
            }
        }

        // Dashboard button click handler
        dashboardBtn.addEventListener('click', () => {
            if (currentUser) {
                // Show dashboard and hide main content
                dashboard.classList.add('active');
                heroSection.style.display = 'none';
                featuresSection.style.display = 'none';
                
                // Show appropriate dashboard
                showDashboard(currentUser.type);
            }
        });

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm-password').value;
                
                // Check password match
                if (password !== confirmPassword) {
                    passwordMismatch.style.display = 'block';
                    return;
                }
                
                // Show loading state
                const submitBtn = signupForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Creating account...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Move to next step (profile)
                    const step1 = document.querySelector('.verification-step:nth-child(1) .step-number');
                    const step2 = document.querySelector('.verification-step:nth-child(2) .step-number');
                    
                    step1.classList.remove('active');
                    step1.classList.add('completed');
                    step2.classList.add('active');
                    
                    signupForm.style.display = 'none';
                    profileSection.classList.add('active');
                    
                    // Set profile email and name
                    profileEmail.textContent = email;
                    verificationEmail.textContent = email;
                    const nameFromEmail = email.split('@')[0];
                    profileName.textContent = nameFromEmail;
                    document.getElementById('full-name').value = nameFromEmail;
                    document.getElementById('username').value = nameFromEmail.toLowerCase();
                    avatarInitialPreview.textContent = nameFromEmail.charAt(0).toUpperCase();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            });
        }

        // Complete profile
        completeProfileBtn.addEventListener('click', () => {
            const fullName = document.getElementById('full-name').value;
            const phone = document.getElementById('phone').value;
            const username = document.getElementById('username').value;
            const location = document.getElementById('location').value;
            
            if (!fullName || !phone || !username) {
                showNotification('Please fill all required fields', 'error');
                return;
            }
            
            // Show loading state
            completeProfileBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Saving profile...';
            completeProfileBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Move to verification step
                const step2 = document.querySelector('.verification-step:nth-child(2) .step-number');
                const step3 = document.querySelector('.verification-step:nth-child(3) .step-number');
                
                step2.classList.remove('active');
                step2.classList.add('completed');
                step3.classList.add('active');
                
                profileSection.classList.remove('active');
                verificationSection.classList.add('active');
                
                // Focus first OTP input
                otpInputs[0].focus();
                
                // Reset button
                completeProfileBtn.innerHTML = 'Continue to Verification';
                completeProfileBtn.disabled = false;
            }, 1000);
        });

        // OTP Input Handling
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value.length === 0) {
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
            });
        });

        // Verify OTP
        verifyOtpBtn.addEventListener('click', () => {
            const otp = Array.from(otpInputs).map(input => input.value).join('');
            
            if (otp.length !== 6) {
                showNotification('Please enter the complete 6-digit code', 'error');
                return;
            }
            
            // Show loading state
            verifyOtpBtn.style.display = 'none';
            verificationLoading.classList.add('active');
            
            // Simulate API verification
            setTimeout(() => {
                // On successful verification
                verificationLoading.classList.remove('active');
                verificationSuccess.classList.add('active');
                
                // Create user account
                const email = document.getElementById('signup-email').value;
                const fullName = document.getElementById('full-name').value;
                currentUser = {
                    email: email,
                    name: fullName,
                    username: document.getElementById('username').value,
                    phone: document.getElementById('phone').value,
                    location: document.getElementById('location').value,
                    type: userType,
                    initial: fullName.charAt(0).toUpperCase(),
                    profilePicture: profilePictureFile ? URL.createObjectURL(profilePictureFile) : null
                };
                
                // After showing success for 1.5 seconds, close modal and update UI
                setTimeout(() => {
                    // Close modal
                    closeAllModals();
                    
                    // Update UI for logged in state
                    loginBtn.style.display = 'none';
                    signupBtn.style.display = 'none';
                    dashboardBtn.classList.add('visible');
                    userDropdown.classList.add('visible');
                    document.getElementById('avatar-initial').textContent = currentUser.initial;
                    
                    // Show dashboard and hide main content
                    dashboard.classList.add('active');
                    heroSection.style.display = 'none';
                    featuresSection.style.display = 'none';
                    
                    // Show appropriate dashboard based on user type
                    showDashboard(currentUser.type);
                    
                    // Update dashboard names
                    studentName.textContent = currentUser.name;
                    recruiterName.textContent = currentUser.name;
                    mentorName.textContent = currentUser.name;
                    organizerName.textContent = currentUser.name;
                    
                    // Show success message
                    showNotification(`Welcome to TRUREXTRA, ${currentUser.name}! (${currentUser.type})`);
                    
                    // Reset signup form for next user
                    setTimeout(() => {
                        signupForm.style.display = 'block';
                        profileSection.classList.remove('active');
                        verificationSection.classList.remove('active');
                        document.querySelector('.verification-step:nth-child(1) .step-number').classList.add('active');
                        document.querySelector('.verification-step:nth-child(1) .step-number').classList.remove('completed');
                        document.querySelector('.verification-step:nth-child(2) .step-number').classList.remove('active');
                        document.querySelector('.verification-step:nth-child(2) .step-number').classList.remove('completed');
                        document.querySelector('.verification-step:nth-child(3) .step-number').classList.remove('active');
                        signupForm.reset();
                        otpInputs.forEach(input => input.value = '');
                        verifyOtpBtn.style.display = 'block';
                        verificationSuccess.classList.remove('active');
                        
                        // Reset profile picture
                        const existingImg = profilePicturePreview.querySelector('img');
                        if (existingImg) existingImg.remove();
                        avatarInitialPreview.style.display = 'flex';
                        profilePictureFile = null;
                    }, 500);
                }, 1500);
            }, 1500);
        });

        // Resend OTP
        resendOtpLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show loading state
            const originalText = resendOtpLink.innerHTML;
            resendOtpLink.innerHTML = '<i class="fas fa-spinner spinner"></i> Resending...';
            
            // Simulate API call
            setTimeout(() => {
                showNotification('New verification code sent to your email');
                resendOtpLink.innerHTML = originalText;
            }, 1000);
        });

        // Forgot password form
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('forgot-email').value;
                
                // Show loading state
                const originalText = resetPasswordBtn.innerHTML;
                resetPasswordBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Sending...';
                resetPasswordBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Show success message
                    showNotification(`Password reset link sent to ${email} (${userType})`);
                    
                                        // Reset button
                    resetPasswordBtn.innerHTML = originalText;
                    resetPasswordBtn.disabled = false;
                }, 1000);
            });
        }

        // User Dropdown
        userAvatar.addEventListener('click', () => {
            dropdownMenu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-dropdown')) {
                dropdownMenu.classList.remove('active');
            }
        });

        // Logout
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show loading state
            const originalText = logoutLink.innerHTML;
            logoutLink.innerHTML = '<i class="fas fa-spinner spinner"></i> Logging out...';
            
            // Simulate API call
            setTimeout(() => {
                // Reset user state
                currentUser = null;
                
                // Update UI for logged out state
                loginBtn.style.display = '';
                signupBtn.style.display = '';
                dashboardBtn.classList.remove('visible');
                userDropdown.classList.remove('visible');
                dropdownMenu.classList.remove('active');
                
                // Show main content and hide dashboard
                dashboard.classList.remove('active');
                heroSection.style.display = '';
                featuresSection.style.display = '';
                
                // Show logout message
                showNotification('You have been logged out successfully');
                
                // Reset button
                logoutLink.innerHTML = originalText;
            }, 800);
        });

        // Help Button
        helpBtn.addEventListener('click', () => {
            showNotification('Help center is coming soon!');
        });

        // Problem Solve Buttons
        problemSolveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const problemId = btn.dataset.problem;
                currentProblem = codingProblems[problemId];
                
                if (currentProblem) {
                    // Update coding editor with problem details
                    codingTitle.textContent = currentProblem.title;
                    codingProblemTitle.textContent = currentProblem.title;
                    codingProblemDifficulty.textContent = currentProblem.difficulty.charAt(0).toUpperCase() + currentProblem.difficulty.slice(1);
                    codingProblemDifficulty.className = `coding-problem-difficulty ${currentProblem.difficulty}`;
                    codingProblemContent.innerHTML = currentProblem.description;
                    
                    // Set default code based on selected language
                    codingEditor.innerHTML = currentProblem.defaultCode.javascript;
                    
                    // Show coding editor
                    codingContainer.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close coding editor
        codingCloseBtn.addEventListener('click', () => {
            codingContainer.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Run code
        codingRunBtn.addEventListener('click', () => {
            codingResult.style.display = 'block';
            
            // Show loading state
            codingResultContent.innerHTML = '<i class="fas fa-spinner spinner"></i> Running your code...';
            
            // Simulate code execution
            setTimeout(() => {
                // Show test case results
                let resultHtml = '<div class="coding-result-title">Test Case Results</div>';
                
                currentProblem.testCases.forEach((testCase, index) => {
                    const passed = Math.random() > 0.3; // Random pass/fail for demo
                    
                    resultHtml += `
                        <div class="coding-test-case">
                            <div class="coding-test-case-input">
                                <strong>Test Case ${index + 1}:</strong> ${testCase.input}
                            </div>
                            <div class="coding-test-case-output">
                                <strong>Expected:</strong> ${testCase.output}
                            </div>
                            <div class="coding-test-case-output ${passed ? 'coding-result-success' : 'coding-result-error'}">
                                <strong>Result:</strong> ${passed ? 'Passed' : 'Failed'}
                            </div>
                        </div>
                    `;
                });
                
                codingResultContent.innerHTML = resultHtml;
            }, 1500);
        });

        // Submit code
        codingSubmitBtn.addEventListener('click', () => {
            codingResult.style.display = 'block';
            
            // Show loading state
            codingResultContent.innerHTML = '<i class="fas fa-spinner spinner"></i> Submitting your solution...';
            
            // Simulate submission
            setTimeout(() => {
                const passedAll = Math.random() > 0.5; // Random pass/fail for demo
                
                if (passedAll) {
                    codingResultContent.innerHTML = `
                        <div class="coding-result-title">Submission Results</div>
                        <div class="coding-result-success">
                            <i class="fas fa-check-circle"></i> All test cases passed!
                        </div>
                        <div style="margin-top: 1rem;">
                            Your solution has been accepted. Great job!
                        </div>
                    `;
                    showNotification('Problem solved successfully!', 'success');
                } else {
                    codingResultContent.innerHTML = `
                        <div class="coding-result-title">Submission Results</div>
                        <div class="coding-result-error">
                            <i class="fas fa-times-circle"></i> Some test cases failed
                        </div>
                        <div style="margin-top: 1rem;">
                            Try again! Check your solution against the failed test cases.
                        </div>
                    `;
                    showNotification('Some test cases failed', 'error');
                }
            }, 2000);
        });

        // Language selector
        codingLanguageSelect.addEventListener('change', function() {
            if (currentProblem) {
                codingEditor.innerHTML = currentProblem.defaultCode[this.value] || currentProblem.defaultCode.javascript;
            }
        });

        // Notification function
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${message}
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                
                // Remove after animation
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        // Initialize UI based on user state
        function initUI() {
            if (currentUser) {
                loginBtn.style.display = 'none';
                signupBtn.style.display = 'none';
                dashboardBtn.classList.add('visible');
                userDropdown.classList.add('visible');
                document.getElementById('avatar-initial').textContent = currentUser.initial;
                
                // Show dashboard and hide main content
                dashboard.classList.add('active');
                heroSection.style.display = 'none';
                featuresSection.style.display = 'none';
                
                // Show appropriate dashboard
                showDashboard(currentUser.type);
            } else {
                loginBtn.style.display = '';
                signupBtn.style.display = '';
                dashboardBtn.classList.remove('visible');
                userDropdown.classList.remove('visible');
                
                // Show main content
                dashboard.classList.remove('active');
                heroSection.style.display = '';
                featuresSection.style.display = '';
            }
        }


        // Initialize the UI
        initUI();

