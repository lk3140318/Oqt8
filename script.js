document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const groupIdInput = document.getElementById('group-id-input');
    const groupNameInput = document.getElementById('group-name-input');
    const addGroupBtn = document.getElementById('add-group-btn');
    const groupListUl = document.getElementById('group-list');
    const postContentTextarea = document.getElementById('post-content');
    const targetGroupsDiv = document.getElementById('target-groups');
    const sendOptionRadios = document.querySelectorAll('input[name="send-option"]');
    const scheduleTimeInput = document.getElementById('schedule-time');
    const sendPostBtn = document.getElementById('send-post-btn');
    const logListUl = document.getElementById('log-list');

    // --- Data Storage (In-Memory) ---
    let groups = []; // Array to hold { id: 'chatId', name: 'nickname' }
    let logs = [];   // Array to hold log entries

    // --- Functions ---

    // Render the list of saved groups
    function renderGroupList() {
        groupListUl.innerHTML = ''; // Clear existing list
        if (groups.length === 0) {
            groupListUl.innerHTML = '<li><i>No groups added yet.</i></li>';
            return;
        }
        groups.forEach((group, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${group.name}</strong> (${group.id})</span>
                <button class="remove-group-btn" data-index="${index}">Remove</button>
            `;
            groupListUl.appendChild(li);
        });
    }

    // Render checkboxes for selecting target groups
    function renderTargetGroups() {
        targetGroupsDiv.innerHTML = '<h3>Select Target Groups/Channels:</h3>'; // Clear existing checkboxes
        if (groups.length === 0) {
            targetGroupsDiv.innerHTML += '<p><i>Add groups in section 1 to see them here.</i></p>';
            return;
        }
        groups.forEach(group => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" name="target-group" value="${group.id}">
                ${group.name} (${group.id})
            `;
            targetGroupsDiv.appendChild(label);
        });
    }

    // Render the log list
    function renderLogs() {
        logListUl.innerHTML = ''; // Clear existing logs
        if (logs.length === 0) {
            logListUl.innerHTML = '<li><i>No posts sent yet.</i></li>';
            return;
        }
        // Display latest logs first
        [...logs].reverse().forEach(log => {
            const li = document.createElement('li');
            const targetsString = log.targets.map(t => t.name).join(', ') || 'N/A';
            const contentPreview = log.content.substring(0, 50) + (log.content.length > 50 ? '...' : '');

            li.innerHTML = `
                <span>"${contentPreview}" to [${targetsString}]</span>
                <span>
                    <span class="log-status ${log.status.toLowerCase()}">${log.status}</span>
                    <span class="log-time">${log.timestamp.toLocaleString()}</span>
                </span>
            `;
            logListUl.appendChild(li);
        });
    }

     // Add a new log entry
    function addLog(content, targets, status, timestamp = new Date()) {
        logs.push({ content, targets, status, timestamp });
        renderLogs(); // Update the UI
    }

    // Handle adding a new group
    function handleAddGroup() {
        const id = groupIdInput.value.trim();
        const name = groupNameInput.value.trim();

        if (!id || !name) {
            alert('Please enter both Chat ID and a Nickname.');
            return;
        }
         // Basic check for potential ID format (optional)
        if (!id.match(/^-?\d+$/)) {
            alert('Chat ID should usually be a number (can be negative).');
            // return; // You might want to allow flexibility here
        }
        // Check for duplicates
        if (groups.some(g => g.id === id)) {
             alert('This Group/Channel ID has already been added.');
             return;
        }


        groups.push({ id, name });
        groupIdInput.value = ''; // Clear inputs
        groupNameInput.value = '';
        renderGroupList();
        renderTargetGroups();
        console.log("Groups:", groups); // For debugging
    }

    // Handle removing a group
    function handleRemoveGroup(event) {
        if (event.target.classList.contains('remove-group-btn')) {
            const indexToRemove = parseInt(event.target.getAttribute('data-index'), 10);
            if (!isNaN(indexToRemove)) {
                groups.splice(indexToRemove, 1);
                renderGroupList();
                renderTargetGroups();
                console.log("Groups after removal:", groups); // For debugging
            }
        }
    }

    // Handle sending or scheduling a post
    function handleSubmitPost() {
        const content = postContentTextarea.value.trim();
        const selectedCheckboxes = document.querySelectorAll('input[name="target-group"]:checked');
        const selectedSendOption = document.querySelector('input[name="send-option"]:checked').value;
        const scheduleTimeValue = scheduleTimeInput.value;

        if (!content) {
            alert('Please enter some content for the post.');
            return;
        }
        if (selectedCheckboxes.length === 0) {
            alert('Please select at least one target group/channel.');
            return;
        }

        const targetGroupDetails = Array.from(selectedCheckboxes).map(checkbox => {
            const groupId = checkbox.value;
            const group = groups.find(g => g.id === groupId);
            return group ? { id: group.id, name: group.name } : null; // Store name for logging
        }).filter(g => g !== null); // Filter out potential inconsistencies

        const timestamp = new Date();

        if (selectedSendOption === 'now') {
            // Simulate immediate sending
            console.log("Simulating Send Now:", { content, targets: targetGroupDetails });
            addLog(content, targetGroupDetails, 'Sent (Simulated)', timestamp);
            // In a real app, this would trigger a backend API call
        } else if (selectedSendOption === 'schedule') {
            if (!scheduleTimeValue) {
                alert('Please select a date and time for scheduling.');
                return;
            }
            const scheduleDateTime = new Date(scheduleTimeValue);
            if (isNaN(scheduleDateTime.getTime()) || scheduleDateTime <= new Date()) {
                alert('Please select a valid future date and time.');
                return;
            }

            const delay = scheduleDateTime.getTime() - Date.now();
            console.log(`Scheduling post in ${delay / 1000} seconds:`, { content, targets: targetGroupDetails });

             // Add a "Scheduled" log immediately
            const scheduledLogEntry = { content, targets: targetGroupDetails, status: 'Scheduled', timestamp: scheduleDateTime };
            logs.push(scheduledLogEntry);
            renderLogs(); // Update UI to show it's scheduled

            // Simulate sending at the scheduled time
            setTimeout(() => {
                console.log("Simulating Scheduled Send:", { content, targets: targetGroupDetails });
                 // Find the original log entry and update its status
                 const logIndex = logs.findIndex(log => log === scheduledLogEntry);
                 if (logIndex !== -1) {
                    logs[logIndex].status = 'Sent (Simulated)';
                    logs[logIndex].timestamp = new Date(); // Update timestamp to actual send time
                 } else {
                    // Fallback if the original entry wasn't found (shouldn't happen)
                     addLog(content, targetGroupDetails, 'Sent (Simulated)', new Date());
                 }
                renderLogs(); // Update UI again
                // In a real app, a backend cron job or task queue would handle this
            }, delay);
        }

        // Clear form after submission
        postContentTextarea.value = '';
        selectedCheckboxes.forEach(checkbox => checkbox.checked = false);
        document.querySelector('input[name="send-option"][value="now"]').checked = true; // Reset to 'Send Now'
        scheduleTimeInput.style.display = 'none';
        scheduleTimeInput.value = '';
    }

    // Toggle schedule time input visibility
    function handleSendOptionChange() {
        if (document.querySelector('input[name="send-option"]:checked').value === 'schedule') {
            scheduleTimeInput.style.display = 'inline-block';
        } else {
            scheduleTimeInput.style.display = 'none';
        }
    }

    // --- Event Listeners ---
    addGroupBtn.addEventListener('click', handleAddGroup);
    groupListUl.addEventListener('click', handleRemoveGroup); // Use event delegation for remove buttons
    sendPostBtn.addEventListener('click', handleSubmitPost);
    sendOptionRadios.forEach(radio => {
        radio.addEventListener('change', handleSendOptionChange);
    });

    // --- Initial Render ---
    renderGroupList();
    renderTargetGroups();
    renderLogs();
    handleSendOptionChange(); // Set initial state of schedule input

});
