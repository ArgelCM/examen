

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const questionContainer = document.getElementById('questionContainer');
    const questionTitle = document.getElementById('questionTitle');
    const answersContainer = document.getElementById('answersContainer');
    const feedback = document.getElementById('feedback');
    const timerDisplay = document.getElementById('timer');
    const nextButton = document.getElementById('nextButton');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let timerInterval;
    
    // Función para obtener preguntas aleatorias desde la API
    function fetchQuestions() {
      fetch('http://localhost:3000/api/get/randomQuestionsWithAnswers')
        .then(response => response.json())
        .then(data => {
          questions = data;
          showQuestion();
        })
        .catch(error => console.error('Error fetching questions:', error));
    }
    
    // Función para mostrar la pregunta actual y sus respuestas
    function showQuestion() {
      const currentQuestion = questions[currentQuestionIndex];
      questionTitle.textContent = currentQuestion.question.question_text;
      answersContainer.innerHTML = ''; // Limpiar contenedor de respuestas
    
      currentQuestion.answers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.classList.add('btn', 'btn-light', 'btn-lg', 'px-4', 'rounded-pill', 'my-2', 'botonrespuesta');
        answerButton.textContent = answer.answer_text;
        nextButton.disabled = true; // Habilitar botón siguiente después de responder
        feedback.textContent = '';
  
        answerButton.addEventListener('click', () => {
          checkAnswer(answer);
          clearInterval(timerInterval); // Detener el temporizador al revisar la respuesta
          disableAnswerButtons();
        });
  
        answersContainer.appendChild(answerButton);
      });
  
      // Reiniciar temporizador para la pregunta actual (15 segundos)
      resetTimer(15);
    }
    
    // Función para iniciar o reiniciar el temporizador
    function resetTimer(seconds) {
      clearInterval(timerInterval);
      let timeLeft = seconds;
      updateTimerDisplay(timeLeft);
  
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleTimeout();
        }
      }, 1000);
    }
    
    // Función para actualizar la visualización del temporizador
    function updateTimerDisplay(timeLeft) {
      timerDisplay.textContent = `Tiempo restante: ${timeLeft} segundos`;
    }
  
   // Función para verificar la respuesta seleccionada
// Función para verificar la respuesta seleccionada
function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answers.find(answer => answer.is_correct === 1);
  
    if (selectedAnswer.is_correct === 1) {
      score++; // Incrementar puntaje si es correcta
      feedback.textContent = 'Respuesta correcta.';
      feedback.style.color = 'green';
  
      // Cambiar el color de la respuesta seleccionada a verde
      const answerButtons = answersContainer.querySelectorAll('.botonrespuesta');
      answerButtons.forEach(button => {
        if (button.textContent === selectedAnswer.answer_text) {
          button.style.backgroundColor = 'green';
        }
      });
    } else {
      feedback.textContent = 'Respuesta incorrecta.';
      feedback.style.color = 'red';
  
      // Cambiar el color de la respuesta seleccionada a rojo y la correcta a verde
      const answerButtons = answersContainer.querySelectorAll('.botonrespuesta');
      answerButtons.forEach(button => {
        if (button.textContent === selectedAnswer.answer_text) {
          button.style.backgroundColor = 'red';
        }
        if (button.textContent === correctAnswer.answer_text) {
          button.style.backgroundColor = 'green';
        }
      });
    }
  
    nextButton.disabled = false; // Habilitar botón siguiente después de responder
    showFeedback();
  }
  
  
    // Función para mostrar retroalimentación
    function showFeedback() {
      feedback.innerHTML += `<br>Puntuación actual: ${score}`;
    }
  
    // Función para deshabilitar botones de respuesta después de seleccionar una
    function disableAnswerButtons() {
      const answerButtons = answersContainer.getElementsByTagName('button');
      for (let button of answerButtons) {
        button.disabled = true;
      }
    }
  
    // Función para manejar el tiempo de espera (timeout)
    function handleTimeout() {
      feedback.textContent = 'Se acabó el tiempo. Respuesta incorrecta.';
      feedback.style.color = 'red';
     disableAnswerButtons() 
      nextButton.disabled = false; // Habilitar botón siguiente después de responder
    }
  
    // Evento click para pasar a la siguiente pregunta
    nextButton.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
        nextButton.disabled = true; // Deshabilitar hasta mostrar siguiente pregunta
      } else {
        endExam();
      }
    });
  
    // Función para finalizar el examen
    function endExam() {
        let message = '';
        if (score <= 4) {
            message = `Tu puntuación total es ${score}. Necesitas estudiar más.`;
          } else if (score <= 8) {
            message = `¡Felicidades! Tu puntuación total es ${score}. Buen trabajo.`;
          } else {
            message = `¡Excelente trabajo! Tu puntuación total es ${score}.`;
          }
      
        const modalBody = document.getElementById('scoreModalBody');
        modalBody.innerHTML = `<p>${message}</p>`;
        
        // Mostrar el modal
        const scoreModal = new bootstrap.Modal(document.getElementById('scoreModal'), {
          keyboard: false
        });
        scoreModal.show();
      }
      
  
    // Iniciar el examen al cargar la página
    fetchQuestions();
  });
  

  function restartExam() {
    // Redirigir al usuario a la página del examen para reiniciar
    window.location.href = '/exam.html'; // Ajusta la URL según tu estructura de archivos
  }
  
  function exitExam() {
    // Redirigir al usuario a la página de inicio
    window.location.href = '/index.html'; // Ajusta la URL según tu estructura de archivos
  }
  

  