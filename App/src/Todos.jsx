import React, { useEffect, useState } from 'react';
import './To-do.css';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchCriterion, setSearchCriterion] = useState('title'); // New state for search criterion
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(`http://localhost:3001/todos?userId=${user.id}`);
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, [user.id]);

  const addTodo = async () => {
    if (!newTodoTitle) return;

    const newTodo = {
      userId: user.id,
      title: newTodoTitle,
      completed: false
    };

    const response = await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTodo)
    });

    const addedTodo = await response.json();
    setTodos([...todos, addedTodo]);
    setNewTodoTitle('');
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE'
    });

    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = async (updatedTodo) => {
    await fetch(`http://localhost:3001/todos/${updatedTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    });

    setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  const filteredTodos = todos
    .filter(todo => {
      if (searchCriterion === 'id') {
        return todo.id.toString().includes(searchTerm);
      } else if (searchCriterion === 'title') {
        return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchCriterion === 'completed') {
        return todo.completed === (searchTerm.toLowerCase() === 'completed');
      }
      return true;
    })
    .sort((a, b) => {
      if (filter === 'alphabetical') return a.title.localeCompare(b.title);
      if (filter === 'completed') return a.completed - b.completed;
      if (filter === 'random') return 0.5 - Math.random();
      return a.id - b.id; // default is by ID
    });

  return (
    <div className="todos-container">
      <h2>Todos</h2>
      <div className="todo-controls">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="New todo title"
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-button">Add Todo</button>
      </div>
      <br />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search todos"
        className="todo-input"
      />
      <select onChange={(e) => setSearchCriterion(e.target.value)} value={searchCriterion} className="todo-select">
        <option value="title">Title</option>
        <option value="id">ID</option>
        <option value="completed">Completed</option>
      </select>
      <select onChange={(e) => setFilter(e.target.value)} value={filter} className="todo-select">
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="random">Random</option>
      </select>
      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <li key={todo.id} className="todo-item">
            <span>{index + 1}. {todo.title}</span>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
              className="todo-checkbox"
            />
            <button onClick={() => deleteTodo(todo.id)} className="todo-delete">Delete</button>
            <button
              onClick={() => updateTodo({ ...todo, title: prompt('Update Title', todo.title) || todo.title })}
              className="todo-update">Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
