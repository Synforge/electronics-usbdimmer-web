from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

app.debug = True

@app.route("/")
def index():
    app.logger.info('User Connected: %s - %s', request.remote_addr, request.headers['User-Agent'])
    return render_template('index.html')

@app.route("/contact")
def contact():
    return render_template('contact.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0')