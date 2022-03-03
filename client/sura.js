
let first_aya = document.getElementById("start-aya");
let last_aya = document.getElementById("end-aya");
let label1 = document.getElementById("label1");
let label2 = document.getElementById("label2");
let start_aya_num = document.getElementById("start-aya-num");
let end_aya_num = document.getElementById("end-aya-num");
let sura_aya = document.getElementById("sura-aya");
let sura_aya2 = document.getElementById("sura-aya2");

let select = document.getElementById("sura_select");
let select_value = select.value;

first_aya.style.border = "none";
last_aya.style.border = "none";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

select.addEventListener('change', (e)=>{
    e.preventDefault();

    select_value = select.value;
})

let start_test_btn = document.getElementById("start-test2");
start_test_btn.addEventListener('click', (e)=>{
    e.preventDefault();

    if (select_value == 0)
        first_aya.textContent = "المرجوا اختيار سورة أعلاه";
    else      
        first_aya.textContent = "...جاري التحميل";
    last_aya.textContent = "";
    label1.textContent = ""; 
    label2.textContent = "";
    start_aya_num.textContent = "";
    end_aya_num.textContent = "";
    sura_aya.textContent = "";
    sura_aya2.textContent = "";
    first_aya.style.border = "none";
    last_aya.style.border = "none";

    fetch("https://api.alquran.cloud/v1/surah/" + select_value)
    .then((response) => response.json())
    .then((json)=>{
    
    let num_ayas = json.data.numberOfAyahs;
    let end_aya = getRandomInt(num_ayas);
    while (end_aya < 9)
        end_aya = getRandomInt(num_ayas);
    let start_aya = getRandomInt(end_aya);
    while (end_aya - start_aya < 8 || end_aya - start_aya > 20)
        start_aya = getRandomInt(end_aya);
    
    label1.textContent = ":اقرأ من قوله تعالى"; 
    label2.textContent = ":إلى";   
    first_aya.style.border = "";
    last_aya.style.border = "";
    first_aya.textContent =  json.data.ayahs[start_aya].text;
    last_aya.textContent = json.data.ayahs[end_aya].text;
    sura_aya.textContent = "(" + json.data.name + "," + json.data.ayahs[start_aya].numberInSurah + ")";
    sura_aya2.textContent = "(" + json.data.name + "," + json.data.ayahs[end_aya].numberInSurah + ")";
    })
})
