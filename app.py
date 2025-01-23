import logging
from flask import Flask, send_from_directory, abort, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

logger = logging.getLogger('Muice.Captions')

class Captions:
    def __init__(self, port=8082):
        self.app = Flask(__name__, static_folder='./')
        CORS(self.app)
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")
        self.port = port
        self._setup_routes()
        self._setup_socketio_events()

    def _setup_routes(self):
        self.app.add_url_rule('/index.html', 'serve_file', self.serve_file)
        self.app.add_url_rule('/css/index.css', 'serve_file2', self.serve_file2)
        self.app.add_url_rule('/js/index.js', 'serve_file3', self.serve_file3)
        self.app.add_url_rule('/js/socket.io.js', 'serve_file4', self.serve_file4)
        self.app.add_url_rule('/src/favicon.png', 'favicon', self.favicon)
        self.app.add_url_rule('/api/sendmessage', 'send_message', self.send_message, methods=['POST'])

    def _setup_socketio_events(self):
        self.socketio.on_event('message', self.handle_message)

    def serve_file(self):
        return send_from_directory(self.app.static_folder, 'index.html')

    def serve_file2(self):
        return send_from_directory(self.app.static_folder, 'css/index.css')

    def serve_file3(self):
        return send_from_directory(self.app.static_folder, 'js/index.js')

    def serve_file4(self):
        return send_from_directory(self.app.static_folder, 'js/socket.io.js')

    def favicon(self):
        return send_from_directory(self.app.static_folder, 'src/favicon.png')

    def handle_message(self, data):
        self.socketio.emit('message', data, broadcast=True)

    def send_message(self):
        try:
            data = request.get_json()
            self.socketio.emit('message', data)
            logger.info(f'user: {data["user"]}, message: {data["message"]}, respond: {data["respond"]}')
            logger.info('200 OK')
            return jsonify({"code": 200, "message": "OK"})
        except:
            logger.error('400 参数缺失或产生内部错误')
            abort(400)
            return jsonify({"code": 400, "message": "参数缺失或产生内部错误"})

    def run(self):
        url = f'http://localhost:{self.port}/index.html'
        self.socketio.run(self.app, host='0.0.0.0', port=self.port, debug=False)

if __name__ == '__main__':
    app_instance = Captions()
    app_instance.run()