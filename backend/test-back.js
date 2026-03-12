import {
  getArtistesByDate,
  getScenesByName,
  getArtistesAlpha,
  getArtisteById,
  getSceneById,
  getArtistesBySceneId,
  getArtistesBySceneName,
} from './backend.mjs';

function ok(label) { console.log(`  ✅ ${label}`); }
function fail(label, err) { console.error(`  ❌ ${label}: ${err?.message ?? err}`); }

async function runTests() {
  let artisteId, sceneId;

  // ── getArtistesByDate ─────────────────────────────────────────────
  console.log('\n[1] getArtistesByDate');
  try {
    const res = await getArtistesByDate();
    ok(`${res.length} artiste(s) trouvé(s)`);
    if (res[0]) {
      artisteId = res[0].id;
      console.log(`    → premier : "${res[0].nom_prenom_pseudo_artiste ?? res[0].nom ?? res[0].name}" (id: ${artisteId})`);
    }
  } catch (e) { fail('getArtistesByDate', e); }

  // ── getScenesByName ───────────────────────────────────────────────
  console.log('\n[2] getScenesByName');
  try {
    const res = await getScenesByName();
    ok(`${res.length} scène(s) trouvée(s)`);
    if (res[0]) {
      sceneId = res[0].id;
      console.log(`    → première : "${res[0].nom_scene ?? res[0].scene ?? res[0].nom ?? res[0].name}" (id: ${sceneId})`);
    }
  } catch (e) { fail('getScenesByName', e); }

  // ── getArtistesAlpha ──────────────────────────────────────────────
  console.log('\n[3] getArtistesAlpha');
  try {
    const res = await getArtistesAlpha();
    ok(`${res.length} artiste(s) par ordre alpha`);
    if (!artisteId && res[0]) {
      artisteId = res[0].id;
      console.log(`    → premier : "${res[0].nom_prenom_pseudo_artiste}" (id: ${artisteId})`);
    }
  } catch (e) { fail('getArtistesAlpha', e); }

  // ── getArtisteById ────────────────────────────────────────────────
  console.log('\n[4] getArtisteById');
  if (artisteId) {
    try {
      const res = await getArtisteById(artisteId);
      ok(`artiste récupéré : "${res.nom_prenom_pseudo_artiste ?? res.nom ?? res.name}"`);
    } catch (e) { fail(`getArtisteById(${artisteId})`, e); }
  } else {
    console.log('  ⚠️  Aucun artiste disponible, test ignoré');
  }

  // ── getSceneById ──────────────────────────────────────────────────
  console.log('\n[5] getSceneById');
  if (sceneId) {
    try {
      const res = await getSceneById(sceneId);
      ok(`scène récupérée : "${res.nom_scene ?? res.scene ?? res.nom ?? res.name}"`);
    } catch (e) { fail(`getSceneById(${sceneId})`, e); }
  } else {
    console.log('  ⚠️  Aucune scène disponible, test ignoré');
  }

  // ── getArtistesBySceneId ──────────────────────────────────────────
  console.log('\n[6] getArtistesBySceneId');
  if (sceneId) {
    try {
      const res = await getArtistesBySceneId(sceneId);
      ok(`${res.length} artiste(s) pour sceneId=${sceneId}`);
    } catch (e) { fail(`getArtistesBySceneId(${sceneId})`, e); }
  } else {
    console.log('  ⚠️  Aucune scène disponible, test ignoré');
  }

  // ── getArtistesBySceneName ────────────────────────────────────────
  console.log('\n[7] getArtistesBySceneName("Grande Scène")');
  try {
    const res = await getArtistesBySceneName('Grande Scène');
    ok(`${res.length} artiste(s) sur "Grande Scène"`);
  } catch (e) { fail('getArtistesBySceneName', e); }

  console.log('\n─────────────────────────────────────────\nTests terminés.\n');
}

runTests();

