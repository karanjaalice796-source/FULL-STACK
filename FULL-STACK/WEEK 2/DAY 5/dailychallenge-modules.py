import requests
import time


def get_page_load_time(url):
    start_time = time.time()

    try:
        response = requests.get(url)
    except requests.exceptions.RequestException as e:
        print(f'Error fetching {url}: {e}')
        return None

    end_time = time.time()
    load_time = end_time - start_time

    return load_time


if __name__ == '__main__':
    sites = [
        'https://www.google.com',
        'https://www.ynet.co.il',
        'https://www.imdb.com',
        'https://www.wikipedia.org',
    ]

    for site in sites:
        load_time = get_page_load_time(site)
        if load_time is not None:
            print(f'{site} took {load_time:.4f} seconds to load.')