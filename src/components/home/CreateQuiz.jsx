// CreateQuiz.js
import React, { useState } from 'react';
import { database } from '../../firebase/firebase';
// import { ref, set } from 'firebase/database';
import { ref,push   } from 'firebase/database';

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctOption: '' }]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    questions.forEach((q) => {
      const quizRef = ref(database, 'quizzes');
      push(quizRef, q)
        .then(() => {
          alert('Questions added successfully!');
          setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
        })
        .catch((error) => {
          alert('Error adding questions: ' + error);
        });
    });
  };

  return (
    <div className="create-quiz mt-24 p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Quiz Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="space-y-4">
            <div>
              <label className="block text-gray-700">Question:</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            {q.options.map((option, oIndex) => (
              <div key={oIndex}>
                <label className="block text-gray-700">Option {oIndex + 1}:</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>
            ))}
            <div>
              <label className="block text-gray-700">Correct Option:</label>
              <input
                type="text"
                value={q.correctOption}
                onChange={(e) => handleQuestionChange(qIndex, 'correctOption', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion} className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Add Another Question
        </button>
        <button type="submit" className="w-full py-2 px-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500">
          Submit All Questions
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;