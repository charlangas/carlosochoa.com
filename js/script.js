document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainHeader = document.querySelector('.main-header');

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

        // Update active state for shortcut buttons
        shortcutButtons.forEach(button => {
            if (button.getAttribute('href').endsWith('?filter=' + filterCategory) || (filterCategory === 'all' && button.getAttribute('href').endsWith('?filter=all'))) {
                button.classList.add('active-filter'); // You'll need to style .active-filter in CSS
            } else {
                button.classList.remove('active-filter');
            }
        });
         // Update active state for nav filter links (more complex due to full URLs)
        navFilterLinks.forEach(link => {
            if (link.getAttribute('href').includes('?filter=' + filterCategory)) {
                link.classList.add('active-filter');
            } else {
                link.classList.remove('active-filter');
            }
        });
    }

    // Get filter from URL on page load (for projects.html)
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter');

    if (initialFilter && (document.body.contains(projectRows[0]) || window.location.pathname.includes('projects.html'))) {
        filterProjects(initialFilter);
    } else if (projectRows.length > 0) { // Default to 'all' if on a page with projects and no filter
        filterProjects('all');
    }


    // Add event listeners to shortcut buttons (likely on index.html)
    shortcutButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // If the button click is on index.html and links to projects.html,
            // the filtering will be handled by the URL parameter on projects.html load.
            // If you want to filter directly on index.html (if projects are also listed there):
            if (window.location.pathname.includes('index.html') || !this.getAttribute('href').includes('projects.html')) {
                event.preventDefault(); // Prevent navigation if filtering on the same page
                const filterValue = this.getAttribute('href').split('=')[1];
                filterProjects(filterValue);
                // If on index.html, and you also want to update the URL hash for history/bookmarking (optional):
                // window.location.hash = 'filter=' + filterValue;
            }
        });
    });

    // Add event listeners to navigation filter links (in the dropdown)
    navFilterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Similar to shortcut buttons, filtering is handled by URL param on projects.html.
            // If projects.html is the current page and you want instant filtering without page reload:
            if (window.location.pathname.includes('projects.html')) {
                 event.preventDefault();
                 const filterValue = new URL(this.href).searchParams.get('filter');
                 filterProjects(filterValue);
                 // Optionally update URL without full reload
                 history.pushState(null, '', 'projects.html?filter=' + filterValue);
            }
        });
    });
});