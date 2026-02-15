// ============================================
// AUTO BOKE - MAIN JAVASCRIPT
// Ultra Functional Interactive Experience
// ============================================

// Data Management
const Storage = {
    getCars: () => JSON.parse(localStorage.getItem('autoBokeCars')) || [],
    setCars: (cars) => localStorage.setItem('autoBokeCars', JSON.stringify(cars)),
    getMessages: () => JSON.parse(localStorage.getItem('autoBokeMessages')) || [],
    setMessages: (msgs) => localStorage.setItem('autoBokeMessages', JSON.stringify(msgs)),
    
    init: function() {
        if (!localStorage.getItem('autoBokeCars')) {
            const defaultCars = [
                {
                    id: 1,
                    brand: 'Audi',
                    model: 'A4 Avant',
                    year: 2020,
                    fuel: 'Naftë',
                    price: 24500,
                    km: 65000,
                    description: 'Audi A4 Avant në gjendje perfekte. Full option, panoramic roof, virtual cockpit.',
                    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800',
                    date: new Date().toISOString()
                },
                {
                    id: 2,
                    brand: 'BMW',
                    model: 'X5 M Sport',
                    year: 2019,
                    fuel: 'Naftë',
                    price: 52000,
                    km: 45000,
                    description: 'BMW X5 me paketë M Sport. Motor 3.0L, 265PS. Gjendje e shkëlqyer.',
                    image: 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800',
                    date: new Date().toISOString()
                },
                {
                    id: 3,
                    brand: 'Mercedes',
                    model: 'C-Class Coupe',
                    year: 2021,
                    fuel: 'Benzinë',
                    price: 38500,
                    km: 28000,
                    description: 'Mercedes C-Class Coupe AMG Line. Design agresiv, teknologji e fundit.',
                    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800',
                    date: new Date().toISOString()
                }
            ];
            this.setCars(defaultCars);
        }
    }
};

// UI Components
const UI = {
    loader: document.getElementById('loader'),
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toastMessage'),
    
    hideLoader: function() {
        setTimeout(() => {
            this.loader.classList.add('hidden');
        }, 2000);
    },
    
    showToast: function(message, type = 'success') {
        this.toastMsg.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    },
    
    initParticles: function() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    },
    
    initScrollAnimations: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Count up animation
                    if (entry.target.classList.contains('count-up')) {
                        this.animateCount(entry.target);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
        document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
    },
    
    animateCount: function(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    },
    
    initNavbar: function() {
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
};

