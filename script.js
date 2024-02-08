"use strict";

  let globalArrayOfWords = [];
  let word;

  async function fetchdata() {
    const response = await fetch("/data/ddo_fullforms_2023-10-11.csv");
    const rawtext = await response.text();

     globalArrayOfWords = rawtext.split("\n").map(line => {
      const parts = line.split("\t");
      return {
        variant: parts[0],
        headword: parts[1],
        homograph: parts[2],
        partofspeech: parts[3],
        id: parts[4]
      };
      
    });

    globalArrayOfWords.sort((a, b) => a.variant.localeCompare(b.variant)); //chatten hjalp. Koden virker kun når jeg sorterer arrayet, selvom det er jo er sorteret i csv filen.
  }


  function objectCheck(search, check){
    return search.localeCompare(check.variant)
  };


  function binarySearchCompareOrdbog(word, globalArrayOfWords, objectCheck){
    let start = 0;
    let end = globalArrayOfWords.length - 1;
    let middle;
    let result;

    while (start <= end) {
        middle = Math.floor((start + end) / 2);
        result = objectCheck(word, globalArrayOfWords[middle]);
        if (result === 0) {
            return middle;
        } else if (result < 0) {
            end = middle - 1;
        } else {
            start = middle + 1;
        }
    }
    return -1;
};

fetchdata().then(() => { 


  performance.mark("start-binary-search");
  const binarySearchIndex = binarySearchCompareOrdbog("hestevogn", globalArrayOfWords, objectCheck);
  performance.mark("end-binary-search");

  performance.measure("binary-search", "start-binary-search", "end-binary-search");

  performance.mark("start-find-search");
  const index = globalArrayOfWords.findIndex(wordObject => wordObject.variant === "hestevogn");
  performance.mark("end-find-search");

  performance.measure("find-search", "start-find-search", "end-find-search");

  const measurements = performance.getEntriesByType('measure');
  measurements.forEach(measurement => {
  console.log(`${measurement.name}: ${measurement.duration}ms`);
  });

});
