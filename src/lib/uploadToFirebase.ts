import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
async function uploadFileToFirebase(file: File): Promise<string> {
  const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export { uploadFileToFirebase };
