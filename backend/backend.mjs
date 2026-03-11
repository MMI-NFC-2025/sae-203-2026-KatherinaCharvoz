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
      // PocketBase returns 400 when sort field does not exist.
      if (error?.status !== 400) {
        throw error;
      }
    }
  }

  // Last fallback: request without sort to avoid blocking page rendering.
  return await pb.collection(collectionName).getFullList(options);
}

export async function getArtistesByDate() {
  return await pb.collection('artistes').getFullList({
    sort: 'dateRepresentation'
  });
}

export async function getScenesByName() {
  return await getFullListWithSortFallback('scenes', [
    'nom',
    'nom_prenom_pseudo_artiste',
    'name',
  ]);
}

export async function getArtistesAlpha() {
  return await getFullListWithSortFallback('artistes', [
    'nom',
    'nom_prenom_pseudo_artiste',
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
  return await pb.collection('artistes').getFullList({
    filter: `scene = "${sceneId}"`,
    sort: 'dateRepresentation'
  });
}

export async function getArtistesBySceneName(sceneName) {
  const scene = await pb.collection('scenes').getFirstListItem(`nom = "${sceneName}"`);
  return getArtistesBySceneId(scene.id);
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

