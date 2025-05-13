document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    // const mainHeader = document.querySelector('.main-header'); // Not strictly needed for this section

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true' || false;
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Dropdown Work Menu
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        dropbtn.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                const currentDropdownContent = this.nextElementSibling;
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    if (content !== currentDropdownContent) {
                        content.style.display = 'none';
                        if (content.previousElementSibling.querySelector('.dropdown-arrow')) {
                           content.previousElementSibling.querySelector('.dropdown-arrow').style.transform = 'rotate(0deg)';
                        }
                    }
                });
                if (currentDropdownContent.style.display === 'block') {
                    currentDropdownContent.style.display = 'none';
                    this.querySelector('.dropdown-arrow').style.transform = 'rotate(0deg)';
                } else {
                    currentDropdownContent.style.display = 'block';
                    this.querySelector('.dropdown-arrow').style.transform = 'rotate(180deg)';
                }
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = 'none';
                 if (content.previousElementSibling.querySelector('.dropdown-arrow')) {
                    content.previousElementSibling.querySelector('.dropdown-arrow').style.transform = 'rotate(0deg)';
                 }
            });
        }
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Active navigation link highlighting
    const currentLocation = window.location.href;
    const navMenuLinks = document.querySelectorAll('.nav-links a:not(.dropbtn)');
    navMenuLinks.forEach(link => {
        if (currentLocation.includes(link.getAttribute('href'))) {
            if (link.getAttribute('href') !== "javascript:void(0)") {
                if (!link.closest('.dropdown-content')) {
                    link.classList.add('active');
                }
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.querySelector('.dropbtn').classList.add('active');
                }
            }
        }
    });

    // --- PROJECT FILTERING LOGIC ---
    const projectListTitle = document.getElementById('project-list-title');
    const projectRows = document.querySelectorAll('.project-listing .project-row');
    const noProjectsMessage = document.getElementById('no-projects-message');
    const shortcutButtons = document.querySelectorAll('.shortcut-buttons .btn-shortcut');
    const navFilterLinks = document.querySelectorAll('.dropdown-content a[href*="?filter="]');

    function filterProjects(filterCategory) {
        let projectsFound = 0;
        projectRows.forEach(row => {
            const projectCategory = row.getAttribute('data-category');
            if (filterCategory === 'all' || projectCategory === filterCategory) {
                row.style.display = 'flex'; // Or 'block' if your CSS uses block
                projectsFound++;
            } else {
                row.style.display = 'none';
            }
        });

        if (projectListTitle) {
            if (filterCategory === 'all') {
                projectListTitle.textContent = 'All Work';
            } else {
                projectListTitle.textContent = filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1) + ' Work';
            }
        }

        if (noProjectsMessage) {
            if (projectsFound === 0) {
                noProjectsMessage.style.display = 'block';
            } else {
                noProjectsMessage.style.display = 'none';
            }
        }

        shortcutButtons.forEach(button => {
            const buttonFilter = button.getAttribute('href').includes('?filter=') ? button.getAttribute('href').split('=')[1] : null;
            if (buttonFilter === filterCategory) {
                button.classList.add('active-filter');
            } else {
                button.classList.remove('active-filter');
            }
        });
        navFilterLinks.forEach(link => {
            const linkFilter = new URL(link.href).searchParams.get('filter');
            if (linkFilter === filterCategory) {
                link.classList.add('active-filter');
            } else {
                link.classList.remove('active-filter');
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter');

    if (initialFilter && (document.body.contains(projectRows[0]) || window.location.pathname.includes('projects.html'))) {
        filterProjects(initialFilter);
    } else if (projectRows.length > 0 && !initialFilter) {
        filterProjects('all');
        // Highlight the "All" button if it exists and we are defaulting to all
        shortcutButtons.forEach(button => {
            if (button.getAttribute('href').endsWith('?filter=all')) {
                button.classList.add('active-filter');
            }
        });
    }

    shortcutButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            if (window.location.pathname.includes('index.html') || !this.getAttribute('href').includes('projects.html')) {
                event.preventDefault();
                const filterValue = this.getAttribute('href').split('=')[1];
                filterProjects(filterValue);
            }
        });
    });

    navFilterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (window.location.pathname.includes('projects.html')) {
                 event.preventDefault();
                 const filterValue = new URL(this.href).searchParams.get('filter');
                 filterProjects(filterValue);
                 history.pushState(null, '', 'projects.html?filter=' + filterValue);
            }
        });
    });

    // --- SVG LOGO HOVER SWAP ---
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        const logoImage = logoLink.querySelector('img');
        if (logoImage) {
            const originalLogoSrc = logoImage.src; // Stores the initial src
            const hoverLogoSrc = 'images/carlos-hover.svg'; // CHANGE THIS to your hover SVG path

            logoLink.addEventListener('mouseenter', function() {
                logoImage.src = hoverLogoSrc;
            });

            logoLink.addEventListener('mouseleave', function() {
                logoImage.src = originalLogoSrc;
            });
        }
    }
});