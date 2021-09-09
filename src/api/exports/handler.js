class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler({ payload, auth, params }, h) {
    try {
      this._validator.validateExportPlaylistSongsPayload(payload);
      const { playlistId } = params;
      const { id: userId } = auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

      const message = {
        playlistId,
        targetEmail: payload.targetEmail,
      };

      await this._service.sendMessage('export:playlist_songs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ExportsHandler;
