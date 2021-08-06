import * as functions from "firebase-functions";
import axios from "axios";
// import { sample } from "lodash";

const GIPHY_API_KEY = "3WncIHXw93rnBbVuSmd0XFTeLtTmbZt1";

type GiphyDataResponse = {
  images: {
    original: {
      mp4: string;
    };
  };
};

export const giphyByKeyword = functions.https.onRequest(
  async (request, response) => {
    const searchUrl = (q = "kanye") =>
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${q}&limit=25&offset=0&rating=g&lang=en`;
    const query = searchUrl();
    try {
      const getQueryResponse = await axios.get(query);
      const videos = getQueryResponse.data.data.map(
        (i: GiphyDataResponse) => i.images.original.mp4
      );
      response.send(videos);
    } catch (e) {
      response.status(500).send(e);
    }
  }
);
