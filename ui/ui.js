const { remote } = require('electron'),
      { app } = remote,
      { exec } = require('child_process'),
      ElectronTitlebarWindows = require('electron-titlebar-windows')

const el = {
   button: document.querySelector('button'),
   inputs: {
      hours: document.querySelector('.setup input[placeholder="hh"]'),
      minutes: document.querySelector('.setup input[placeholder="mm"]'),
      seconds: document.querySelector('.setup input[placeholder="ss"]')
   },
   display: {
      circle: document.querySelector('svg circle'),
      text: document.querySelector('svg text')
   },
   titlebar: document.querySelector('.titlebar'),
   views: {
      setup: document.querySelector('.setup'),
      display: document.querySelector('.display')
   }
}

const titlebar = new ElectronTitlebarWindows({
   backgroundColor: '#242424'
})

titlebar.appendTo(el.titlebar)
titlebar.on('minimize', () => remote.BrowserWindow.getFocusedWindow().minimize())
titlebar.on('maximize', () => remote.BrowserWindow.getFocusedWindow().maximize())
titlebar.on('close', app.quit)


const generateDisplayLabel = (secondsLeft) => {
   let hoursLeft = Math.floor(secondsLeft / (60 * 60))
   let minutesLeft = Math.floor(secondsLeft / 60)
   if(hoursLeft >= 1) {
      return `${hoursLeft}h`
   } else if(minutesLeft >= 1) {
      return `${minutesLeft}m`
   } else {
      return `${secondsLeft}s`
   }
}


let timeInSec

el.display.circle.setAttribute('stroke-dasharray', 2 * el.display.circle.getAttribute('r') * Math.PI)


const startTimer = () => {
   timeInSec = parseFloat(el.inputs.hours.value || 0) * 60 * 60 + parseFloat(el.inputs.minutes.value || 0) * 60 + parseFloat(el.inputs.seconds.value || 0)

   el.display.circle.style.transitionDuration = '0s'
   el.display.circle.style.transitionDuration = `${timeInSec.toString()}s`
   el.display.circle.classList.toggle('running')
   el.display.circle.style.strokeDashoffset = 2 * el.display.circle.getAttribute('r') * Math.PI
   el.button.innerText = 'Cancel'

   let timeLeft = timeInSec
   el.display.text.innerHTML = generateDisplayLabel(timeLeft)
   setInterval(() => {
      timeLeft--
      el.display.text.innerHTML = generateDisplayLabel(timeLeft)
   }, 1000)

   setTimeout(() => {
      let shutdown = document.querySelector('.shutdownCheckbox').checked
      if(!shutdown) {
         exec('shutdown /h')
      } else {
         exec('shutdown /s')
      }
      // app.exit()
   }, timeInSec * 1000)
}

el.button.addEventListener('click', startTimer)
