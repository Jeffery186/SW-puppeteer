import sys
import socket

with open(sys.argv[1], 'r') as fp:
    ServiceWorker_raw = fp.read().splitlines()

with open(sys.argv[2], 'r') as fp:
    NoServiceWorker_raw = fp.read().splitlines()

ServiceWorkerConnections = []
NoServiceWorkerConnections = []
FromServiceToNot = []
FromNotToService = []

def extraContitions(connection):
    return True

for i in ServiceWorker_raw:
    if i == '':
        continue
    temp = i.split(' ')[2].split('.')
    ip = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3]
    if ip not in ServiceWorkerConnections and extraContitions(temp):
        ServiceWorkerConnections.append(ip)
    temp = i.split(' ')[4].split('.')
    ip = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3]
    if ip not in ServiceWorkerConnections and extraContitions(temp):
        ServiceWorkerConnections.append(ip)

for i in NoServiceWorker_raw:
    if i == '':
        continue
    temp = i.split(' ')[2].split('.')
    ip = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3]
    if ip not in NoServiceWorkerConnections and extraContitions(temp):
        NoServiceWorkerConnections.append(ip)
    temp = i.split(' ')[4].split('.')
    ip = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3]
    if ip not in NoServiceWorkerConnections and extraContitions(temp):
        NoServiceWorkerConnections.append(ip)

for i in ServiceWorkerConnections:
    if i not in NoServiceWorkerConnections:
        FromServiceToNot.append(i)

for i in NoServiceWorkerConnections:
    if i not in ServiceWorkerConnections:
        FromNotToService.append(i)


print()
print("\033[1;37mDomains only with Service Worker:\033[0;37m")
for ip in FromServiceToNot:
    try:
        temp = socket.gethostbyaddr(ip)[0]
    except Exception as invalid_ip:
        print(ip, "hostname not found")
    else:
        print(ip, temp)
print()
print("\033[1;37mDomains only without Service Worker:\033[0;37m")
for ip in FromNotToService:
    try:
        temp = socket.gethostbyaddr(ip)[0]
    except Exception as invalid_ip:
        print(ip, "hostname not found")
    else:
        print(ip, temp)