import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  state = {
    name: '',
    content:'',
    folder_id:'',
    nameError:false,
    contentError:false
  }

  handleSubmit = e => {
    e.preventDefault()
    if(this.state.name.length > 0){
      if(this.state.content.length > 0){
        const newNote = {
          name: e.target['note-name'].value,
          content: e.target['note-content'].value,
          folder_id: e.target['note-folder-id'].value,
          modified: new Date(),
        }
        fetch(`${config.API_ENDPOINT}/api/notes`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(newNote),
        })
          .then(res => {
            if (!res.ok)
              return res.json().then(e => Promise.reject(e))
            return res.json()
          })
          .then(note => {
            this.context.addNote(note)
            this.props.history.push(`/folder/${note.folder_id}`)
          })
          .catch(error => {
            console.error({ error })
          })
      } else {
        this.setState({contentError:true})
      }
    } else {
      this.setState({nameError:true})
    }
    
  }

  handleNameChange = (e) => {
    this.setState({name:e.currentTarget.value})
  }

  handleContentChange = (e) => {
    this.setState({content:e.currentTarget.value})
  }

  render() {
    let nameInput ='';
    let contentInput='';
    if(this.state.nameError){
      nameInput =
        <div>
          <input onChange={this.handleNameChange} className='error-message' type='text' id='note-name-input' name='note-name' />
          <p>Enter a name</p>
        </div>
    } else {
      nameInput =
        <input onChange={this.handleNameChange} type='text' id='note-name-input' name='note-name' />
    }
    if(this.state.contentError){
      contentInput = 
      <div>
        <textarea onChange={this.handleContentChange} className='error-message' id='note-content-input' name='note-content' />
        <p>Enter Content</p>
      </div>
    } else {
      contentInput = 
        <textarea onChange={this.handleContentChange} id='note-content-input' name='note-content' />
    }
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            {nameInput}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            {contentInput}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id'>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
