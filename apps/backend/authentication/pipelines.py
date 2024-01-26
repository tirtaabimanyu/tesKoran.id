from social_core.pipeline.partial import partial
from rest_framework.response import Response
from uuid import uuid4
from social_core.utils import module_member, slugify
from django.contrib.auth import get_user_model
import unicodedata
import re


User = get_user_model()


def get_user(backend, uid, *args, **kwargs):
    user = backend.strategy.storage.user.get_user(email=uid)
    return {'user': user}


def activate_user(backend, is_new, user=None, *args, **kwargs):
    if user and is_new:
        user.is_active = True
        backend.strategy.storage.user.changed(user)


def enable_username_change(backend, is_new, user=None, *args, **kwargs):
    if user and is_new:
        user.can_change_username = True
        backend.strategy.storage.user.changed(user)

# @partial
# def get_username(backend, uid, is_new=True, user=None, *args, **kwargs):
#     breakpoint()
#     if is_new:
#         username = kwargs['request'].POST['username']
#         if username:
#             return {'username': username}
#         current_partial = kwargs.get('current_partial')
#         return Response(data={'partial_token': current_partial.token})


def get_username(strategy, details, backend, user=None, *args, **kwargs):
    storage = strategy.storage

    if not user:
        email_as_username = strategy.setting('USERNAME_IS_FULL_EMAIL', False)
        uuid_length = strategy.setting('UUID_LENGTH', 4)
        max_length = User._meta.get_field('username').max_length
        do_slugify = strategy.setting('SLUGIFY_USERNAMES', True)
        do_clean = strategy.setting('CLEAN_USERNAMES', True)

        def identity_func(val):
            return val

        if do_clean:
            override_clean = strategy.setting('CLEAN_USERNAME_FUNCTION')
            if override_clean:
                clean_func = module_member(override_clean)
            else:
                clean_func = storage.user.clean_username
        else:
            clean_func = identity_func

        if do_slugify:
            override_slug = strategy.setting('SLUGIFY_FUNCTION')
            if override_slug:
                slug_func = module_member(override_slug)
            else:
                slug_func = slugify
        else:
            slug_func = identity_func

        if email_as_username and details.get('email'):
            username = details['email']
        elif details.get('username'):
            username = details['username']
        else:
            username = uuid4().hex

        short_username = (username[:max_length - uuid_length - 1]
                          if max_length is not None
                          else username)
        final_username = slug_func(clean_func(username[:max_length]))

        # Generate a unique username for current user using username
        # as base but adding a unique hash at the end. Original
        # username is cut to avoid any field max_length.
        # The final_username may be empty and will skip the loop.
        while not final_username or User.objects.filter(username=final_username).exists():
            username = short_username + '_' + uuid4().hex[:uuid_length]
            final_username = slug_func(clean_func(username[:max_length]))
    else:
        final_username = storage.user.get_username(user)
    return {'username': final_username}


def slugify(value):
    """Removes non-word characters (alphanumerics
    and underscores) and converts spaces to underscore. Also strips leading
    and trailing whitespace."""
    value = unicodedata.normalize('NFKD', str(value)) \
                       .encode('ascii', 'ignore') \
                       .decode('ascii')
    value = re.sub(r'[^\w\s.]', '', value).strip()
    value = re.sub(r'[\s.-]+', '_', value)
    return value
