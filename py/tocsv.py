import csv
import kroman

source_file = "../web/txt/JapaneseCore2000.txt"
target_file = "../web/csv/JapaneseCore20001.csv"
# header = ["index", "word", "meaning", "category"]
header = ["index", "word", "meaning", "furi", "pos", "e.g.","e.g.[voc]", "e.g.[eng]"]
row_ele = [1,4,2,6,9,8,11]


def krom(header, row):
	for idx,title in enumerate(header):
		if title == "kroman":
			row[idx] = kroman.parse(row[idx])

def jrom(header, row):
	for idx,title in enumerate(header):
		if title == "jroman":
			pass


f = open(target_file, "w", newline='', encoding="utf-8")
wr = csv.writer(f, quoting=csv.QUOTE_ALL)
with open(source_file, encoding="utf-8") as rf:
	f_csv = csv.reader(rf)
	wr.writerow(header)
	i = 1
	for row in rf:
		print(i,row)
		n_row = row.strip("\n").split("\t")
		therow = [i] + [n_row[idx] for idx in row_ele]
		krom(header, therow)
		jrom(header, therow)
		wr.writerow(therow)
		i += 1
	f.close()

