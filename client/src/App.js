import React, { Component } from 'react';
import axios from 'axios'

import './App.css';

const url = 'http://localhost:5000/api/posts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      newPost: {
        title: '',
        contents: '',
      },
      isUpdating: false,
      updatingId: null
    }
  }
  
  componentDidMount() {
    axios.get(`${url}`)
      .then(res => {
        this.setState({ posts: res.data })
      })
  }

  handleChange = e => {
    this.setState({
      newPost: {
        ...this.state.newPost,
        [e.target.name] : e.target.value
      }
    })
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input  
            type='text'
            name='title'
            value={this.state.newPost.title}
            onChange={this.handleChange}
            placeholder='title'
          />
          <input  
            type='text'
            name='contents'
            value={this.state.newPost.contents}
            onChange={this.handleChange}
            placeholder='contents'
          />
          <button 
            type='submit'>
            {this.state.isUpdating ? 'Update' : 'Add'}
          </button>
        </form>
        <div className='posts'>
          {this.state.posts.map(post => {
            return (
              <div key={post.id} className='post'>
                <h2>{post.title}</h2>
                <h3>{post.contents}</h3>
                <h4>{post.updated_at}</h4>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
