const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx-7W6M3_ebHLesrrlR-R9xMjk4OEFu7BlhLRJAQ54p7dFuXmkz/exec'

class Subscribe {
  constructor() {
    this.$form = document.getElementById('subscribe-form')
    this.$email = document.getElementById('email-input')
    this.$button = document.querySelector('.subscribe__submit')
    this.$subscribed = document.querySelector('.subscribe__subscribed')
    this.init()
  }

  init() {
    this.$form.addEventListener('submit', e => {
      this.handleFormSubmit(e)
    })

    if (localStorage.getItem('subscribed')) {
      this.$subscribed.style.display = 'block'
      this.$form.style.display = 'none'
    }
  }

  handleFormSubmit(e) {
    e.preventDefault()
    this.$button.setAttribute('disabled', 'disabled')
    const url = new URL(SCRIPT_URL)
    const params = { email: this.$email.value, timestamp: Date.now() }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )
    console.log(url)
    fetch(url)
      .then(data => data.text())
      .then(text => {
        localStorage.setItem('subscribed', 'true')
        this.$subscribed.style.display = 'block'
        this.$form.style.display = 'none'
      })
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}

export default Subscribe
