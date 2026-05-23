import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import {fire} from "../../components/Firebase";

const storage = getStorage(fire);

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl?.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
function pushToFBStorage(folder, file, resolve, reject) {
  const storageRef = ref(
    storage,
    `/${folder}/` + Date.now() + Math.floor(Math.random() * 9999) + file.name
  );
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      console.error(error);
      reject(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    }
  );
}

export function convertImage(finalDataActivityBrief) {
  return new Promise((resolve, reject) => {
    const { imagesData } = finalDataActivityBrief;
    const { logo, activity, special } = imagesData;
    let uploadPromises = [];

    if (logo.length > 0) {
      const logoFile = dataURLtoFile(logo[0].imageBase64, logo[0].fullName);

      const logoUploadPromise = new Promise((logoResolve, logoReject) => {
        pushToFBStorage("game_logos", logoFile, logoResolve, logoReject);
      }).then((logoUrl) => ({ game_logo: logoUrl }));

      uploadPromises.push(logoUploadPromise);
    }
    if (activity.length > 0) {
      const activityUploadPromises = activity.map((activityImage, index) => {
        const activityFile = dataURLtoFile(
          activityImage.imageBase64,
          activityImage.fullName
        );
        return new Promise((activityResolve, activityReject) => {
          pushToFBStorage(
            `game_images${index === 0 ? "" : index}`,
            activityFile,
            activityResolve,
            activityReject
          );
        }).then((activityUrl) => ({
          [`game_image${index === 0 ? "" : index}`]: activityUrl,
        }));
      });

      uploadPromises.push(...activityUploadPromises);
    }
    if (special.length > 0) {
      const specialUploadPromise = new Promise(
        (specialResolve, specialReject) => {
          const specialUrls = [];
          let uploadedCount = 0;
          special.forEach((specialImage, index) => {
            const specialFile = dataURLtoFile(
              specialImage.imageBase64,
              specialImage.fullName
            );
            pushToFBStorage(
              `special_images`,
              specialFile,
              (specialUrl) => {
                specialUrls[index] = specialUrl;
                uploadedCount++;
                if (uploadedCount === special.length) {
                  specialResolve({ special_images: specialUrls });
                }
              },
              specialReject
            );
          });
        }
      );

      uploadPromises.push(specialUploadPromise);
    }

    Promise.all(uploadPromises)
      .then((results) => {
        const output = {};
        results.forEach((result) => {
          Object.assign(output, result);
        });

        const formattedOutput = {};
        Object.entries(output).forEach(([key, value]) => {
          const match = key.match(/^(game_image)(\d+)?$/);
          if (match) {
            const [, prefix, index] = match;
            formattedOutput[`${prefix}${index || ""}`] = value;
          } else {
            formattedOutput[key] = value;
          }
        });

        resolve(formattedOutput);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
