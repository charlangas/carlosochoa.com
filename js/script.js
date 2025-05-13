document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

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
            // Only apply click toggle for mobile-sized screens where CSS hover might not be ideal
            if (window.innerWidth <= 768) {
                event.preventDefault(); // Prevent page jump if href is "#" or actual link
                const currentDropdownContent = this.nextElementSibling;
                // Close other open dropdowns
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    if (content !== currentDropdownContent) {
                        content.style.display = 'none';
                        if (content.previousElementSibling.querySelector('.dropdown-arrow')) {
                           content.previousElementSibling.querySelector('.dropdown-arrow').style.transform = 'rotate(0deg)';
                        }
                    }
                });

                // Toggle current dropdown
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

    // Close dropdown if clicked outside (for all screen sizes)
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = 'none';
                 // Reset arrow direction if it exists
                 const arrow = content.previousElementSibling.querySelector('.dropdown-arrow');
                 if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
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
        if (link.href === currentLocation) { // More precise check
            if (!link.closest('.dropdown-content')) {
                link.classList.add('active');
            }
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropbtn').classList.add('active');
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
                row.style.display = 'flex'; // Assuming flex display; adjust if needed
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
            noProjectsMessage.style.display = projectsFound === 0 ? 'block' : 'none';
        }

        // Update active state for ALL filter buttons/links
        const allFilterElements = [...shortcutButtons, ...navFilterLinks];
        allFilterElements.forEach(element => {
            let elementFilter = null;
            if (element.getAttribute('href').includes('?filter=')) {
                try {
                    elementFilter = new URL(element.href).searchParams.get('filter');
                } catch (e) { // Handle cases where element.href might not be a full URL
                    const hrefAttr = element.getAttribute('href');
                    if (hrefAttr.includes('?filter=')) {
                         elementFilter = hrefAttr.split('?filter=')[1];
                    }
                }
            }

            if (elementFilter === filterCategory) {
                element.classList.add('active-filter');
            } else {
                element.classList.remove('active-filter');
            }
        });
    }

    // Get filter from URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilterFromUrl = urlParams.get('filter');

    // Only apply filtering if project rows exist on the page
    if (projectRows.length > 0) {
        if (initialFilterFromUrl) {
            filterProjects(initialFilterFromUrl);
        } else {
            filterProjects('all'); // Default to 'all' if no filter in URL
        }
    }

    // Add event listeners to shortcut buttons
    shortcutButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const targetUrl = new URL(this.href, window.location.origin); // Resolve relative URLs
            const filterValue = targetUrl.searchParams.get('filter');

            // If on a page that is NOT projects.html but lists projects (e.g. index.html)
            // AND the button is intended to filter on the current page (not navigate away)
            if (!window.location.pathname.endsWith('projects.html') && targetUrl.pathname === window.location.pathname) {
                 if (filterValue) {
                    event.preventDefault();
                    filterProjects(filterValue);
                    // Optional: update URL hash for bookmarking on index.html
                    // window.location.hash = 'filter=' + filterValue;
                 }
            }
            // If the button click is on index.html and links to projects.html,
            // or if it's on projects.html already, let the default navigation
            // (or the projects.html specific listener below) handle it.
        });
    });

    // Add event listeners to navigation filter links (dropdown)
    navFilterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // If we are already on projects.html, filter without full page reload
            if (window.location.pathname.endsWith('projects.html') || window.location.pathname.endsWith('projects')) {
                 event.preventDefault();
                 const filterValue = new URL(this.href).searchParams.get('filter');
                 if (filterValue) {
                    filterProjects(filterValue);
                    // Update URL without full reload for better UX
                    history.pushState({filter: filterValue}, '', 'projects.html?filter=' + filterValue);
                 }
            }
            // Otherwise, allow default navigation to projects.html?filter=...
        });
    });

    // --- SVG LOGO HOVER SWAP ---
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        const logoImage = logoLink.querySelector('img');
        if (logoImage) {
            const initialLogoSrc = logoImage.src; // Get the fully resolved path of the original logo
            let hoverLogoPath = 'images/carlos-hover.svg'; // Default path for root directory

            // Check if the current page is in the 'projects' subdirectory
            if (window.location.pathname.includes('/projects/')) {
                hoverLogoPath = '../images/carlos-hover.svg'; // Adjust path for subdirectories
            }

            logoLink.addEventListener('mouseenter', function() {
                logoImage.src = hoverLogoPath;
            });

            logoLink.addEventListener('mouseleave', function() {
                logoImage.src = initialLogoSrc; // Revert to the original, correctly resolved path
            });
        }
    }
});