// Car Management
const CarManager = {
    renderCars: function(cars = null) {
        const grid = document.getElementById('carsGrid');
        const noResults = document.getElementById('noResults');
        const data = cars || Storage.getCars();
        
        // Update stats
        const statElement = document.getElementById('stat-cars');
        if (statElement) statElement.textContent = Storage.getCars().length;
        
        if (data.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        grid.innerHTML = data.map(car => this.createCarCard(car)).join('');
    },
    
    createCarCard: function(car) {
        return `
            <div class="car-card" data-brand="${car.brand.toLowerCase()}" data-aos="fade-up">
                <div class="car-image">
                    <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy" 
                         onerror="this.src='https://via.placeholder.com/400x300/0a0a0a/00f0ff?text=Auto+Boke'">
                    <span class="car-badge">Në Shitje</span>
                </div>
                <div class="car-info">
                    <div class="car-header">
                        <div>
                            <div class="car-title">${car.brand} ${car.model}</div>
                            <div class="car-meta">${car.year} • ${car.fuel}</div>
                        </div>
                        <div class="car-price">€${car.price.toLocaleString()}</div>
                    </div>
                    <div class="car-details">
                        <div class="car-detail">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${car.km ? car.km.toLocaleString() + ' km' : 'N/A'}</span>
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${car.year}</span>
                        </div>
                    </div>
                    <p class="car-description">${car.description}</p>
                    <div class="car-actions">
                        <button class="car-btn primary" onclick="CarManager.openModal(${car.id})">
                            <i class="fas fa-info-circle"></i> Detaje
                        </button>
                        <button class="car-btn secondary" onclick="ContactManager.openContactModal(${car.id})">
                            <i class="fas fa-phone"></i> Kontakto
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    openModal: function(id) {
        const cars = Storage.getCars();
        const car = cars.find(c => c.id === id);
        if (!car) return;
        
        const modal = document.getElementById('carModal');
        const body = document.getElementById('modalBody');
        
        body.innerHTML = `
            <div class="modal-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}" 
                     onerror="this.src='https://via.placeholder.com/600x800/0a0a0a/00f0ff?text=Auto+Boke'">
            </div>
            <div class="modal-details">
                <h2>${car.brand} ${car.model}</h2>
                <div class="modal-meta">${car.year} • ${car.fuel} • ${car.km ? car.km.toLocaleString() + ' km' : 'N/A'}</div>
                <div class="modal-price">€${car.price.toLocaleString()}</div>
                <div class="modal-specs">
                    <div class="modal-spec">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <div class="modal-spec-label">Viti</div>
                            <div class="modal-spec-value">${car.year}</div>
                        </div>
                    </div>
                    <div class="modal-spec">
                        <i class="fas fa-gas-pump"></i>
                        <div>
                            <div class="modal-spec-label">Karburanti</div>
                            <div class="modal-spec-value">${car.fuel}</div>
                        </div>
                    </div>
                    <div class="modal-spec">
                        <i class="fas fa-tachometer-alt"></i>
                        <div>
                            <div class="modal-spec-label">Kilometrazhi</div>
                            <div class="modal-spec-value">${car.km ? car.km.toLocaleString() + ' km' : 'N/A'}</div>
                        </div>
                    </div>
                    <div class="modal-spec">
                        <i class="fas fa-tag"></i>
                        <div>
                            <div class="modal-spec-label">Çmimi</div>
                            <div class="modal-spec-value">€${car.price.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <p class="modal-description">${car.description}</p>
                <button class="btn btn-primary btn-full" onclick="ContactManager.openContactModal(${car.id}); CarManager.closeModal();">
                    <i class="fas fa-phone"></i> Interesohu për këtë Makinë
                </button>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    closeModal: function() {
        document.getElementById('carModal').classList.remove('active');
        document.body.style.overflow = '';
    },
    
    search: function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const cars = Storage.getCars();
        
        const filtered = cars.filter(car => 
            car.brand.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.year.toString().includes(query) ||
            car.fuel.toLowerCase().includes(query)
        );
        
        this.renderCars(filtered);
    },
    
    filter: function() {
        const brand = document.getElementById('filterBrand').value.toLowerCase();
        const fuel = document.getElementById('filterFuel').value.toLowerCase();
        const maxPrice = parseInt(document.getElementById('priceRange').value);
        
        let cars = Storage.getCars();
        
        if (brand) cars = cars.filter(c => c.brand.toLowerCase() === brand);
        if (fuel) cars = cars.filter(c => c.fuel.toLowerCase() === fuel);
        cars = cars.filter(c => c.price <= maxPrice);
        
        this.renderCars(cars);
    }
};

// Contact Management
const ContactManager = {
    openContactModal: function(carId) {
        const cars = Storage.getCars();
        const car = cars.find(c => c.id === carId);
        
        // Create modal dynamically
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'contactModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div style="padding: 2rem;">
                    <h2 style="margin-bottom: 0.5rem;">Interesuar për këtë makinë?</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        ${car ? car.brand + ' ' + car.model + ' - €' + car.price.toLocaleString() : ''}
                    </p>
                    <form onsubmit="ContactManager.submit(event, ${carId})">
                        <div class="form-group">
                            <input type="text" name="name" required placeholder=" ">
                            <label>Emri juaj</label>
                        </div>
                        <div class="form-group">
                            <input type="tel" name="phone" required placeholder=" ">
                            <label>Numri i telefonit</label>
                        </div>
                        <div class="form-group">
                            <textarea name="message" rows="3" placeholder=" "></textarea>
                            <label>Mesazhi juaj (opsional)</label>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">
                            <i class="fas fa-paper-plane"></i> Dërgo Kërkesën
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    },
    
    submit: function(e, carId) {
        e.preventDefault();
        
        const cars = Storage.getCars();
        const car = cars.find(c => c.id === carId);
        
        const message = {
            id: Date.now(),
            carId: carId,
            carInfo: car ? `${car.brand} ${car.model}` : 'N/A',
            clientName: e.target.name.value,
            clientPhone: e.target.phone.value,
            clientMessage: e.target.message.value,
            date: new Date().toLocaleString('sq-AL'),
            read: false
        };
        
        const messages = Storage.getMessages();
        messages.push(message);
        Storage.setMessages(messages);
        
        UI.showToast('Kërkesa u dërgua me sukses! Do t\'ju kontaktojmë së shpejti.');
        
        e.target.closest('.modal').remove();
        document.body.style.overflow = '';
    },
    
    submitContactForm: function(e) {
        e.preventDefault();
        
        const message = {
            id: Date.now(),
            carId: null,
            carInfo: 'Kontakt i Përgjithshëm',
            clientName: document.getElementById('contactName').value,
            clientPhone: document.getElementById('contactPhone').value,
            clientMessage: document.getElementById('contactMessage').value,
            date: new Date().toLocaleString('sq-AL'),
            read: false
        };
        
        const messages = Storage.getMessages();
        messages.push(message);
        Storage.setMessages(messages);
        
        UI.showToast('Mesazhi u dërgua me sukses!');
        e.target.reset();
    }
};

// Global Functions
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    const btn = document.querySelector('.filter-toggle');
    panel.classList.toggle('active');
    btn.classList.toggle('active');
}

function updatePriceLabel() {
    const value = document.getElementById('priceRange').value;
    document.getElementById('priceLabel').textContent = '€' + parseInt(value).toLocaleString();
}

function clearFilters() {
    document.getElementById('filterBrand').value = '';
    document.getElementById('filterFuel').value = '';
    document.getElementById('priceRange').value = 100000;
    updatePriceLabel();
    CarManager.renderCars();
}

function searchCars() {
    CarManager.search();
}

function applyFilters() {
    CarManager.filter();
}

function openCarModal() {
    CarManager.openModal();
}

function closeCarModal() {
    CarManager.closeModal();
}

function submitContactForm(e) {
    ContactManager.submitContactForm(e);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Storage.init();
    UI.hideLoader();
    UI.initParticles();
    UI.initScrollAnimations();
    UI.initNavbar();
    CarManager.renderCars();
    
    // Close modal on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => {
                m.classList.remove('active');
                if (m.id === 'carModal') CarManager.closeModal();
            });
        }
    });
});
