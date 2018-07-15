from django.conf.urls import url, include
from rest_framework_extensions.routers import ExtendedDefaultRouter

from search_indexes.viewsets.film import FilmDocumentView

router = ExtendedDefaultRouter()
films = router.register(r'films',
                        FilmDocumentView,
                        base_name='filmdocument')

urlpatterns = [
    url(r'^', include(router.urls)),
]
