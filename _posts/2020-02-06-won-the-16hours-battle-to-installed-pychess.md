---
title: [won] The 16hours battle to installed pychess
tags: [Python, Chess, Linux]
style: fill
color: success
description: The chanllenge jjokah went through while trying to install chess game on linux.
---

Source: [jjokah on dev.to](https://dev.to/jjokah/won-the-16hours-battle-to-installed-pychess-3j5o)


After coding for the day at 17:00, I needed to take a break. Then decided to play chess on my PC. This is how the 1st hour began.

I won't go into the nitty-gritty detail, instead I would tell you where the battle was tough and how it was won.

...

Okay let's begin! 🏁
The battle started with a Google search: "best chess games for linux". After scanning through few posts, I went for pychess because SCIDvsPC couldn't install and I'm a pythonista, I would like to check out pychess source code someday.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/orlf9azd3fn3t8qldbcz.png)

<br>
Now, I have decided to go with pychess. First I tried installing it using pip:
```shell
$ pip install pychess
```
Within a minute, it installed. "WOW that was fast", I said to myself. Then I tried to open the app, but it failed to startup. At that moment, I think I heard my PC say "YEAH not so fast".


![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/kyujpvsplyl5ni8qrbty.png)
I kept on battling with it. I went back to my dear friend Google, and he directed me to Professor Stackoverflow and others, but they give me no direct answer. After about 3 hours, I saw something about cloning the pychess git repo.

...
```shell
$ git clone https://github.com/pychess/pychess.git
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/18ejvhh0mfps18uhn5m0.png)

...
<br>
Surprisingly, this somehow worked. I could run the pychess directly from the repo I cloned. But when I wanted to install it, another phase of the battle began.
To cut it all short, this is how the battle was won (also what I learnt):
* The first time I tried to install it, I did it without the magic word, "_sudo_", and It stopped half way.
* Then I had to uninstall it. Unfortunately, my terminal told me I can't use  "__pip uninstall pychess__" to remove a distutils project.
* So I went to _/usr/local/lib/python3.6/dist-packages_ to remove everything that had pychess on it.
* My terminal refused to do what I said until I did it the hard way:
```shell
$ sudo rm -rf /usr/local/lib/python3.6/dist-packages/pychess/
$ sudo rm -rf /usr/local/lib/python3.6/dist-packages/pychess-1.0.2.egg-info
```
* It was out. This time I remembered to add the magic word, "_sudo_", as I tried to reinstall the pychess from the cloned repo.
* And at last, IT WORKED.🚀

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/skegmmvxdr8ffdgaxpmw.png)

