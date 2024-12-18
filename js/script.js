const translations = {
  ar: {
    title: "حاسبة الفرق بين الوقتين",
    timeLabel: "الوقت الأول",
    Hourinput:'الساعة',
    MinuteInput:'دقيقة',
    SecondInput:'ثانية',
    calculateButton: "احسب الفرق",
    timeFormatLabel: "اختر نظام الوقت",
    timeFormat12:'12 ساعة',
    timeFormat24:'24 ساعة',
    resultText: "الفرق هو",
    errorText: "يرجى إدخال الوقتين بشكل صحيح!",
    add:'اضافة وقت جديد',
    am: "صباحًا",
    pm: "مساءً",
  },
  en: {
    title: "Time Difference Calculator",
    timeLabel: "Time",
    HourInput:'Hour',
    MinuteInput:'Minute',
    SecondInput:'Second',
    calculateButton: "Calculate Difference",
    timeFormatLabel: "Choose Time Format",
    timeFormat12:'12 Hours',
    timeFormat24:'24 Hours',
    resultText: "The difference is",
    errorText: "Please enter valid times!",
    add:'Add new time',
    am: "AM",
    pm: "PM",
  },
};


const timeFormat = document.getElementById("timeformat");
const timeInputContainer = document.getElementById("timeInputsContainer");
let timeBlocks = 2;
document.getElementById('language').addEventListener('change', (e)=> {
  updateLanguage(e.target.value)
})
function updateLanguage (language) {
  document.getElementById('title').textContent = translations[language].title;
  document.getElementById('calculateButton').textContent = translations[language].calculateButton;
  document.getElementById('timeFormatLabel').textContent = translations[language].timeFormatLabel;
  document.getElementById("addTime").textContent=translations[language].add;
  const h3 = document.querySelectorAll('h3');
  const hoursLang = document.querySelectorAll('.hour-input');
  const minutesLang = document.querySelectorAll('.minute-input');
  const secondsLang = document.querySelectorAll('.second-input');
  const timePeriod = document.querySelectorAll('.time-period');
  h3.forEach((ele,index)=> 
  {
    index++
    ele.textContent = translations[language].timeLabel + ' ' +index
  }
  )
  hoursLang.forEach((hour)=> {
    hour.placeholder = translations[language].HourInput
  })
  minutesLang.forEach((minute)=> {
    minute.placeholder = translations[language].MinuteInput
  })
  secondsLang.forEach((second)=> {
    second.placeholder = translations[language].SecondInput
  })

  timePeriod.forEach((period)=> {
    period.options[0].textContent = translations[language].am
  period.options[1].textContent = translations[language].pm
  })

  timeFormat.options[0].textContent = translations[language].timeFormat12
  timeFormat.options[1].textContent = translations[language].timeFormat24

}




// تعديل نظام الوقت
timeFormat.addEventListener("change", () => {
  const is12Hour = timeFormat.value === "12";
  document.querySelectorAll(".time-period").forEach((select) => {
    select.style.display = is12Hour ? "inline-block" : "none";
  });

  const maxHour = is12Hour ? 12 : 23;
  document.querySelectorAll(".hour-input").forEach((input) => {
    input.max = maxHour;
  });
});

// تحويل الوقت إلى نظام 24 ساعة
function convertTo24Hour(hour, minute, second, period) {
  hour = parseInt(hour);
  minute = parseInt(minute);
  second = parseInt(second);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
}

// حساب الفرق بين وقتين
function calculateTimeDifference(start, end) {
  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);

  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  const differenceInMs = endTime - startTime;

  const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((differenceInMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

// إضافة وقت جديد
document.getElementById("addTime").addEventListener("click", () => {
  timeBlocks++;
  const newBlock = `
    <div class="time-block">
      <h3>الوقت ${timeBlocks}</h3>
      <input type="number" class="hour-input" min="0" max="23" placeholder="ساعة" required>
      <input type="number" class="minute-input" min="0" max="59" placeholder="دقيقة" required>
      <input type="number" class="second-input" min="0" max="59" placeholder="ثانية" required>
      <select class="time-period" style="display: ${timeFormat.value === "12" ? "inline-block" : "none"};">
        <option value="AM">صباحا</option>
        <option value="PM">مساء</option>
      </select>
    </div>
    <div class="time-block">
      <h3>الوقت ${++timeBlocks}</h3>
      <input type="number" class="hour-input" min="0" max="23" placeholder="ساعة" required>
      <input type="number" class="minute-input" min="0" max="59" placeholder="دقيقة" required>
      <input type="number" class="second-input" min="0" max="59" placeholder="ثانية" required>
      <select class="time-period" style="display: ${timeFormat.value === "12" ? "inline-block" : "none"};">
        <option value="AM">صباحا</option>
        <option value="PM">مساء</option>
      </select>
    </div>
  `;
  timeInputContainer.insertAdjacentHTML("beforeend", newBlock);
});

// حساب الفرق الإجمالي
document.getElementById("timeCalculator").addEventListener("submit", (e) => {
  e.preventDefault();

  let totalDifference = { hours: 0, minutes: 0, seconds: 0 };
  const allTimeBlocks = document.querySelectorAll(".time-block");
  let previousTime = null;

  allTimeBlocks.forEach((block) => {
    const hour = block.querySelector(".hour-input").value;
    const minute = block.querySelector(".minute-input").value;
    const second = block.querySelector(".second-input").value;
    const periodSelect = block.querySelector(".time-period");
    const period = periodSelect ? periodSelect.value : null;

    if (!hour || !minute || !second) {
      alert("تأكد من إدخال جميع القيم!");
      return;
    }

    let currentTime;
    if (timeFormat.value === "12") {
      currentTime = convertTo24Hour(hour, minute, second, period);
    } else {
      currentTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
    }

    if (previousTime) {
      const diff = calculateTimeDifference(previousTime, currentTime);
      totalDifference.hours += diff.hours;
      totalDifference.minutes += diff.minutes;
      totalDifference.seconds += diff.seconds;
    }
    previousTime = currentTime;
  });

  // ضبط القيم الزائدة
  totalDifference.minutes += Math.floor(totalDifference.seconds / 60);
  totalDifference.seconds %= 60;

  totalDifference.hours += Math.floor(totalDifference.minutes / 60);
  totalDifference.minutes %= 60;

  document.getElementById("result").textContent = 
    ` ${totalDifference.hours.toString().padStart(2, "0")}:${totalDifference.minutes.toString().padStart(2, "0")}:${totalDifference.seconds.toString().padStart(2, "0")}`;
});
