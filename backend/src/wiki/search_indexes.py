from haystack import indexes

from .models import WikiArticle


class WikiIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True, template_name="search/wiki_text.txt")
    title = indexes.CharField(model_attr='title')
    body = indexes.CharField(model_attr='body')
    author = indexes.CharField(model_attr='created_by__username', null=True)
    date_created = indexes.DateTimeField(model_attr='created_at', null=True)

    def get_model(self):
        return WikiArticle

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
