// JSON File path (Temporary, will need to be changed for scale)
const filePath = ('src/lib/apps.json');

let loadedApps = [];

// Function to load apps from a JSON file
function loadApps() {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const apps = data.apps;
            loadedApps = apps;
            return apps;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);

        });
}

// Function to write a new app to the JSON file if it's unique
async function addApp(newApp) {
    try {
        newApp.id = loadedApps.length + 1;
        const apps = await loadApps();

        // Ensure apps is an array
        if (!Array.isArray(apps)) {
            throw new TypeError('Loaded apps is not an array');
        }

        // Check if the app is unique based on a unique identifier (e.g., id or name)
        const isUnique = !apps.some(app => app.id === newApp.id || app.name === newApp.name);
        if (!isUnique) {
            throw new Error('App already exists');
        }

        // Add the new app to the list
        loadedApps.push(newApp);


    } catch (error) {
        console.error('There was a problem adding the app:', error);
    }
}


// Function to filter apps based on a search term
function filterApps(apps, filter) {
    filter = filter.toLowerCase();
    return apps.filter(app => app.name.toLowerCase().includes(filter));
}




// Export the function
export { loadApps, addApp, filterApps, loadedApps };