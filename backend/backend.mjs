import PocketBase from "pocketbase";
export const pb = new PocketBase("http://127.0.0.1:8090/_/#/collections?collection=_pb_users_auth_&filter=&sort=-%40rowid");

export async function getArtistesByDate() {
  return await pb.collection('artistes').getFullList({
    sort: 'dateRepresentation'
  });
}

export async function getArtistesByDate() {
  return await pb.collection('artistes').getFullList({
    sort: 'dateRepresentation'
  });
}

export async function getScenesByName() {
  return await pb.collection('scenes').getFullList({
    sort: 'nom'
  });
}

export async function getArtistesAlpha() {
  return await pb.collection('artistes').getFullList({
    sort: 'nom'
  });
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

