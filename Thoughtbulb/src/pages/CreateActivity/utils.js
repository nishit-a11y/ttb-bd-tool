import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { setFirebaseURL } from "./action";
import store from "../../redux/store";
import {
  setFirebaseURLActivity,
  setFirebaseURLSpecial,
  setFirebaseURLLogo,
} from "./CreateActivitySlice";
import { getStorage } from "firebase/storage";
import {fire} from "../../components/Firebase";

const storage = getStorage(fire);

function dataURLtoFile(dataurl, game_name) {
  const arr = dataurl?.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], game_name, { type: mime });
}
export function fileToStorage(folder, file, game_name, resolve, reject) {
  const storageRef = ref(
    storage,
    `/${folder}/` + Date.now() + Math.floor(Math.random() * 9999) + game_name
  );
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      reject(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    }
  );
}

function groupURLsByFolder(urls, promiseArray) {
  const groupedURLs = {};

  urls.forEach((url, index) => {
    const folder = promiseArray[index].folder;

    if (!groupedURLs[folder]) {
      groupedURLs[folder] = [];
    }

    groupedURLs[folder].push(url);
  });

  return groupedURLs;
}

export function pushToFBStorage() {
  
  const { imageCover, imagesLogo, imagesActivity, imagesSpecial, game_name } =
    store.getState().createActivity;
  const filteredImagesLogo = imagesLogo.filter((image) => image !== "");
  const filteredImageCover = imageCover.filter((image) => image !== "");
  const filteredImagesActivity = imagesActivity.filter((image) => image !== "");
  const filteredImagesSpecial = imagesSpecial.filter((image) => image !== "");
  const promises = [];

  const imageArrays = [
    { images: filteredImageCover, folder: "games_cover" },
    { images: filteredImagesLogo, folder: "games_logo" },
    { images: filteredImagesActivity, folder: "games_activity" },
    { images: filteredImagesSpecial, folder: "games_special" },
  ];

  imageArrays.forEach(({ images, folder }) => {
    
    images.forEach((imageDataUrl) => {
      if(imageDataUrl){
        if ( imageDataUrl.startsWith("http") || imageDataUrl === "") {
          promises.push({ promise: Promise.resolve(imageDataUrl), folder });
        } else {
          const imageFile = dataURLtoFile(imageDataUrl, game_name);
          const uploadImagePromise = new Promise((resolve, reject) => {
            fileToStorage(folder, imageFile, game_name, resolve, reject);
          });
          promises.push({ promise: uploadImagePromise, folder });
        }
      }
    });
  });

  return Promise.all(promises.map(({ promise }) => promise)).then(
    (firebaseURLs) => {
      const groupedURLs = groupURLsByFolder(firebaseURLs, promises);

      if (groupedURLs["games_cover"]) {
        store.dispatch(setFirebaseURLLogo(groupedURLs["games_cover"]));
      }
      
      if (groupedURLs["games_logo"]) {
        store.dispatch(setFirebaseURLLogo(groupedURLs["games_logo"]));
      }
      if (groupedURLs["games_activity"]) {
        store.dispatch(setFirebaseURLActivity(groupedURLs["games_activity"]));
      }
      if (groupedURLs["games_special"]) {
        store.dispatch(setFirebaseURLSpecial(groupedURLs["games_special"]));
      }

      return groupedURLs;
    }
  );
}
