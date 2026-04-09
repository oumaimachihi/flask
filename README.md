# System Monitor Application 
Overview
This application is a Flask-based real-time system monitor that displays live information about CPU usage, RAM usage, disk usage, IP address, MAC address, network status, processor, hostname, and operating system through a web dashboard. The backend exposes a main page and a JSON endpoint, while the frontend updates the interface periodically with JavaScript and allows drag-and-drop reordering of dashboard cards using SortableJS.

## Architecture
The application follows a simple client-server structure. Flask serves the HTML dashboard through the root route / and returns real-time monitoring data through the /stats route in JSON format using jsonify. The browser uses JavaScript fetch() calls to request this data at regular intervals and updates the displayed values without reloading the page.

## Backend components
The backend is written in Python and relies mainly on Flask and psutil. Flask handles routing, template rendering, and JSON responses, while psutil provides cross-platform access to CPU, memory, disk, and network interface information.

Typical backend responsibilities include:

Reading CPU utilization with psutil.cpu_percent().

Reading RAM usage with psutil.virtual_memory().

Reading disk usage with psutil.disk_usage().

Reading interface addresses with psutil.net_if_addrs().

Reading interface state with psutil.net_if_stats().

Returning data to the frontend as JSON with Flask jsonify.

## Frontend components
The frontend consists of HTML, CSS, and JavaScript. JavaScript uses the Fetch API to read the /stats endpoint, updates text fields and progress bars in the DOM, and enables card reordering with SortableJS. The interface therefore behaves like a lightweight dashboard instead of a page that requires full refreshes for every update.

## Libraries and modules
The application uses a small number of third-party libraries plus a few Python standard-library modules.

| Category                | Library or module | Role                                                                       |
| ----------------------- | ----------------- | -------------------------------------------------------------------------- |
| Python library          | Flask             | Web server, routes, template rendering, JSON API.flask.palletsprojects+1   |
| Python library          | psutil            | CPU, RAM, disk, and network monitoring.pypi+1                              |
| Frontend library        | SortableJS        | Drag-and-drop reordering of dashboard cards.githubyoutube                  |
| Browser built-in        | Fetch API         | Requests live JSON stats from the backend.flask.palletsprojects+1          |
| Browser built-in        | DOM API           | Updates labels, values, and progress bars.flask.palletsprojects            |
| Python standard library | socket            | Reads IP-family network addresses and helps interpret interfaces.djangocas |
| Python standard library | os                | Determines the root disk path for usage checks.pypi                        |
| Python standard library | platform          | Retrieves host and OS metadata.flask.palletsprojects                       |
| Python standard library | datetime          | Formats timestamps for the last update time.flask.palletsprojects          |


## Functional features
The dashboard is designed to present core machine-health information in real time. Each widget corresponds to one or more backend outputs and is updated automatically every second through JavaScript polling.

## Displayed information
CPU usage as a real-time percentage.

RAM usage as a real-time percentage and used/total memory in GB.

Disk usage as a real-time percentage and used/total storage in GB.

Network interface name, IP address, MAC address, and up/down status.

Hostname, processor name, and operating system name.

Last update time shown in the dashboard.

## User interactions
The interface includes push-button interactions and drag-and-drop behavior. A refresh button triggers an immediate request to /stats, a pause/resume button controls automatic polling, and dashboard cards can be moved to a different order through drag-and-drop actions handled by SortableJS.

## Request flow
The following sequence describes the normal runtime behavior of the application.

The user opens the main dashboard page served by Flask from /.

The browser loads HTML, CSS, JavaScript, and the SortableJS library.

JavaScript sends a request to /stats using fetch().

Flask collects current system values using psutil and returns them as JSON.

JavaScript updates the visible values and progress bars in the page.

A timer repeats the process every second while auto-update is enabled.

Project structure
A typical project layout for this application is shown below.

```bash
project/
├── app.py
├── static/
│   ├── app.js
│   └── style.css
└── templates/
    └── index.html
```    
app.py contains the Flask server, routes, and system-data collection logic.

templates/index.html contains the dashboard markup.

static/app.js contains live-update logic, button actions, and drag-and-drop setup.

static/style.css contains the visual styling for the dashboard.

## Installation and startup
The Python side of the updated application mainly requires Flask and psutil. SortableJS is typically loaded from a CDN on the frontend rather than installed with pip.

### Install dependencies
```bash
pip install flask psutil
```
Run the application
```bash
python app.py
```
After startup, Flask serves the dashboard locally and the user can open it in a browser, typically at http://127.0.0.1:8080 if that host and port are configured in the application.

## Key implementation notes
A few design choices make this version cleaner and more reliable than the earlier plotting-based version. The application avoids blocking request loops inside Flask routes, uses a dedicated JSON endpoint for monitoring data, and shifts dynamic rendering to JavaScript in the browser.

Recommended implementation practices include:

Keep monitoring logic inside a dedicated /stats API route.

Use fetch() plus setInterval() for periodic updates on the client side.

Clamp progress-bar width values to 0 to 100 before writing them to CSS width properties.

Use psutil.net_if_addrs() and psutil.net_if_stats() together to determine network address data and link state.

Use drag-and-drop only for layout arrangement, while data refresh remains controlled by JavaScript functions and button handlers.

## Limitations and extensions
This application is suitable as a lightweight local dashboard, but it can be extended in several directions. Possible improvements include adding historical charts, saving the dragged widget order, adding per-interface network throughput, or wrapping the web app in a desktop shell such as PyWebView if a native desktop feel is required.

## Summary
The application combines Flask on the backend, psutil for system metrics, and JavaScript plus SortableJS on the frontend to create a real-time draggable monitoring dashboard. Its core strength is a simple architecture: Python gathers system information, Flask serves it as JSON, and the browser renders and updates the interface live.
