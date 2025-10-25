from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    if request.method == 'POST':
        print("Webhook received!")
        # For now, we'll just print the data.
        # In the future, we will trigger the ansible playbook here.
        print(request.json)
        # Trigger ansible playbook
        # Using shell=True is a security risk, but for this demo it's fine.
        # In a real-world scenario, we would use a more secure way to do this.
        subprocess.run(["ansible-playbook", "-i", "ansible/inventory.ini", "ansible/playbook.yml"], shell=False)
        return "Webhook received!", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
