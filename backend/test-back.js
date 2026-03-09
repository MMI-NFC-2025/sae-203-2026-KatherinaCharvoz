import {
  getArtistesByDate,
  getScenesByName,
  getArtistesAlpha,
  getArtisteById,
  getSceneById,
  getArtistesBySceneId,
  getArtistesBySceneName,
  saveArtiste,
  saveScene
} from './backend.mjs';

async function runTests() {
  console.log(await getArtistesByDate());
  console.log(await getScenesByName());
  console.log(await getArtistesAlpha());
  console.log(await getArtisteById('REPLACE_ID'));
  console.log(await getSceneById('REPLACE_ID'));
  console.log(await getArtistesBySceneId('REPLACE_ID'));
  console.log(await getArtistesBySceneName('Grande Scène'));
}

runTests();

