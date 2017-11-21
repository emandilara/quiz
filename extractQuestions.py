import sys
import json
from greek_accentuation.characters import base

category = str(sys.argv[1])
inputFile = str(sys.argv[2])
outputFile = str(sys.argv[3])

print "Note correct syntax: python extractQuestions.py category outputFile"
print "Please remember that the input file must end with \'.json\', defined in the run arguments."

with open(inputFile, "r") as myfile:
    qExtractedArray = []
    data = myfile.read().replace("(", "").replace("\n", "").split(")")
    for i in range(0, len(data)-1):
        qDecomposed = data[i].split("|")
        print (i, qDecomposed)
        question = qDecomposed[0]
        answers = qDecomposed[1].split("/")
        correctAnswer = int(qDecomposed[2])-1
        if len(qDecomposed)>3:
            image = "static/questions/images/" + str(category) + "/" + str(qDecomposed[3]) + ".jpg"
            qExtracted = ({"id": i, "question": question, "answers": answers, "correctAnswer":correctAnswer, "image": image})
        else:
            qExtracted = ({"id": i, "question": question, "answers": answers, "correctAnswer":correctAnswer, "image": ""})
        qExtractedArray.append(qExtracted)

    output = open(outputFile,"w")
    output.write("{ \"questions\": ")
    output.write(json.dumps(qExtractedArray))
    output.write("\n }")
    output.close()
    print "OK, the questions were extracted to the file " + outputFile

