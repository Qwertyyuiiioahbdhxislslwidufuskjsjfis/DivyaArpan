import { File } from "expo-file-system";
import { fetch } from "expo/fetch";

import { API_BASE_URL } from "./api";

type NativeDocumentUploadOptions = {
  sessionToken: string;
  uri: string;
  fileName: string;
  mimeType: string;
  documentType: string;
  documentNumber: string;
};

export async function uploadPanditDocumentNative({
  sessionToken,
  uri,
  fileName,
  mimeType,
  documentType,
  documentNumber,
}: NativeDocumentUploadOptions) {
  if (!sessionToken) {
    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  if (!uri) {
    throw new Error(
      `${documentType} file is missing. Please select it again.`
    );
  }

  if (!documentNumber.trim()) {
    throw new Error(
      `Please enter the document number for ${documentType}.`
    );
  }

  console.log("[KYC UPLOAD] preparing Expo File", {
    documentType,
    fileName,
    mimeType,
    uri,
  });

  let file: File;

  try {
    file = new File(uri);

    console.log("[KYC FILE] ready", {
      exists: file.exists,
      size: file.size,
      uri: file.uri,
      name: file.name,
      type: file.type,
    });

  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error(
      `[KYC FILE ERROR] ${message}`
    );

    throw error;
  }

  const formData = new FormData();

  formData.append("file", file, fileName);
  formData.append("documentType", documentType);
  formData.append(
    "documentNumber",
    documentNumber.trim()
  );

  console.log("[KYC UPLOAD] sending with expo/fetch", {
    documentType,
    fileName,
  });

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/pandit/documents/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
        body: formData,
      }
    );
  } catch (error) {
    const errorName =
      error instanceof Error ? error.name : "UnknownError";

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    console.error(
      `[KYC EXPO FETCH ERROR] name=${errorName} message=${errorMessage}`
    );

    throw new Error(
      `KYC_UPLOAD_FAILED: ${errorMessage}`
    );
  }

  const responseText = await response.text();

  console.log("[KYC UPLOAD] server response", {
    documentType,
    status: response.status,
    body: responseText,
  });

  let result: any = {};

  try {
    if (responseText) {
      result = JSON.parse(responseText);
    }
  } catch {
    throw new Error(
      `${documentType} upload returned an invalid server response.`
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.error ||
        `Unable to upload ${documentType}.`
    );
  }

  if (!result?.success || !result?.documentId) {
    throw new Error(
      `${documentType} was uploaded but the save could not be confirmed.`
    );
  }

  console.log("[KYC UPLOAD] saved", {
    documentType,
    documentId: result.documentId,
  });

  return result;
}
