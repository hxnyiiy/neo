#!/usr/bin/env python

import threading, requests, time

def getHtml(url):
    resp = requests.get(url)
    time.sleep(1)
    print(url, len(resp.text), 'chars')

t = threading.Thread(target=getHtml, args=('http://google.com',))
t.daemon = True
t.start()

while True:
    for _ in range(5):
        time.sleep(1)
    print('### END ###')
    break