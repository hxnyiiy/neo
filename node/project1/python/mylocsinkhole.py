from fastapi import FastAPI, Query
import requests
import json
import uvicorn
import os
from geopy.geocoders import Nominatim

def geocoding(address):
  geocoder = Nominatim(user_agent='South Korea',timeout=None)
  geo = geocoder.geocode(address)
  crd = {"lat":float(geo.latitude),'lng':float(geo.longitude)}

  return crd


address = input("현재 위치의 도로명 주소를 입력하세요 :")
crd= geocoding(address)
print(crd)
print('위도:' , crd['lat'])
print('경도:' , crd['lng'])

my_map = folium.Map(location=[crd['lat'],crd['lng']],zoom_start=13)
