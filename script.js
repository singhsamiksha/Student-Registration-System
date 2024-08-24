document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const recordDiv = document.getElementById('recordDiv');
    const formErrors = document.getElementById('formErrors');

    // Load data from local storage
    function loadRecords() {
        const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
        recordDiv.innerHTML = '';
        records.forEach(record => createRecordElement(record));
    }

    // Save data to local storage
    function saveRecords(records) {
        localStorage.setItem('studentRecords', JSON.stringify(records));
    }

    // Validate form input
    function validateForm() {
        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentID').value.trim();
        const contact = document.getElementById('contactNumber').value.trim();
        const email = document.getElementById('email').value.trim();

        formErrors.innerHTML = '';

        if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
            formErrors.innerHTML += 'Invalid student name.<br>';
        }
        if (!id || !/^\d+$/.test(id)) {
            formErrors.innerHTML += 'Student ID must be a number.<br>';
        }
        if (!contact || !/^\d+$/.test(contact)) {
            formErrors.innerHTML += 'Contact Number must be a number.<br>';
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            formErrors.innerHTML += 'Invalid email address.<br>';
        }

        return !formErrors.innerHTML;
    }

    // Create record element
    function createRecordElement(record) {
        const recordItem = document.createElement('div');
        recordItem.className = 'record-item';
        recordItem.dataset.id = record.id;
        recordItem.innerHTML = `
            <strong>Name:</strong> ${record.name} <br>
            <strong>ID:</strong> ${record.id} <br>
            <strong>Contact:</strong> ${record.contact} <br>
            <strong>Email:</strong> ${record.email} <br>
            <button onclick="editRecord('${record.id}')">Edit</button>
            <button onclick="deleteRecord('${record.id}')">Delete</button>
        `;
        recordDiv.appendChild(recordItem);
    }

    // Add a new record
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentID').value.trim();
        const contact = document.getElementById('contactNumber').value.trim();
        const email = document.getElementById('email').value.trim();

        const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
        if (records.some(record => record.id === id)) {
            formErrors.innerHTML = 'Record with this ID already exists.';
            return;
        }

        const newRecord = { id, name, contact, email };
        records.push(newRecord);
        saveRecords(records);
        createRecordElement(newRecord);

        form.reset();
    });

    // Edit a record
    window.editRecord = function(id) {
        const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
        const record = records.find(r => r.id === id);
        if (record) {
            document.getElementById('studentName').value = record.name;
            document.getElementById('studentID').value = record.id;
            document.getElementById('contactNumber').value = record.contact;
            document.getElementById('email').value = record.email;
          
            form.addEventListener('submit', function updateRecord(event) {
                event.preventDefault();
                if (!validateForm()) return;

                record.name = document.getElementById('studentName').value.trim();
                record.contact = document.getElementById('contactNumber').value.trim();
                record.email = document.getElementById('email').value.trim();

                saveRecords(records);
                recordDiv.innerHTML = '';
                loadRecords();

                form.reset();
                form.removeEventListener('submit', updateRecord);
            });
        }
    };

    // Delete a record
    window.deleteRecord = function(id) {
        let records = JSON.parse(localStorage.getItem('studentRecords')) || [];
        records = records.filter(record => record.id !== id);
        saveRecords(records);
        recordDiv.innerHTML = '';
        loadRecords();
    };

    // Initial load
    loadRecords();
});
