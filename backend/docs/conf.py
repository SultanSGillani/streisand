# -*- coding: utf-8 -*-

import inspect
import os
import sys
import django

sys.path.insert(0, os.path.abspath('../src'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'jumpcut.settings.www_settings'
django.setup()

# -- Project information -----------------------------------------------------

project = 'JumpCut'
copyright = '2018, JumpCut'
author = 'JumpCut'

# The short X.Y version
version = ''
# The full version, including alpha/beta/rc tags
release = '1.0.0'

from django.db.models.fields.files import FileDescriptor  # NOQA
FileDescriptor.__get__ = lambda self, *args, **kwargs: self
from django.db.models.manager import ManagerDescriptor  # NOQA
ManagerDescriptor.__get__ = lambda self, *args, **kwargs: self.manager

# Stop Django from executing DB queries
from django.db.models.query import QuerySet  # NOQA
QuerySet.__repr__ = lambda self: self.__class__.__name__

try:
    import enchant  # NOQA
except ImportError:
    enchant = None


def process_django_models(app, what, name, obj, options, lines):
    """Append params from fields to model documentation."""
    from django.utils.encoding import force_text
    from django.utils.html import strip_tags
    from django.db import models

    spelling_white_list = ['', '.. spelling::']

    if inspect.isclass(obj) and issubclass(obj, models.Model):
        for field in obj._meta.fields:
            help_text = strip_tags(force_text(field.help_text))
            verbose_name = force_text(field.verbose_name).capitalize()

            if help_text:
                lines.append(':param %s: %s - %s' % (field.attname,
                                                     verbose_name, help_text))
            else:
                lines.append(':param %s: %s' % (field.attname, verbose_name))

            if enchant is not None:
                from enchant.tokenize import basic_tokenize

                words = verbose_name.replace('-', '.').replace('_',
                                                               '.').split('.')
                words = [s for s in words if s != '']
                for word in words:
                    spelling_white_list += [
                        "    %s" % ''.join(i for i in word if not i.isdigit())
                    ]
                    spelling_white_list += [
                        "    %s" % w[0] for w in basic_tokenize(word)
                    ]

            field_type = type(field)
            module = field_type.__module__
            if 'django.db.models' in module:
                # scope with django.db.models * imports
                module = 'django.db.models'
            lines.append(':type %s: %s.%s' % (field.attname, module,
                                              field_type.__name__))
        if enchant is not None:
            lines += spelling_white_list
    return lines


def process_modules(app, what, name, obj, options, lines):
    """Add module names to spelling white list."""
    if what != 'module':
        return lines
    from enchant.tokenize import basic_tokenize

    spelling_white_list = ['', '.. spelling::']
    words = name.replace('-', '.').replace('_', '.').split('.')
    words = [s for s in words if s != '']
    for word in words:
        spelling_white_list += [
            "    %s" % ''.join(i for i in word if not i.isdigit())
        ]
        spelling_white_list += ["    %s" % w[0] for w in basic_tokenize(word)]
    lines += spelling_white_list
    return lines


def skip_queryset(app, what, name, obj, skip, options):
    """Skip queryset subclasses to avoid database queries."""
    from django.db import models
    if isinstance(obj,
                  (models.QuerySet,
                   models.manager.BaseManager)) or name.endswith('objects'):
        return True
    return skip


def setup(app):
    # Register the docstring processor with sphinx
    app.connect('autodoc-process-docstring', process_django_models)
    app.connect('autodoc-skip-member', skip_queryset)
    if enchant is not None:
        app.connect('autodoc-process-docstring', process_modules)


# -- General configuration ---------------------------------------------------

# If your documentation needs a minimal Sphinx version, state it here.
#
# needs_sphinx = '1.0'

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.graphviz',
    'sphinx.ext.napoleon',
    'sphinx.ext.inheritance_diagram',
    'sphinx.ext.intersphinx',
]

if enchant is not None:
    extensions.append('sphinxcontrib.spelling')

intersphinx_mapping = {
    'python': ('https://docs.python.org/3.5', None),
    'sphinx': ('http://sphinx.pocoo.org/', None),
    'django': ('https://docs.djangoproject.com/en/dev/',
               'https://docs.djangoproject.com/en/dev/_objects/'),
    'djangoextensions':
    ('https://django-extensions.readthedocs.org/en/latest/', None),
    'geoposition': ('https://django-geoposition.readthedocs.org/en/latest/',
                    None),
    'braces': ('https://django-braces.readthedocs.org/en/latest/', None),
    'select2': ('https://django-select2.readthedocs.org/en/latest/', None),
    'celery': ('https://celery.readthedocs.org/en/latest/', None),
}

autodoc_default_flags = ['members']

# spell checking
spelling_lang = 'en_US'
spelling_word_list_filename = 'spelling_wordlist.txt'
spelling_show_suggestions = True
spelling_ignore_pypi_package_names = True
# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# The suffix(es) of source filenames.
# You can specify multiple suffix as a list of string:
#
source_suffix = ['.rst', '.md']

# The master toctree document.
master_doc = 'index'

# The language for content autogenerated by Sphinx. Refer to documentation
# for a list of supported languages.
#
# This is also used if you do content translation via gettext catalogs.
# Usually you set "language" from the command line for these cases.
language = None

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path .
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# The name of the Pygments (syntax highlighting) style to use.
pygments_style = 'sphinx'

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'

# Theme options are theme-specific and customize the look and feel of a theme
# further.  For a list of options available for each theme, see the
# documentation.
#
# html_theme_options = {}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# Custom sidebar templates, must be a dictionary that maps document names
# to template names.
#
# The default sidebars (for documents that don't match any pattern) are
# defined by theme itself.  Builtin themes are using these templates by
# default: ``['localtoc.html', 'relations.html', 'sourcelink.html',
# 'searchbox.html']``.
#
# html_sidebars = {}

# -- Options for HTMLHelp output ---------------------------------------------

# Output file base name for HTML help builder.
htmlhelp_basename = 'JumpCutdoc'

# -- Options for LaTeX output ------------------------------------------------

latex_elements = {
    # The paper size ('letterpaper' or 'a4paper').
    #
    # 'papersize': 'letterpaper',

    # The font size ('10pt', '11pt' or '12pt').
    #
    # 'pointsize': '10pt',

    # Additional stuff for the LaTeX preamble.
    #
    # 'preamble': '',

    # Latex figure (float) alignment
    #
    # 'figure_align': 'htbp',
}

# Grouping the document tree into LaTeX files. List of tuples
# (source start file, target name, title,
#  author, documentclass [howto, manual, or own class]).
latex_documents = [
    (master_doc, 'JumpCut.tex', 'JumpCut Documentation', 'JumpCut', 'manual'),
]

# -- Options for manual page output ------------------------------------------

# One entry per manual page. List of tuples
# (source start file, name, description, authors, manual section).
man_pages = [(master_doc, 'jumpcut', 'JumpCut Documentation', [author], 1)]

# -- Options for Texinfo output ----------------------------------------------

# Grouping the document tree into Texinfo files. List of tuples
# (source start file, target name, title, author,
#  dir menu entry, description, category)
texinfo_documents = [
    (master_doc, 'JumpCut', 'JumpCut Documentation', author, 'JumpCut',
     'One line description of project.', 'Miscellaneous'),
]

# -- Extension configuration -------------------------------------------------

# -- Options for todo extension ----------------------------------------------

# If true, `todo` and `todoList` produce output, else they produce nothing.
todo_include_todos = True
