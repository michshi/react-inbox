import React, {Component} from 'react';
import './App.css';
import MessageList from './Components/MessageList'
import Toolbar from './Components/Toolbar'

const API = 'http://localhost:8082/api/messages/'

class App extends Component {


  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  async componentDidMount() {
    const response = await fetch(API)
    if (response.status === 200) {
      const json = await response.json()
      const messages = json._embedded.messages
      this.setState({
        ...this.state,
        messages
      })
    } else {
      console.log('Couldn/t fetch json', response.status);
    }
  }

  newState = (data) => {
    this.setState({
      ...this.state,
      messages: data
    })
  }

  selectToggle = (message) => {
    let index = this.state.messages.indexOf(message)
    this.setState({
      ...this.state,
      messages: [
        ...this.state.messages.slice(0, index), {
          ...message,
          selected: !message.selected
        },
        ...this.state.messages.slice(index + 1)
      ]
    })
  }

  starToggle = (message) => {
    let index = this.state.messages.indexOf(message)
    this.setState({
      ...this.state,
      messages: [
        ...this.state.messages.slice(0, index), {
          ...message,
          starred: !message.starred
        },
        ...this.state.messages.slice(index + 1)
      ]
    })
  }

  selectAll = (event) => {
    event.preventDefault()
    const allSelected = this.state.messages.every(m => m.selected)
    this.setState({
      ...this.state,
      messages: this.state.messages.map(message => {
        message.selected = !allSelected
        return message
      })
    })
  }

  markAsRead = (message) => {
    let msgArr = this.state.messages
    this.setState({
      ...this.state,
      messages: msgArr.map(msg => {
        if (msg.selected === true) {
          msg.read = true
        }
        return msg
      })
    })
  }

  markAsUnread = (message) => {
    let msgArr = this.state.messages
    this.setState({
      ...this.state,
      messages: msgArr.map(msg => {
        if (msg.selected === true) {
          msg.read = false
        }
        return msg
      })
    })
  }

  deleteMess = (message) => {
    let msgArr = this.state.messages
    this.setState({
      ...this.state,
      messages: msgArr.filter(msg => {
        return msg.selected !== true
      })
    })
  }

  addLabel = (e) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      messages: this.state.messages.map(msg => {
        if (msg.selected) {
          if (!msg.labels.includes(e.target.value) && e.target.value !== "Apply label") {
            msg.labels = [
              ...msg.labels,
              e.target.value
            ]
          }
        }
        return msg
      })
    })
  }

  removeLabel = (e) => {
    e.preventDefault()
    let msgArr = this.state.messages
    this.setState({
      messages: msgArr.map(msg => {
        if (msg.selected) {
          if (msg.labels.includes(e.target.value) && e.target.value !== "Remove label") {
            msg.labels = msg.labels.filter(x => {
              return x !== e.target.value
            })
          }
        }
        return msg
      })
    })
  }

  render() {
    return (<div className="container">
      <Toolbar
        messages={this.state.messages}
        selectAll={this.selectAll}
        markAsRead={this.markAsRead}
        markAsUnread={this.markAsUnread}
        deleteMess={this.deleteMess}
        addLabel={this.addLabel}
        removeLabel={this.removeLabel}
        newState={this.newState}/>
      <MessageList
        messages={this.state.messages}
        selectToggle={this.selectToggle}
        starToggle={this.starToggle}
        newState={this.newState}/>
    </div>);
  }
}

export default App
