# Self-Healing Infrastructure with Prometheus, Alertmanager, and Ansible

## Introduction

This project demonstrates a self-healing infrastructure using a combination of monitoring, alerting, and automation tools. The goal is to automatically detect and recover from service failures without manual intervention, thereby increasing system reliability and availability.

We will be monitoring a simple Node.js application. When the application becomes unavailable, Prometheus will detect it and send an alert to Alertmanager. Alertmanager will then trigger a webhook to a custom-built Flask application, which in turn will execute an Ansible playbook to restart the failed service.

## Architecture

The project consists of the following components, all orchestrated using Docker Compose:

1.  **Node.js Application (`app`)**: A simple "Hello World" web server with a `/metrics` endpoint for Prometheus to scrape and a `/health` endpoint for health checks.

2.  **Prometheus (`prometheus`)**: A monitoring system that scrapes metrics from the Node.js application. It is configured with alert rules to detect when the application is down.

3.  **Alertmanager (`alertmanager`)**: Handles alerts sent by Prometheus. It is configured to send a webhook to our webhook receiver when an alert is firing.

4.  **Webhook Receiver (`webhook`)**: A Python Flask application that listens for webhooks from Alertmanager. Upon receiving a webhook, it executes an Ansible playbook.

5.  **Ansible (`ansible`)**: An automation tool used for configuration management and application deployment. In this project, we use an Ansible playbook to restart the Node.js application container. The playbook is executed by the webhook receiver.

## How to Run the Project

1.  **Prerequisites**: Make sure you have Docker and Docker Compose installed on your machine.

2.  **Start the services**: Run the following command in the root directory of the project:
    ```bash
    docker-compose up --build
    ```
    This will build the necessary Docker images and start all the services.

3.  **Verify the services are running**:
    *   **Node.js Application**: Open your browser and navigate to `http://localhost:8080`. You should see "Hello World!".
    *   **Prometheus**: Access the Prometheus UI at `http://localhost:9090`. In the "Targets" section, you should see the `nodejs-app` job with a state of "UP".
    *   **Alertmanager**: Access the Alertmanager UI at `http://localhost:9093`.
    *   **Webhook**: The webhook service runs on port `5001`.

## Testing the Self-Healing Mechanism

To test the self-healing functionality, we will manually stop the Node.js application container and observe if it gets restarted automatically.

1.  **Find the container ID of the app**:
    ```bash
    docker ps
    ```
    Look for the container with the name `app`.

2.  **Stop the container**:
    ```bash
    docker stop app
    ```

3.  **Observe the process**:
    *   **Prometheus**: After a short while (the scrape interval is 15s), Prometheus will fail to scrape the `/metrics` endpoint of the app. The `up{job="nodejs-app"}` metric will become `0`.
    *   **Alerting**: After the alert has been firing for the configured duration (1 minute), Prometheus will send an alert to Alertmanager.
    *   **Alertmanager**: You can see the alert in the Alertmanager UI (`http://localhost:9093`). Alertmanager will then send a webhook to our receiver.
    *   **Webhook**: The webhook receiver will log a message to the console indicating that it has received a webhook. It will then execute the Ansible playbook.
    *   **Ansible**: The Ansible playbook will restart the `app` container.

4.  **Verify the recovery**:
    *   Run `docker ps` again. You should see that the `app` container is running again.
    *   The alert in Prometheus and Alertmanager will eventually go into a "resolved" state.
    *   You should be able to access `http://localhost:8080` again.

This completes the demonstration of the self-healing infrastructure. The system automatically detected the failure and recovered from it without any human intervention.
