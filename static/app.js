let autoUpdate = true;
let intervalId = null;

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setBar(id, value) {
    const el = document.getElementById(id);
    if (el) el.style.width = `${value}%`;
}

async function fetchStats() {
    try {
        const response = await fetch("/stats");
        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }

        const data = await response.json();

        setText("cpu-value", `${data.cpu_percent}%`);
        setText("ram-value", `${data.ram_percent}%`);
        setText("disk-value", `${data.disk_percent}%`);

        setBar("cpu-bar", data.cpu_percent);
        setBar("ram-bar", data.ram_percent);
        setBar("disk-bar", data.disk_percent);

        setText("ip-value", data.ip_address);
        setText("mac-value", data.mac_address);
        setText("network-value", data.network_status);
        setText("hostname-value", data.hostname);
        setText("os-value", data.os);
        setText("processor-value", data.processor);
    } catch (error) {
        console.error(error);
    }
}

function startAutoRefresh() {
    if (!intervalId) {
        intervalId = setInterval(fetchStats, 1000);
    }
}

function stopAutoRefresh() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchStats();
    startAutoRefresh();

    const refreshBtn = document.getElementById("refresh-btn");
    const toggleBtn = document.getElementById("toggle-auto-btn");
    const dashboard = document.getElementById("dashboard");

    refreshBtn.addEventListener("click", fetchStats);

    toggleBtn.addEventListener("click", () => {
        autoUpdate = !autoUpdate;

        if (autoUpdate) {
            startAutoRefresh();
            toggleBtn.textContent = "Pause Auto Refresh";
        } else {
            stopAutoRefresh();
            toggleBtn.textContent = "Resume Auto Refresh";
        }
    });

    new Sortable(dashboard, {
        animation: 150
    });
});