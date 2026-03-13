const fs = require('fs');
const path = require('path');

// Load all data files
const paalListData = require('./paalList_data');
const adikaramData = require('./aikaram.json');
const kurralData = require('./kurral_data.with_adikaram.json');

// Function to create nested structure
function mergeThirukkuralData() {
  const mergedData = {
    title: 'Thirukkural',
    description: 'Complete Thirukkural with nested structure',
    totalKurrals: 1330,
    totalAdikarams: 133,
    totalPaals: 3,
    paals: [],
  };

  //   console.log(paalListData)
  // Process each Paal
  paalListData?.default?.forEach((paal) => {
    const paalObj = {
      index: paal.Index,
      tamil: paal.Tamil,
      english: paal.English,
      transliteration: paal.Transliteration,
      adikaramRange: {
        start: paal.adikaramStart,
        end: paal.adikaramEnd,
      },
      adikarams: [],
    };

    // Find all adikarams for this paal
    const paalAdikarams = adikaramData.filter(
      (adikaram) => adikaram.Index >= paal.adikaramStart && adikaram.Index <= paal.adikaramEnd,
    );

    // Process each Adikaram
    paalAdikarams.forEach((adikaram) => {
      const adikaramObj = {
        index: adikaram.Index,
        adikaramNumber: adikaram.Index,
        tamil: adikaram.Tamil,
        english: adikaram.English,
        transliteration: adikaram.Transliteration,
        kurralRange: {
          start: adikaram.kurralStart,
          end: adikaram.kurralEnd,
        },
        kurrals: [],
      };

      // Find all kurrals for this adikaram
      const adikaramKurrals = kurralData.filter(
        (kurral) =>
          kurral.adikaram_number === adikaram.Index ||
          (kurral.Kurral_id >= adikaram.kurralStart && kurral.Kurral_id <= adikaram.kurralEnd),
      );

      // Process each Kurral
      adikaramKurrals.forEach((kurral) => {
        const kurralObj = {
          kurralId: kurral.Kurral_id,
          index: kurral.Index || kurral.Kurral_id,
          tamil: {
            full: kurral.Tamil,
            line1: kurral.line1,
            line2: kurral.line2,
          },
          english: {
            translation: kurral.English,
            meaning: kurral.EnglishMeaning,
          },
          transliteration: kurral.Transliteration,
          explanations: {
            kalaignar: kurral.KalaignarUrai,
            muVa: kurral.MuVaUrai,
            solomonPaapaiya: kurral.SolomonPaapaiyaUrai,
          },
        };

        adikaramObj.kurrals.push(kurralObj);
      });

      // Sort kurrals by kurralId
      adikaramObj.kurrals.sort((a, b) => a.kurralId - b.kurralId);

      paalObj.adikarams.push(adikaramObj);
    });

    // Sort adikarams by index
    paalObj.adikarams.sort((a, b) => a.index - b.index);

    mergedData.paals.push(paalObj);
  });

  return mergedData;
}

// Generate the merged data
console.log('Starting merge process...');
const mergedData = mergeThirukkuralData();

// Write to file
const outputPath = path.join(__dirname, 'thirukkural_complete_nested.json');
fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf8');

console.log(`✅ Successfully created nested JSON file: ${outputPath}`);
console.log(`📊 Statistics:`);
console.log(`   - Paals: ${mergedData.paals.length}`);
console.log(
  `   - Total Adikarams: ${mergedData.paals.reduce((sum, p) => sum + p.adikarams.length, 0)}`,
);
console.log(
  `   - Total Kurrals: ${mergedData.paals.reduce(
    (sum, p) => sum + p.adikarams.reduce((aSum, a) => aSum + a.kurrals.length, 0),
    0,
  )}`,
);

// Also create a flattened version for easier querying
const flattenedData = {
  paals: mergedData.paals.map((p) => ({
    index: p.index,
    tamil: p.tamil,
    english: p.english,
    transliteration: p.transliteration,
    adikaramRange: p.adikaramRange,
  })),
  adikarams: [],
  kurrals: [],
};

mergedData.paals.forEach((paal) => {
  paal.adikarams.forEach((adikaram) => {
    flattenedData.adikarams.push({
      index: adikaram.index,
      paalIndex: paal.index,
      tamil: adikaram.tamil,
      english: adikaram.english,
      transliteration: adikaram.transliteration,
      kurralRange: adikaram.kurralRange,
    });

    adikaram.kurrals.forEach((kurral) => {
      flattenedData.kurrals.push({
        ...kurral,
        paalIndex: paal.index,
        adikaramIndex: adikaram.index,
      });
    });
  });
});

const flatOutputPath = path.join(__dirname, 'thirukkural_complete_flat.json');
fs.writeFileSync(flatOutputPath, JSON.stringify(flattenedData, null, 2), 'utf8');

console.log(`✅ Successfully created flattened JSON file: ${flatOutputPath}`);
console.log('\n🎉 Merge complete!');
