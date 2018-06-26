# -*- coding: utf-8 -*-

from binascii import b2a_base64

from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='tracker.Peer')
def handle_new_peer(**kwargs):

    if kwargs['created']:

        peer = kwargs['instance']
        compact_ip = bytes([int(s) for s in peer.ip_address.split('.')])
        compact_port = peer.port.to_bytes(2, byteorder='big')
        peer.compact_representation = b2a_base64(compact_ip + compact_port).decode('ascii')
        peer.save()
