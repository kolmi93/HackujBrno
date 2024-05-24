import csv
from geopy.geocoders import Nominatim
loc = Nominatim(user_agent="Geopy Library")

with open('mobiliar_hriste.csv', 'r', encoding='utf-8') as inputfile:
    data = inputfile.read().splitlines()

header = ["hriste", "adresa", "latitude", "longitude"]
oddelovac = ','
csv_zapis= csv.writer(open('hriste_vystup.csv', mode='w', encoding= 'UTF-8', newline=''), delimiter = oddelovac) 
csv_zapis.writerow(header)

adresy = []

for line in data[1:]:
    line = line.split(',')
    hriste = line[8]
    ulice = line[4]
    cislo = line[5]
    adresa = ulice + ' ' + cislo + ', Brno'
    if hriste == "Herní prvky dětských hřišť" or hriste == "Hřiště":
        if adresa not in adresy:
            adresy.append(adresa)
            souradnice = loc.geocode(adresa)
            latitude = souradnice.latitude
            longitude = souradnice.longitude
            zaznam = [hriste, adresa, latitude, longitude]
            csv_zapis.writerow(zaznam)
