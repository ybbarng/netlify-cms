import { actions as notifActions } from 'redux-notifications';
import { currentBackend } from '../backends/backend';
import { createAssetProxy } from '../valueObjects/AssetProxy';
import { getAsset, selectIntegration } from '../reducers';
import { addAsset } from './media';
import { getIntegrationProvider } from '../integrations';

const { notifSend } = notifActions;

export const MEDIA_LIBRARY_OPEN = 'MEDIA_LIBRARY_OPEN';
export const MEDIA_LIBRARY_CLOSE = 'MEDIA_LIBRARY_CLOSE';
export const MEDIA_INSERT = 'MEDIA_INSERT';
export const MEDIA_LOAD_REQUEST = 'MEDIA_LOAD_REQUEST';
export const MEDIA_LOAD_SUCCESS = 'MEDIA_LOAD_SUCCESS';
export const MEDIA_LOAD_FAILURE = 'MEDIA_LOAD_FAILURE';
export const MEDIA_PERSIST_REQUEST = 'MEDIA_PERSIST_REQUEST';
export const MEDIA_PERSIST_SUCCESS = 'MEDIA_PERSIST_SUCCESS';
export const MEDIA_PERSIST_FAILURE = 'MEDIA_PERSIST_FAILURE';
export const MEDIA_DELETE_REQUEST = 'MEDIA_DELETE_REQUEST';
export const MEDIA_DELETE_SUCCESS = 'MEDIA_DELETE_SUCCESS';
export const MEDIA_DELETE_FAILURE = 'MEDIA_DELETE_FAILURE';

export function openMediaLibrary(payload) {
  return { type: MEDIA_LIBRARY_OPEN, payload };
}

export function closeMediaLibrary() {
  return { type: MEDIA_LIBRARY_CLOSE };
}

export function insertMedia(mediaPath) {
  return { type: MEDIA_INSERT, payload: { mediaPath } };
}

export function loadMedia(opts = {}) {
  const { delay = 0, query = '', page = 1, privateUpload } = opts;
  return async (dispatch, getState) => {
    const state = getState();
    const backend = currentBackend(state.config);
    const integration = selectIntegration(state, null, 'assetStore');
    if (integration) {
      const provider = getIntegrationProvider(state.integrations, backend.getToken, integration);
      dispatch(mediaLoading(page));
      try {
        const files = await provider.retrieve(query, page, privateUpload);
        const mediaLoadedOpts = {
          page,
          canPaginate: true,
          dynamicSearch: true,
          dynamicSearchQuery: query,
          privateUpload,
        };
        return dispatch(mediaLoaded(files, mediaLoadedOpts));
      }
      catch(error) {
        return dispatch(mediaLoadFailed({ privateUpload }));
      }
    }
    dispatch(mediaLoading(page));
    return new Promise(resolve => {
      setTimeout(() => resolve(
        backend.getMedia()
          .then(files => dispatch(mediaLoaded(files)))
          .catch((error) => dispatch(error.status === 404 ? mediaLoaded() : mediaLoadFailed()))
      ));
    }, delay);
  };
}

export function persistMedia(file, opts = {}) {
  const { privateUpload } = opts;
  return async (dispatch, getState) => {
    const state = getState();
    const backend = currentBackend(state.config);
    const integration = selectIntegration(state, null, 'assetStore');

    dispatch(mediaPersisting());

    try {
      const assetProxy = await createAssetProxy(file.name.toLowerCase(), file, false, privateUpload);
      dispatch(addAsset(assetProxy));
      if (!integration) {
        const asset = await backend.persistMedia(assetProxy);
        return dispatch(mediaPersisted(asset));
      }
      return dispatch(mediaPersisted(assetProxy.asset, { privateUpload }));
    }
    catch(error) {
      console.error(error);
      dispatch(notifSend({
        message: `Failed to persist media: ${ error }`,
        kind: 'danger',
        dismissAfter: 8000,
      }));
      return dispatch(mediaPersistFailed({ privateUpload }));
    }
  };
}

export function deleteMedia(file, opts = {}) {
  const { privateUpload } = opts;
  return (dispatch, getState) => {
    const state = getState();
    const backend = currentBackend(state.config);
    const integration = selectIntegration(state, null, 'assetStore');
    if (integration) {
      const provider = getIntegrationProvider(state.integrations, backend.getToken, integration);
      dispatch(mediaDeleting());
      return provider.delete(file.id)
        .then(() => {
          return dispatch(mediaDeleted(file, { privateUpload }));
        })
        .catch(error => {
          console.error(error);
          dispatch(notifSend({
            message: `Failed to delete media: ${ error.message }`,
            kind: 'danger',
            dismissAfter: 8000,
          }));
          return dispatch(mediaDeleteFailed({ privateUpload }));
        });
    }
    dispatch(mediaDeleting());
    return backend.deleteMedia(file.path)
      .then(() => {
        return dispatch(mediaDeleted(file));
      })
      .catch(error => {
        console.error(error);
        dispatch(notifSend({
          message: `Failed to delete media: ${ error.message }`,
          kind: 'danger',
          dismissAfter: 8000,
        }));
        return dispatch(mediaDeleteFailed());
      });
  };
}

export function mediaLoading(page) {
  return {
    type: MEDIA_LOAD_REQUEST,
    payload: { page },
  }
}

export function mediaLoaded(files, opts = {}) {
  return {
    type: MEDIA_LOAD_SUCCESS,
    payload: { files, ...opts }
  };
}

export function mediaLoadFailed(error, opts = {}) {
  const { privateUpload } = opts;
  return { type: MEDIA_LOAD_FAILURE, payload: { privateUpload } };
}

export function mediaPersisting() {
  return { type: MEDIA_PERSIST_REQUEST };
}

export function mediaPersisted(asset, opts = {}) {
  const { privateUpload } = opts;
  return {
    type: MEDIA_PERSIST_SUCCESS,
    payload: { file: asset, privateUpload },
  };
}

export function mediaPersistFailed(error, opts = {}) {
  const { privateUpload } = opts;
  return { type: MEDIA_PERSIST_FAILURE, payload: { privateUpload } };
}

export function mediaDeleting() {
  return { type: MEDIA_DELETE_REQUEST };
}

export function mediaDeleted(file, opts = {}) {
  const { privateUpload } = opts;
  return {
    type: MEDIA_DELETE_SUCCESS,
    payload: { file, privateUpload },
  };
}

export function mediaDeleteFailed(error, opts = {}) {
  const { privateUpload } = opts;
  return { type: MEDIA_DELETE_FAILURE, payload: { privateUpload } };
}
