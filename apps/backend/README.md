This is a [Django](https://www.djangoproject.com/) REST API built with [Django REST Framework](https://www.django-rest-framework.org/).

## Getting Started

First, install [pyenv](https://github.com/pyenv/pyenv) and [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) to create a virtual environment for your python

```
pyenv virtualenv 3.11 myvirtualenv
```

Then, install the requirements

```
pip install -r requirements.txt
```

Run the migrations

```
python manage.py migrate
```

Finally, run the development server

```
python manage.py runserver
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Learn More

To learn more about Django and Django REST Framework, take a look at the following resources:

- [Django 3.2 Documentation](https://docs.djangoproject.com/en/3.2/) - learn about Django features and API.
- [Django Rest Framework Quickstart](https://www.django-rest-framework.org/tutorial/quickstart/) - A quickstart guide to have you up to speed with Django REST Framework

You can also check out the [Django](https://github.com/django/django) and [Django REST Framework](https://github.com/encode/django-rest-framework) github repository - your feedback and contributions are welcome!
