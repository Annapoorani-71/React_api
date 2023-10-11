import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todo.css';
import AddPost from './AddPost';

function Todo() {
  const [formData, setFormData] = useState({
    title: ''
  });
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:3000/posts')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching to-do items:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.title.trim() === '') {
      alert('This is a required field');
      return;
    }

    // Send a POST request to create a new todo item with done: false by default
    axios
      .post('http://localhost:3000/posts', {
        title: formData.title,
        done: false, // Set "done" property to false by default
      })
      .then((response) => {
        console.log('To-do item created:', response.data);
        setFormData({
          title: ''
        });

        fetchTodos();
      })
      .catch((error) => {
        console.error('Error creating to-do item:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/posts/${id}`)
      .then(response => {
        console.log('To-do item deleted:', response.data);
        fetchTodos();
      })
      .catch(error => {
        console.error('Error deleting to-do item:', error);
      });
  };

  const handleUpdate = (id, updatedTitle) => {
    axios.put(`http://localhost:3000/posts/${id}`, { title: updatedTitle })
      .then(response => {
        console.log('To-do item updated:', response.data);
        fetchTodos();
      })
      .catch(error => {
        console.error('Error updating to-do item:', error);
      });
  };

  const handleDone = (id, done) => {
    axios.put(`http://localhost:3000/posts/${id}`, { done: !done })
      .then((response) => {
        console.log('To-do item status updated:', response.data);
        fetchTodos();
      })
      .catch((error) => {
        console.error('Error updating to-do item status:', error);
      });
  };

  return (
    <div>
      <h2>To-Do List</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Todo List:</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <button type="submit" aria-required>Add</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleDone(todo.id, todo.done)} 
            />
            <span>{todo.title}</span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
            <button
              onClick={() => {
                const updatedTitle = prompt('Enter the updated title:', todo.title);
                if (updatedTitle !== null) {
                  handleUpdate(todo.id, updatedTitle);
                }
              }}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
      <AddPost />
    </div>
  );
}

export default Todo;
