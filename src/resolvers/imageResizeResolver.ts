import { Buffer } from "buffer";
import * as Request from "request-promise";
import * as Sharp from "sharp";
import {URL} from "url";

export default {
  getBase64Img: async (source: any, { url }: { url: string }) => {
    try {
      const parsedURL = new URL(url);
      const responseBuffer = await Request(parsedURL.toString(), {
        encoding: null,
        strictSSL: parsedURL.protocol === "https:" ? true : false,
      });

      const sharpImage = await Sharp(responseBuffer)
        .resize(200, 200)
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
