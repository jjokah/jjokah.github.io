---
title: WORD COUNTER - A simple python script that counts a specific word in text file
tags: [showdev, python, algorithms, 100daysofcode]
style: fill
color: primary
description: During a rainy and boring morning, I decided to write an algorithm that displays how many times a word appears in the bible.
---

Source: [jjokah](https://dev.to/jjokah/word-counter-a-simple-python-script-that-counts-a-specific-word-in-text-file-jhe)

During a rainy and boring morning, I decided to write an algorithm that displays how many times a word appears in the bible.

---
To start with, I searched for a kjv bible in a text file and found one that was in this format:
__*bible.txt*__
```
Genesis 1:1	In the beginning God created the heaven and the earth.
Genesis 1:2	And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.
Genesis 1:3	And God said, Let there be light: and there was light.
...
Revelation 22:21	The grace of our Lord Jesus Christ be with you all. Amen.
```
---

Then I wrote this code to do the word count magic for me:
__*search_bible.py*__
```python
search = input("Search for: ")
total_count = 0
with open("bible.txt") as bible:
    for line in bible:
        bible_verse = line.split("\t")[-1].lower()
        verse_count = bible_verse.count(search.lower())
        total_count += verse_count
print(f"{search} appears {total_count} times")
```

---
Testing the program (_where script and text file are in same directory_)

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/4zlzrfiwr1bxohkl1n9a.png)

---
__*Feel free to share your insight on the comment and don't forget to like.*__
