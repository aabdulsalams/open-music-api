class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadPictureHandler = this.postUploadPictureHandler.bind(this);
  }

  async postUploadPictureHandler({ payload }, h) {
    try {
      const { data } = payload;

      this._validator.validatePictureHeaders(data.hapi.headers);
      // Menyimpan di local storage

      const filename = await this._service.writeFile(data, data.hapi);
      // const pictureUrl = await this._service.writeFile(payload, payload.hapi);

      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          // Menyimpan di local storage
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
          // pictureUrl,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UploadsHandler;
