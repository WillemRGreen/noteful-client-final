import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  state = {
    name: '',
    error: false
  }

  handleSubmit = e => {
    e.preventDefault()
    if(this.state.name.length > 0){
      const folder = {
        name: e.target['folder-name'].value
      }
      fetch(`${config.API_ENDPOINT}/api/folders`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(folder),
      })
        .then(res => {
          if (!res.ok)
            return res.json().then(e => Promise.reject(e))
          return res.json()
        })
        .then(folder => {
          this.context.addFolder(folder)
          this.props.history.push(`/folder/${folder.id}`)
        })
        .catch(error => {
          console.error({ error })
        })
    } else {
      this.setState({error: true})
    }
    
  }

  handleNameChange = e => {
    e.preventDefault()
    this.setState({name:e.currentTarget.value})
  }

  render() {
    let input = '';
    if(this.state.error){
      input =
      <div>
        <input onChange={this.handleNameChange} className = 'error-message' type='text' id='folder-name-input' name='folder-name' />
        <p className='lighter'>Folder must have a name</p>
      </div>
    } else { 
      input = 
        <input onChange={this.handleNameChange} type='text' id='folder-name-input' name='folder-name' />
    }
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            {input}
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
