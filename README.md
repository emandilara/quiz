Quiz
------------------------------------

A Quiz game implemented with Python Flask and AngularJS.
It uses SQLite and MongoDB.

How to run
-------------
Run the following command:

`python manage.py runserver`

How to extract the questions
---------------
Create a `.txt` file with questions that follow this structure:

```
(question1 | answer1 / answer2 / answer3 / answer4 | 3 | image_name1)(question2 | answer1 / answer2 / answer3 / answer4 | 4 | image_name2)...(question_n | answer1 / answer2 / answer3 / answer4 | 1 | image_name_n)

```

then, run the following command:

`python extractQuestions.py category inputFile outputFile`

The image files must be of type `.jpg`.
Then the images must be put inside a folder named as the category inside `project/static/questions/images/`

How to start the statistics storage
------------------
TODO: MongoDB setup