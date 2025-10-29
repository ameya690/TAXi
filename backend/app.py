# Copyright 2025
# Apache-2.0
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import structlog

from config.settings import Settings
from routes.health import health_bp
from routes.assist import assist_bp
from routes.eligibility import eligibility_bp

logger = structlog.get_logger(__name__)
SETTINGS = Settings()  # reads env

REQUESTS = Counter("taxi_requests_total", "Total HTTP requests", ["route"])

def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    CORS(app, origins=[o.strip() for o in SETTINGS.cors_origins.split(",")])

    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=["60 per minute"],
        storage_uri="memory://",
    )
    limiter.init_app(app)

    # Blueprints
    app.register_blueprint(health_bp, url_prefix="/")
    app.register_blueprint(assist_bp, url_prefix="/api")
    app.register_blueprint(eligibility_bp, url_prefix="/api/eligibility")

    @app.before_request
    def _incr():
        REQUESTS.labels(route="*").inc()

    if SETTINGS.enable_metrics:
        @app.get("/metrics")
        def metrics():
            return generate_latest(), 200, {"Content-Type": CONTENT_TYPE_LATEST}

    return app

app = create_app()

if __name__ == "__main__":
    host = SETTINGS.host
    port = int(SETTINGS.port)
    logger.info("starting_taxi", host=host, port=port, env=SETTINGS.env)
    app.run(host=host, port=port, debug=(SETTINGS.env == "development"))
