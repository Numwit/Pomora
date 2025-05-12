// Get settings modal elements


// Function to open settings modal


// Function to close settings modal
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
