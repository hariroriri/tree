const data = {
    roririGroups: {
        roririSoftwareSolutions: {
            name: "Roriri Software Solutions",
            details: {
                location: "Location A",
                contact: "123-456-7890",
                website: "http://www.roririsoftware.com"
            },
            departments: {
                development: {
                    head: "Alice Smith",
                    email: "alice@roririsoftware.com",
                    phone: "123-456-7891"
                },
                marketing: {
                    head: "Bob Johnson",
                    email: "bob@roririsoftware.com",
                    phone: "123-456-7892"
                }
            },
            services: ["Software Development", "Consulting", "Support"],
            contactPersons: [
                {
                    name: "Alice Smith",
                    role: "Head of Development",
                    email: "alice@roririsoftware.com"
                },
                {
                    name: "Bob Johnson",
                    role: "Head of Marketing",
                    email: "bob@roririsoftware.com"
                }
            ]
        },
        nexgenITCollege: {
            name: "Nexgen IT College",
            details: {
                location: "Location B",
                contact: "234-567-8901",
                website: "http://www.nexgenitcollege.com"
            },
            departments: {
                computerScience: {
                    head: "Dr. Carol Davis",
                    email: "carol@nexgenitcollege.com",
                    phone: "234-567-8902"
                },
                businessAdministration: {
                    head: "Dr. Dan Miller",
                    email: "dan@nexgenitcollege.com",
                    phone: "234-567-8903"
                }
            },
            programs: ["Computer Science", "Business Administration", "Cybersecurity"],
            contactPersons: [
                {
                    name: "Dr. Carol Davis",
                    role: "Head of Computer Science",
                    email: "carol@nexgenitcollege.com"
                },
                {
                    name: "Dr. Dan Miller",
                    role: "Head of Business Administration",
                    email: "dan@nexgenitcollege.com"
                }
            ]
        }
    }
};

function createHierarchy(data, container) {
    const ul = document.createElement('ul');

    for (const key in data) {
        const li = document.createElement('li');
        
        if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            li.innerHTML = `<strong>${data[key].name}</strong>`;
            createHierarchy(data[key], li);
            li.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('open');
            });
        } else if (Array.isArray(data[key])) {
            li.innerHTML = `<strong>${key}:</strong> ${data[key].join(', ')}`;
        } else {
            li.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
        }

        ul.appendChild(li);
    }

    container.appendChild(ul);
}

const hierarchyContainer = document.getElementById('hierarchyTree');
createHierarchy(data.roririGroups, hierarchyContainer);

let expanded = false;
let zoomLevel = 1;

window.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY > 0) {
            zoomLevel = Math.max(0.5, zoomLevel - 0.1); // Zoom out, minimum scale 0.5x
        } else {
            zoomLevel = Math.min(2, zoomLevel + 0.1); // Zoom in, maximum scale 2x
        }
        hierarchyContainer.style.transform = `scale(${zoomLevel})`;
    } else {
        if (e.deltaY > 0 && !expanded) {
            hierarchyContainer.style.height = 'auto';
            expanded = true;
        } else if (e.deltaY < 0 && expanded) {
            hierarchyContainer.style.height = '300px';
            expanded = false;
        }
    }
});
