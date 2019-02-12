import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment'

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

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isUpdating) {
      this.updatePost();
      this.setState({
        isUpdating: false,
        newPost: {
          title: '',
          contents: '',
        },
        updatingId: null
      })
    } else {
      this.addPost(this.state.newPost)
    }
  }

  addPost = post => {
    axios.post(`${url}`, post)
      .then(res => {
        axios.get(`${url}`)
          .then(res => {
            this.setState({
              posts: res.data,
              newPost: {
                title: '',
                contents: '',
              }
            })
          })
      })
  }

  deletePost = (e, id) => {
    e.preventDefault();
    axios.delete(`${url}/${id}`)
      .then(res => {
        axios.get(`${url}`)
          .then(res => {
            this.setState({
              posts: res.data
            })
          })
      })
  }

  updatePost = () => {
    const toBeUpdated = this.state.posts.find(post => post.id === this.state.updatingId);
    axios.put(`${url}/${toBeUpdated.id}`, this.state.newPost)
      .then(res => {
        axios.get(`${url}`)
          .then(res => {
            this.setState({
              posts: res.data
            })
          })
      })
  }

  populateForm = (e, post) => {
    e.preventDefault();
    this.setState({
      newPost: {
        title: post.title,
        contents: post.contents
      },
      isUpdating: true,
      updatingId: post.id
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
                <h4>Created: {moment(post.updated_at).fromNow()}</h4>
                <div className='modify'>
                  <button className='delete' onClick={(e) => this.deletePost(e, post.id)}>Delete</button>
                  <button className='edit' onClick={(e) => this.populateForm(e, post)}>Update</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
