import Subscribe from './Subscribe'

class App {
  constructor() {
    this._init()
  }

  _init() {
    console.log('App loaded!')
    this.subscribe = new Subscribe()
    var scroll = new SmoothScroll('a[href*="#"]')
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const app = new App()
})
