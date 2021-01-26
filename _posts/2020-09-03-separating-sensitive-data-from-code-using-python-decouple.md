---
title: Separating Sensitive Data from Code (using python-decouple)
tags: [python, django, security, bestpractice]
style: border
color: warning
description: Here is how you seperate your sensitive data (like secret key) from your code base.
---

Source: [jjokah](https://dev.to/jjokah/separating-sensitive-data-from-code-using-python-decouple-5gj4)

Whenever I learn any code related stuff, I make sure I follow it all through till the end and then push the code to [My Repo](https://github.com/JohnJohnsonOkah). As I _git push_ and enjoy the feeling of completing a task, sometimes GitHub Bot tries to cut short the party by emailing me about a security issue; that I have exposed some sensitive data.

Those times, I wished I could reply GitHub Bot:
>"Thanks for letting me know.
>This is just a test project, so .."

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/wamdmf6r6ttdcqyspac6.gif)
And my completion party continues ... 🎉

Nevertheless, deep down I knew I needed to make my project production-ready. Then I found **python-decouple**.

>_Decouple helps you to organize your settings so that you can change parameters without having to redeploy your app._

Let me show you how I used _decouple_ to seperate sensitive data from my code:

__*settings.py*__ _(before decoupling)_
```python
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ",q9XmWx-tB^pv+Z:a7S^%&W5+&3o4f-tl14ongf(4*!(%u++)-n"
DEBUG = True

DATABASE_URL = "postgres://johndoe:mypassword@123.456.789.000:5000/blog_db"
DATABASES = {"default": dj_database_url.config(default=config("DATABASE_URL"))}

EMAIL_HOST = "stmp.gmail.com"
EMAIL_HOST_USER = "johndoe@gmail.com"
EMAIL_HOST_PASSWORD = "johndoepassword123"
EMAIL_PORT = 543
EMAIL_USE_TLS = True
```
___

🔩 __Okay let's decouple some sh*t!__ 🔩

📌 First install python-decouple on your virtual environment
```shell
$ pip install python-decouple
```
📌 Add this at the top of **_settings.py_**
```python
from decouple import config
```
📌 And then change the value of sensitive data to point to your environment variables
**_settings.py_**
```python
SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)

DATABASES = {"default": dj_database_url.config(default=config("DATABASE_URL"))}

EMAIL_HOST = config("EMAIL_HOST", default="localhost")
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
EMAIL_PORT = config("EMAIL_PORT", default=25, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=False, cast=bool)
```
📌 Add **_.env_** file at the root of your project
```shell
$ touch .env
```
📌 Make sure _.env_ is added to your .gitignore file.
**_.gitignore_**
``` python
# ... other ignored files
.env
```
📌 Now you can define those environment variables in the **_.env_** file
**_.env_**
```
SECRET_KEY=,q9XmWx-tB^pv+Z:a7S^%&W5+&3o4f-tl14ongf(4*!(%u++)-n
DEBUG=True

DATABASE_URL=postgres://johndoe:mypassword@123.456.789.000:5000/blog_db

EMAIL_HOST=stmp.gmail.com
EMAIL_HOST_USER=johndoe@gmail.com
EMAIL_HOST_PASSWORD=johndoepassword123
EMAIL_PORT=543
EMAIL_USE_TLS=True
```

And that was it. 🚀🚀

We can now push our code to github without being scared of exposing sensitive data.

__Note__: when it's time for production, nothing in your code changes. Just define your sensitive data in the production environment.