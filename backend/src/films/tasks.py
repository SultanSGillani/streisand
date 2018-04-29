# -*- coding: utf-8 -*-

import time
import threading
from queue import Queue

import requests
from celery import shared_task

from .models import Film


@shared_task
def check_posters():
    """
    Check film poster URLs for 404 errors
    """

    lock = threading.Lock()

    def worker():
        """
        The worker thread pulls an item from the queue and processes it
        """
        while True:
            film = q.get()
            try:
                response = requests.head(film.poster_url, verify=False)
            except Exception as e:
                print(film.id, film.poster_url, str(e))
            else:
                if response.status_code != 200:
                    with lock:
                        print(film.id, film.poster_url)
            q.task_done()

    q = Queue()
    for i in range(50):
        t = threading.Thread(target=worker)
        t.daemon = True
        t.start()

    films_to_check = Film.objects.exclude(
        poster_url__startswith='https://image.tmdb.org/t/p/w500/'
    ).exclude(
        poster_url=''
    )

    print('Checking {count} film posters...'.format(count=films_to_check.count()))
    start_time = time.time()
    for f in films_to_check.iterator():
        q.put(f)
    q.join()
    end_time = time.time()
    print('Finished in {duration} seconds.'.format(duration=end_time - start_time))
