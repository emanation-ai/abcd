class CountDown extends HTMLElement {
  
    constructor(){
        super();
        
        this.countDownDate = this.getAttribute('data-date');

        if(!this.countDownDate) return;
        console.log(this.countDownDate);
        this.targetDate  = new Date(Date.parse(this.countDownDate));
        this.now   = new Date();
    
        window.days = this.daysBetween(this.now, this.targetDate);
        this.secondsLeft = this.secondsDifference(this.now, this.targetDate);
        window.hours = Math.floor(this.secondsLeft / 60 / 60);
        this.secondsLeft = this.secondsLeft - (window.hours * 60 * 60);
        window.minutes = Math.floor(this.secondsLeft / 60 );
        this.secondsLeft = this.secondsLeft - (window.minutes * 60);
        window.seconds = Math.floor(this.secondsLeft);
    
        this.startCountdown();
        this.interval;
    }
  
    daysBetween( date1, date2 ) {

        const one_day=1000*60*60*24;
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();
        const difference_ms = date2_ms - date1_ms;
        return Math.round(difference_ms/one_day); 

    }
  
    secondsDifference( date1, date2 ) {

        const one_day=1000*60*60*24;
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();
        const difference_ms = date2_ms - date1_ms;
        const difference = difference_ms / one_day; 
        const offset = difference - Math.floor(difference);
        return offset * (60*60*24);

    }
  
  
  
  startCountdown() {
    
    this.displayValue('#js-days', window.days);
    this.displayValue('#js-hours', window.hours);
    this.displayValue('#js-minutes', window.minutes);
    this.displayValue('#js-seconds', window.seconds);
  
    const interval = setInterval(() => {
        if (window.seconds > 0) {
            window.seconds--;
            this.displayValue('#js-seconds', window.seconds);
        } else {
            if (window.minutes > 0) {
            window.minutes--;
            window.seconds = 59;
            this.updateValues('minutes');
            } else {
                if (window.hours > 0)  {
                    window.hours--;
                    window.minutes = 59;
                    window.seconds = 59;
                    this.updateValues('hours');
                } else {
                    window.days--;
                    window.hours = 23;
                    window.minutes = 59;
                    window.seconds = 59;
                    this.updateValues('days');
                }
            }
        }
    }, 1000);

  }
  
  
  updateValues(context) {
    if (context === 'days') {
        this.displayValue('#js-days', window.days);
        this.displayValue('#js-hours', window.hours);
        this.displayValue('#js-minutes', window.minutes);
        this.displayValue('#js-seconds', window.seconds);
    } else if (context === 'hours') {
        this.displayValue('#js-hours', window.hours);
        this.displayValue('#js-minutes', window.minutes);
        this.displayValue('#js-seconds', window.seconds);
    } else if (context === 'minutes') {
        this.displayValue('#js-minutes', window.minutes);
        this.displayValue('#js-seconds', window.seconds);
    }
  }
  
  displayValue(target, value) {
    const newDigit = document.createElement('span');
    const item = document.querySelector(target);
    newDigit.textContent = this.pad(value);
    newDigit.classList.add('new');
    item.appendChild(newDigit);
    item.querySelector('.current')?.classList.add('old')?.classList.remove('current');
    item.querySelector('.old')?.remove();
    item.querySelector('.new')?.classList.add('current')?.classList.remove('new');

  }
  
  pad(number) {
    return ("0" + number).slice(-2);
  }

}

customElements.define('count-down', CountDown);