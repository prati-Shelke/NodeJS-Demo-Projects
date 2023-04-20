const cloudinary = require('cloudinary');
const Readable = require('stream').Readable;

cloudinary.config({
    cloud_name: 'abs-am',
    api_key: '869991447394645',
    api_secret: 'eEyA-PTPewyhaTqdjHBvUpVoYiA'
});

module.exports = {
    // upload: cloudinary.v2.uploader.upload,
    destroy: cloudinary.v2.uploader.destroy,
    upload_stream: cloudinary.v2.uploader.upload_stream,
    upload: async (file) => {
        return await new Promise((resolve, reject) => {
            const readable = new Readable();
            readable._read = () => { };
            readable.push(file.buffer);
            readable.push(null);
            readable.pipe(cloudinary.v2.uploader.upload_stream({
                folder: 'training-api',
                format: 'jpg',
                return_delete_token: true,
                discard_original_filename: true
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            }));
        });
    }
};