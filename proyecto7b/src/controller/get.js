import conexion from '../../database.js';

export const answers = async (req, res) => {
  try {
      const page = req.query.page || 1;
      const pageSize = req.query.pageSize || 10;
      const offset = (page - 1) * pageSize;
      const query = `SELECT * FROM answers LIMIT ${pageSize} OFFSET ${offset}`;
      const queryCount = 'SELECT COUNT(*) FROM answers';

      // Realizar la consulta de las answers
      conexion.query(query, (error, results) => {
          if (error) {
              throw error;
          }

          // Realizar la consulta para contar el total de answers
          conexion.query(queryCount, (error, count) => {
              if (error) {
                  throw error;
              }
              const totalItems = count[0]["COUNT(*)"];
              const totalPages = Math.ceil(totalItems / pageSize);
              if (page > totalPages) {
                  return res.status(404).json({ message: `La página ${page} no existe` });
              }

              res.status(200).json({ data: results, currentPage: page, totalPages: totalPages, totalItems: totalItems });
          });
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const questions	 = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const query = `SELECT * FROM questions	 LIMIT ${pageSize} OFFSET ${offset}`;
        const queryCount = 'SELECT COUNT(*) FROM questions	';
  
        // Realizar la consulta de las questions	
        conexion.query(query, (error, results) => {
            if (error) {
                throw error;
            }
  
            // Realizar la consulta para contar el total de questions	
            conexion.query(queryCount, (error, count) => {
                if (error) {
                    throw error;
                }
                const totalItems = count[0]["COUNT(*)"];
                const totalPages = Math.ceil(totalItems / pageSize);
                if (page > totalPages) {
                    return res.status(404).json({ message: `La página ${page} no existe` });
                }
  
                res.status(200).json({ data: results, currentPage: page, totalPages: totalPages, totalItems: totalItems });
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };


  export const randomQuestionsWithAnswers = async (req, res) => {
    try {
        const queryRandomQuestions = `
            SELECT *
            FROM questions
            ORDER BY RAND()
            LIMIT 10
        `;

        const questions = await new Promise((resolve, reject) => {
            conexion.query(queryRandomQuestions, async (error, questionResults) => {
                if (error) {
                    reject(error);
                    return;
                }

                // Recorrer las preguntas para obtener las respuestas de cada una
                const promises = questionResults.map(async (question) => {
                    const queryAnswers = `
                        SELECT *
                        FROM answers
                        WHERE question_id = ?
                        ORDER BY RAND()
                    `;

                    const answers = await new Promise((resolve, reject) => {
                        conexion.query(queryAnswers, [question.id], (error, answerResults) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            resolve(answerResults);
                        });
                    });

                    // Mezclar aleatoriamente las respuestas
                    shuffleArray(answers);

                    return { question, answers };
                });

                // Esperar a que todas las consultas de respuestas se completen
                const results = await Promise.all(promises);
                resolve(results);
            });
        });

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para mezclar aleatoriamente un array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
