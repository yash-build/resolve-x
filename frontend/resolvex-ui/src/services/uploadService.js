import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

/*
==========================================
UPLOAD ISSUE IMAGES SERVICE
==========================================

Handles all image uploads for ResolveX.

Features:
• max 2 images
• file validation
• size validation
• Firebase Storage upload
• download URL return
• production error handling
*/

const MAX_IMAGES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadIssueImages = async (files, issueId) => {

  try {

    if (!files || files.length === 0) {
      return [];
    }

    if (files.length > MAX_IMAGES) {
      throw new Error("Maximum 2 images allowed");
    }

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      /* =========================
         FILE TYPE VALIDATION
      ========================= */

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      /* =========================
         FILE SIZE VALIDATION
      ========================= */

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Image must be smaller than 5MB");
      }

      /* =========================
         STORAGE PATH
      ========================= */

      const storageRef = ref(
        storage,
        `issues/${issueId}/${Date.now()}_${file.name}`
      );

      /* =========================
         UPLOAD FILE
      ========================= */

      const snapshot = await uploadBytes(storageRef, file);

      /* =========================
         GET DOWNLOAD URL
      ========================= */

      const downloadURL = await getDownloadURL(snapshot.ref);

      uploadedUrls.push(downloadURL);

    }

    return uploadedUrls;

  } catch (error) {

    console.error("Image Upload Error:", error);

    throw error;
  }

};