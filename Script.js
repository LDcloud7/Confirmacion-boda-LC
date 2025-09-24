document.addEventListener('DOMContentLoaded', function() {
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const attendanceSection = document.getElementById('attendanceSection');
    const hasCompanionRadios = document.querySelectorAll('input[name="hasCompanion"]');
    const companionsContainer = document.getElementById('companionsContainer');
    const companionsList = document.getElementById('companionsList');
    const addCompanionBtn = document.getElementById('addCompanion');
    const mainGuestAllergyCheckbox = document.getElementById('mainGuestAllergyCheckbox');
    const mainGuestAllergyDetails = document.getElementById('mainGuestAllergyDetails');
    const mainGuestNameInput = document.getElementById('name');
    const mainGuestNameSpan = document.getElementById('mainGuestName');
    const confirmationForm = document.getElementById('confirmationForm');
    
    let companionCount = 0;
    let hasCompanion = false;
    let willAttend = true;
    
    // Actualizar nombre del invitado principal en tiempo real
    mainGuestNameInput.addEventListener('input', function() {
        mainGuestNameSpan.textContent = this.value || 'ti';
    });
    
    // Manejar selección de "Ninguna" para el invitado principal
    function handleMainGuestNoneSelection() {
        const noneCheckbox = document.querySelector('input[name="mainGuestDiet"][value="ninguna"]');
        const otherCheckboxes = document.querySelectorAll('input[name="mainGuestDiet"]:not([value="ninguna"])');
        
        noneCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
                mainGuestAllergyDetails.style.display = 'none';
            } else {
                otherCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
        });
        
        otherCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    noneCheckbox.checked = false;
                }
            });
        });
    }
    
    // Mostrar/ocultar secciones según la asistencia
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            willAttend = this.value === 'yes';
            
            if (willAttend) {
                attendanceSection.style.display = 'block';
            } else {
                attendanceSection.style.display = 'none';
                companionsContainer.style.display = 'none';
                companionsList.innerHTML = '';
                companionCount = 0;
            }
        });
    });
    
    // Mostrar detalles de alergia para invitado principal
    mainGuestAllergyCheckbox.addEventListener('change', function() {
        if (this.checked) {
            const noneCheckbox = document.querySelector('input[name="mainGuestDiet"][value="ninguna"]');
            noneCheckbox.checked = false;
            noneCheckbox.disabled = false;
        }
        mainGuestAllergyDetails.style.display = this.checked ? 'block' : 'none';
    });
    
    // Mostrar/ocultar sección de acompañantes
    hasCompanionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            hasCompanion = this.value === 'yes';
            
            if (hasCompanion) {
                companionsContainer.style.display = 'block';
                companionCount = 0;
                companionsList.innerHTML = '';
                addCompanion(); // Añadir un campo automáticamente
            } else {
                companionsContainer.style.display = 'none';
                companionsList.innerHTML = '';
                companionCount = 0;
            }
        });
    });
    
    // Configurar la fecha límite de confirmación (15 días a partir de hoy)
    const confirmationDeadline = new Date();
    confirmationDeadline.setDate(confirmationDeadline.getDate() + 15);
    
    // Elementos del countdown
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Formatear números a dos dígitos
    function formatTime(value) {
        return value < 10 ? `0${value}` : value;
    }
    
    // Actualizar el countdown en tiempo real
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = confirmationDeadline - now;
        
        if (timeRemaining <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            document.getElementById('countdown').innerHTML = 
                '<div class="countdown-title">¡El período de confirmación ha finalizado!</div>';
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('submitBtn').textContent = 'Confirmación cerrada';
            return;
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        daysElement.textContent = formatTime(days);
        hoursElement.textContent = formatTime(hours);
        minutesElement.textContent = formatTime(minutes);
        secondsElement.textContent = formatTime(seconds);
    }
    
    // Iniciar el countdown en tiempo real
    updateCountdown();
    setInterval(updateCountdown, 1000); // Actualizar cada segundo
    
    // Mostrar sección de asistencia por defecto
    attendanceSection.style.display = 'block';
    
    // Inicializar manejo de selección "Ninguna"
    handleMainGuestNoneSelection();
    
    // Función para crear campos de alergias para acompañantes
    function createCompanionAllergySection(companionIndex) {
        return `
            <div class="allergies-section" style="margin-top: 10px;">
                <h4>Preferencias alimentarias para este acompañante:</h4>
                <div class="checkbox-group">
                    <label class="checkbox-option">
                        <input type="checkbox" name="companion${companionIndex}Diet" value="ninguna" checked> Ninguna
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="companion${companionIndex}Diet" value="vegetariana"> Vegetariana
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="companion${companionIndex}Diet" value="vegana"> Vegana
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="companion${companionIndex}Diet" value="sin-gluten"> Sin gluten
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="companion${companionIndex}Diet" value="alergia" id="companion${companionIndex}AllergyCheckbox"> Alergia alimenticia
                    </label>
                </div>
                <div class="allergy-details" id="companion${companionIndex}AllergyDetails">
                    <label for="companion${companionIndex}AllergyDescription">Especifica la alergia:</label>
                    <input type="text" id="companion${companionIndex}AllergyDescription" placeholder="Ej: Alergia a mariscos, frutos secos, etc.">
                </div>
            </div>
        `;
    }
    
    // Función para manejar selección "Ninguna" en acompañantes
    function handleCompanionNoneSelection(companionIndex) {
        const noneCheckbox = document.querySelector(`input[name="companion${companionIndex}Diet"][value="ninguna"]`);
        const otherCheckboxes = document.querySelectorAll(`input[name="companion${companionIndex}Diet"]:not([value="ninguna"])`);
        const allergyDetails = document.getElementById(`companion${companionIndex}AllergyDetails`);
        
        noneCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
                allergyDetails.style.display = 'none';
            } else {
                otherCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
        });
        
        otherCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    noneCheckbox.checked = false;
                }
            });
        });
    }
    
    // Función para añadir un campo de acompañante
    function addCompanion() {
        companionCount++;
        const div = document.createElement('div');
        div.className = 'companion-input';
        div.innerHTML = `
            <div class="companion-header">
                <div class="companion-title">Acompañante ${companionCount}</div>
                <button type="button" class="remove-companion">×</button>
            </div>
            <div class="form-group">
                <label for="companion${companionCount}Name">Nombre completo:</label>
                <input type="text" id="companion${companionCount}Name" required>
            </div>
            ${createCompanionAllergySection(companionCount)}
        `;
        companionsList.appendChild(div);
        
        // Añadir evento al botón de eliminar
        const removeBtn = div.querySelector('.remove-companion');
        removeBtn.addEventListener('click', function() {
            div.remove();
            companionCount--;
            updateAddButtonVisibility();
        });
        
        // Añadir evento para mostrar/ocultar detalles de alergia del acompañante
        const allergyCheckbox = div.querySelector(`#companion${companionCount}AllergyCheckbox`);
        const allergyDetails = div.querySelector(`#companion${companionCount}AllergyDetails`);
        
        allergyCheckbox.addEventListener('change', function() {
            if (this.checked) {
                const noneCheckbox = div.querySelector(`input[name="companion${companionCount}Diet"][value="ninguna"]`);
                noneCheckbox.checked = false;
                noneCheckbox.disabled = false;
            }
            allergyDetails.style.display = this.checked ? 'block' : 'none';
        });
        
        // Manejar selección "Ninguna" para este acompañante
        handleCompanionNoneSelection(companionCount);
        
        updateAddButtonVisibility();
    }
    
    // Actualizar visibilidad del botón de añadir (sin límite)
    function updateAddButtonVisibility() {
        // Sin límite de acompañantes - siempre mostrar el botón
        addCompanionBtn.style.display = 'block';
    }
    
    // Añadir acompañante al hacer clic en el botón
    addCompanionBtn.addEventListener('click', addCompanion);
    
    // Manejar el envío del formulario
    confirmationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Verificar si el período de confirmación ha terminado
        const now = new Date();
        if (now > confirmationDeadline) {
            alert('El período de confirmación ha finalizado. Por favor, contacta directamente con los novios.');
            return;
        }
        
        // Validar que si hay acompañantes, se hayan añadido
        if (willAttend && hasCompanion && companionCount === 0) {
            alert('Por favor, añade la información de tu acompañante.');
            return;
        }
        
        // Mostrar loading, ocultar otros estados
        document.getElementById('loading').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('submitBtn').disabled = true;
        
        // Recoger datos del formulario
        const companions = [];
        const mainGuestDiets = [];
        
        // Recopilar preferencias alimentarias del invitado principal
        document.querySelectorAll('input[name="mainGuestDiet"]:checked').forEach(checkbox => {
            if (checkbox.value === 'alergia') {
                const allergyDesc = document.getElementById('mainGuestAllergyDescription').value;
                if (allergyDesc) {
                    mainGuestDiets.push(`Alergia: ${allergyDesc}`);
                }
            } else if (checkbox.value !== 'ninguna') {
                mainGuestDiets.push(checkbox.value);
            }
        });
        
        // Si no se seleccionó nada, agregar "Ninguna"
        if (mainGuestDiets.length === 0) {
            mainGuestDiets.push('Ninguna');
        }
        
        // Recopilar información de acompañantes
        for (let i = 1; i <= companionCount; i++) {
            const companionName = document.getElementById(`companion${i}Name`);
            if (companionName && companionName.value) {
                const companionData = {
                    name: companionName.value,
                    diets: []
                };
                
                // Recopilar preferencias alimentarias del acompañante
                document.querySelectorAll(`input[name="companion${i}Diet"]:checked`).forEach(checkbox => {
                    if (checkbox.value === 'alergia') {
                        const allergyDesc = document.getElementById(`companion${i}AllergyDescription`).value;
                        if (allergyDesc) {
                            companionData.diets.push(`Alergia: ${allergyDesc}`);
                        }
                    } else if (checkbox.value !== 'ninguna') {
                        companionData.diets.push(checkbox.value);
                    }
                });
                
                // Si no se seleccionó nada, agregar "Ninguna"
                if (companionData.diets.length === 0) {
                    companionData.diets.push('Ninguna');
                }
                
                companions.push(companionData);
            }
        }
        
        const formData = {
            name: document.getElementById('name').value,
            willAttend: willAttend,
            hasCompanion: willAttend ? hasCompanion : false,
            mainGuestDiets: mainGuestDiets,
            companions: companions,
            message: document.getElementById('message').value
        };
        
        try {
            // SIMULACIÓN DE ENVÍO (por ahora)
            console.log('Datos a enviar:', formData);
            
            // Simular envío a servidor
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mostrar mensaje de éxito personalizado
            const confirmationDetails = document.getElementById('confirmationDetails');
            if (willAttend) {
                let detailsHTML = `
                    <p>Hemos registrado que <strong>sí asistirás</strong> a nuestra boda.</p>
                    <p><strong>Preferencias alimentarias para ti:</strong> ${mainGuestDiets.join(', ')}</p>
                `;
                
                if (hasCompanion && companions.length > 0) {
                    detailsHTML += `<p><strong>Acompañantes:</strong></p>`;
                    companions.forEach(companion => {
                        detailsHTML += `<p>- ${companion.name}: ${companion.diets.join(', ')}</p>`;
                    });
                }
                
                detailsHTML += `<p>La información del evento se mostrará a continuación.</p>`;
                confirmationDetails.innerHTML = detailsHTML;
                document.getElementById('eventInfo').style.display = 'block';
            } else {
                confirmationDetails.innerHTML = `
                    <p>Hemos registrado que <strong>no podrás asistir</strong> a nuestra boda.</p>
                    <p>Lamentamos mucho tu ausencia y te agradecemos por avisarnos.</p>
                `;
            }
            
            document.getElementById('successMessage').style.display = 'block';
            
            // Limpiar formulario
            document.getElementById('confirmationForm').reset();
            companionsList.innerHTML = '';
            companionsContainer.style.display = 'none';
            mainGuestAllergyDetails.style.display = 'none';
            companionCount = 0;
            hasCompanion = false;
            
            // Restablecer selecciones
            document.querySelector('input[name="hasCompanion"][value="no"]').checked = true;
            document.querySelectorAll('input[value="ninguna"]').forEach(cb => cb.checked = true);
            
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('errorMessage').style.display = 'block';
        } finally {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
        }
    });
});