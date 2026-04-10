SUMMARY = "Real-time system monitor Flask app"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/MIT;md5=0835c9148a6b53b82a31b1f7f26f9f6e"

SRC_URI = "file://app.py \
           file://templates/index.html \
           file://static/app.js \
           file://static/style.css \
           file://system-monitor.service"

S = "${WORKDIR}"

inherit systemd

RDEPENDS:${PN} += "python3 python3-flask python3-psutil python3-prometheus-flask-exporter"

SYSTEMD_SERVICE:${PN} = "system-monitor.service"
SYSTEMD_AUTO_ENABLE = "enable"

do_install() {
    install -d ${D}/opt/system-monitor/templates
    install -d ${D}/opt/system-monitor/static
    install -d ${D}${systemd_system_unitdir}

    install -m 0755 ${WORKDIR}/app.py ${D}/opt/system-monitor/app.py
    install -m 0644 ${WORKDIR}/templates/index.html ${D}/opt/system-monitor/templates/index.html
    install -m 0644 ${WORKDIR}/static/app.js ${D}/opt/system-monitor/static/app.js
    install -m 0644 ${WORKDIR}/static/style.css ${D}/opt/system-monitor/static/style.css
    install -m 0644 ${WORKDIR}/system-monitor.service ${D}${systemd_system_unitdir}/system-monitor.service
}

FILES:${PN} += "/opt/system-monitor ${systemd_system_unitdir}/system-monitor.service"