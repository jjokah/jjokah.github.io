---
title: SUBMODULES - A git repo inside a git repo
tags: [git, github]
style: dark
color: fill
description: It often happens that while working on one project, you need to use another project from within it. Perhaps it’s a library that a third party developed or that you’re developing separately and using in multiple parent projects. Git addresses this issue using submodules.
---

Source: [jjokah](https://dev.to/jjokah/submodules-a-git-repo-inside-a-git-repo-36l9)

As I followed the installation guide to set up saleor-platform on my system, I just copied and pasted all the series of commands required, into my terminal without even understanding what most of them meant.

The first command was
```shell
git clone https://github.com/mirumee/saleor-platform.git --recursive --jobs 3
```
I quite understood `git clone <repo-url>`, but had no idea what `recursive --jobs 3` was doing there.
Though, It didn't really bother me as long as I don't get any error.

But later as I browsed through the repository on github, and clicked on a folder, it was as if I was redirected to another repo. 😲
Immediately I went to consult Google and asked him: "Can you have a git repository in a git repository?".
And, voila! I found **_submodules_**.

---

This is a summary of what Submodules is:
_(from [this blog](https://github.blog/2016-02-01-working-with-submodules/))_

**SUBMODULES**
It often happens that while working on one project, you need to use another project from within it. Perhaps it’s a library that a third party developed or that you’re developing separately and using in multiple parent projects. A common issue arises in these scenarios: you want to be able to treat the two projects as separate yet still be able to use one from within the other.

Git addresses this issue using submodules. _Submodules allow you to keep a Git repository as a subdirectory of another Git repository_. This lets you clone another repository into your project and keep your commits separate.

_Example_:
Let’s say you’re working on a project called Slingshot. You’ve got code for `y-shaped stick` and a `rubber-band`.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/o5cot0qnq8n1c89ayvf0.jpg)

At the same time, in another repository, you’ve got another project called Rock—it’s just a generic `rock` library, but you think it’d be perfect for Slingshot.

You can add `rock` as a submodule of `slingshot`. In the `slingshot` repository:

```
git submodule add https://github.com/<user>/rock rock
```
At this point, you’ll have a rock folder inside slingshot, but if you were to peek inside that folder, depending on your version of Git, you might see … nothing.

Newer versions of Git will do this automatically, but older versions will require you to explicitly tell Git to download the contents of rock:

```
git submodule update --init --recursive
```

If everything looks good, you can commit this change and you’ll have a rock folder in the slingshot repository with all the content from the rock repository.

On GitHub, the rock folder icon will have a little indicator showing that it is a submodule:

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/da93w0t1tl8t5v3cq5tl.png)

And clicking on the rock folder will take you over to the rock repository.

That’s it! You’ve embedded the rock repository inside the slingshot repository. You can interact with all the content from rock as if it were a folder inside slingshot (because it is).

On the command-line, Git commands issued from slingshot (or any of the other folders, rubber-band and y-shaped-stick) will operate on the “parent repository”, slingshot, but commands you issue from the rock folder will operate on just the rock repository:

```
cd ~/projects/slingshot
git log # log shows commits from Project Slingshot
cd ~/projects/slingshot/rubber-band
git log # still commits from Project Slingshot
cd ~/projects/slingshot/rock
git log # commits from Rock
```

_Joining a project using submodules_:
Now, say you’re a new collaborator joining Project Slingshot. You’d start by running git clone to download the contents of the slingshot repository. At this point, if you were to peek inside the rock folder, you’d see … nothing.

Again, Git expects us to explicitly ask it to download the submodule’s content. You can use git submodule update --init --recursive here as well, but if you’re cloning slingshot for the first time, you can use a modified clone command to ensure you download everything, including any submodules:

```
git clone --recursive <project url>
```

_**Submodules allow you to include or embed one or more repositories as a sub-folder inside another repository.**_

At the end, I was like how come nobody told me about this.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/xz3as56it6v1iwrkkqv2.jpg)