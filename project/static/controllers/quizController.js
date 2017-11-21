
angular.module('myApp').controller('quizController',  ['$scope', '$location', '$http', '$rootScope', 'AuthService',
    function ($scope, $location, $http, $rootScope, AuthService) {
        $scope.Math = window.Math;
        $scope.categorySelected = false;
        $scope.gameStarted = false;
        $scope.questionRenderred = false;
        $scope.category;
        $scope.user = "unknown";
        $scope.questionsNumber = 7;
        $scope.$on('someEvent', function(event, mass) { console.log('to steila'); });
        $scope.answers = {
            "text" : [],
            "styles" : [
                {
                    "background": "#7cb0dc",
                    "color": "black"
                },
                {
                    "background": "#7cb0dc",
                    "color": "black"
                },
                {
                    "background": "#7cb0dc",
                    "color": "black"
                },
                {
                    "background": "#7cb0dc",
                    "color": "black"
                }
            ],
            "disabled" : [false, false, false, false]
        };
        $scope.questionAnswers = [];
        $scope.gameOver = false;

        $scope.questionCounter = 0;
        $scope.correctAnswersCounter = 0;

        $scope.loseMessages = ["I am sorry", "hmm, maybe next time?", "keep on trying,", "practice makes perfect..", "whoopsy.. :/", "oops...", "don't give up,", "not your best time...", "boooo!!", "κάποιος δεν πρόσεχε πολύ...", "κου-λού-ρι", "καταστρόφ!!", "λίγο χάλια, δε βρίσκεις,", "καλή καρδιά,", "τι λες να δοκιμάσεις να απαντάς στην τύχη,", "εν οίδα ότι ουδέν οίδα,", "μακάριοι οι πτωχοί τω πνεύματι,"];
        $scope.winMessages = ["Bien joué,", "great game!", "you are getting better and better,", "amazing game,", "keep up the good work!", "wow, you are a real Genevois,"];
        $scope.drawMessages = ["almost,", "pas mal,"];

        setUsername = function(username){
            $scope.user = username;
        };

        AuthService.getUsername()
            .then(function(data){
                setUsername(data.data.username);
            });

        $scope.categories =
            {
                styles : {
                    general : {
                        "background": "url('static/categories/images/general.jpg') no-repeat center center",
                        "background-size": "cover"
                    },
                    geneva : {
                        "background": "url('static/categories/images/geneva.jpg') no-repeat center center",
                        "background-size": "cover"
                    },
                    cern: {
                        "background": "url('static/categories/images/cern.jpg') no-repeat center center",
                        "background-size": "cover"
                    },
                    switzerland: {
                        "background": "url('static/categories/images/switzerland.jpg') no-repeat center center",
                        "background-size": "cover"
                    },
                    france: {
                        "background": "url('static/categories/images/france.jpg') no-repeat center center",
                        "background-size": "cover"
                    },
                    orchidees: {
                        "background": "url('static/categories/images/orchidees.jpg') no-repeat center center",
                        "background-size": "cover"
                    }
                }
            };

        startGame = function(category){
            $scope.$apply(function(){
                $scope.categorySelected = true;
                $scope.category = category;
                $scope.gameStarted = true;
                $scope.questionRenderred = true;
            });
            var questionsFile = "";
            switch ($scope.category){
                case "general":
                    questionsFile = 'general.json';
                    break;
                case "cern":
                    questionsFile = 'cern.json';
                    break;
                case "geneva":
                    questionsFile = 'geneva.json';
                    break;
                case "switzerland":
                    questionsFile = 'switzerland.json';
                    break;
                case "france":
                    questionsFile = 'france.json';
                    break;
                case "orchidees":
                    questionsFile = 'orchidees.json';
                    break;
                default:
                    questionsFile = 'general.json';
                    break;
            }
            $scope.questions = [];
            $scope.questionsFetched = false;
            $http.get('static/questions/'+questionsFile)
                .then(function onSuccess(response) {
                    var questions = response.data.questions;
                    console.log("q", questions);
                    var indices = [];
                    var questionIndices= [];
                    for(i=0;i<questions.length;i++){
                        indices[i] = i;
                    }
                    shuffle(indices);
                    if($scope.questionsNumber>questions.length){
                        $scope.questionsNumber = questions;
                    }
                    for(i=0;i<$scope.questionsNumber;i++){
                        questionIndices[i] = indices[i]
                    }

                    for(i=0;i<questionIndices.length;i++){
                        $scope.questions[i] = questions[questionIndices[i]]
                    }
                    console.log("Game started with "+$scope.questionsNumber+" questions: ", $scope.questions);
                    renderQuestion(0, $scope.questions);
                    $scope.questionsFetched = true;
                })
                .catch(function onError(response) {
                    console.log('Could not fetch questions...');
                });
        };
        $scope.questionStyle = {};
        renderQuestion = function(questionCounter, questions){
            setTimeout(function(){
                $scope.$apply(function(){
                    $scope.questionStyle = {
                        "background-image": "url('"+ $scope.questions[questionCounter].image +"'"
                    };
                    for(i=0;i<4;i++){
                        $scope.answers.styles[i] = {

                        };
                        $scope.answers.disabled[i] = false;
                    }
                    $scope.question = $scope.questions[questionCounter].question;
                    $scope.questionAnswers = $scope.questions[questionCounter].answers;
                    $scope.questionRenderred = true
                });
            }, 500);
        };


        submitStatiticsToDb = function(user, score){
            var data = { "score": score };
            $http({
                method: 'POST',
                url: 'http://localhost:5000/api/scores',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: data
            });
        };

        renderStatistics = function(correctAnswersCounter){
            $scope.$apply(function(){
                $scope.gameOver = true;
                if(correctAnswersCounter!=$scope.questionsNumber/2){
                    if(correctAnswersCounter<$scope.questionsNumber/2){
                        $scope.gameOverMessage = $scope.loseMessages[Math.floor(Math.random() * $scope.loseMessages.length)];
                        $scope.gameOverStyle = {
                            "color": "pink"
                        }

                    } else {
                        $scope.gameOverMessage = $scope.winMessages[Math.floor(Math.random() * $scope.winMessages.length)];
                        $scope.gameOverStyle = {
                            "color": "#00BCD4"
                        }
                    }
                } else {
                    $scope.gameOverMessage = $scope.drawMessages[Math.floor(Math.random() * $scope.drawMessages.length)];
                    $scope.gameOverStyle = {
                        "color": "purple"
                    }
                }
            });
            renderChart(correctAnswersCounter, $scope.questionsNumber - correctAnswersCounter);
        };

        $scope.progressPercentage = 0;
        $scope.progressBarStyle = {
            "width": "0%"
        };
        commitAnswer = function(answer){
            var correctAnswer = $scope.questions[$scope.questionCounter].correctAnswer;
            $scope.progressPercentage += 100/$scope.questionsNumber;
            var progressPercentageString = $scope.progressPercentage.toString()+"%";
            $scope.progressBarStyle = {
                "width": progressPercentageString
            };
            $scope.$apply(function(){
                $scope.answers.disabled = [true, true, true, true];
            });
            if(answer===correctAnswer){
                $scope.correctAnswersCounter++;
                $scope.$apply(function(){
                    $scope.answers.styles[answer] = {
                        "background": "green",
                        "color": "white"
                    }
                });
            } else {
                $scope.$apply(function(){
                    $scope.answers.styles[answer] = {
                        "background": "red",
                        "color": "white"
                    }
                });
            }
            $scope.questionCounter++;

            setTimeout(function(){
                if($scope.questionCounter<$scope.questionsNumber){
                    $scope.$apply(function(){
                        $scope.questionRenderred = false
                    });
                    renderQuestion($scope.questionCounter, $scope.questions)
                } else {
                    renderStatistics($scope.correctAnswersCounter);
                    submitStatiticsToDb($scope.user, $scope.correctAnswersCounter*100)
                }
            }, 500);
        }

}]);
