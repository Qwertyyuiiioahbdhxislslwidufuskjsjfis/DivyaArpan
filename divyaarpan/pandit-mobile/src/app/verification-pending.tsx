import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getPanditSessionToken,
  logoutPandit,
  panditApiFetch,
} from "@/lib/api";

import {
  uploadPanditDocumentNative,
} from "@/lib/native-document-upload";

const GOLD = "#B88924";
const DARK_GOLD = "#8D6718";
const CREAM = "#FFFDF8";
const BORDER = "#E8D9B8";
const TEXT = "#2D2418";
const MUTED = "#756B5C";
const GREEN = "#1D7A46";
const ERROR = "#B42318";

const REQUIRED_DOCUMENTS = [
  "Government Photo ID",
  "PAN Card",
  "Address Proof",
  "Police Verification",
  "Pooja / Vedic Qualification Certificate",
] as const;

const DOCUMENT_TYPE_MAP = {
  "Government Photo ID": "GOVERNMENT_ID",
  "PAN Card": "PAN_CARD",
  "Address Proof": "ADDRESS_PROOF",
  "Police Verification": "POLICE_VERIFICATION",
  "Pooja / Vedic Qualification Certificate":
    "QUALIFICATION_CERTIFICATE",
} as const;

type RequiredDocument =
  (typeof REQUIRED_DOCUMENTS)[number];

type UploadedDocument = {
  id: number;
  documentType: string;
  documentNumber: string | null;
  isVerified: boolean;
};

type MissingDocumentState = {
  documentType: RequiredDocument;
  documentNumber: string;
  asset: DocumentPicker.DocumentPickerAsset | null;
};

function getDocumentMimeType(
  asset: DocumentPicker.DocumentPickerAsset
) {
  const reported =
    asset.mimeType?.toLowerCase().trim();

  if (
    reported === "image/jpeg" ||
    reported === "image/png" ||
    reported === "application/pdf"
  ) {
    return reported;
  }

  const fileName =
    (asset.name || asset.uri)
      .split("?")[0]
      .toLowerCase();

  if (
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg")
  ) {
    return "image/jpeg";
  }

  if (fileName.endsWith(".png")) {
    return "image/png";
  }

  if (fileName.endsWith(".pdf")) {
    return "application/pdf";
  }

  throw new Error(
    "Unsupported document format. Please select a JPG, PNG or PDF file."
  );
}

