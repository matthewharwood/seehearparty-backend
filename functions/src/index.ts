import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from 'cors';
// import { sample } from "lodash";

const GIPHY_API_KEY = "3WncIHXw93rnBbVuSmd0XFTeLtTmbZt1";

type GiphyDataResponse = {
  images: {
    original: {
      mp4: string;
    };
  };
};

const c = cors({
    origin: true,
})

// export const giphyByKeyword = functions.https.onRequest(
//   async (request, response) => {
//     const searchUrl = (q = "kanye") =>
//       `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${q}&limit=25&offset=0&rating=g&lang=en`;
//     const query = searchUrl();
//     try {
//       const getQueryResponse = await axios.get(query);
//       const videos = getQueryResponse.data.data.map(
//         (i: GiphyDataResponse) => i.images.original.mp4
//       );
//       response.send(videos);
//     } catch (e) {
//       response.status(500).send(e);
//     }
//   }
// );
const searchUrl = (q = "kanye") =>
    `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${q}&limit=25&offset=0&rating=g&lang=en`;

const callGiphy = async (tags:any)=> {
    const tagsArr = tags.split(',');
    const tagsArr$ = tagsArr.map((tag:any) => {
        return axios.get(searchUrl(tag));
    });
    const gifResponse = await Promise.all(tagsArr$);
    return gifResponse.map((gifR: any) => {
        return gifR.data.data.map(
        (i: GiphyDataResponse) => i.images.original.mp4
        );
    });

}

export const submitTags = functions.https.onRequest((req, res) => {
    c(req, res, () => {
        callGiphy(req.body.tags).then((gifs) => {
            res.send(gifs);
        }).catch((e) => {
            res.status(500).send(e);
        });
    })
});
export const createGame = functions.https.onRequest((request, response) => {
    response.send(btoa(new Date().toISOString()));
    // save this to firebasebase
})
