const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongByIdHandler = this.postPlaylistSongByIdHandler.bind(this);
    this.getPlaylistSongsByIdHandler = this.getPlaylistSongsByIdHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    try {
      this._validator.validatePostPlaylistPayload(payload);
      const { name } = payload;
      const { id: credentialId } = auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPlaylistsHandler({ auth }) {
    try {
      const { id: credentialId } = auth.credentials;

      const playlists = await this._service.getPlaylists(credentialId);
      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deletePlaylistByIdHandler({ params, auth }) {
    try {
      const { playlistId } = params;
      const { id: credentialId } = auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async postPlaylistSongByIdHandler({ payload, params, auth }, h) {
    try {
      this._validator.validatePostPlaylistSongPayload(payload);
      const { songId } = payload;
      const { playlistId } = params;
      const { id: credentialId } = auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.addPlaylistSong(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPlaylistSongsByIdHandler({ params, auth }) {
    try {
      const { playlistId } = params;
      const { id: credentialId } = auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._service.getPlaylistSongsById(playlistId);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deletePlaylistSongByIdHandler({ payload, params, auth }) {
    try {
      const { songId } = payload;
      const { playlistId } = params;
      const { id: credentialId } = auth.credentials;

      const result = songId.startsWith('song-');
      if (!result) {
        throw new ClientError('Song Id Invalid');
      }

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deletePlaylistSongById(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistsHandler;
