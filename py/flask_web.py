from flask import Flask, jsonify, request, send_from_directory
from tts import TTS

host = "http://3.136.211.6:8080/mp3/"
#host = "http://localhost:8080/mp3/"

webtts = TTS("../web/mp3/", host)
app = Flask(__name__, static_url_path='', static_folder="../web")

@app.route('/tts')
def tts():
    word = request.args.get('word', default='', type=str)
    lang = request.args.get('lang', default='', type=str)
    data = webtts.lookup(word, lang)
    return jsonify(data)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8080)
