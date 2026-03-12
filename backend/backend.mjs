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
  // Les artistes n'ont pas de champ date propre ; on trie par nom_prenom_pseudo_artiste.
  return await getFullListWithSortFallback('artistes', [
    'dateRepresentation',
    'date_representation',
    'nom_prenom_pseudo_artiste',
    'nom',
  ]);
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
  // Les artistes sont liés aux scènes par le champ texte nom_scene (pas par relation ID).
  // On récupère d'abord le nom de la scène, puis on filtre les artistes.
  const scene = await pb.collection('scenes').getOne(sceneId);
  const sceneName = scene.scene ?? scene.nom ?? '';
  return pb.collection('artistes').getFullList({
    filter: `nom_scene = "${sceneName}"`,
    sort: 'nom_prenom_pseudo_artiste',
  });
}

export async function getArtistesBySceneName(sceneName) {
  // Filtre les artistes directement par leur champ nom_scene.
  return pb.collection('artistes').getFullList({
    filter: `nom_scene = "${sceneName}"`,
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

