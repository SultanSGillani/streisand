# -*- coding: utf-8 -*-

from pytz import UTC

from django.contrib.auth.models import Permission

from users.models import User, UserClass

from import_scripts.management.commands import MySQLCommand


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM users_main
        JOIN users_info ON users_info.UserID = users_main.ID
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM users_main
        JOIN users_info ON users_info.UserID = users_main.ID
    """

    help = "Import users"

    def pre_sql(self):
        self.leech_perm = Permission.objects.get(codename='can_leech')

    def handle_row(self, row):

        old_id = row['ID']
        enabled = row['Enabled']
        username = row['Username']
        email = row['Email']
        password_hash = row['PassHash']
        if password_hash:
            salt = row['Secret']
        else:
            salt = ''

        irc_key = row['IRCKey']
        avatar_url = row['Avatar']
        user_class = UserClass.objects.get(old_id=row['PermissionID'])
        custom_title = row['Title']
        try:
            profile_description = row['Info'].encode('latin-1').decode('utf-8')
        except UnicodeDecodeError:
            profile_description = row['Info']
        staff_notes = row['AdminComment'].encode('latin-1').decode('utf-8')
        # paranoia = int(row['Paranoia'])
        invite_count = row['Invites']
        # invited_by_id = row['Inviter']
        join_date = row['JoinDate']
        last_login = row['LastLogin']
        # last_access = row['LastAccess']
        last_seeded = row['LastSeed']
        can_leech = row['can_leech'] == 1
        # ip_address = row['IP']
        bytes_uploaded = row['Uploaded']
        bytes_downloaded = row['Downloaded']
        # bounty_spent = row['BountySpent']
        # average_seeding_size = row['AverageSeedingSize']
        is_donor = row['Donor'] == '1'

        u = User.objects.create(
            old_id=old_id,
            username=username,
            email=email,
            password='old_hash${salt}${password_hash}'.format(salt=salt, password_hash=password_hash),
            date_joined=join_date.replace(tzinfo=UTC),
            user_class=user_class,
            is_donor=is_donor,
            invite_count=invite_count,
            avatar_url=avatar_url,
            custom_title=custom_title.encode('latin-1').decode('utf-8') if custom_title else None,
            profile_description=profile_description,
            staff_notes=staff_notes,
            irc_key=irc_key if irc_key else '',
            bytes_uploaded=bytes_uploaded,
            bytes_downloaded=bytes_downloaded,
            last_seeded=last_seeded.replace(tzinfo=UTC) if last_seeded else None,
            account_status=['unconfirmed', 'enabled', 'disabled'][int(enabled)],
        )
        if last_login:
            u.last_login = last_login.replace(tzinfo=UTC)
        else:
            u.last_login = join_date.replace(tzinfo=UTC)
        if user_class.rank >= 10:
            u.is_staff = True
        if user_class.rank >= 11:
            u.is_superuser = True
        u.save()

        if can_leech:
            u.user_permissions.add(self.leech_perm)

        # if invited_by_id:
        #     try:
        #         user.invited_by = User.objects.get(old_id=invited_by_id)
        #     except User.DoesNotExist:
        #         print(invited_by_id, 'DOES NOT EXIST!')

        # if last_access:
        #     last_access = last_access.replace(tzinfo=UTC)
        #     last_ip = user.ip_addresses.create(
        #         ip_address=ip_address,
        #         used_with='site',
        #     )
        #     user.ip_addresses.filter(id=last_ip.id).update(
        #         first_used=last_access,
        #         last_used=last_access,
        #     )
