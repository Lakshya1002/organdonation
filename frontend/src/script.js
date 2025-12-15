// script.js
import { showAlert } from './showAlert.js';

document.getElementById('loadPatientsBtn').addEventListener('click', () => {
    fetch('http://localhost:3001/api/patients')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            const list = document.getElementById('patientList');
            list.innerHTML = '';
            data.forEach(patient => {
                const li = document.createElement('li');
                li.textContent = `${patient.name} - ${patient.organ_needed}`;
                list.appendChild(li);
            });
            showAlert('Patients loaded successfully');
        })
        .catch(err => {
            console.error(err);
            showAlert('Failed to load patients');
        });
});
