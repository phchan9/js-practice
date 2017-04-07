/////////////////////////////
// CODING CHALLENGE


/*
--- Let's build a fun quiz game in the console! ---

1. Build a function constructor called Question to describe a question. A question should include:
a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
c) correct answer (I would use a number for this)

2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor (Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code (Hint: we learned a special technique to do exactly that).
*/


// expert level
/*
8. iteratively play game and record the score you get

9. input "exit" to quit the game.

10. track the user's score to make the game more fun. 1 questions, 1 point.

11. display the score in the console. 

*/

function Question(question, answers, correctAnswer) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
}

// shuffle questions order
function shuffleOrder(questions) {
    
    function randomIdx(range) {
        return (Math.floor(Math.random() * 100)) % range;
    }

    var head = randomIdx(questions.length);
    var shuffledQ = [];
    
    for (var i = head, j = 0; j < questions.length ; j++) {
        shuffledQ.push(questions[i]);
        i = (i + 1) % questions.length;
    }
    return shuffledQ;
}

function outputQuestionString(idx, q) {
    var text = 'Q' + idx + '. ' + q.question + '\n';
    for (var i = 0; i < q.answers.length; ++i) {
        var answerLine = (i + 1) + '. ' + q.answers[i] + '\n';
        text += answerLine;
    }
    return text;
}
        
// define constant
var q1 = new Question('Who is the leading actor in Matrix?',
                      ['robert downey', 'keanu reeves'],
                      2);
var q2 = new Question('Who is the leading actress in La La Land?',
                      ['emma stone', 'emma waston'],
                      1);
var q3 = new Question('Who is the leading actor in Inception?',
                      ['leonardo dicapio', 'joseph gordon'],
                      1);
var questions = [q1, q2, q3];
var totalScore = 0;
var eachPoint = 1;
var shuffleQ = shuffleOrder(questions);

for( var i = 0; i < shuffleQ.length; ++i) {

    var q = shuffleQ[i];
    console.log(outputQuestionString(i + 1, q));
    var ans = prompt('Your answer is: ');

    if (ans === 'exit') {
        console.log('You exit in the middle of the game.');
        break;
    }
    
    ans = parseInt(ans);
    if (ans === q.correctAnswer) {
        totalScore += eachPoint;
        console.log('Correct Answer! You got '
                    + totalScore + ' point(s).');
    } else {
        console.log('Wrong Answer! The correct answer is '
                    + q.answers[q.correctAnswer - 1]
                    + '. You still got ' + totalScore + ' point(s).');
    }
}
console.log('Game Over.');
