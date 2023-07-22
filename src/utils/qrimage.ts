import qr from 'qr-image';

const qrImage = function (content) {
  // ctx.type = 'image/png'
  // ctx.body = img
  const img = qr.image(content);
  return img;
};

export { qrImage };
