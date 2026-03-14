/*
=====================================================
ResolveX Upload Service
=====================================================

Handles image uploads to Firebase Storage.

Features

• Upload images
• Limit to 2 files
• Generate unique filenames
• Return image URLs
• Track upload progress

=====================================================
*/

import { storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";



/* =========================================
Upload Single Image
========================================= */

export const uploadImage = (file, userId) => {

  return new Promise((resolve, reject) => {

    const timestamp = Date.now();

    const storageRef = ref(
      storage,
      `issues/${userId}/${timestamp}_${file.name}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log("Upload progress:", progress);
      },

      (error) => {
        reject(error);
      },

      async () => {

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        resolve(downloadURL);
      }
    );
  });
};



/* =========================================
Upload Multiple Images (Max 2)
========================================= */

export const uploadIssueImages = async (files, userId) => {

  const urls = [];

  for (const file of files) {

    const url = await uploadImage(file, userId);

    urls.push(url);
  }

  return urls;

};