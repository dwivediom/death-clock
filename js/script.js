console.clear();

// Array of JavaScript supported languages for local dates
const languageFlags = [
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', flag: '🇸🇦' },
  { code: 'cs-CZ', name: 'Czech (Czech Republic)', flag: '🇨🇿' },
  { code: 'da-DK', name: 'Danish (Denmark)', flag: '🇩🇰' },
  { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
  { code: 'el-GR', name: 'Greek (Greece)', flag: '🇬🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fi-FI', name: 'Finnish (Finland)', flag: '🇫🇮' },
  { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
  { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
  { code: 'he-IL', name: 'Hebrew (Israel)', flag: '🇮🇱' },
  { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
  { code: 'hu-HU', name: 'Hungarian (Hungary)', flag: '🇭🇺' },
  { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷' },
  { code: 'nl-NL', name: 'Dutch (Netherlands)', flag: '🇳🇱' },
  { code: 'no-NO', name: 'Norwegian (Norway)', flag: '🇳🇴' },
  { code: 'pl-PL', name: 'Polish (Poland)', flag: '🇵🇱' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ro-RO', name: 'Romanian (Romania)', flag: '🇷🇴' },
  { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
  { code: 'sv-SE', name: 'Swedish (Sweden)', flag: '🇸🇪' },
  { code: 'th-TH', name: 'Thai (Thailand)', flag: '🇹🇭' },
  { code: 'tr-TR', name: 'Turkish (Turkey)', flag: '🇹🇷' },
  { code: 'vi-VN', name: 'Vietnamese (Vietnam)', flag: '🇻🇳' },
  { code: 'zh-CN', name: 'Chinese (Simplified, China)', flag: '🇨🇳' },
];

const RADIUS = 140;

// Default regions map
const defaultRegions = languageFlags.reduce((map, lang) => {
  const baseLang = lang.code.split('-')[0];
  if (!map[baseLang]) {
    map[baseLang] = lang.code;
  }
  return map;
}, {});

// DOM Elements
const currentLangDisplay = document.getElementById('current-lang');
const languageDialog = document.getElementById('language-dialog');
const languageOptionsContainer = document.getElementById('language-options');
const closeButton = document.getElementById('btn-dialog-close');
const deathYearDialog = document.getElementById('death-year-dialog');
const deathYearInput = document.getElementById('death-year');
const submitDeathYear = document.getElementById('submit-death-year');
const btnDeathDialogClose = document.getElementById('btn-death-dialog-close');
const countdownTimer = document.getElementById('countdown-timer');
const addCountdownBtn = document.getElementById('add-countdown');
const addCountdownDialog = document.getElementById('add-countdown-dialog');
const submitCountdownBtn = document.getElementById('submit-countdown');
const countdownDialogClose = document.getElementById('countdown-dialog-close');
const customCountdownsContainer = document.getElementById('custom-countdowns');

// State variables
let locale = getLocale();
let deathYear = null;
let customCountdowns = JSON.parse(localStorage.getItem('customCountdowns') || '[]');

// Local Storage Functions
function saveDeathYear(year) {
    localStorage.setItem('deathYear', year);
}

function getStoredDeathYear() {
    return localStorage.getItem('deathYear');
}

function getLocale() {
    let language = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
    if (language.length === 2) {
        language = defaultRegions[language] || `${language}-${language.toUpperCase()}`;
    }
    return language;
}

// Clock Face Functions
function drawClockFaces() {
    const clockFaces = document.querySelectorAll('.clock-face');

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentWeekday = currentDate.getDay();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const weekdayNames = Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(2021, 0, i + 3))
    );
    const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2021, i))
    );

    clockFaces.forEach(clockFace => {
        clockFace.innerHTML = '';

        const clockType = clockFace.getAttribute('data-clock');
        const numbers = parseInt(clockFace.getAttribute('data-numbers'), 10);
        const RADIUS = (clockFace.offsetWidth / 2) - 20;
        const center = clockFace.offsetWidth / 2;

        let valueSet;
        let currentValue;

        switch (clockType) {
            case 'seconds':
                valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentSeconds).padStart(2, '0');
                break;
            case 'minutes':
                valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentMinutes).padStart(2, '0');
                break;
            case 'hours':
                valueSet = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentHours).padStart(2, '0');
                break;
            case 'days':
                valueSet = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
                currentValue = currentDay;
                break;
            case 'months':
                valueSet = monthNames;
                currentValue = currentMonth;
                break;
            case 'years':
                valueSet = Array.from({ length: 101 }, (_, i) => 2000 + i);
                currentValue = currentYear;
                break;
            case 'day-names':
                valueSet = weekdayNames;
                currentValue = currentWeekday;
                break;
            default:
                return;
        }

        valueSet.forEach((value, i) => {
            const angle = (i * (360 / numbers));
            const x = center + RADIUS * Math.cos((angle * Math.PI) / 180);
            const y = center + RADIUS * Math.sin((angle * Math.PI) / 180);

            const element = document.createElement('span');
            element.classList.add('number');
            
            if (clockType === 'years' && deathYear && parseInt(value) >= deathYear) {
                element.classList.add('dead');
            }
            
            element.textContent = value;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            clockFace.appendChild(element);
        });

        const currentIndex = valueSet.indexOf(
            typeof valueSet[0] === 'string' ? String(currentValue) : currentValue
        );
        const rotationAngle = -((currentIndex / numbers) * 360);
        clockFace.style.transform = `rotate(${rotationAngle}deg)`;
    });
}

