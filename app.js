document.addEventListener('DOMContentLoaded', function() {
    // Timer functionality
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');
    
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksContainer = document.getElementById('tasks-container');
    const taskModal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskInput = document.getElementById('task-input');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');
    const aboutLink = document.querySelector('a[href="#about-section"]');
    const themeToggle = document.getElementById('theme-toggle');
    
    const deleteModal = document.getElementById('delete-modal');
    const deleteCancelBtn = document.getElementById('delete-cancel');
    const deleteConfirmBtn = document.getElementById('delete-confirm');

    const remove30sBtn = document.getElementById('remove-30s');
    const remove4mBtn = document.getElementById('remove-4m');

    let taskToDelete = null;


    // Activity tracking variables
    let totalPomodoros = 0;
    let completedTasks = 0;
    let totalTimeInMinutes = 0;
    
    // Get modal elements
    const activityModal = document.getElementById('activity-modal');
    const activityCloseBtn = document.getElementById('activity-close-btn');
    const activityLink = document.querySelectorAll('.nav-links a')[1]; // Activity link
    
    const signInModal = document.getElementById('signin-modal');
    const signInCloseBtn = document.getElementById('signin-close-btn');
    const signInLink = document.querySelectorAll('.nav-links a')[2]; // Sign In link
    const loginLink = document.querySelector('.login-link');

    // MODAL FOR SETTINGS
    const settingsModal = document.getElementById('settings-modal');
    const gearBtn = document.getElementById('gear-btn');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    const settingsCancelBtn = document.getElementById('settings-cancel');
    const settingsSaveBtn = document.getElementById('settings-save');
    const pomodoroDurationInput = document.getElementById('pomodoro-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
        
    let timerId;
    let isRunning = false;
    let currentEditTask = null;
    let draggedItem = null;

    let modes = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60
    };

    let currentMode = 'pomodoro';
    let timeLeft = modes.pomodoro;
    
    // MODALS FOR BOTH COMPLETION AND BREAKTIMES
    const completionModal = document.getElementById('completion-modal');
    const continueBtn = document.getElementById('continue-btn');
    const breakCompletionModal = document.getElementById('break-completion-modal');
    const breakCompletionMessage = document.getElementById('break-completion-message');
    const backToWorkBtn = document.getElementById('back-to-work-btn');

        

    // Initialize timer display
    updateTimerDisplay();
    
    // Mode button functionality
    function setMode(mode) {
        currentMode = mode;
        
        // Update active button styling
        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');
        
        if (mode === 'pomodoro') {
            pomodoroBtn.classList.add('active');
            timeLeft = modes.pomodoro;
        } else if (mode === 'shortBreak') {
            shortBreakBtn.classList.add('active');
            timeLeft = modes.shortBreak;
        } else if (mode === 'longBreak') {
            longBreakBtn.classList.add('active');
            timeLeft = modes.longBreak;
        }
        
        // Reset timer when changing modes
        clearInterval(timerId);
        isRunning = false;
        updateButtonStates('reset');
        updateTimerDisplay();
    }

    function openSettingsModal() {
    // Set current values in the inputs
    pomodoroDurationInput.value = modes.pomodoro / 60;
    shortBreakDurationInput.value = modes.shortBreak / 60;
    longBreakDurationInput.value = modes.longBreak / 60;
    
    settingsModal.classList.add('active');
    }

    function closeSettingsModal() {
    settingsModal.classList.remove('active');
    }

    // Save settings
    function saveSettings() {
        // Update the modes with new values (convert minutes to seconds)
        modes.pomodoro = parseInt(pomodoroDurationInput.value) * 60;
        modes.shortBreak = parseInt(shortBreakDurationInput.value) * 60;
        modes.longBreak = parseInt(longBreakDurationInput.value) * 60;
        
        // Update the current timer if needed
        if (currentMode === 'pomodoro') {
            timeLeft = modes.pomodoro;
        } else if (currentMode === 'shortBreak') {
            timeLeft = modes.shortBreak;
        } else if (currentMode === 'longBreak') {
            timeLeft = modes.longBreak;
        }
        
        updateTimerDisplay();
        closeSettingsModal();
        
        // Save to localStorage
        localStorage.setItem('timerSettings', JSON.stringify(modes));
    }
    

    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('timerSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            modes.pomodoro = settings.pomodoro || 25 * 60;
            modes.shortBreak = settings.shortBreak || 5 * 60;
            modes.longBreak = settings.longBreak || 15 * 60;
        }
        
        // Update current timeLeft based on mode
        if (currentMode === 'pomodoro') {
            timeLeft = modes.pomodoro;
        } else if (currentMode === 'shortBreak') {
            timeLeft = modes.shortBreak;
        } else if (currentMode === 'longBreak') {
            timeLeft = modes.longBreak;
        }
        
        updateTimerDisplay();
    }

    // Event listeners for settings modal
    gearBtn.addEventListener('click', openSettingsModal);
    settingsCloseBtn.addEventListener('click', closeSettingsModal);
    settingsCancelBtn.addEventListener('click', closeSettingsModal);
    settingsSaveBtn.addEventListener('click', saveSettings);

    // Close modal when clicking outside
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });

    // Load settings when page loads
    document.addEventListener('DOMContentLoaded', function() {
        loadSettings();
    });


    // Mode button event listeners
    pomodoroBtn.addEventListener('click', function() {
        setMode('pomodoro');
    });
    
    shortBreakBtn.addEventListener('click', function() {
        setMode('shortBreak');
    });
    
    longBreakBtn.addEventListener('click', function() {
        setMode('longBreak');
    });
    
    // Initialize button states
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Update page title to include timer
    function updatePageTitle(timeString) {
        document.title = `${timeString} - Pomodoro Timer`;
    }
    
    // Theme toggle
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    });
    
    // Timer functionality
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = timeString;
        updatePageTitle(timeString);
    }
    
    function updateButtonStates(state) {
        if (state === 'running') {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
        } else if (state === 'paused') {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
        } else if (state === 'reset') {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
        }
    }
    
    // Update activity statistics
    function updateActivityStats() {
        document.getElementById('total-pomodoros').textContent = totalPomodoros;
        document.getElementById('completed-tasks').textContent = completedTasks;
        
        // Convert minutes to hours and minutes format
        const hours = Math.floor(totalTimeInMinutes / 60);
        const minutes = totalTimeInMinutes % 60;
        document.getElementById('total-time').textContent = `${hours}h ${minutes}m`;
    }
    
    function openBreakCompletionModal(breakType) {
        if (breakType === 'short') {
            breakCompletionMessage.textContent = "Your short break has ended. Ready for another Pomodoro?";
            playSFX('sfx-done');
        } else {
            breakCompletionMessage.textContent = "Your long break has ended. Time to get back to work!";
            playSFX('sfx-done');
        }
        breakCompletionModal.classList.add('active');
    }

    // Function to close break completion modal
    function closeBreakCompletionModal() {
        breakCompletionModal.classList.remove('active');
    }

    // Back to work button handler
    backToWorkBtn.addEventListener('click', function() {
        closeBreakCompletionModal();
        setMode('pomodoro');
    });

    // Function to open completion modal
    function openCompletionModal() {
        completionModal.classList.add('active');
    }

    // Function to close completion modal
    function closeCompletionModal() {
        completionModal.classList.remove('active');
    }

    // Continue button handler
    continueBtn.addEventListener('click', function() {
        closeCompletionModal();
        const completedPomodoros = parseInt(document.getElementById('total-pomodoros').textContent);
        
        // Every 4 pomodoros, take a long break instead
        if (completedPomodoros % 4 === 0) {
            setMode('longBreak');
        } else {
            setMode('shortBreak');
        }
    });

    startBtn.addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            updateButtonStates('running');
            timerId = setInterval(function() {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {

                    clearInterval(timerId);
                    isRunning = false;
                    
                    // Timer completed logic
                    if (currentMode === 'pomodoro') {
                        incrementPomodoro();
                        openCompletionModal();
                        playSFX('sfx-done');
                    } else if (currentMode === 'shortBreak') {
                        openBreakCompletionModal('short');
                    } else if (currentMode === 'longBreak') {
                        openBreakCompletionModal('long');
                    }
                }
            }, 1000);
        }
    });

    // Close modal when clicking outside
    breakCompletionModal.addEventListener('click', function(e) {
        if (e.target === breakCompletionModal) {
            closeBreakCompletionModal();
        }
    });

    completionModal.addEventListener('click', function(e) {
    if (e.target === completionModal) {
        closeCompletionModal();
    }
    });
    
    pauseBtn.addEventListener('click', function() {
        if (isRunning) {
            clearInterval(timerId);
            isRunning = false;
            updateButtonStates('paused');
        }
    });
    
    resetBtn.addEventListener('click', function() {
        clearInterval(timerId);
        isRunning = false;
        timeLeft = 25 * 60;
        updateTimerDisplay();
        updateButtonStates('reset');
    });
    
    // Activity tracking functions
    function incrementPomodoro() {
        totalPomodoros++;
        totalTimeInMinutes += 25; // Add 25 minutes for each pomodoro
        updateActivityStats();
    }
    
    function incrementCompletedTask() {
        completedTasks++;
        playSFX('sfx-task');
        updateActivityStats();
    }
    
    // Task modal functions
    function openTaskModal(type, task = null) {
        if (type === 'add') {
            modalTitle.textContent = 'Add New Task';
            modalConfirm.textContent = 'Confirm';
            taskInput.value = '';
            modalConfirm.classList.add('modal-incomp');
            modalConfirm.classList.remove('modal-confirm');
            console.log("Let's make a task!");
        } else if (type === 'edit') {
            modalTitle.textContent = 'Edit Task';
            modalConfirm.textContent = 'Update';
            taskInput.value = task.querySelector('.task-text').textContent;
            currentEditTask = task;
            modalConfirm.classList.remove('modal-incomp');
            modalConfirm.classList.add('modal-confirm');
        }
        
        taskModal.classList.add('active');
        taskInput.focus();
    }

    // Update modal button state based on task input value
    taskInput.addEventListener('input', function() {
        if (taskInput.value.trim() === '') {
            modalConfirm.classList.add('modal-incomp');
            modalConfirm.classList.remove('modal-confirm');
        } else {
            modalConfirm.classList.remove('modal-incomp');
            modalConfirm.classList.add('modal-confirm');
        }
    });
    function closeTaskModal() {
        taskModal.classList.remove('active');
        currentEditTask = null;
    }
    
    // Add task button click
    addTaskBtn.addEventListener('click', function() {
        openTaskModal('add');
    });
    
    // Modal confirm button
    function confirmTask() 
    {
        const taskText = taskInput.value.trim();
        if (taskText) {
            if (currentEditTask) {
                // Update existing task
                currentEditTask.querySelector('.task-text').textContent = taskText;
            } else {
                // Create new task
                const taskItem = createTaskItem(taskText);
                tasksContainer.appendChild(taskItem);
                setupTaskDragging(taskItem);
            }
            closeTaskModal();
        }
    }
    // Modal confirm button by using the ENTER key
    modalConfirm.addEventListener('click', confirmTask);
    taskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            confirmTask();
        }
    });

    
    
    // Modal cancel button
    modalCancel.addEventListener('click', closeTaskModal);
    
    // Close modal when clicking outside
    taskModal.addEventListener('click', function(e) {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
    
    // Handle escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && taskModal.classList.contains('active')) {
            closeTaskModal();
        }
    });
    
    // Create a new task item with custom checkbox
    function createTaskItem(text) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('draggable', 'true');
        
        taskItem.innerHTML = `
            <div class="task-check">
                <label class="custom-checkbox">
                    <input type="checkbox" class="task-checkbox">
                    <span class="checkmark"></span>
                </label>
                <span class="task-text">${text}</span>
            </div>
            <div class="task-options">⋮
                <div class="context-menu">
                    <div class="context-menu-item edit-task">Edit Task</div>
                    <div class="context-menu-item delete-task">Delete Task</div>
                </div>
            </div>
        `;
        
        // Setup checkbox functionality for the new task
        setupCheckboxHandler(taskItem);
        return taskItem;
    }
    
    function setupCheckboxHandler(taskItem) {
        const checkbox = taskItem.querySelector('.task-checkbox');
        const checkmark = taskItem.querySelector('.checkmark');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                taskItem.classList.add('completed');
                // Ensure checkmark stays at full opacity
                checkmark.style.opacity = "1";
                // Move completed task to bottom
                tasksContainer.appendChild(taskItem);
                // Only increment if this is a new completion (not when loading from storage)
                if (!taskItem.dataset.loadedCompleted) {
                    incrementCompletedTask();
                }
            } else {
                taskItem.classList.remove('completed');
                // If unchecking, decrement the count (optional)
                if (taskItem.dataset.loadedCompleted) {
                    completedTasks = Math.max(0, completedTasks - 1);
                    updateActivityStats();
                }
            }
            
            // Clear the loaded flag after first interaction
            taskItem.dataset.loadedCompleted = false;
            
            // Save task states
            saveTaskStates();
        });
    }
    // Save task states to localStorage
    function saveTaskStates() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const taskText = taskItem.querySelector('.task-text').textContent;
            const isCompleted = taskItem.classList.contains('completed');
            
            tasks.push({
                text: taskText,
                completed: isCompleted
            });
        });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Load tasks from localStorage
    function loadTaskStates() {
        const savedTasks = localStorage.getItem('tasks');
        
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            
            tasks.forEach(task => {
                const taskItem = createTaskItem(task.text);
                tasksContainer.appendChild(taskItem);
                
                if (task.completed) {
                    const checkbox = taskItem.querySelector('.task-checkbox');
                    checkbox.checked = true;
                    taskItem.classList.add('completed');
                    // Mark as loaded from storage to prevent double-counting
                    taskItem.dataset.loadedCompleted = true;
                }
                
                setupTaskDragging(taskItem);
            });
        }
    }

    // Initialize task states from localStorage
    loadTaskStates();
    
    // Apply checkbox functionality to existing tasks
    function initializeExistingCheckboxes() {
        document.querySelectorAll('.task-item').forEach(taskItem => {
            setupCheckboxHandler(taskItem);
        });
    }
    
    // Initialize existing checkboxes
    initializeExistingCheckboxes();
    
    // Fixed context menu for tasks
    document.addEventListener('click', function(e) {
        
    // If clicked on task options (the three dots)
    if (e.target.closest('.task-options')) {
        e.stopPropagation();
        const taskOptions = e.target.closest('.task-options');
        const contextMenu = taskOptions.querySelector('.context-menu');
        
        if (contextMenu) {
            // Toggle the menu - if it's visible, hide it; if hidden, show it
            if (contextMenu.style.display === 'block') {
                contextMenu.style.display = 'none';
            } else {
                // First close all other menus
                document.querySelectorAll('.context-menu').forEach(menu => {
                    menu.style.display = 'none';
                });

                contextMenu.style.display = 'block';

                // Position the menu relative to the viewport to prevent scrolling issues
                const menuRect = contextMenu.getBoundingClientRect();
                const taskOptionsRect = taskOptions.getBoundingClientRect();

                contextMenu.style.position = 'fixed';
                contextMenu.style.top = `${taskOptionsRect.bottom}px`;
                contextMenu.style.left = `${taskOptionsRect.left}px`;

                // Check if menu goes off-screen horizontally and adjust if needed
                if (menuRect.right > window.innerWidth) {
                    contextMenu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
                }

                // Check if menu goes off-screen vertically and adjust if needed
                if (menuRect.bottom > window.innerHeight) {
                    contextMenu.style.top = `${taskOptionsRect.top - menuRect.height}px`;
                }
            }
        }
        return;
    }
        
        // Close all context menus when clicking elsewhere
        document.querySelectorAll('.context-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
    
    // Handle task actions (edit/delete) 
    tasksContainer.addEventListener('click', function(e) {
        // Handle context menu actions
        if (e.target.classList.contains('edit-task')) {
            const taskItem = e.target.closest('.task-item');
            openTaskModal('edit', taskItem);
        }
        
        if (e.target.classList.contains('delete-task')) {
            taskToDelete = e.target.closest('.task-item');
            openDeleteModal();
        }
    });

    // Add these new functions for delete modal handling
    function openDeleteModal() {
        deleteModal.classList.add('active');
    }


    function closeDeleteModal() {
        deleteModal.classList.remove('active');
        taskToDelete = null;
    }

    function confirmDelete() {
        if (taskToDelete) {
            taskToDelete.remove();
            saveTaskStates(); // Save changes after deletion
            
            // If the task was completed, decrement the count
            if (taskToDelete.classList.contains('completed')) {
                completedTasks = Math.max(0, completedTasks - 1);
                updateActivityStats();
            }
        }
        closeDeleteModal();
    }

    // Event listeners for delete modal
    deleteCancelBtn.addEventListener('click', closeDeleteModal);
    deleteConfirmBtn.addEventListener('click', confirmDelete);

    // Close modal when clicking outside
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Handle enter key to delete modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && deleteModal.classList.contains('active')) {
            confirmDelete();
        }
    });
        
    // Language selector with flags (updated version)
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            const flagImg = this.querySelector('.language-flag').cloneNode(true);
            const selectedFlag = document.getElementById('selected-flag');
            
            // Update flag and text
            selectedFlag.src = flagImg.src;
            document.querySelector('.language-display span').textContent = lang.toUpperCase();
            
            // Call the language update function from translations.js
            updateLanguage(lang);
        });
    });

    // Initialize language on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Check if there's a saved language preference
        const savedLanguage = localStorage.getItem('language') || 'en';
        updateLanguage(savedLanguage);
        
        // Update the language selector display
        const savedLangOption = document.querySelector(`.language-option[data-lang="${savedLanguage}"]`);
        if (savedLangOption) {
            const flagImg = savedLangOption.querySelector('.language-flag');
            document.getElementById('selected-flag').src = flagImg.src;
            document.querySelector('.language-display span').textContent = savedLanguage.toUpperCase();
        }
    });
    
    // Smooth scroll to about section
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Task drag and drop functionality
    function setupTaskDragging(taskItem) {
        taskItem.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });
        
        taskItem.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
            saveTaskStates(); // Save task order after drag and drop
        });
    }
    
    // Setup initial tasks for dragging
    document.querySelectorAll('.task-item').forEach(task => {
        setupTaskDragging(task);
    });
    
    // Handle drop target
    tasksContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(this, e.clientY);
        if (draggedItem) {
            if (afterElement) {
                this.insertBefore(draggedItem, afterElement);
            } else {
                this.appendChild(draggedItem);
            }
        }
    });
    
    // Helper function to determine where to place the dragged item
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Activity Modal Functions
    function openActivityModal() {
        updateActivityStats();
        activityModal.classList.add('active');
    }
    
    function closeActivityModal() {
        activityModal.classList.remove('active');
    }
    
    // Sign In Modal Functions
    function openSignInModal() {
        signInModal.classList.add('active');
    }
    
    function closeSignInModal() {
        signInModal.classList.remove('active');
    }
    
    // Activity link click event
    activityLink.addEventListener('click', function(e) {
        e.preventDefault();
        openActivityModal();
    });
    
    // Sign In link click event
    signInLink.addEventListener('click', function(e) {
        e.preventDefault();
        openSignInModal();
    });
    
    // Activity modal close events
    activityModal.addEventListener('click', function(e) {
        if (e.target === activityModal) {
            closeActivityModal();
        }
    });
    
    activityCloseBtn.addEventListener('click', closeActivityModal);
    
    // Sign In modal close events
    signInModal.addEventListener('click', function(e) {
        if (e.target === signInModal) {
            closeSignInModal();
        }
    });
    
    signInCloseBtn.addEventListener('click', closeSignInModal);
    
    // Toggle between login and signup forms
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        const signinTitle = document.querySelector('.signin-title');
        const signinSubmitBtn = document.querySelector('.signin-submit-btn');
        const loginPrompt = document.querySelector('.signin-login-prompt');
        
        if (signinTitle.textContent === 'Create account') {
            signinTitle.textContent = 'Log in';
            signinSubmitBtn.textContent = 'Log in';
            loginPrompt.innerHTML = 'Don\'t have an account? <a href="#" class="login-link">Sign up</a>';
        } else {
            signinTitle.textContent = 'Create account';
            signinSubmitBtn.textContent = 'Sign up';
            loginPrompt.innerHTML = 'Already have an account? <a href="#" class="login-link">Login</a>';
        }
        
        // Reattach event listener to the new login link
        document.querySelector('.login-link').addEventListener('click', loginLink.onclick);
    });
    
    // Handle form submission
    const emailForm = document.querySelector('.signin-email-form');
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        console.log('Form submitted with email:', email);
    });
    
    // Make the sign in button work without a form submission
    const signinSubmitBtn = document.querySelector('.signin-submit-btn');
    signinSubmitBtn.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        console.log('Authentication requested with email:', email);
    });

    remove30sBtn.addEventListener('click', function() {
        if (timeLeft > 30) {
            timeLeft -= 30;
        } else {
            timeLeft = 0;
        }
        updateTimerDisplay();
    });

    remove4mBtn.addEventListener('click', function() {
        const secondsToRemove = 4 * 60;
        if (timeLeft > secondsToRemove) {
            timeLeft -= secondsToRemove;
        } else {
            timeLeft = 0;
        }
        updateTimerDisplay();
    });
});
