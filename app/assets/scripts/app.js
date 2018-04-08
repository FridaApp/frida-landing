import Subscribe from './Subscribe'

class App {
  constructor() {
    this._init()
  }

  _init() {
    console.log('App loaded!')
    this.subscribe = new Subscribe()
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const app = new App()
})
