import cfscrape
import requests

def start_requests(start_urls):
  for url in start_urls:
    token, agent = cfscrape.get_tokens(url)
    requests.Request(url=url, cookies=token, headers={'User-Agent': agent})

start_requests(['https://movie2k.life'])