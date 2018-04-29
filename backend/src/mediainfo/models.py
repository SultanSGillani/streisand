# -*- coding: utf-8 -*-

from decimal import Decimal
from io import StringIO

from django.db import models
from django.utils.timezone import timedelta

from picklefield import PickledObjectField


class Mediainfo(models.Model):

    text = models.TextField()
    file_path = models.CharField(max_length=1024, editable=False)
    file_size = models.CharField(max_length=16, editable=False)
    runtime = models.DurationField(null=True, editable=False)
    resolution_width = models.SmallIntegerField(null=True, editable=False)
    resolution_height = models.SmallIntegerField(null=True, editable=False)
    display_aspect_ratio = models.CharField(max_length=16)
    bit_rate = models.CharField(max_length=16)
    frame_rate = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    has_chapters = models.BooleanField()
    is_dxva_compliant = models.BooleanField()
    is_quality_encode = models.BooleanField()
    audio = PickledObjectField(default=[])
    subtitles = PickledObjectField(default=[])

    def __repr__(self):
        return self.file_path

    def __str__(self):
        return self.text

    def parse(self):

        if not self.text:
            raise MediainfoError('No text to parse')

        dictionary = dict()
        section = None
        audio_sections = []
        subtitles_sections = []

        for line in StringIO(self.text):
            line = line.strip()

            if not line:
                continue

            if ':' not in line:
                section = line.lower()
                if section not in dictionary:
                    dictionary[section] = dict()

                if section.startswith('audio'):
                    audio_sections.append(section)
                elif section.startswith('text'):
                    subtitles_sections.append(section)

            elif section is not None:
                try:
                    (key, separator, value) = line.partition(':')
                    dictionary[section][key.strip().lower()] = value.strip()
                except AttributeError:
                    raise MediainfoError('Could not parse line "{text}"'.format(text=line))

        # Get x264 encoding settings
        try:
            if dictionary['video']['writing library'].lower().startswith('x264'):
                encoding_settings = dictionary['video']['encoding settings'].split(' / ')
                dictionary['video']['encoding settings'] = dict()
                for setting in encoding_settings:
                    (key, delimiter, value) = setting.partition('=')
                    dictionary['video']['encoding settings'][key] = value
        except (KeyError, ValueError):
            pass

        # Set values
        self._set_file_path(dictionary)
        self._set_file_size(dictionary)
        self._set_runtime(dictionary)
        self._set_resolution(dictionary)
        self._set_display_aspect_ratio(dictionary)
        self._set_bit_rate(dictionary)
        self._set_frame_rate(dictionary)
        self._set_has_chapters(dictionary)
        self._set_is_dxva_compliant(dictionary)
        self._set_is_quality_encode(dictionary)
        self._set_audio(dictionary, audio_sections)
        self._set_subtitles(dictionary, subtitles_sections)

    def _set_file_path(self, dictionary):
        self.file_path = dictionary['general']['complete name']

    def _set_file_size(self, dictionary):
        self.file_size = dictionary['general']['file size']

    def _set_runtime(self, dictionary):

        duration = dict()

        for time_component in dictionary['general']['duration'].split():

            value = ''
            unit = ''

            for character in time_component:
                if character.isdigit():
                    value += character
                else:
                    unit += character
            value = int(value)

            if unit == 'h':
                duration['hours'] = value
            elif unit == 'mn':
                duration['minutes'] = value
            elif unit == 's':
                duration['seconds'] = value
            else:
                raise Exception('unit was ' + unit)

        self.runtime = timedelta(**duration)

    def _set_resolution(self, dictionary):
        width = dictionary['video']['width'].replace('pixels', '').replace(' ', '')
        height = dictionary['video']['height'].replace('pixels', '').replace(' ', '')
        self.resolution_width = int(width)
        self.resolution_height = int(height)

    def _set_display_aspect_ratio(self, dictionary):
        self.display_aspect_ratio = dictionary['video']['display aspect ratio']

    def _set_bit_rate(self, dictionary):
        # TODO: try nominal bit rate if this key isn't present
        self.bit_rate = dictionary['video']['bit rate']

    def _set_frame_rate(self, dictionary):
        try:
            (frame_rate, __) = dictionary['video']['frame rate'].split()
        except KeyError:
            self.frame_rate = None
        else:
            self.frame_rate = Decimal(frame_rate)

    def _set_has_chapters(self, dictionary):
        self.has_chapters = 'menu' in dictionary and bool(dictionary['menu'])

    def _set_is_dxva_compliant(self, dictionary):
        try:
            format_profile = dictionary['video']['format profile']
        except KeyError:
            self.is_dxva_compliant = False
        else:
            profile, level = format_profile.split('@')
            self.is_dxva_compliant = Decimal(level.lstrip('L')) <= Decimal('4.1')

    def _encoding_problems(self, dictionary):

        settings = dictionary['video']['encoding settings']
        problems = []

        if self.is_sd:
            if int(settings['bframes']) < 5:
                problems.append("bframes: {value} is not >= 5".format(value=settings['bframes']))
            if int(settings['ref']) < 9:
                problems.append("ref: {value} is not >= 9".format(value=settings['ref']))
            if settings['me'] == 'umh' and int(settings['me_range']) < 24:
                problems.append("me_range: {value} is not >= 24".format(value=settings['me_range']))

        elif self.is_720p:
            if int(settings['bframes']) < 5:
                problems.append("bframes: {value} is not >= 5".format(value=settings['bframes']))
            if int(settings['ref']) < 9:
                problems.append("ref: {value} is not >= 9".format(value=settings['ref']))
            if settings['me'] == 'umh' and int(settings['me_range']) < 16:
                problems.append("me_range: {value} is not >= 16".format(value=settings['me_range']))

        elif self.is_1080p:
            if int(settings['bframes']) < 3:
                problems.append("bframes: {value} is not >= 3".format(value=settings['bframes']))
            if int(settings['ref']) < 4:
                problems.append("ref: {value} is not >= 4".format(value=settings['ref']))
            if settings['me'] == 'umh' and int(settings['me_range']) < 16:
                problems.append("me_range: {value} is not >= 16".format(value=settings['me_range']))

        return problems

    def _set_is_quality_encode(self, dictionary):
        if 'encoding settings' not in dictionary['video']:
            self.is_quality_encode = False
        else:
            self.is_quality_encode = bool(self._encoding_problems(dictionary))

    def _set_audio(self, dictionary, audio_sections):

        channel_dict = {
            '6': '5.1ch',
            '5': '4.1ch',
            '3': '2.1ch',
            '2': '2.0ch',
            '1': '1.0ch',
        }

        for section in audio_sections:

            audio_dict = dictionary[section]

            # Find language
            language = audio_dict.get('language', 'English')

            # Find channels
            channels_text = audio_dict.get('channel(s)', audio_dict.get('channel count', '? ?'))
            (channels, __) = channels_text.split()
            channels = channel_dict[channels]

            # Find codec
            codec = audio_dict['codec id'].replace('A_', '')
            if audio_dict.get('codec id/hint') == 'mp3':
                codec = 'MP3'
            elif audio_dict.get('format') in ('FLAC', 'AAC'):
                codec = audio_dict['format']

            # Find bitrate
            bitrate = audio_dict['bit rate']

            self.audio.append(
                '{language} {channels} {codec} @ {bitrate}'.format(
                    language=language,
                    channels=channels,
                    codec=codec,
                    bitrate=bitrate,
                )
            )

    def _set_subtitles(self, dictionary, subtitles_sections):

        language_dict = {
            None: 'English',
            'rom': 'Romanian',
            'scr': 'Croatian',
        }

        for section in subtitles_sections:

            subtitles_dict = dictionary[section]

            # Find language
            language = subtitles_dict.get('language')
            language = language_dict.get(language, language)

            self.subtitles.append(language)

    def save(self, *args, **kwargs):
        self.parse()
        return super().save(*args, **kwargs)

    @property
    def is_sd(self):
        return 0 < self.resolution_height <= 576 and 0 < self.resolution_width <= 854

    @property
    def is_720p(self):
        return 576 < self.resolution_height <= 720 and 854 < self.resolution_width <= 1280

    @property
    def is_1080p(self):
        return 720 < self.resolution_height <= 1080 and 1280 < self.resolution_width <= 1920


class MediainfoError(Exception):
    pass
