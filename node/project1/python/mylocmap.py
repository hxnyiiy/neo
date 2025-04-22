from geopy.geocoders import Nominatim

def geocoding(address):
  geocoder = Nominatim(user_agent='South Korea',timeout=None)
  geo = geocoder.geocode(address)
  crd = {"lat":float(geo.latitude),'lng':float(geo.longitude)}

  return crd

address = input("ㅎ도로명 주소를 입력하세요")
crd= geocoding(address)
print(crd)
print('위도:' , crd['lat'])
print('경도:' , crd['lng'])


my_map = folium.Map(location=[crd['lat'],crd['lng']],zoom_start=13)
folium.Marker([crd['lat'],crd['lng']],icon=folium.Icon(color='red',icon='fa-home',prefix='fa')).add_to(my_map)
my_map

