// Main application logic

let currentRecords = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize database
        await tractorDB.init();
        console.log('App initialized');

        // Load existing records
        await loadRecords();

        // Set up form submission
        const form = document.getElementById('tractorServiceForm');
        form.addEventListener('submit', handleFormSubmit);

    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to initialize application');
    }
});

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        tractorId: document.getElementById('tractorId').value,
        tractorModel: document.getElementById('tractorModel').value,
        serviceType: document.getElementById('serviceType').value,
        serviceDate: document.getElementById('serviceDate').value,
        technicianName: document.getElementById('technicianName').value,
        description: document.getElementById('description').value,
        kilometers: parseFloat(document.getElementById('kilometers').value),
        cost: parseFloat(document.getElementById('cost').value),
        hoursWorked: parseFloat(document.getElementById('hoursWorked').value)
    };

    try {
        // Add to database
        const recordId = await tractorDB.addService(formData);
        console.log('Record added with ID:', recordId);

        // Show success message
        showSuccess('Service form submitted successfully!');

        // Reset form
        event.target.reset();

        // Reload records
        await loadRecords();

    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Error submitting form. Please try again.');
    }
}

// Load and display all records
async function loadRecords() {
    try {
        currentRecords = await tractorDB.getAllServices();
        displayRecords(currentRecords);
    } catch (error) {
        console.error('Error loading records:', error);
        showError('Error loading records');
    }
}

// Display records in the UI
function displayRecords(records) {
    const container = document.getElementById('recordsContainer');

    if (records.length === 0) {
        container.innerHTML = '<p class="no-records">No service records yet.</p>';
        return;
    }

    container.innerHTML = records.map(record => `
        <div class="record-card">
            <div class="record-header">
                <div>
                    <div class="record-title">Tractor: ${escapeHtml(record.tractorModel)}</div>
                    <div class="record-date">${formatDate(record.createdAt)}</div>
                </div>
                <button class="btn-delete" onclick="deleteRecord(${record.id})">Delete</button>
            </div>
            <div class="record-details">
                <div class="record-detail-item">
                    <span class="detail-label">Tractor ID:</span>
                    <span class="detail-value">${escapeHtml(record.tractorId)}</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Service Type:</span>
                    <span class="detail-value">${capitalizeFirst(record.serviceType)}</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Service Date:</span>
                    <span class="detail-value">${formatDate(record.serviceDate)}</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Technician:</span>
                    <span class="detail-value">${escapeHtml(record.technicianName)}</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${escapeHtml(record.description)}</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Kilometers:</span>
                    <span class="detail-value">${record.kilometers} km</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Cost:</span>
                    <span class="detail-value">$${record.cost.toFixed(2)}</span>
                </div>
                <div class="record-detail-item">
                    <span class="detail-label">Hours Worked:</span>
                    <span class="detail-value">${record.hoursWorked} hrs</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Delete a record
async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        try {
            await tractorDB.deleteService(id);
            showSuccess('Record deleted successfully');
            await loadRecords();
        } catch (error) {
            console.error('Error deleting record:', error);
            showError('Error deleting record');
        }
    }
}

// Show success message
function showSuccess(message) {
    const msgElement = document.getElementById('successMessage');
    msgElement.textContent = '✓ ' + message;
    msgElement.style.display = 'block';

    // Hide error message if shown
    document.getElementById('errorMessage').style.display = 'none';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        msgElement.style.display = 'none';
    }, 5000);
}

// Show error message
function showError(message) {
    const msgElement = document.getElementById('errorMessage');
    msgElement.textContent = '✗ ' + message;
    msgElement.style.display = 'block';

    // Hide success message if shown
    document.getElementById('successMessage').style.display = 'none';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        msgElement.style.display = 'none';
    }, 5000);
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility function to escape HTML (prevent XSS)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}