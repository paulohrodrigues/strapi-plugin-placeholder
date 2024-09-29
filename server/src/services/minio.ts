import AWS from 'aws-sdk';

const minio = () => ({
  async get({ settings, objectName }) {
    const s3 = new AWS.S3({
      endpoint: settings.endpoint,
      credentials: {
        accessKeyId: settings.accessKey,
        secretAccessKey: settings.secretKey,
      },
      s3ForcePathStyle: true,
    });
    return s3.getSignedUrl('getObject', {
      Bucket: settings.bucket,
      Key: objectName,
      Expires: 15 * 60,
    });
  },
});

export default minio;