export default function VerificationPendingScreen() {
  const [name, setName] = useState("Pandit Ji");
  const [panditCode, setPanditCode] = useState("");
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [uploadedDocuments, setUploadedDocuments] =
    useState<UploadedDocument[]>([]);
  const [missingDocuments, setMissingDocuments] =
    useState<MissingDocumentState[]>([]);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycUploading, setKycUploading] =
    useState(false);
  const [kycError, setKycError] = useState("");
  const [kycStatusLoaded, setKycStatusLoaded] =
    useState(false);

  async function loadDocumentStatus() {
    setKycLoading(true);
    setKycError("");
    setKycStatusLoaded(false);

    try {
      const response = await panditApiFetch(
        "/api/pandit/documents/upload"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load KYC document status."
        );
      }

      const received: UploadedDocument[] =
        Array.isArray(result.documents)
          ? result.documents
          : [];

      setUploadedDocuments(received);

      const receivedTypes = new Set(
        received.map(
          (document) => document.documentType
        )
      );

      setMissingDocuments((current) =>
        REQUIRED_DOCUMENTS
          .filter(
            (documentType) =>
              !receivedTypes.has(
                DOCUMENT_TYPE_MAP[documentType]
              )
          )
          .map((documentType) => {
            const existing = current.find(
              (item) =>
                item.documentType === documentType
            );

            return (
              existing || {
                documentType,
                documentNumber: "",
                asset: null,
              }
            );
          })
      );

      setKycStatusLoaded(true);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "AUTH_REQUIRED" ||
          error.message === "SESSION_EXPIRED")
      ) {
        router.replace("/");
        return;
      }

      setKycError(
        error instanceof Error
          ? error.message
          : "Unable to load KYC document status."
      );
    } finally {
      setKycLoading(false);
    }
  }

  async function chooseMissingDocument(
    documentType: RequiredDocument
  ) {
    setKycError("");

    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: [
            "image/jpeg",
            "image/png",
            "application/pdf",
          ],
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (
        result.canceled ||
        !result.assets?.[0]
      ) {
        return;
      }

      const asset = result.assets[0];

      if (
        typeof asset.size === "number" &&
        asset.size > 5 * 1024 * 1024
      ) {
        setKycError(
          "Document size must not exceed 5 MB."
        );
        return;
      }

      try {
        getDocumentMimeType(asset);
      } catch (error) {
        setKycError(
          error instanceof Error
            ? error.message
            : "Unsupported document format."
        );
        return;
      }

      console.log(
        "[KYC PICKER] document selected",
        {
          documentType,
          name: asset.name,
          uri: asset.uri,
          size: asset.size,
          mimeType: asset.mimeType,
        }
      );

      setMissingDocuments((current) =>
        current.map((document) =>
          document.documentType ===
          documentType
            ? {
                ...document,
                asset,
              }
            : document
        )
      );
    } catch (error) {
      console.error(
        "[KYC PICKER] document selection failed",
        {
          documentType,
          error,
        }
      );

      setKycError(
        "We could not read that document. Please select it again."
      );
    }
  }

  function updateDocumentNumber(
    documentType: RequiredDocument,
    value: string
  ) {
    setMissingDocuments((current) =>
      current.map((document) =>
        document.documentType === documentType
          ? {
              ...document,
              documentNumber: value,
            }
          : document
      )
    );
  }

  async function uploadMissingKyc() {
    setKycError("");

    const readyDocuments =
      missingDocuments.filter(
        (document) =>
          document.documentNumber.trim() &&
          document.asset
      );

    if (readyDocuments.length === 0) {
      setKycError(
        "Please enter a document number and choose at least one document."
      );
      return;
    }

    setKycUploading(true);

    const failedDocuments: string[] = [];
    let uploadedCount = 0;

    try {
      for (const document of readyDocuments) {
        if (!document.asset) continue;

        try {
          const fileName =
            document.asset.name ||
            `${document.documentType}.pdf`;

          const mimeType =
            getDocumentMimeType(
              document.asset
            );

          if (Platform.OS !== "web") {
            const sessionToken =
              await getPanditSessionToken();

            if (!sessionToken) {
              throw new Error(
                "AUTH_REQUIRED"
              );
            }

            console.log(
              "[KYC MOBILE] uploading",
              {
                documentType:
                  document.documentType,
                uri:
                  document.asset.uri,
              }
            );

            await uploadPanditDocumentNative({
              sessionToken,
              uri: document.asset.uri,
              fileName,
              mimeType,
              documentType:
                document.documentType,
              documentNumber:
                document.documentNumber.trim(),
            });

            uploadedCount += 1;
            continue;
          }

          const uploadData =
            new FormData();

          const webAsset =
            document.asset as
              DocumentPicker.DocumentPickerAsset & {
                file?: File;
              };

          if (
            typeof File !== "undefined" &&
            webAsset.file instanceof File
          ) {
            uploadData.append(
              "file",
              webAsset.file,
              fileName
            );
          } else {
            throw new Error(
              "Selected browser file is unavailable."
            );
          }

          uploadData.append(
            "documentType",
            document.documentType
          );

          uploadData.append(
            "documentNumber",
            document.documentNumber.trim()
          );

          await panditApiFetch(
            "/api/pandit/documents/upload",
            {
              method: "POST",
              body: uploadData,
            }
          );

          uploadedCount += 1;
        } catch (error) {
          console.error("[KYC MOBILE] upload failed", {
            documentType: document.documentType,
            errorName:
              error instanceof Error ? error.name : "UnknownError",
            errorMessage:
              error instanceof Error ? error.message : String(error),
            errorStack:
              error instanceof Error ? error.stack : undefined,
            rawError: String(error),
          });

          if (
            error instanceof Error &&
            (
              error.message ===
                "AUTH_REQUIRED" ||
              error.message ===
                "SESSION_EXPIRED"
            )
          ) {
            throw error;
          }

          failedDocuments.push(
            document.documentType
          );
        }
      }

      await loadDocumentStatus();

      if (
        uploadedCount > 0 &&
        failedDocuments.length === 0
      ) {
        setMessage(
          `${uploadedCount} KYC document${
            uploadedCount === 1 ? "" : "s"
          } uploaded successfully.`
        );
      }

      if (
        uploadedCount > 0 &&
        failedDocuments.length > 0
      ) {
        setMessage(
          `${uploadedCount} document${
            uploadedCount === 1 ? "" : "s"
          } uploaded successfully.`
        );

        setKycError(
          `Could not upload: ${failedDocuments.join(
            ", "
          )}. Please select those files again.`
        );
      }

      if (
        uploadedCount === 0 &&
        failedDocuments.length > 0
      ) {
        setKycError(
          `Upload failed for: ${failedDocuments.join(
            ", "
          )}. Please select the files again.`
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (
          error.message ===
            "AUTH_REQUIRED" ||
          error.message ===
            "SESSION_EXPIRED"
        )
      ) {
        router.replace("/");
        return;
      }

      setKycError(
        error instanceof Error
          ? error.message
          : "Unable to upload KYC documents."
      );

      try {
        await loadDocumentStatus();
      } catch {
        // Preserve the original upload error.
      }
    } finally {
      setKycUploading(false);
    }
  }

  async function checkStatus() {
    setChecking(true);
    setMessage("");

    try {
      const response = await panditApiFetch(
        "/api/pandit/me"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to check verification status."
        );
      }

      if (result.pandit?.name) {
        setName(result.pandit.name);
      }

      if (result.pandit?.panditCode) {
        setPanditCode(result.pandit.panditCode);
      }

      if (
        result.pandit?.verificationStatus ===
          "VERIFIED" &&
        result.pandit?.isActive === true
      ) {
        router.replace("/dashboard");
        return;
      }

      if (
        result.pandit?.verificationStatus ===
        "PENDING"
      ) {
        setMessage(
          "Your application is still under verification."
        );
        return;
      }

      if (
        result.pandit?.verificationStatus ===
        "REJECTED"
      ) {
        setMessage(
          "Your application could not be approved. Please contact DivyaArpan Support for assistance."
        );
        return;
      }

      if (
        result.pandit?.isActive === false
      ) {
        setMessage(
          "Your Pandit Partner account is currently inactive. Please contact DivyaArpan Support."
        );
        return;
      }

      setMessage(
        "Your current verification status requires Admin review."
      );
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "AUTH_REQUIRED" ||
          error.message === "SESSION_EXPIRED")
      ) {
        router.replace("/");
        return;
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to check verification status."
      );
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    void checkStatus();
    void loadDocumentStatus();
  }, []);

  async function signOut() {
    console.log("[LOGOUT] signOut handler started");

    try {
      await logoutPandit();
      console.log("[LOGOUT] local session cleared");
    } catch (error) {
      console.error("[LOGOUT] logout error", error);
    }

    console.log("[LOGOUT] navigating to login");
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.card}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>ॐ</Text>
        </View>

        <Text style={styles.brand}>DivyaArpan</Text>
        <Text style={styles.portal}>PANDIT PARTNER</Text>

        <View style={styles.statusIcon}>
          <Text style={styles.statusIconText}>⌛</Text>
        </View>

        <Text style={styles.title}>
          Verification in Progress
        </Text>

        <Text style={styles.greeting}>
          Namaste, {name}
        </Text>

        <Text style={styles.description}>
          Your Pandit Partner application has been
          received and is currently being reviewed by
          the DivyaArpan Admin team.
        </Text>

        {panditCode ? (
          <View style={styles.referenceBox}>
            <Text style={styles.referenceLabel}>
              APPLICATION REFERENCE
            </Text>
            <Text style={styles.referenceValue}>
              {panditCode}
            </Text>
          </View>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            KYC Documents
          </Text>

          {kycLoading ? (
            <View style={styles.kycLoadingRow}>
              <ActivityIndicator color={GOLD} />
              <Text style={styles.kycLoadingText}>
                Checking document status...
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.kycCount}>
                {uploadedDocuments.length} of{" "}
                {REQUIRED_DOCUMENTS.length} received
              </Text>

              {REQUIRED_DOCUMENTS.map(
                (documentType) => {
                  const uploaded =
                    uploadedDocuments.find(
                      (document) =>
                        document.documentType ===
                        DOCUMENT_TYPE_MAP[documentType]
                    );

                  return (
                    <View
                      key={documentType}
                      style={styles.kycStatusRow}
                    >
                      <Text
                        style={[
                          styles.kycStatusMark,
                          uploaded
                            ? styles.kycReceived
                            : styles.kycMissing,
                        ]}
                      >
                        {uploaded ? "✓" : "○"}
                      </Text>

                      <View style={styles.kycStatusText}>
                        <Text style={styles.kycDocName}>
                          {documentType}
                        </Text>
                        <Text
                          style={
                            uploaded
                              ? styles.kycReceived
                              : styles.kycMissing
                          }
                        >
                          {uploaded
                            ? uploaded.isVerified
                              ? "Verified"
                              : "Received"
                            : "Missing"}
                        </Text>
                      </View>
                    </View>
                  );
                }
              )}

              {kycStatusLoaded &&
              uploadedDocuments.length ===
                REQUIRED_DOCUMENTS.length ? (
                <Text style={styles.kycComplete}>
                  ✓ All required KYC documents have
                  been received.
                </Text>
              ) : missingDocuments.length > 0 ? (
                <View style={styles.resumeBox}>
                  <Text style={styles.resumeTitle}>
                    Complete KYC
                  </Text>
                  <Text style={styles.resumeText}>
                    Upload only the missing documents below.
                    Documents already received do not need to
                    be uploaded again.
                  </Text>

                  {missingDocuments.map(
                    (document) => (
                      <View
                        key={document.documentType}
                        style={styles.missingCard}
                      >
                        <Text style={styles.missingTitle}>
                          {document.documentType} *
                        </Text>

                        <TextInput
                          value={
                            document.documentNumber
                          }
                          onChangeText={(value) =>
                            updateDocumentNumber(
                              document.documentType,
                              value
                            )
                          }
                          placeholder="Document / Reference Number"
                          placeholderTextColor="#A89D8B"
                          autoCapitalize="characters"
                          style={styles.kycInput}
                        />

                        <Pressable
                          disabled={kycUploading}
                          onPress={() =>
                            chooseMissingDocument(
                              document.documentType
                            )
                          }
                          style={styles.uploadButton}
                        >
                          <Text
                            style={
                              styles.uploadButtonText
                            }
                          >
                            {document.asset
                              ? "✓ Change Document"
                              : "＋ Choose Document"}
                          </Text>
                        </Pressable>

                        {document.asset ? (
                          <Text
                            style={styles.fileName}
                            numberOfLines={2}
                          >
                            {document.asset.name}
                          </Text>
                        ) : null}
                      </View>
                    )
                  )}

                  <Pressable
                    disabled={kycUploading}
                    onPress={uploadMissingKyc}
                    style={styles.kycSubmitButton}
                  >
                    {kycUploading ? (
                      <ActivityIndicator
                        color="#FFFFFF"
                      />
                    ) : (
                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        Submit Missing Documents
                      </Text>
                    )}
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.kycLoadingText}>
                  Document status could not be confirmed.
                  Please check your connection and try again.
                </Text>
              )}

              {kycError ? (
                <Text style={styles.kycError}>
                  {kycError}
                </Text>
              ) : null}
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            What happens next?
          </Text>

          <Text style={styles.infoText}>
            Your profile and verification documents will
            be reviewed. Once approved, your Pandit
            Dashboard and booking features will become
            available automatically.
          </Text>
        </View>

        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}

        <Pressable
          disabled={checking}
          onPress={checkStatus}
          style={styles.primaryButton}
        >
          {checking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Check Verification Status
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            console.log("[LOGOUT] Sign Out button pressed");
            void signOut();
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            Sign Out
          </Text>
        </Pressable>

        <Text style={styles.secureText}>
          🔒 Your verification documents remain private
          and are available only to authorized review.
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    alignItems: "center",
  },
  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF5D8",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    color: DARK_GOLD,
    fontSize: 29,
    fontWeight: "800",
  },
  brand: {
    marginTop: 10,
    color: DARK_GOLD,
    fontSize: 21,
    fontWeight: "900",
  },
  portal: {
    marginTop: 2,
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  statusIcon: {
    marginTop: 25,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFF8E6",
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconText: {
    fontSize: 29,
  },
  title: {
    marginTop: 16,
    color: TEXT,
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  greeting: {
    marginTop: 8,
    color: DARK_GOLD,
    fontSize: 16,
    fontWeight: "800",
  },
  description: {
    marginTop: 12,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  referenceBox: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#F8F3E6",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  referenceLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  referenceValue: {
    marginTop: 5,
    color: DARK_GOLD,
    fontSize: 18,
    fontWeight: "900",
  },
  infoBox: {
    width: "100%",
    marginTop: 18,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#FFF8E6",
    borderWidth: 1,
    borderColor: "#E9D6A4",
  },
  infoTitle: {
    color: DARK_GOLD,
    fontSize: 14,
    fontWeight: "900",
  },
  infoText: {
    marginTop: 6,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
  },
  kycLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  kycLoadingText: {
    marginLeft: 8,
    color: MUTED,
    fontSize: 13,
  },
  kycCount: {
    marginTop: 8,
    color: TEXT,
    fontSize: 14,
    fontWeight: "800",
  },
  kycStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  kycStatusMark: {
    width: 24,
    fontSize: 18,
    fontWeight: "900",
  },
  kycStatusText: {
    flex: 1,
  },
  kycDocName: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "700",
  },
  kycReceived: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
  },
  kycMissing: {
    color: ERROR,
    fontSize: 12,
    fontWeight: "800",
  },
  resumeBox: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E9D6A4",
  },
  resumeTitle: {
    color: DARK_GOLD,
    fontSize: 15,
    fontWeight: "900",
  },
  resumeText: {
    marginTop: 5,
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  missingCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  missingTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "800",
  },
  kycInput: {
    minHeight: 46,
    marginTop: 9,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: TEXT,
    backgroundColor: "#FFFFFF",
  },
  uploadButton: {
    minHeight: 44,
    marginTop: 9,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: DARK_GOLD,
    fontSize: 13,
    fontWeight: "800",
  },
  fileName: {
    marginTop: 7,
    color: GREEN,
    fontSize: 12,
    fontWeight: "700",
  },
  kycSubmitButton: {
    minHeight: 50,
    marginTop: 15,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  kycComplete: {
    marginTop: 14,
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },
  kycError: {
    marginTop: 12,
    color: ERROR,
    fontSize: 12,
    fontWeight: "700",
  },
  message: {
    marginTop: 14,
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    minHeight: 52,
    marginTop: 20,
    borderRadius: 13,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    width: "100%",
    minHeight: 50,
    marginTop: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: DARK_GOLD,
    fontSize: 14,
    fontWeight: "800",
  },
  secureText: {
    marginTop: 18,
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
});
