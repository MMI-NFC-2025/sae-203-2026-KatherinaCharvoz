import PocketBase from "pocketbase";
export const pb = new PocketBase("http://127.0.0.1:8090");

async function getFullListWithSortFallback(collectionName, sortCandidates, options = {}) {
  for (const sortField of sortCandidates) {
    try {
      return await pb.collection(collectionName).getFullList({
        ...options,
        sort: sortField,
      });
    } catch (error) {
      if (error?.status !== 400) {
        throw error;
      }
    }
  }

  return await pb.collection(collectionName).getFullList(options);
}

function escapePbString(value) {
  return String(value || '').replace(/"/g, '\\"');
}

function buildEqualsFilter(field, value) {
  return `${field} = "${escapePbString(value)}"`;
}

export async function getArtistesByDate() {
  return await getFullListWithSortFallback('artistes', [
    'dateRepresentation',
    'date_representation',
    'nom_prenom_pseudo_artiste',
    'nom',
  ]);
}

export async function getScenesByName() {
  return await getFullListWithSortFallback('scenes', [
    'nom_scene',
    'scene',
    'nom',
    'name',
  ]);
}

export async function getArtistesAlpha() {
  return await getFullListWithSortFallback('artistes', [
    'nom_prenom_pseudo_artiste',
    'nom',
    'name',
  ]);
}

export async function getArtisteById(id) {
  return await pb.collection('artistes').getOne(id);
}

export async function getSceneById(id) {
  return await pb.collection('scenes').getOne(id);
}

export async function getArtistesBySceneId(sceneId) {
  const scene = await pb.collection('scenes').getOne(sceneId);
  const sceneName = scene.nom_scene ?? scene.scene ?? scene.nom ?? '';

  if (!sceneName) {
    return [];
  }

  return await pb.collection('artistes').getFullList({
    filter: buildEqualsFilter('nom_scene', sceneName),
    sort: 'nom_prenom_pseudo_artiste',
  });
}

export async function getArtistesBySceneName(sceneName) {
  return await pb.collection('artistes').getFullList({
    filter: buildEqualsFilter('nom_scene', sceneName),
    sort: 'nom_prenom_pseudo_artiste',
  });
}

export async function saveArtiste(data, id = null) {
  if (id) {
    return await pb.collection('artistes').update(id, data);
  }
  return await pb.collection('artistes').create(data);
}

export async function saveScene(data, id = null) {
  if (id) {
    return await pb.collection('scenes').update(id, data);
  }
  return await pb.collection('scenes').create(data);
}

