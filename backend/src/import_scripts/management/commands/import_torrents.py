# -*- coding: utf-8 -*-

import re
from binascii import b2a_hex

from pytz import UTC

from import_scripts.management.commands import MySQLCommand
from films.models import Film
from mediainfo.models import Mediainfo
from torrents.models import Torrent, TorrentMetaInfo
from tracker.models import Swarm
from users.models import User


class Command(MySQLCommand):

    SQL = """SELECT * FROM torrents"""
    COUNT_SQL = """SELECT COUNT(*) FROM torrents"""

    help = "Import torrents"

    moderation_values = {
        0: None,
        1: True,
        2: False,
    }

    def pre_sql(self):
        last_torrent = Torrent.objects.order_by('old_id').last()
        last_old_id = last_torrent.old_id if last_torrent else 0
        self.SQL += ' WHERE ID > {id} ORDER BY ID LIMIT 1000'.format(id=last_old_id)

    def handle_row(self, row):

        torrent_id = row['ID']
        torrent_group_id = row['GroupID']
        info_hash = b2a_hex(row['info_hash']).decode('utf-8')
        uploader_id = row['UserID']
        uploaded_at = row['Time']
        source_media = row['media']
        resolution = row['Encoding']
        codec = row['Format']
        container = row['container']
        is_special_edition = (row['Remastered'] == '1')
        special_edition_title = row['RemasterTitle']
        # special_edition_year = row['Year']
        is_scene = (row['Scene'] == '1')
        # scene_title = row['SceneTitle']
        bbcode_description = row['Description']
        release_name = row['ReleaseName']
        size_in_bytes = row['Size']
        # last_action = row['last_action']
        is_approved = self.moderation_values[row['Moderated']]
        last_moderated_by_username = row['LastModeratedBy']
        # tc_original = (row['Exclusive'] == '1')
        mediainfo = row['MediaInfo']

        try:
            film = Film.objects.get(old_id=torrent_group_id)
        except Film.DoesNotExist:
            return

        if container == 'Matroska':
            container = 'MKV'

        if codec == 'h.264':
            codec = 'H.264'

        metainfo_dict = dict()
        file_list = []

        nfo_text = ''
        if bbcode_description:
            description = bbcode_description.encode('latin-1').decode('utf-8').strip()
            nfo_match = re.search(
                r'\[spoiler=NFO\]\s*(?:\[size=\d\])?\s*\[pre\](.*)\[/pre\]\s*(?:\[/size\])?\s*\[/spoiler\]',
                string=description,
                flags=re.IGNORECASE + re.DOTALL,
            )
            if nfo_match:
                nfo_text = nfo_match.group(1).rstrip()
                if 'Ü' in nfo_text and torrent_id not in (68325, 73858, 77698):
                    try:
                        nfo_text = nfo_text.encode('cp1252').decode('cp437')
                    except UnicodeEncodeError:
                        nfo_text = nfo_text.encode('latin-1').decode('cp437')
                spoiler_match = re.search(
                    r'(\[spoiler=NFO\]\s*(?:\[size=\d\])?\s*\[pre\].*\[/pre\]\s*(?:\[/size\])?\s*\[/spoiler\])',
                    string=description,
                    flags=re.IGNORECASE + re.DOTALL,
                )
                description = description.replace(spoiler_match.group(1), '')
        else:
            description = ''

        swarm = Swarm.objects.create(torrent_info_hash=info_hash)
        metainfo = TorrentMetaInfo.objects.create(dictionary=metainfo_dict)
        uploader = User.objects.filter(old_id=uploader_id).first()
        moderator = User.objects.filter(username=last_moderated_by_username).first()

        mediainfo_text = mediainfo.encode('latin-1').decode('utf-8').strip() if mediainfo else ''
        if mediainfo_text:
            try:
                mediainfo = Mediainfo.objects.create(text=mediainfo_text)
            except Exception:
                mediainfo = None
                # raise
        else:
            mediainfo = None

        torrent = Torrent.objects.create(
            old_id=torrent_id,
            film=film,
            cut=special_edition_title if is_special_edition else 'Theatrical',
            description=description,
            nfo=nfo_text,
            mediainfo=mediainfo,
            swarm=swarm,
            metainfo=metainfo,
            file_list=file_list,
            uploaded_by=uploader,
            source_media_id=source_media,
            resolution_id=resolution,
            codec_id=codec,
            container_id=container,
            release_name=release_name.encode('latin-1').decode('utf-8') if release_name else '',
            is_scene=is_scene,
            size_in_bytes=size_in_bytes,
            is_approved=is_approved,
            moderated_by=moderator,
        )
        torrent.uploaded_at = uploaded_at.replace(tzinfo=UTC)
        torrent.save()
