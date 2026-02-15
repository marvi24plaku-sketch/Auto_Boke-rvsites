// ============================================
// AUTO BOKE - ADMIN PANEL JAVASCRIPT
// Secure & Functional Admin System
// ============================================

const AdminConfig = {
    email: 'marvi24plaku@gmail.com',
    get password() {
        return localStorage.getItem('adminPassword') || 'admin123';
    },
    set password(newPass) {
        localStorage.setItem('adminPassword', newPass);
    }
};

const Admin = {
    init: function() {
        this.checkAuth();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // Check for messages
        this.updateBadgeCounts();
    },
    
    checkAuth: function() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        if (isLoggedIn === 'true') {
            this.showDashboard();
        }
    },
    
    handleLogin: function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email === AdminConfig.email && password === AdminConfig.password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            this.showDashboard();
            this.showToast('Mirësevini në Admin Panel!', 'success');
        } else {
            this.showToast('Email ose fjalëkalim i gabuar!', 'error');
        }
    },
    
    showDashboard: function() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        this.loadDashboard();
    },
    
    logout: function() {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    },
    
    togglePassword: function() {
        const input = document.getElementById('loginPassword');
        const icon = document.querySelector('.toggle-password i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    },
    
    toggleSidebar: function() {
        document.querySelector('.admin-sidebar').classList.toggle('active');
    },
    
    showSection: function(sectionName, element) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        
        // Show target section
        document.getElementById(sectionName + 'Section').classList.add('active');
        
        // Update nav
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        if (element) element.classList.add('active');
        
        // Load section data
        if (sectionName === 'cars') this.loadCars();
        if (sectionName === 'messages') this.loadMessages();
        if (sectionName === 'dashboard') this.loadDashboard();
    },
    
    updateTime: function() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const headerTime = document.getElementById('headerTime');
        if (headerTime) {
            headerTime.innerHTML = `<i class="fas fa-clock"></i> ${timeStr}<br><small>${dateStr}</small>`;
        }
    },
    
    updateBadgeCounts: function() {
        const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
        const messages = JSON.parse(localStorage.getItem('autoBokeMessages')) || [];
        
        document.getElementById('carCount').textContent = cars.length;
        document.getElementById('msgCount').textContent = messages.length;
        document.getElementById('dashboardCarCount').textContent = cars.length;
        document.getElementById('dashboardMsgCount').textContent = messages.length;
        
        // Calculate average price
        if (cars.length > 0) {
            const avg = cars.reduce((sum, c) => sum + c.price, 0) / cars.length;
            document.getElementById('avgPrice').textContent = '€' + Math.round(avg).toLocaleString();
        }
    },
    
    loadDashboard: function() {
        this.updateBadgeCounts();
        
        // Recent cars
        const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
        const recentCars = cars.slice(-3).reverse();
        
        document.getElementById('recentCars').innerHTML = recentCars.map(car => `
            <div class="recent-item">
                <img src="${car.image}" onerror="this.src='https://via.placeholder.com/60x40/0a0a0a/00f0ff?text=AB'">
                <div class="recent-item-info">
                    <div class="recent-item-title">${car.brand} ${car.model}</div>
                    <div class="recent-item-meta">${car.year} • ${car.fuel}</div>
                </div>
                <div class="recent-item-price">€${car.price.toLocaleString()}</div>
            </div>
        `).join('') || '<p style="padding: 1rem; color: var(--text-muted);">Nuk ka makina</p>';
        
        // Recent messages
        const messages = JSON.parse(localStorage.getItem('autoBokeMessages')) || [];
        const recentMsgs = messages.slice(-3).reverse();
        
        document.getElementById('recentMessages').innerHTML = recentMsgs.map(msg => `
            <div class="recent-item">
                <div class="sender-avatar" style="width: 40px; height: 40px; font-size: 0.875rem;">
                    ${msg.clientName.charAt(0).toUpperCase()}
                </div>
                <div class="recent-item-info">
                    <div class="recent-item-title">${msg.clientName}</div>
                    <div class="recent-item-meta">${msg.carInfo}</div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${msg.date.split(',')[0]}</div>
            </div>
        `).join('') || '<p style="padding: 1rem; color: var(--text-muted);">Nuk ka mesazhe</p>';
    },
    
    loadCars: function() {
        const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
        
        document.getElementById('carsTableBody').innerHTML = cars.map(car => `
            <tr>
                <td><img src="${car.image}" onerror="this.src='https://via.placeholder.com/80x50/0a0a0a/00f0ff?text=AB'"></td>
                <td><strong>${car.brand} ${car.model}</strong></td>
                <td>${car.year}</td>
                <td>${car.fuel}</td>
                <td>${car.km ? car.km.toLocaleString() : '-'}</td>
                <td style="color: var(--accent); font-weight: 700;">€${car.price.toLocaleString()}</td>
                <td>${new Date(car.date).toLocaleDateString('sq-AL')}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-btn edit" onclick="Admin.editCar(${car.id})" title="Edito">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="table-btn delete" onclick="Admin.deleteCar(${car.id})" title="Fshi">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Nuk ka makina</td></tr>';
        
        this.updateBadgeCounts();
    },
    
    loadMessages: function() {
        const messages = JSON.parse(localStorage.getItem('autoBokeMessages')) || [];
        
        document.getElementById('messagesGrid').innerHTML = messages.map(msg => `
            <div class="message-card">
                <div class="message-header">
                    <div class="message-sender">
                        <div class="sender-avatar">${msg.clientName.charAt(0).toUpperCase()}</div>
                        <div class="sender-info">
                            <h4>${msg.clientName}</h4>
                            <span>${msg.clientPhone}</span>
                        </div>
                    </div>
                    <div class="message-date">${msg.date}</div>
                </div>
                <div class="message-car">
                    <i class="fas fa-car"></i> ${msg.carInfo}
                </div>
                ${msg.clientMessage ? `<div class="message-text">${msg.clientMessage}</div>` : ''}
            </div>
        `).join('') || '<div class="coming-soon" style="padding: 3rem;"><i class="fas fa-inbox"></i><h3>Nuk ka mesazhe</h3></div>';
    },
    
    openCarModal: function(carId = null) {
        const modal = document.getElementById('carModal');
        const form = document.getElementById('carForm');
        const title = document.getElementById('modalTitle');
        
        form.reset();
        document.getElementById('carId').value = '';
        
        if (carId) {
            const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
            const car = cars.find(c => c.id === carId);
            
            if (car) {
                title.textContent = 'Edito Makinën';
                document.getElementById('carId').value = car.id;
                document.getElementById('carBrand').value = car.brand;
                document.getElementById('carModel').value = car.model;
                document.getElementById('carYear').value = car.year;
                document.getElementById('carFuel').value = car.fuel;
                document.getElementById('carPrice').value = car.price;
                document.getElementById('carKm').value = car.km || '';
                document.getElementById('carDescription').value = car.description || '';
                document.getElementById('carImage').value = car.image;
            }
        } else {
            title.textContent = 'Shto Makinë të Re';
        }
        
        modal.classList.add('active');
    },
    
    closeCarModal: function() {
        document.getElementById('carModal').classList.remove('active');
    },
    
    saveCar: function(e) {
        e.preventDefault();
        
        const carId = document.getElementById('carId').value;
        const carData = {
            id: carId ? parseInt(carId) : Date.now(),
            brand: document.getElementById('carBrand').value,
            model: document.getElementById('carModel').value,
            year: parseInt(document.getElementById('carYear').value),
            fuel: document.getElementById('carFuel').value,
            price: parseInt(document.getElementById('carPrice').value),
            km: parseInt(document.getElementById('carKm').value) || 0,
            description: document.getElementById('carDescription').value,
            image: document.getElementById('carImage').value || 'https://via.placeholder.com/400x300/0a0a0a/00f0ff?text=Auto+Boke',
            date: new Date().toISOString()
        };
        
        let cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
        
        if (carId) {
            const index = cars.findIndex(c => c.id === parseInt(carId));
            if (index !== -1) cars[index] = carData;
        } else {
            cars.push(carData);
        }
        
        localStorage.setItem('autoBokeCars', JSON.stringify(cars));
        
        this.closeCarModal();
        this.loadCars();
        this.showToast(carId ? 'Makina u përditësua!' : 'Makina u shtua!');
    },
    
    editCar: function(id) {
        this.openCarModal(id);
    },
    
    deleteCar: function(id) {
        if (!confirm('A jeni i sigurt që doni të fshini këtë makinë?')) return;
        
        let cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
        cars = cars.filter(c => c.id !== id);
        localStorage.setItem('autoBokeCars', JSON.stringify(cars));
        
        this.loadCars();
        this.showToast('Makina u fshi!');
    },
    
    clearAllMessages: function() {
        if (!confirm('A jeni i sigurt që doni të fshini të gjitha mesazhet?')) return;
        
        localStorage.removeItem('autoBokeMessages');
        this.loadMessages();
        this.updateBadgeCounts();
        this.showToast('Të gjitha mesazhet u fshinë!');
    },
    
    changePassword: function(e) {
        e.preventDefault();
        
        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        
        if (oldPass !== AdminConfig.password) {
            this.showToast('Fjalëkalimi i vjetër është i gabuar!', 'error');
            return;
        }
        
        if (newPass !== confirmPass) {
            this.showToast('Fjalëkalimet e reja nuk përputhen!', 'error');
            return;
        }
        
        if (newPass.length < 6) {
            this.showToast('Fjalëkalimi duhet të ketë të paktën 6 karaktere!', 'error');
            return;
        }
        
        AdminConfig.password = newPass;
        e.target.reset();
        this.showToast('Fjalëkalimi u ndryshua me sukses!');
    },
    
    refreshData: function() {
        this.updateBadgeCounts();
        this.showToast('Të dhënat u rifreshkuan!');
    },
    
    showToast: function(message, type = 'success') {
        const toast = document.getElementById('adminToast');
        toast.textContent = message;
        toast.className = 'toast show';
        
        if (type === 'error') {
            toast.style.borderColor = 'var(--danger)';
        } else {
            toast.style.borderColor = 'var(--accent)';
        }
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// Global functions
function handleLogin(e) { Admin.handleLogin(e); }
function togglePassword() { Admin.togglePassword(); }
function logout() { Admin.logout(); }
function toggleSidebar() { Admin.toggleSidebar(); }
function showSection(section, element) { Admin.showSection(section, element); }
function openCarModal() { Admin.openCarModal(); }
function closeCarModal() { Admin.closeCarModal(); }
function saveCar(e) { Admin.saveCar(e); }
function editCar(id) { Admin.editCar(id); }
function deleteCar(id) { Admin.deleteCar(id); }
function clearAllMessages() { Admin.clearAllMessages(); }
function changePassword(e) { Admin.changePassword(e); }
function refreshData() { Admin.refreshData(); }

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
    
    // Close modal on outside click
    window.onclick = function(e) {
        if (e.target.classList.contains('admin-modal')) {
            e.target.classList.remove('active');
        }
    };
});
