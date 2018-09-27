import { Buffer } from "buffer";
import * as Request from "request-promise";
import * as Sharp from "sharp";

export default {
  getBase64Img: async (source: any, { url }: { url: string }) => {
    try {
      const responseBuffer = await Request(url, {
        encoding: null,
        strictSSL: true,
      });

      const sharpImage = await Sharp(responseBuffer)
        .resize(300, 200)
        .max()
        .jpeg({
          quality: 95,
        })
        .toBuffer({
          resolveWithObject: true,
        });

      const response = new Buffer(sharpImage.data).toString("base64");

      return {
        data: response,
      };
    } catch (error) {
      console.error(error);
      return {
        data: {
          error: "errored",
        },
      };
    }
  },
};
