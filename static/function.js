let autoUpdate = true;
let intervalId = null;
let sortableInstance = null;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function setBar(id, percent) {
  const el = document.getElementById(id);
  if (el) {
    const safeValue = Math.max(0, Math.min(100, Number(percent) || 0));
    el.style.width = safeValue + "%";
  }
}

function setStatus(status) {
  const el = document.getElementById("netStatus");
  if (!el) return;

  el.textContent = status;

  if (status === "Up") {
    el.className = "value status-up";
  } else {
    el.className = "value status-down";
  }
}

async function refreshStats() {
  try {
    const response = await fetch("/stats", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();

    setText("cpuValue", data.cpu_percent + "%");
    setText("ramValue", data.ram_percent + "%");
    setText("diskValue", data.disk_percent + "%");

    setText("processorText", "Processor: " + data.processor);
    setText("ramText", `Used: ${data.ram_used_gb} / ${data.ram_total_gb} GB`);
    setText("diskText", `Used: ${data.disk_used_gb} / ${data.disk_total_gb} GB`);

    setText("ifaceText", "Interface: " + data.interface);
    setText("ipText", "IP: " + data.ip_address);
    setText("macText", "MAC: " + data.mac_address);

    setStatus(data.network_status);

    setText("systemValue", data.system);
    setText("hostText", "Hostname: " + data.hostname);
    setText("timeText", "Updated: " + data.time);

    setBar("cpuBar", data.cpu_percent);
    setBar("ramBar", data.ram_percent);
    setBar("diskBar", data.disk_percent);
  } catch (error) {
    console.error("Failed to refresh stats:", error);
    setText("timeText", "Updated: error while fetching data");
  }
}

function startAutoUpdate() {
  if (intervalId) return;

  intervalId = setInterval(() => {
    if (autoUpdate) {
      refreshStats();
    }
  }, 1000);
}

function stopAutoUpdate() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function toggleAutoUpdate() {
  autoUpdate = !autoUpdate;

  const btn = document.getElementById("toggleBtn");
  if (btn) {
    btn.textContent = autoUpdate ? "Pause auto update" : "Resume auto update";
  }

  if (autoUpdate) {
    refreshStats();
  }
}

function initDragAndDrop() {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard || typeof Sortable === "undefined") return;

  sortableInstance = new Sortable(dashboard, {
    animation: 150,
    ghostClass: "sortable-ghost",
    dragClass: "sortable-drag",
    chosenClass: "sortable-chosen",
    onEnd: function (evt) {
      console.log("Card moved from", evt.oldIndex, "to", evt.newIndex);
    }
  });
}

function bindButtons() {
  const refreshBtn = document.getElementById("refreshBtn");
  const toggleBtn = document.getElementById("toggleBtn");

  if (refreshBtn) {
    refreshBtn.addEventListener("click", refreshStats);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleAutoUpdate);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindButtons();
  initDragAndDrop();
  refreshStats();
  startAutoUpdate();
});