function rotateClockFaces() {
    const clockFaces = document.querySelectorAll('.clock-face');
    const lastAngles = {};

    function updateRotations() {
        const now = new Date();
        const currentSecond = now.getSeconds();
        const currentMinute = now.getMinutes();
        const currentHour = now.getHours();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const currentWeekday = now.getDay();

        clockFaces.forEach(clockFace => {
            const clockType = clockFace.getAttribute('data-clock');
            const totalNumbers = parseInt(clockFace.getAttribute('data-numbers'), 10);

            let currentValue;
            switch (clockType) {
                case 'seconds': currentValue = currentSecond; break;
                case 'minutes': currentValue = currentMinute; break;
                case 'hours': currentValue = currentHour; break;
                case 'days': currentValue = currentDay - 1; break;
                case 'months': currentValue = currentMonth; break;
                case 'years': currentValue = currentYear - 2000; break;
                case 'day-names': currentValue = currentWeekday; break;
                default: return;
            }

            const targetAngle = (360 / totalNumbers) * currentValue;
            const clockId = clockFace.id || clockType;
            const lastAngle = lastAngles[clockId] || 0;
            const shortestDelta = ((targetAngle - lastAngle + 540) % 360) - 180;
            const newAngle = lastAngle + shortestDelta;
            
            clockFace.style.transform = `rotate(${newAngle * -1}deg)`;
            lastAngles[clockId] = newAngle;

            const numbers = clockFace.querySelectorAll('.number');
            numbers.forEach((number, index) => {
                number.classList.toggle('active', index === currentValue);
            });
        });
        requestAnimationFrame(updateRotations);
    }

    updateRotations();
}

// Language Dialog Functions
function createLanguageOptions() {
    const centerX = languageOptionsContainer.offsetWidth / 2;
    const centerY = languageOptionsContainer.offsetHeight / 2;

    languageFlags.forEach((lang, index, arr) => {
        const angle = (index / arr.length) * 2 * Math.PI;
        const x = centerX + RADIUS * Math.cos(angle);
        const y = centerY + RADIUS * Math.sin(angle);

        const radioWrapper = document.createElement('label');
        radioWrapper.title = lang.name;
        radioWrapper.style.left = `${x}px`;
        radioWrapper.style.top = `${y}px`;

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'language';
        radioInput.value = lang.code;

        if (lang.code === locale) {
            radioInput.checked = true;
            radioWrapper.classList.add('active');
        }

        const flag = document.createElement('span');
        flag.classList.add('flag-icon');
        flag.innerText = lang.flag;

        radioWrapper.appendChild(radioInput);
        radioWrapper.appendChild(flag);
        languageOptionsContainer.appendChild(radioWrapper);

        radioWrapper.addEventListener('mouseover', () => showTitle(lang.name));
        radioWrapper.addEventListener('mouseleave', hideTitle);

        radioInput.addEventListener('change', () => {
            locale = radioInput.value;
            setCurrentLangDisplay(lang);
            drawClockFaces();
            document.querySelector('label.active')?.classList.remove('active');
            radioWrapper.classList.add('active');
            closeDialog();
        });
    });
}

// Title Display Functions
let titleDisplay = null;
function showTitle(languageName) {
    if (titleDisplay) {
        titleDisplay.remove();
    }
    titleDisplay = document.createElement('div');
    titleDisplay.classList.add('language-title');
    titleDisplay.textContent = languageName;
    languageOptionsContainer.appendChild(titleDisplay);
}

