from flask import Flask, render_template, jsonify
import psutil
import socket
import os
import platform
from datetime import datetime

app = Flask(__name__)


def bytes_to_gb(value):
    return round(value / (1024 ** 3), 2)


def get_network_info():
    addrs = psutil.net_if_addrs()
    stats = psutil.net_if_stats()

    for iface, addr_list in addrs.items():
        if iface.lower().startswith("lo"):
            continue

        ip_addr = None
        mac_addr = None
        is_up = stats.get(iface).isup if iface in stats else False

        for addr in addr_list:
            if addr.family == socket.AF_INET:
                ip_addr = addr.address
            elif str(addr.family) == 'AddressFamily.AF_PACKET' or getattr(socket, "AF_LINK", None) == addr.family:
                mac_addr = addr.address

        if ip_addr or mac_addr:
            return {
                "interface": iface,
                "ip": ip_addr or "N/A",
                "mac": mac_addr or "N/A",
                "status": "Up" if is_up else "Down"
            }

    return {
        "interface": "N/A",
        "ip": "N/A",
        "mac": "N/A",
        "status": "Down"
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/stats")
def stats():
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage(os.sep)
    net = get_network_info()

    data = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "hostname": platform.node(),
        "system": platform.system(),
        "processor": platform.processor() or "N/A",
        "cpu_percent": round(cpu, 1),
        "ram_percent": round(ram.percent, 1),
        "ram_used_gb": bytes_to_gb(ram.used),
        "ram_total_gb": bytes_to_gb(ram.total),
        "disk_percent": round(disk.percent, 1),
        "disk_used_gb": bytes_to_gb(disk.used),
        "disk_total_gb": bytes_to_gb(disk.total),
        "interface": net["interface"],
        "ip_address": net["ip"],
        "mac_address": net["mac"],
        "network_status": net["status"]
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)