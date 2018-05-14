class AllowFieldLimitingMixin(object):
    """
    A mixin for a generic APIView that will allow the serialized fields to be
    limited to a set of comma-separated values, specified via the `fields`
    query parameter.  This will only apply to GET requests.

    Source: https://gist.github.com/philipn/8659192
    """
    _serializer_class_for_fields = {}

    def get_serializer_class_for_fields(self, serializer_class, fields):
        fields = sorted(fields.strip().split(','))
        fields = tuple(fields)
        if fields in self._serializer_class_for_fields:
            return self._serializer_class_for_fields[fields]
        # Doing this because a simple copy.copy() doesn't work here.
        meta = type(
            'Meta', (serializer_class.Meta, object), {
                'fields': fields})
        LimitedFieldsSerializer = type(
            'LimitedFieldsSerializer', (serializer_class,), {
                'Meta': meta})
        self._serializer_class_for_fields[fields] = LimitedFieldsSerializer
        return LimitedFieldsSerializer

    def get_serializer_class(self):
        """
        Allow the `fields` query parameter to limit the returned fields
        in list and detail views.  `fields` takes a comma-separated list of
        fields.
        """
        serializer_class = super(
            AllowFieldLimitingMixin,
            self).get_serializer_class()
        fields = self.request.query_params.get('tab')
        if self.request.method == 'GET' and fields:
            return self.get_serializer_class_for_fields(
                serializer_class, fields)
        return serializer_class


class MultiSerializerViewSetMixin(object):
    # Thanks to https://stackoverflow.com/a/22922156
    def get_serializer_class(self):
        """
        Look for serializer class in self.serializer_action_classes, which
        should be a dict mapping action name (key) to serializer class (value),
        i.e.:

        class MyViewSet(MultiSerializerViewSetMixin, ViewSet):
            serializer_class = MyDefaultSerializer
            serializer_action_classes = {
               'list': MyListSerializer,
               'my_action': MyActionSerializer,
            }

            @action
            def my_action:
                ...

        If there's no entry for that action then just fallback to the regular
        get_serializer_class lookup: self.serializer_class, DefaultSerializer.

        """
        try:
            return self.serializer_action_classes[self.action]
        except (KeyError, AttributeError):
            return super(MultiSerializerViewSetMixin, self).get_serializer_class()