function hideTitle() {
    if (titleDisplay) {
        titleDisplay.textContent = '';
    }
}

// Dialog Management Functions
function setCurrentLangDisplay(lang) {
    currentLangDisplay.textContent = lang.flag;
    currentLangDisplay.title = lang.name;
    showTitle(lang.name);
}

function openDialog() {
    languageDialog.showModal();
    createLanguageOptions();
    addDialogCloseListener();
}

function closeDialog() {
    languageDialog.close();
    removeLanguageOptions();
    removeDialogCloseListener();
}

function removeLanguageOptions() {
    languageOptionsContainer.innerHTML = '';
}

function addDialogCloseListener() {
    languageDialog.addEventListener('click', closeDialogOnClickOutside);
}

function removeDialogCloseListener() {
    languageDialog.removeEventListener('click', closeDialogOnClickOutside);
}

function closeDialogOnClickOutside(e) {
    if (e.target === languageDialog) {
        closeDialog();
    }
}

// Custom Countdown Functions
function updateCountdownTimer() {
    if (!deathYear) return;
    
    const now = new Date();
    const deathDate = new Date(deathYear, 0, 1);
    const timeLeft = deathDate - now;

    if (timeLeft <= 0) {
        countdownTimer.textContent = 'Time\'s up!';
        return;
    }

    const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownTimer.textContent = `Time left: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function renderCustomCountdowns() {
  customCountdownsContainer.innerHTML = '';
  customCountdowns.forEach((countdown, index) => {
      const div = document.createElement('div');
      div.className = 'countdown-item';
      div.innerHTML = `
          <span class="countdown-delete" data-index="${index}">×</span>
          <div class="countdown-title">${countdown.title}</div>
          <div class="countdown-time" data-date="${countdown.date}"></div>
      `;
      customCountdownsContainer.appendChild(div);
  });
  updateCustomCountdowns();
}

function updateCustomCountdowns() {
  document.querySelectorAll('.countdown-time').forEach(element => {
      const targetDate = new Date(element.dataset.date);
      const now = new Date();
      const timeLeft = targetDate - now;

      if (timeLeft <= 0) {
          element.textContent = 'Expired';
          return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
  });
}
// Event Listeners
window.addEventListener('load', () => {
    const storedYear = getStoredDeathYear();
    if (storedYear) {
        deathYear = parseInt(storedYear);
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 1000);
    } else {
        deathYearDialog.showModal();
    }
    renderCustomCountdowns();
});

submitDeathYear.addEventListener('click', () => {
    const year = parseInt(deathYearInput.value);
    if (year >= 2024 && year <= 2100) {
        deathYear = year;
        saveDeathYear(year);
        deathYearDialog.close();
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 1000);
        drawClockFaces(); // Redraw clock faces to update 'dead' years
    } else {
        alert('Please enter a year between 2024 and 2100');
    }
});

btnDeathDialogClose.addEventListener('click', () => {
    deathYearDialog.close();
});

document.getElementById('restart-time').addEventListener('click', () => {
    localStorage.removeItem('deathYear');
    deathYear = null;
    deathYearDialog.showModal();
});

addCountdownBtn.addEventListener('click', () => {
    addCountdownDialog.showModal();
});

countdownDialogClose.addEventListener('click', () => {
    addCountdownDialog.close();
});

submitCountdownBtn.addEventListener('click', () => {
  const title = document.getElementById('countdown-title').value;
  const date = document.getElementById('countdown-date').value;
  
  if (title && date) {
      const countdown = { title, date: new Date(date).toISOString() };
      customCountdowns.push(countdown);
      localStorage.setItem('customCountdowns', JSON.stringify(customCountdowns));
      renderCustomCountdowns();
      addCountdownDialog.close();
  }
});

customCountdownsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('countdown-delete')) {
        const index = e.target.dataset.index;
        customCountdowns.splice(index, 1);
        localStorage.setItem('customCountdowns', JSON.stringify(customCountdowns));
        renderCustomCountdowns();
    }
});

closeButton.addEventListener('click', closeDialog);
currentLangDisplay.addEventListener('click', openDialog);

// Initialize
drawClockFaces();
rotateClockFaces();
setCurrentLangDisplay(languageFlags.find(lang => lang.code === locale));
setInterval(updateCustomCountdowns, 1000);