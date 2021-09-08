class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler({ payload, auth }, h) {
    try {
      this._validator.validateExportPlaylistSongsPayload(payload);

      const message = {
        userId: auth.credentials.id,
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
