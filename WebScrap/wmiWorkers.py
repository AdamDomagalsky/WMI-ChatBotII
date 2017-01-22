#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import urllib2, re
import unicodecsv as csv
from bs4 import BeautifulSoup


url="https://stafflist.wmi.amu.edu.pl/"

def scrap(url):
	response = urllib2.urlopen(url) 
	with open('wmiStaff.html','w') as f: f.write(response.read())


def getStaff():
	with open('wmiStaff.html','r') as f: page_source = f.read()
	soup = BeautifulSoup(page_source, 'html.parser')


	table = soup.table
	pattern = re.compile('^details/\d*')
	links = []
	for link in table.findAll('a'):
		string = link.get('href')
		if re.match(pattern,string):
			links.append(string)
	return links


def getInfo(sublink):
	response = urllib2.urlopen(url+sublink)
	soup = BeautifulSoup(response.read(), 'html.parser')
	soup = soup.body
	#soup.span.decompose()


	degree = soup.h1.get_text()
	name = soup.h2.get_text()
	faculty = ' '.join(soup.h3.get_text().strip().split())
	print ' '.join(soup.h3.get_text().strip().split())
	#print ' '.join(faculty.split())
	info = {}
	for tr in soup.table.findAll('tr'):
		info[tr.th.get_text().encode('utf-8')] = tr.td.get_text().encode('utf-8')

	lvl = info['stopień naukowy']
	position = info['stanowisko']
	room = info['pokój']
	phone = info['telefon']
	mail = info['e-mail']

	if 'strona internetowa' in info.keys():
		web = "".join(info['strona internetowa'])
	else:
		web = 'No'

	if 'dyżury' in info.keys():
		when = " ".join(info['dyżury'].split()).replace('\"','').replace('\t','')
	else:
		when = 'No'

	return {'name':name, 'degree':degree, 'faculty':faculty,'lvl':lvl, 'position':position, 'room':room,'phone':phone, 'mail':mail,'website':web, 'when':when}



with open('wmiStaff.tsv', 'a') as csvfile:
	fieldnames = ['name', 'degree', 'faculty','lvl', 'position', 'room','phone' ,'mail','website', 'when']
	writer = csv.DictWriter(csvfile, fieldnames=fieldnames,delimiter='\t')
	writer.writeheader()
	for i in getStaff():
		print i
		writer.writerow(getInfo(i))





