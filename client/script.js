// ==================== MOBILE MENU FUNCTIONS ====================
        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('overlay');
            
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // ==================== PAGE NAVIGATION FUNCTIONS ====================
        function showPage(pageId) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            document.getElementById(pageId).classList.add('active');
            updateActiveNavigation(pageId);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        function updateActiveNavigation(pageId) {
            const navLinks = document.querySelectorAll('.nav-link');
            const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            
            navLinks.forEach(link => link.classList.remove('active'));
            mobileNavLinks.forEach(link => link.classList.remove('active'));
            
            navLinks.forEach(link => {
                if (link.onclick.toString().includes(pageId)) {
                    link.classList.add('active');
                }
            });
            
            mobileNavLinks.forEach(link => {
                if (link.onclick.toString().includes(pageId)) {
                    link.classList.add('active');
                }
            });
        }

        // ==================== AUTH FUNCTIONS ====================
        function switchTab(tabName) {
            const tabs = document.querySelectorAll('.auth-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');

            const forms = document.querySelectorAll('.auth-form');
            forms.forEach(form => form.classList.remove('active'));
            
            if (tabName === 'login') {
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.getElementById('signupForm').classList.add('active');
            }
        }

        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '🙈';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        }

        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function validatePassword(password) {
            return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
        }

        function showError(inputId, message) {
            const input = document.getElementById(inputId);
            const errorMessage = input.parentElement.nextElementSibling;
            
            input.classList.add('error');
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
            
            setTimeout(() => {
                input.classList.remove('error');
                errorMessage.classList.remove('show');
            }, 3000);
        }

        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!validateEmail(email)) {
                showError('loginEmail', 'Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('loginPassword', 'Password must be at least 6 characters');
                return;
            }

            showAlert('Login successful! Welcome back to ShareCare.', 'success');
            setTimeout(() => showPage('home'), 2000);
        }

        function handleSignup(event) {
            event.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!validateEmail(email)) {
                showError('signupEmail', 'Please enter a valid email address');
                return;
            }

            if (!validatePassword(password)) {
                showError('signupPassword', 'Password must be at least 8 characters with numbers and letters');
                return;
            }

            if (password !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                return;
            }

            showAlert('Account created successfully! Welcome to ShareCare community.', 'success');
            setTimeout(() => showPage('home'), 2000);
        }

        function showForgotPassword() {
            showAlert('Password reset link will be sent to your email address.', 'info');
        }

        function loginWithGoogle() {
            showAlert('Google login integration coming soon!', 'info');
        }

        function loginWithFacebook() {
            showAlert('Facebook login integration coming soon!', 'info');
        }

        function signupWithGoogle() {
            showAlert('Google signup integration coming soon!', 'info');
        }

        function signupWithFacebook() {
            showAlert('Facebook signup integration coming soon!', 'info');
        }

        // ==================== POPUP DONATION FUNCTIONS ====================
        let popupSelectedAmount = 0;
        let popupSelectedPaymentMethod = 'upi';
        let popupSelectedCategory = '';

        function openDonatePopup(category) {
            popupSelectedCategory = category;
            const categoryTitles = {
                'education': 'Education & Learning',
                'health': 'Healthcare & Medicine', 
                'nutrition': 'Food & Nutrition',
                'shelter': 'Shelter & Clothing',
                'activities': 'Sports & Recreation',
                'emergency': 'Emergency Support'
            };
            
            const categoryIcons = {
                'education': '📚',
                'health': '🏥',
                'nutrition': '🍽️', 
                'shelter': '🏠',
                'activities': '🎨',
                'emergency': '🚨'
            };
            
            const popup = document.getElementById('donatePopup');
            const popupTitle = document.getElementById('popupTitle');
            const popupSubtitle = document.getElementById('popupSubtitle');
            
            popupTitle.textContent = `${categoryIcons[category]} Quick Donate - ${categoryTitles[category]}`;
            popupSubtitle.textContent = `Support ${categoryTitles[category].toLowerCase()} with your generous donation. Every contribution makes a real difference!`;
            
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function closeDonatePopup() {
            const popup = document.getElementById('donatePopup');
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Reset popup state
            popupSelectedAmount = 0;
            popupSelectedPaymentMethod = 'upi';
            const amounts = document.querySelectorAll('#donatePopup .quick-amount');
            amounts.forEach(a => a.classList.remove('selected'));
            const methods = document.querySelectorAll('#donatePopup .payment-method');
            methods.forEach(m => m.classList.remove('selected'));
            methods[0].classList.add('selected'); // Reset to UPI
            document.getElementById('popupCustomAmountDiv').style.display = 'none';
        }

        function selectPopupAmount(amount) {
            popupSelectedAmount = amount;
            const amounts = document.querySelectorAll('#donatePopup .quick-amount');
            amounts.forEach(a => a.classList.remove('selected'));
            event.target.classList.add('selected');
            
            // Hide custom amount div if showing
            document.getElementById('popupCustomAmountDiv').style.display = 'none';
        }

        function selectPopupCustom() {
            const amounts = document.querySelectorAll('#donatePopup .quick-amount');
            amounts.forEach(a => a.classList.remove('selected'));
            event.target.classList.add('selected');
            
            document.getElementById('popupCustomAmountDiv').style.display = 'flex';
            document.getElementById('popupCustomAmount').focus();
        }

        function confirmPopupCustomAmount() {
            const customAmount = document.getElementById('popupCustomAmount').value;
            if (customAmount && customAmount >= 100) {
                popupSelectedAmount = parseInt(customAmount);
                showAlert(`Custom amount ₹${popupSelectedAmount} selected! 💰`, 'success');
            } else {
                showAlert('Please enter a valid amount (minimum ₹100)', 'error');
            }
        }

        function selectPopupPaymentMethod(method) {
            popupSelectedPaymentMethod = method;
            const methods = document.querySelectorAll('#donatePopup .payment-method');
            methods.forEach(m => m.classList.remove('selected'));
            event.target.classList.add('selected');
        }

        function proceedToPopupDonate() {
            if (popupSelectedAmount === 0) {
                showAlert('Please select a donation amount first! 💰', 'error');
                return;
            }
            
            const categoryTitles = {
                'education': 'Education & Learning',
                'health': 'Healthcare & Medicine',
                'nutrition': 'Food & Nutrition', 
                'shelter': 'Shelter & Clothing',
                'activities': 'Sports & Recreation',
                'emergency': 'Emergency Support'
            };
            
            const message = `🎉 Processing donation of ₹${popupSelectedAmount} via ${popupSelectedPaymentMethod.toUpperCase()}!\\n\\n` +
                          `Category: ${categoryTitles[popupSelectedCategory]}\\n` +
                          `Payment: ${popupSelectedPaymentMethod.toUpperCase()}\\n\\n` +
                          `Thank you for your generosity! In a real app, this would redirect to the payment gateway.`;
            
            showAlert(message, 'success');
            closeDonatePopup();
            
            // Simulate payment processing
            setTimeout(() => {
                showAlert('🙏 Donation successful! You will receive an email receipt and tax certificate within 24 hours.', 'success');
            }, 3000);
        }


        // ==================== VOLUNTEER POPUP FUNCTIONS ====================
        let currentVolunteerStep = 1;
        let selectedVolunteerCategory = '';

        function openVolunteerPopup(category) {
            selectedVolunteerCategory = category;
            const categoryTitles = {
                'education': 'Education & Tutoring',
                'healthcare': 'Healthcare Support',
                'recreation': 'Arts & Recreation',
                'technical': 'Technical Support',
                'outreach': 'Community Outreach',
                'administrative': 'Administrative Support'
            };

            const categoryIcons = {
                'education': '📚',
                'healthcare': '🏥',
                'recreation': '🎨',
                'technical': '💻',
                'outreach': '🤝',
                'administrative': '📋'
            };

            const popup = document.getElementById('volunteerPopup');
            const popupTitle = document.getElementById('volunteerPopupTitle');
            const popupSubtitle = document.getElementById('volunteerPopupSubtitle');

            popupTitle.textContent = `${categoryIcons[category]} Volunteer for ${categoryTitles[category]}`;
            popupSubtitle.textContent = `Apply to volunteer in ${categoryTitles[category].toLowerCase()}. Your contribution will make a real difference!`;

            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetVolunteerForm();
        }

        function openGeneralVolunteerPopup() {
            selectedVolunteerCategory = 'general';
            const popup = document.getElementById('volunteerPopup');
            const popupTitle = document.getElementById('volunteerPopupTitle');
            const popupSubtitle = document.getElementById('volunteerPopupSubtitle');

            popupTitle.textContent = '🤝 General Volunteer Application';
            popupSubtitle.textContent = 'Join our volunteer community and we\'ll match you with the perfect opportunity!';

            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetVolunteerForm();
        }

        function closeVolunteerPopup() {
            const popup = document.getElementById('volunteerPopup');
            popup.classList.remove('active');
            document.body.style.overflow = '';
            resetVolunteerForm();
        }

        function resetVolunteerForm() {
            currentVolunteerStep = 1;
            document.getElementById('volunteerPopupForm').reset();
            showStep(1);
        }

        function showStep(stepNumber) {
            const steps = document.querySelectorAll('.form-step');
            const indicators = document.querySelectorAll('.step');
            const prevBtn = document.getElementById('prevStepBtn');
            const nextBtn = document.getElementById('nextStepBtn');
            const submitBtn = document.getElementById('submitBtn');

            // Hide all steps
            steps.forEach(step => step.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Show current step
            document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');
            indicators[stepNumber - 1].classList.add('active');

            // Update navigation buttons
            if (stepNumber === 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'inline-block';
                submitBtn.style.display = 'none';
            } else if (stepNumber === 3) {
                prevBtn.style.display = 'inline-block';
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-block';
            } else {
                prevBtn.style.display = 'inline-block';
                nextBtn.style.display = 'inline-block';
                submitBtn.style.display = 'none';
            }

            currentVolunteerStep = stepNumber;
        }

        function nextStep() {
            if (validateCurrentStep()) {
                if (currentVolunteerStep < 3) {
                    showStep(currentVolunteerStep + 1);
                }
            }
        }

        function previousStep() {
            if (currentVolunteerStep > 1) {
                showStep(currentVolunteerStep - 1);
            }
        }

        function validateCurrentStep() {
            const currentStepElement = document.querySelector(`[data-step="${currentVolunteerStep}"]`);
            const requiredFields = currentStepElement.querySelectorAll('[required]');

            for (let field of requiredFields) {
                if (!field.value.trim()) {
                    field.focus();
                    showAlert('Please fill in all required fields', 'error');
                    return false;
                }
            }

            // Additional validation for step 2 (days selection)
            if (currentVolunteerStep === 2) {
                const selectedDays = currentStepElement.querySelectorAll('input[name="volDays"]:checked');
                if (selectedDays.length === 0) {
                    showAlert('Please select at least one preferred day', 'error');
                    return false;
                }
            }

            return true;
        }

        function applyForJob(jobId) {
            // Map job IDs to categories
            const jobCategories = {
                'english-tutor': 'education',
                'art-coordinator': 'recreation',
                'digital-literacy': 'technical'
            };

            const category = jobCategories[jobId] || 'general';
            openVolunteerPopup(category);
        }

        // Enhanced volunteer form submission
        document.addEventListener('DOMContentLoaded', function() {
            const volunteerForm = document.getElementById('volunteerPopupForm');
            if (volunteerForm) {
                volunteerForm.addEventListener('submit', function(event) {
                    event.preventDefault();

                    if (validateCurrentStep()) {
                        const categoryTitles = {
                            'education': 'Education & Tutoring',
                            'healthcare': 'Healthcare Support',
                            'recreation': 'Arts & Recreation',
                            'technical': 'Technical Support',
                            'outreach': 'Community Outreach',
                            'administrative': 'Administrative Support',
                            'general': 'General Volunteer'
                        };

                        const categoryTitle = categoryTitles[selectedVolunteerCategory] || 'General Volunteer';

                        showAlert(`🎉 Thank you for your volunteer application for ${categoryTitle}! We will review your application and contact you within 2-3 business days with next steps.`, 'success');
                        closeVolunteerPopup();
                    }
                });
            }
        });

                // ==================== DONATION FUNCTIONS ====================
        let selectedAmount = 0;
        let selectedPaymentMethod = 'upi';
        let selectedCategory = '';

        function selectAmount(amount) {
            selectedAmount = amount;
            const amounts = document.querySelectorAll('.quick-amount');
            amounts.forEach(a => a.classList.remove('selected'));
            event.target.classList.add('selected');
            
            // Hide custom amount div if showing
            document.getElementById('customAmountDiv').style.display = 'none';
        }

        function selectCustom() {
            const amounts = document.querySelectorAll('.quick-amount');
            amounts.forEach(a => a.classList.remove('selected'));
            event.target.classList.add('selected');
            
            document.getElementById('customAmountDiv').style.display = 'flex';
            document.getElementById('customAmount').focus();
        }

        function confirmCustomAmount() {
            const customAmount = document.getElementById('customAmount').value;
            if (customAmount && customAmount >= 100) {
                selectedAmount = parseInt(customAmount);
                showAlert(`Custom amount ₹${selectedAmount} selected! 💰`, 'success');
            } else {
                showAlert('Please enter a valid amount (minimum ₹100)', 'error');
            }
        }

        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            const methods = document.querySelectorAll('.payment-method');
            methods.forEach(m => m.classList.remove('selected'));
            event.target.classList.add('selected');
        }

        function proceedToDonate() {
            if (selectedAmount === 0) {
                showAlert('Please select a donation amount first! 💰', 'error');
                return;
            }
            
            const message = `🎉 Processing donation of ₹${selectedAmount} via ${selectedPaymentMethod.toUpperCase()}!\\n\\n` +
                          `Category: ${selectedCategory || 'General Support'}\\n` +
                          `Payment: ${selectedPaymentMethod.toUpperCase()}\\n\\n` +
                          `Thank you for your generosity! In a real app, this would redirect to the payment gateway.`;
            
            showAlert(message, 'success');
            
            // Simulate payment processing
            setTimeout(() => {
                showAlert('🙏 Donation successful! You will receive an email receipt and tax certificate within 24 hours.', 'success');
            }, 3000);
        }

        function selectCategory(category) {
            selectedCategory = category;
            showAlert(`Selected category: ${category.charAt(0).toUpperCase() + category.slice(1)} 📚`, 'info');
        }

        // ==================== FORM SUBMISSION FUNCTIONS ====================
        function submitVolunteerForm(event) {
            event.preventDefault();
            showAlert('Your volunteer application has been submitted! We will review it and contact you within 3-5 business days.', 'success');
            event.target.reset();
        }

        function submitAdoptionForm(event) {
            event.preventDefault();
            showAlert('Your adoption inquiry has been received. Our counselor will contact you within 1 week to begin the process.', 'success');
            event.target.reset();
        }

        function submitContactForm(event) {
            event.preventDefault();
            showAlert('Thank you for your message! We will get back to you within 24 hours.', 'success');
            event.target.reset();
        }

        // ==================== UTILITY FUNCTIONS ====================
        function showAlert(message, type) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.innerHTML = message;
            
            const activePage = document.querySelector('.page.active');
            activePage.insertBefore(alertDiv, activePage.firstChild);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
            
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        // ==================== EVENT LISTENERS ====================
        document.addEventListener('click', function(event) {
            const mobileMenu = document.getElementById('mobileMenu');
            const hamburger = document.querySelector('.hamburger');
            
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(event.target) && 
                !hamburger.contains(event.target)) {
                toggleMobileMenu();
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            showPage('home');
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const mobileMenu = document.getElementById('mobileMenu');
                const overlay = document.getElementById('overlay');
                
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });