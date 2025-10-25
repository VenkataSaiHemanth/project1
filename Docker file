FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Ansible
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ansible \
    && rm -rf /var/lib/apt/lists/*

# Install Docker python support for ansible
RUN pip install docker

# Install community.docker collection
RUN ansible-galaxy collection install community.docker

COPY . .

CMD ["python", "app.py"]
