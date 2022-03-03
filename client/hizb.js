
function isZawji(number)
{
    if ((number % 2) == 0)
        return 1;
    else
        return 0;    
}

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
let first_select_value = select_value;

first_aya.style.border = "none";
last_aya.style.border = "none";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

select.addEventListener('change', (e)=>{
    e.preventDefault();

    select_value = select.value;
    first_select_value = select_value;
})

let start_test_btn = document.getElementById("start-test2");
start_test_btn.addEventListener('click', (e)=>{
    e.preventDefault();

    select_value = select.value;

    if (select_value == 0)
        first_aya.textContent = "المرجوا اختيار حزب أعلاه";
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

    if ((select_value % 2) == 0)
        select_value -= (select_value / 2);
    else if ((select_value % 2) != 0)
    {
        select_value++;
        select_value -= (select_value / 2);
    }

    fetch("https://api.alquran.cloud/v1/juz/" + select_value + "/quran-uthmani")
    .then((response) => response.json())
    .then((json)=>{
    
    let start_aya = 0;
    let end_aya = 0;
    let num_ayas = json.data.ayahs.length;
    let start_second_hizb = (select_value * 8) - 3;
    
    if (!isZawji(first_select_value))
    {   
        end_aya = getRandomInt(num_ayas);
        while (end_aya < num_ayas && json.data.ayahs[end_aya].hizbQuarter >= start_second_hizb)
            end_aya = getRandomInt(num_ayas);
        while (end_aya < 9)
            end_aya = getRandomInt(num_ayas);

        start_aya = getRandomInt(end_aya);
        while (end_aya - start_aya < 8 || end_aya - start_aya > 20)
            start_aya = getRandomInt(end_aya);
    }
    else
    {   
        end_aya = getRandomInt(num_ayas);
        while (end_aya < num_ayas && json.data.ayahs[end_aya].hizbQuarter < start_second_hizb)
            end_aya = getRandomInt(num_ayas);
        while (end_aya < 9)
            end_aya = getRandomInt(num_ayas);

        start_aya = getRandomInt(end_aya);
        while (json.data.ayahs[start_aya].hizbQuarter < start_second_hizb)
        start_aya = getRandomInt(end_aya);
        while (end_aya - start_aya < 8 || end_aya - start_aya > 20)
            start_aya = getRandomInt(end_aya);

    }

    console.log(end_aya - start_aya);
    label1.textContent = ":اقرأ من قوله تعالى"; 
    label2.textContent = ":إلى";   
    first_aya.style.border = "";
    last_aya.style.border = "";
    first_aya.textContent =  json.data.ayahs[start_aya].text;
    last_aya.textContent = json.data.ayahs[end_aya].text;
    sura_aya.textContent = "(" + json.data.ayahs[start_aya].surah.name + "," + json.data.ayahs[start_aya].numberInSurah + ")";
    sura_aya2.textContent = "(" + json.data.ayahs[end_aya].surah.name + "," + json.data.ayahs[end_aya].numberInSurah + ")";
    })
})
