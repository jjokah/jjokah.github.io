---
title: Making Python3 default in Ubuntu
tags: [python, ubuntu, linux]
style: border
color: info
description: Making Python3 default in Ubuntu
---

Source: [jjokah](https://dev.to/jjokah/one-who-knows-machine-learning-is-called-3ko8)

I came into the python world at 2017, and ever since then, I have never thought of using _Python2_. Now in 2020, I just updated my OS to Ubuntu 20.04 and I have no idea what _python2_ is doing on my terminal, talkless of even being the default.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/pahyxjioohpdeillbfdh.png)

---
But this is how I made _python3_ my default:

📌 First I typed **gedit ~/.bashrc** on my terminal to open the .bashrc file on my text editor.
```shell
$ gedit ~/.bashrc
```
📌 And then I added 
**alias python=python3**
to the top of the .bashrc file and saved it.

That was it. 🚀🚀

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/ifaj4lc9xtxcoocxrup5.png)
---
What this means is that whenever I write _python_ on my terminal, it sees it as _python3_
