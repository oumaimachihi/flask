from app import app


def test_stats_endpoint():
    client = app.test_client()
    response = client.get("/stats")

    assert response.status_code == 200

    data = response.get_json()
    assert "cpu_percent" in data
    assert "ram_percent" in data
    assert "disk_percent" in data
    assert "ip_address" in data
    assert "mac_address" in data
    assert "network_status" in data
    assert "hostname" in data
    assert "os" in data
    assert "processor" in data