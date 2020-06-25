(function () {

  function tokenize(text) {
    return text
      .replace(/'/g, '')
      .replace(/[^A-Za-zА-Яа-яçÇğĞıİöÖşŞüÜ0-9_]/g, ' ')
      .replace(/\s\s+/g, ' ')
      .split(' ').map(function (s) {
        return s.toLowerCase();
      });
  }

  function extractDictionary(textArray) {
    var dict = {},
      keys = [],
      words;
    textArray = Array.isArray(textArray) ? textArray : [textArray];
    textArray.forEach(function (text) {
      words = tokenize(text);
      words.forEach(function (word) {
        word = word.toLowerCase();
        if (!dict[word] && word !== '') {
          dict[word] = 1;
          keys.push(word);
        } else {
          dict[word] += 1;
        }
      });
    });

    return {
      words: keys,
      dict: dict
    };
  }

  function bow(text, vocabulary) {
    var dict = extractDictionary([text]).dict,
      vector = [];

    vocabulary.words.forEach(function (word) {
      vector.push(dict[word] || 0);
    });
    return vector;
  }


  module.exports = {
    dict: extractDictionary,
    bow: bow
  };

}());
