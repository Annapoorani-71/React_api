import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddPost() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/posts')
      .then(response => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleRadioChange = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Toggle the "done" property when the radio button is clicked
        return { ...post, done: !post.done };
      }
      return post;
    });

    // Update the state with the modified list
    setPosts(updatedPosts);

    // Send a PUT request to update the JSON file
    axios.put(`http://localhost:3000/posts/${postId}`, { done: true }) // or false based on your needs
      .then(response => {
        console.log('To-do item status updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating to-do item status:', error);
      });
  };

  return (
    <div className="App">
      <h1>VALUE FETCHED BY AXIOS</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2 style={{ textDecoration: post.done ? 'line-through' : 'none' }}>
              {post.title}
            </h2>
            <p>{post.body}</p>
            <input
              type="radio"
              checked={post.done}
              onChange={() => handleRadioChange(post.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddPost;
