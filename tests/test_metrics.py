from app import app


def test_metrics_endpoint():
    client = app.test_client()
    response = client.get("/metrics")
    assert response.status_code == 200