// QuizList.js
import React, { useEffect, useState } from 'react';
import { database } from '../../firebase/firebase';
import { ref, onValue, remove, update  } from 'firebase/database';
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({ question: '', options: [], correctOption: '' });

  useEffect(() => {
    const quizzesRef = ref(database, 'quizzes');
    onValue(quizzesRef, (snapshot) => {
      const data = snapshot.val();
      const quizList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setQuizzes(quizList);
    });
  }, []);

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all quizzes?')) {
      remove(ref(database, 'quizzes'))
        .then(() => {
          alert('All quizzes deleted successfully!');
          setQuizzes([]);
        })
        .catch((error) => {
          alert('Error deleting quizzes: ' + error);
        });
    }
  };

  const handleEditClick = (quiz) => {
    setEditingQuiz(quiz.id);
    setEditForm({ question: quiz.question, options: quiz.options, correctOption: quiz.correctOption });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleEditOptionChange = (index, value) => {
    const newOptions = [...editForm.options];
    newOptions[index] = value;
    setEditForm(prevForm => ({
      ...prevForm,
      options: newOptions
    }));
  };

  const handleSaveEdit = () => {
    const quizRef = ref(database, `quizzes/${editingQuiz}`);
    update(quizRef, editForm)
      .then(() => {
        alert('Quiz updated successfully!');
        setEditingQuiz(null); // Exit edit mode
      })
      .catch((error) => {
        alert('Error updating quiz: ' + error);
      });
  };

  const handleCancelEdit = () => {
    setEditingQuiz(null);
  };

  return (
    <div className="quiz-list mt-24 p-8 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-800">List of Quiz Questions</h2>
      {quizzes.length > 0 ? (
        <div>
          <ul className="space-y-6">
            {quizzes.map(quiz => (
              <li key={quiz.id} className="border-b pb-4 border-blue-200">
                {editingQuiz === quiz.id ? (
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="question">Question</label>
                      <input
                        type="text"
                        name="question"
                        id="question"
                        value={editForm.question}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded text-black"
                      />
                    </div>
                    {editForm.options.map((option, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor={`option-${index}`}>Option {index + 1}</label>
                        <input
                          type="text"
                          id={`option-${index}`}
                          value={option}
                          onChange={(e) => handleEditOptionChange(index, e.target.value)}
                          className="w-full p-2 border rounded text-black"
                        />
                      </div>
                    ))}
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="correctOption">Correct Answer</label>
                      <input
                        type="text"
                        name="correctOption"
                        id="correctOption"
                        value={editForm.correctOption}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded text-black"
                      />
                    </div>
                    <button onClick={handleSaveEdit} className="mt-2 w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="mt-2 w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-blue-700">{quiz.question}</h3>
                    <ul className="pl-5 mt-2 list-disc space-y-1">
                      {quiz.options.map((option, index) => (
                        <li key={index} className="text-gray-700">{option}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-green-700 font-medium">Correct Answer: {quiz.correctOption}</p>
                    <button onClick={() => handleEditClick(quiz)} className="mt-2 py-1 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      Update Quiz
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={handleDeleteAll}
            className="mt-6 w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete All Quizzes
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">No questions available</p>
      )}
    </div>
  );
};

export default QuizList;