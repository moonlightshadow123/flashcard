from gtts import gTTS
from pathlib import Path
import os,time,threading

class TTS:
	def __init__(self, save_dir="./", root_url="./", span=30):
		self.save_dir = save_dir
		self.span = span
		self.root_url = root_url

	def lookup(self, word, lang):
		tts = gTTS(word, lang=lang)
		file_path,file_url = self.getName(word)
		tts.save(file_path)
		t = threading.Thread(target=self.gc, args=(file_path,self.span))
		t.start()
		return {"url":file_url}

	def getName(self, word):
		file_name = word + ".mp3"
		file_path = self.save_dir + file_name
		while Path(file_path).exists():
			word += "_"
			file_name = word + ".mp3"
			file_path = self.save_dir + file_name
		return file_path, self.root_url+file_name

	def gc(self, file, span):
		time.sleep(span)
		try:
			os.remove(file)
		except OSError:
			pass

if __name__ == "__main__":
	save_dir = "./"
	span = 10
	tts = TTS(save_dir, span)
	res = tts.lookup('생신', lang='ko')
	print(res)
	time.sleep(2)
	res = tts.lookup('생신', lang='ko')
	print(res)
#tts = gTTS('생신', lang='ko')
#tts.save('hello.mp3')