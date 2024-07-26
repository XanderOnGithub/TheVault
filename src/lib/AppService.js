import fs from 'fs';
import path from 'path';

// JSON File path (Temporary, will need to be changed for scale)
const filePath = ('src/lib/apps.json');

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
            return apps;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            return [];
        });
}

// Function to write a new app to the JSON file if it's unique
async function addApp(newApp) {
    try {
        const apps = await loadApps();

        // Check if the app is unique based on a unique identifier (e.g., id or name)
        const isUnique = !apps.some(app => app.id === newApp.id || app.name === newApp.name);
        if (!isUnique) {
            throw new Error('App already exists');
        }

        // Add the new app to the list
        apps.push(newApp);

        // Write the updated list back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify({ apps }, null, 2), 'utf8');
        return newApp;
    } catch (error) {
        console.error('There was a problem with adding the app:', error);
        throw error;
    }
}


// Function to filter apps based on a search term
function filterApps(apps, filter) {
    filter = filter.toLowerCase();
    return apps.filter(app => app.name.toLowerCase().includes(filter));
}


// Export the function
export { loadApps, addApp, filterApps };