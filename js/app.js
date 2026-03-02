/**
 * Legal History Hub - Main Application
 */

// State
let projects = [];
let filteredProjects = [];
let activeFilters = {
    search: '',
    types: [],
    status: [],
    categories: []
};
let viewMode = 'grid'; // 'grid' or 'list'

// DOM Elements
const projectsContainer = document.getElementById('projectsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const resultCount = document.getElementById('resultCount');
const searchInput = document.getElementById('searchInput');
const typeFilters = document.getElementById('typeFilters');
const statusFilters = document.getElementById('statusFilters');
const categoryFilters = document.getElementById('categoryFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const viewGridBtn = document.getElementById('viewGrid');
const viewListBtn = document.getElementById('viewList');
const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));

/**
 * Load projects from JSON
 */
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        projects = data.projects;
        filteredProjects = [...projects];

        initializeFilters();
        renderProjects();
        hideLoading();
    } catch (error) {
        console.error('Error loading projects:', error);
        loadingSpinner.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Error loading projects. Please try again later.
            </div>
        `;
    }
}

/**
 * Initialize filter checkboxes based on available data
 */
function initializeFilters() {
    // Collect unique values
    const types = [...new Set(projects.map(p => p.type))];
    const statuses = [...new Set(projects.map(p => p.status))];
    const categories = [...new Set(projects.flatMap(p => p.categories))];

    // Render type filters
    typeFilters.innerHTML = types.map(type => `
        <div class="form-check filter-checkbox">
            <input class="form-check-input" type="checkbox" value="${type}" id="type-${type}">
            <label class="form-check-label" for="type-${type}">
                <span class="badge badge-type badge-${type}">${t('types.' + type)}</span>
            </label>
        </div>
    `).join('');

    // Render status filters
    statusFilters.innerHTML = statuses.map(status => `
        <div class="form-check filter-checkbox">
            <input class="form-check-input" type="checkbox" value="${status}" id="status-${status}">
            <label class="form-check-label" for="status-${status}">
                <span class="badge badge-status badge-${status}">${t('status.' + status)}</span>
            </label>
        </div>
    `).join('');

    // Render category filters
    categoryFilters.innerHTML = categories.sort().map(cat => `
        <div class="form-check filter-checkbox">
            <input class="form-check-input" type="checkbox" value="${cat}" id="cat-${cat}">
            <label class="form-check-label small" for="cat-${cat}">${t('categories.' + cat)}</label>
        </div>
    `).join('');

    // Add event listeners
    typeFilters.querySelectorAll('input').forEach(cb => {
        cb.addEventListener('change', () => {
            activeFilters.types = getCheckedValues(typeFilters);
            applyFilters();
        });
    });

    statusFilters.querySelectorAll('input').forEach(cb => {
        cb.addEventListener('change', () => {
            activeFilters.status = getCheckedValues(statusFilters);
            applyFilters();
        });
    });

    categoryFilters.querySelectorAll('input').forEach(cb => {
        cb.addEventListener('change', () => {
            activeFilters.categories = getCheckedValues(categoryFilters);
            applyFilters();
        });
    });
}

/**
 * Get checked values from a filter container
 */
function getCheckedValues(container) {
    return [...container.querySelectorAll('input:checked')].map(cb => cb.value);
}

/**
 * Apply all active filters
 */
function applyFilters() {
    filteredProjects = projects.filter(project => {
        // Search filter
        if (activeFilters.search) {
            const searchLower = activeFilters.search.toLowerCase();
            const title = (project.title[currentLang] || project.title.en || '').toLowerCase();
            const desc = (project.description[currentLang] || project.description.en || '').toLowerCase();
            const keywords = (project.keywords[currentLang] || project.keywords.en || []).join(' ').toLowerCase();

            if (!title.includes(searchLower) && !desc.includes(searchLower) && !keywords.includes(searchLower)) {
                return false;
            }
        }

        // Type filter
        if (activeFilters.types.length > 0 && !activeFilters.types.includes(project.type)) {
            return false;
        }

        // Status filter
        if (activeFilters.status.length > 0 && !activeFilters.status.includes(project.status)) {
            return false;
        }

        // Category filter
        if (activeFilters.categories.length > 0) {
            const hasMatchingCategory = project.categories.some(cat => activeFilters.categories.includes(cat));
            if (!hasMatchingCategory) return false;
        }

        return true;
    });

    renderProjects();
}

/**
 * Reset all filters
 */
function resetFilters() {
    activeFilters = { search: '', types: [], status: [], categories: [] };
    searchInput.value = '';

    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
        cb.checked = false;
    });

    filteredProjects = [...projects];
    renderProjects();
}

/**
 * Render project cards
 */
function renderProjects() {
    resultCount.textContent = filteredProjects.length;

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');

    projectsContainer.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');

    // Add click handlers for cards
    projectsContainer.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                const projectId = card.dataset.projectId;
                showProjectDetail(projectId);
            }
        });
    });
}

/**
 * Create HTML for a project card
 */
function createProjectCard(project) {
    const title = project.title[currentLang] || project.title.en || project.title.de;
    const description = project.description[currentLang] || project.description.en || project.description.de;
    const period = project.period[currentLang] || project.period.en || project.period.de;

    const yearRange = project.yearStart === project.yearEnd
        ? project.yearStart
        : `${project.yearStart}–${project.yearEnd}`;

    return `
        <div class="col">
            <div class="card project-card shadow-sm h-100" data-project-id="${project.id}" role="button">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge badge-type badge-${project.type}">${t('types.' + project.type)}</span>
                        <span class="badge badge-status badge-${project.status}">${t('status.' + project.status)}</span>
                    </div>
                    <h5 class="card-title">${escapeHtml(title)}</h5>
                    <p class="card-text">${escapeHtml(description)}</p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        <span class="badge period-badge">
                            <i class="bi bi-calendar3 me-1"></i>${yearRange}
                        </span>
                        ${project.regions.slice(0, 2).map(r => `<span class="badge region-tag">${r}</span>`).join('')}
                        ${project.regions.length > 2 ? `<span class="badge region-tag">+${project.regions.length - 2}</span>` : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${project.institution.split(' ').slice(0, 3).join(' ')}...</small>
                        <a href="${project.url}" class="btn btn-sm btn-outline-primary" target="_blank" onclick="event.stopPropagation()">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show project detail modal
 */
function showProjectDetail(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const title = project.title[currentLang] || project.title.en || project.title.de;
    const description = project.description[currentLang] || project.description.en || project.description.de;
    const period = project.period[currentLang] || project.period.en || project.period.de;
    const keywords = project.keywords[currentLang] || project.keywords.en || [];

    const yearRange = project.yearStart === project.yearEnd
        ? project.yearStart
        : `${project.yearStart}–${project.yearEnd}`;

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalProjectLink').href = project.url;

    document.getElementById('modalBody').innerHTML = `
        <div class="d-flex gap-2 mb-3">
            <span class="badge badge-type badge-${project.type}">${t('types.' + project.type)}</span>
            <span class="badge badge-status badge-${project.status}">${t('status.' + project.status)}</span>
        </div>

        <p>${escapeHtml(description)}</p>

        <h6><i class="bi bi-calendar3 me-2"></i>${t('modal.period')}</h6>
        <p>${period} (${yearRange})</p>

        <h6><i class="bi bi-geo-alt me-2"></i>${t('modal.regions')}</h6>
        <p>${project.regions.join(', ')}</p>

        <h6><i class="bi bi-tags me-2"></i>${t('modal.categories')}</h6>
        <p>${project.categories.map(c => t('categories.' + c)).join(', ')}</p>

        ${keywords.length > 0 ? `
            <h6><i class="bi bi-key me-2"></i>${t('modal.keywords')}</h6>
            <p>${keywords.join(', ')}</p>
        ` : ''}

        <h6><i class="bi bi-building me-2"></i>${t('modal.institution')}</h6>
        <p>${project.institution}</p>

        ${project.funding ? `
            <h6><i class="bi bi-cash me-2"></i>${t('modal.funding')}</h6>
            <p>${project.funding}</p>
        ` : ''}

        <h6><i class="bi bi-translate me-2"></i>${t('modal.contentLanguages')}</h6>
        <p>${project.contentLanguages.map(l => t('languages.' + l) || l.toUpperCase()).join(', ')}</p>

        <h6><i class="bi bi-collection me-2"></i>${t('modal.mediaTypes')}</h6>
        <p>${project.mediaTypes.map(m => t('mediaTypes.' + m)).join(', ')}</p>

        ${project.relatedProjects.length > 0 ? `
            <h6><i class="bi bi-link-45deg me-2"></i>${t('modal.relatedProjects')}</h6>
            <p>${project.relatedProjects.map(id => {
                const related = projects.find(p => p.id === id);
                return related ? `<a href="#" onclick="showProjectDetail('${id}'); return false;">${related.title[currentLang] || related.title.en}</a>` : id;
            }).join(', ')}</p>
        ` : ''}

        ${project.license ? `
            <h6><i class="bi bi-shield-check me-2"></i>${t('modal.license')}</h6>
            <p>${project.license}</p>
        ` : ''}
    `;

    projectModal.show();
}

/**
 * Toggle view mode (grid/list)
 */
function setViewMode(mode) {
    viewMode = mode;
    projectsContainer.classList.toggle('view-list', mode === 'list');
    viewGridBtn.classList.toggle('active', mode === 'grid');
    viewListBtn.classList.toggle('active', mode === 'list');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    // Search input with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            activeFilters.search = e.target.value;
            applyFilters();
        }, 300);
    });

    // Reset filters
    resetFiltersBtn.addEventListener('click', resetFilters);

    // View mode toggle
    viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    viewListBtn.addEventListener('click', () => setViewMode('list'));
});

// Re-render on language change
window.addEventListener('languageChanged', () => {
    initializeFilters();
    renderProjects();
});

// Make showProjectDetail available globally for related projects links
window.showProjectDetail = showProjectDetail;
