import logging
from flask import Flask, send_from_directory, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

logging.basicConfig(format='[%(levelname)s] %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)
werkzeug_logger = logging.getLogger("werkzeug")
werkzeug_logger.setLevel(logging.WARNING)

app = Flask(__name__, static_folder='./')
CORS(app)  # 允许跨域请求
socketio = SocketIO(app, cors_allowed_origins="*")

port = 5500

@app.route('/index.html')
def serve_file():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/css/index.css')
def serve_file2():
    return send_from_directory(app.static_folder, 'css/index.css')

@app.route('/js/index.js')
def serve_file3():
    return send_from_directory(app.static_folder, 'js/index.js')

@app.route('/js/socket.io.js')
def serve_file4():
    return send_from_directory(app.static_folder, 'js/socket.io.js')

@app.route('/src/favicon.png')
def favicon():
    return send_from_directory(app.static_folder, 'src/favicon.png')

@socketio.on('message')
def handle_message(data):
    avatar = data['avatar']
    user = data['user']
    message = data['message']
    respond = data['respond']
    emit('message',{'user':user, 'avatar':avatar, 'message':message, 'respond':respond}, broadcast=True)
    
@app.route('/api/sendmessage', methods=['POST'])
def send_message():
    try:
        user = request.args.get('user')
        avatar = request.args.get('avatar')
        message = request.args.get('message')
        respond = request.args.get('respond')
        if user and avatar and respond:
            socketio.emit('message', {'user':user, 'avatar':avatar, 'message':message, 'respond':respond})
            logger.info('200 OK')
            return jsonify({"code": 200, "message": "OK"})
        else:
            logger.error('400 Error')
            return jsonify({"code": 400, "message": "Error"})   
    except:
        logger.error('400 Error')
        return jsonify({"code": 400, "message": "Error"})
    
if __name__ == '__main__':
    url = f'http://localhost:{port}/index.html'
    logger.info(f"Running at：{url}")
    socketio.run(app, host='0.0.0.0', port=port, debug=False)