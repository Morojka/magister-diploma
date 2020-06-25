var vowels = /[аеиоуыэюя]/i;

var ending_data = {
    'gerund1': ['в', 'вши', 'вшись'], // а / я
    'gerund2': ['ив', 'ивши', 'ившись', 'ыв', 'ывши', 'ывшись'],
    'adjective': ["ее", "ие", "ые", "ое", "ими", "ыми", "ей", "ий", "ый", "ой", "ем", "им", "ым", "ом", "его", "ого", "ему", "ому", "их", "ых", "ую", "юю", "ая", "яя", "ою", "ею"],
    'participle1': ["ем", "нн", "вш", "ющ", "щ"], // а / я
    'participle2': ["ивш", "ывш", "ующ"],
    'reflexive': ["ся", "сь"],
    'verb1': ["ла", "на", "ете", "йте", "ли", "й", "л", "ем", "н", "ло", "но", "ет", "ют", "ны", "ть", "ешь", "нно"], // а / я
    'verb2': ["ила", "ыла", "ена", "ейте", "уйте", "ите", "или", "ыли", "ей", "уй", "ил", "ыл", "им", "ым", "ен", "ило", "ыло", "ено", "ят", "ует", "уют", "ит", "ыт", "ены", "ить", "ыть", "ишь", "ую", "ю"],
    'noun': ["а", "ев", "ов", "ие", "ье", "е", "иями", "ями", "ами", "еи", "ии", "и", "ией", "ей", "ой", "ий", "й", "иям", "ям", "ием", "ем", "ам", "ом", "о", "у", "ах", "иях",
        "ях", "ы", "ь", "ию", "ью", "ю", "ия", "ья", "я"],
    'superlative': ["ейш", "ейше"],
    'derivational': ["ост", "ость"]
}
for (var key in ending_data) {
    ending_data[key].sort(function(a, b){
        return b.length - a.length;
    });
}

function isVowel(letter) {
    return vowels.test(letter);
}

function isConsonant(letter) {
    return !isVowel(letter);
}

function isExtra(letter) {
    return /[ая]/.test(letter);
}

// область из СЛОВА после первой гласной буквы.
// null или индекс начала области
function findRV(word) {
    var i = vowels.exec(word).index;
    return i && i + 1;
}

// область из RV после первой согласной буквы.
// null или индекс начала области
function findR1(word, index) {
    for (var i = index; i < word.length - 1; ++i) {
        if (isConsonant(word[i])) {
            return i + 1;
        }
    }
    return null;
}

// область из R1 после первого сочетания гласная-согласная.
// null или индекс начала области
function findR2(word, index) {
    for (var i = index + 1; i < word.length - 1; ++i) {
        if (isVowel(word[i - 1]) && isConsonant(word[i])) {
            return i + 1;
        }
    }
    return null;
}

// origin - обрабатываемое слово
// offset - отклонение области
// type   - тип окончаний
// extra(bool)  - проверка наличия "а/я"
function cutEnding(origin, offset, type, extra = false) {
    var endings = ending_data[type];
    for (var i = 0; i < endings.length; ++i) {
        var e = endings[i];

        if (e.length > origin.length) {
            continue;
        } else {
            if (e === origin.slice(-e.length)) {
                console.log(' = Найдено совпадение: %s[%s]', origin.slice(0, -e.length), e);
                if (extra) {
                    if (!isExtra(origin[origin.length - e.length - 1])) {
                        console.log(' = а/я не найдена');
                        continue;
                    }
                }
                return origin.substring(0, origin.length - e.length);
            }
        }
    }
    return null;
}

function stem(word) {

    console.log("\nНачало стемминга:\n\
		\nОпределяем лемму слова: %s\n", word);

    // Делим слово на области
    var RV = findRV(word);
    var R1 = findR1(word, RV);
    var R2 = findR2(word, R1);

    console.log("RV: %s(%s)\nR1: %s(%s)\nR2: %s(%s)",
        word.slice(0, RV), word.substring(RV),
        word.slice(0, R1), word.substring(R1),
        word.slice(0, R2), word.substring(R2));

    // Если отсутствует одна из областей, прерываем функцию
    if (!(RV && R1 && R2)) {
        console.log("\t#Внимание! Неверная сегментация");
        return;
    }

    var sample = null;

    // Шаг №1
    if (!sample) sample = cutEnding(word, RV, 'gerund2');
    if (!sample) sample = cutEnding(word, RV, 'gerund1', true);
    if (!sample) sample = cutEnding(word, RV, 'reflexive');
    if (!sample) {
        var tmp = cutEnding(word, RV, 'adjective');
        if (tmp) {
            sample = cutEnding(tmp, RV, 'participle2');
            if (!sample) sample = cutEnding(tmp, RV, 'participle1', true);
        }
        sample = sample || tmp;
    }
    if (!sample) sample = cutEnding(word, RV, 'verb2');
    if (!sample) sample = cutEnding(word, RV, 'verb1', true);
    if (!sample) sample = cutEnding(word, RV, 'noun');
    if (!sample) {
        console.log("\t#Внимание! Не найдено окончаний");
        sample = word;
    }

    console.log("Шаг ~1: %s", sample);

    // Шаг №2
    // Удаляем последний символ, если это 'и'
    if (sample.slice(-1) === 'и') {
        sample = sample.substring(0, sample.length - 1);
    }
    console.log("Шаг ~2: %s", sample);

    // Шаг №3
    sample = cutEnding(sample, R2, 'derivational') || sample;
    console.log("Шаг ~3: %s", sample);

    // Шаг №4
    // Выполняем одну из трех инструкций в зависимости от условий
    while (true) {


        // Удаляем последний символ, если окончание - это двойная 'н'
        if (sample.slice(-2) === 'нн') {
            sample = sample.substring(0, sample.length - 1);
            break;
        }


        var tmp = sample;
        sample = cutEnding(sample, RV, 'superlative') || sample;
        if (tmp !== sample) {
            // Удаляем последний символ, если окончание - это двойная 'н'
            if (sample.slice(-2) === 'нн') {
                sample = sample.substring(0, sample.length - 1);
            }
            break;
        }


        // Удаляем последний символ, если это 'ь'
        if (sample.slice(-1) === 'ь') {
            sample = sample.substring(0, sample.length - 1);
            break;
        }
        break;
    }
    console.log("Шаг ~4: %s", sample);
}

export default stem