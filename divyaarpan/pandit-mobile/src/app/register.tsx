import * as DocumentPicker from "expo-document-picker";
import { storageSetItem } from "../lib/storage";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  API_BASE_URL,
  PANDIT_SESSION_EXPIRY_KEY,
  PANDIT_SESSION_KEY,
  PANDIT_USER_KEY,
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
const ERROR = "#B42318";
const SUCCESS = "#1D7A46";

const PARTNER_AGREEMENT_VERSION = "1.0.0";

const PARTNER_AGREEMENT_TERMS = [
  {
    number: "1",
    title: "Verified Partner",
    text:
      "Only Pandits who have completed the DivyaArpan verification process and have an active partner profile may accept and perform bookings through the platform.",
  },
  {
    number: "2",
    title: "Booking Acceptance",
    text:
      "A Pandit may accept or reject a booking request based on availability, location and ability to perform the requested pooja. Once accepted, the Pandit is expected to honour the confirmed booking.",
  },
  {
    number: "3",
    title: "Customer Pricing",
    text:
      "Final customer pricing is controlled by DivyaArpan. Pandits must not independently change, collect or negotiate the customer booking amount outside the approved DivyaArpan process.",
  },
  {
    number: "4",
    title: "Professional Conduct",
    text:
      "Pandits are expected to maintain respectful, professional and appropriate conduct with every devotee and customer associated with a booking.",
  },
  {
    number: "5",
    title: "Booking Status",
    text:
      "Pandits should keep booking status updated accurately, including On the Way, Arrived, Pooja Started and Completed, so that devotees and DivyaArpan can receive accurate booking information.",
  },
  {
    number: "6",
    title: "Cancellation",
    text:
      "If a Pandit is unable to fulfil a confirmed booking, DivyaArpan support should be informed as soon as possible. Repeated cancellations or failure to attend confirmed bookings may affect partner eligibility.",
  },
  {
    number: "7",
    title: "Customer Information",
    text:
      "Customer information received through DivyaArpan must be used only for legitimate booking-related purposes. Personal information must not be shared or misused.",
  },
  {
    number: "8",
    title: "Payments & Settlements",
    text:
      "Pandit earnings are calculated according to the applicable DivyaArpan settlement rules. Settlement timing and amounts may depend on booking completion, payment status and applicable policies.",
  },
  {
    number: "9",
    title: "Platform Usage",
    text:
      "The DivyaArpan Partner App should be used only for legitimate partner activities. Login credentials must be kept confidential and must not be shared with another person.",
  },
  {
    number: "10",
    title: "Profile & Documents",
    text:
      "Pandits must keep their profile information and required verification documents accurate and up to date. DivyaArpan may review partner information when required for verification or compliance.",
  },
] as const;

const LANGUAGES = [
  "Hindi",
  "Marathi",
  "English",
  "Sanskrit",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
];

const SERVICES = [
  "Ganesh Pooja",
  "Satyanarayan Pooja",
  "Griha Pravesh",
  "Vastu Pooja",
  "Navgraha Pooja",
  "Havan",
  "Marriage Pooja",
  "Mundan",
  "Naming Ceremony",
  "Shraddha / Pitru Pooja",
];

const DOCUMENT_TYPES = [
  "Government Photo ID",
  "PAN Card",
  "Address Proof",
  "Police Verification",
  "Pooja / Vedic Qualification Certificate",
] as const;

type DocumentType = (typeof DOCUMENT_TYPES)[number];

type SelectedDocument = {
  documentType: DocumentType;
  documentNumber: string;
  asset: DocumentPicker.DocumentPickerAsset | null;
};

const STEPS = [
  "Personal",
  "Service Area",
  "Expertise",
  "Documents",
  "Account",
];

function toggleValue(
  current: string[],
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>
) {
  setter(
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A89D8B"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
      />
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.passwordFieldWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A89D8B"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.passwordTextInput}
        />

        <Pressable
          onPress={() =>
            setVisible((current) => !current)
          }
          accessibilityRole="button"
          accessibilityLabel={
            visible
              ? "Hide password"
              : "Show password"
          }
          hitSlop={10}
          style={styles.passwordEyeButton}
        >
          <Text style={styles.passwordEyeIcon}>
            {visible ? "◉" : "◎"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function PanditRegisterScreen() {
  const [registrationStarted, setRegistrationStarted] =
    useState(false);

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [panditCode, setPanditCode] = useState("");
  const [registrationSessionToken, setRegistrationSessionToken] =
    useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");

  const [emailError, setEmailError] =
    useState("");
  const [mobileError, setMobileError] =
    useState("");
  const [checkingIdentity, setCheckingIdentity] =
    useState(false);
  const [genderOpen, setGenderOpen] =
    useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const [serviceCity, setServiceCity] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [servicePincode, setServicePincode] = useState("");
  const [serviceRadiusKm, setServiceRadiusKm] = useState("10");

  const [languages, setLanguages] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const [acceptsImmediate, setAcceptsImmediate] = useState(true);
  const [acceptsScheduled, setAcceptsScheduled] = useState(true);

  const [documents, setDocuments] = useState<SelectedDocument[]>(
    DOCUMENT_TYPES.map((documentType) => ({
      documentType,
      documentNumber: "",
      asset: null,
    }))
  );

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [agreementVisible, setAgreementVisible] =
    useState(false);

  const progress = useMemo(
    () => `${step + 1} of ${STEPS.length}`,
    [step]
  );

  function updateDocumentNumber(
    index: number,
    documentNumber: string
  ) {
    setDocuments((current) =>
      current.map((document, documentIndex) =>
        documentIndex === index
          ? { ...document, documentNumber }
          : document
      )
    );
  }

  async function chooseDocument(index: number) {
    setError("");

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
        setError(
          "Maximum document size is 5 MB."
        );
        return;
      }

      console.log(
        "[KYC PICKER] document selected",
        {
          name: asset.name,
          uri: asset.uri,
          size: asset.size,
          mimeType: asset.mimeType,
        }
      );

      setDocuments((current) =>
        current.map(
          (document, documentIndex) =>
            documentIndex === index
              ? {
                  ...document,
                  asset,
                }
              : document
        )
      );
    } catch (pickError) {
      console.error(
        "[KYC PICKER] document selection failed",
        pickError
      );

      setError(
        "We could not read that document. Please select it again."
      );
    }
  }

  function validateCurrentStep() {
    setError("");

    if (step === 0) {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return false;
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const normalizedMobile =
        mobile.replace(/\D/g, "");

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        setEmailError(
          "Enter a valid email ID."
        );
        setError(
          "Please correct your email ID."
        );
        return false;
      }

      if (
        !/^[6-9]\d{9}$/.test(
          normalizedMobile
        )
      ) {
        setMobileError(
          "Enter a valid 10-digit Indian mobile number."
        );
        setError(
          "Please correct your mobile number."
        );
        return false;
      }

      if (!gender) {
        setError("Please select your gender.");
        return false;
      }
    }

    if (step === 1) {
      if (!address.trim()) {
        setError("Please enter your full residential address.");
        return false;
      }

      if (!city.trim() || !stateName.trim()) {
        setError("City and state are required.");
        return false;
      }

      if (!/^\d{6}$/.test(pincode.trim())) {
        setError("Please enter a valid 6-digit residential pincode.");
        return false;
      }

      if (!serviceCity.trim() || !serviceArea.trim()) {
        setError("Please enter at least one service area.");
        return false;
      }

      if (
        servicePincode.trim() &&
        !/^\d{6}$/.test(servicePincode.trim())
      ) {
        setError("Please enter a valid service-area pincode.");
        return false;
      }
    }

    if (step === 2) {
      if (languages.length === 0) {
        setError("Please select at least one language.");
        return false;
      }

      if (services.length === 0) {
        setError("Please select at least one Pooja service.");
        return false;
      }
    }

    if (step === 3) {
      const incomplete = documents.find(
        (document) =>
          !document.documentNumber.trim() ||
          !document.asset
      );

      if (incomplete) {
        setError(
          `Please complete ${incomplete.documentType}.`
        );
        return false;
      }
    }

    if (step === 4) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }

      if (password !== confirmation) {
        setError("Passwords do not match.");
        return false;
      }

      if (!acceptedTerms) {
        setError(
          "Please accept the Pandit Partner terms before submitting."
        );
        return false;
      }
    }

    return true;
  }

  async function nextStep() {
    setEmailError("");
    setMobileError("");

    if (!validateCurrentStep()) return;

    /*
     * Email/mobile must be validated while the
     * Pandit is still on the Personal step,
     * not after completing the entire form.
     */
    if (step === 0) {
      setCheckingIdentity(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/pandit-register/check`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),

              mobile:
                mobile.replace(
                  /\D/g,
                  ""
                ),
            }),
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to validate email and mobile number."
          );
        }

        let valid = true;

        if (!result.emailAvailable) {
          setEmailError(
            "This email ID is already registered."
          );
          valid = false;
        }

        if (!result.mobileAvailable) {
          setMobileError(
            "This mobile number is already registered."
          );
          valid = false;
        }

        if (!valid) {
          setError(
            "Please use an email ID and mobile number that are not already registered."
          );
          return;
        }
      } catch (availabilityError) {
        setError(
          availabilityError instanceof Error
            ? availabilityError.message
            : "Unable to validate email and mobile number."
        );
        return;
      } finally {
        setCheckingIdentity(false);
      }
    }

    setStep((current) =>
      Math.min(
        current + 1,
        STEPS.length - 1
      )
    );
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

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

  async function uploadDocument(
    document: SelectedDocument,
    sessionToken: string
  ) {
    if (!document.asset) {
      throw new Error(
        `Please select ${document.documentType}.`
      );
    }

    const fileName =
      document.asset.name ||
      `${document.documentType}.pdf`;

    const mimeType =
      getDocumentMimeType(document.asset);

    if (Platform.OS !== "web") {
      await uploadPanditDocumentNative({
        sessionToken,
        uri: document.asset.uri,
        fileName,
        mimeType,
        documentType: document.documentType,
        documentNumber:
          document.documentNumber.trim(),
      });

      return;
    }

    const uploadData = new FormData();

    const webAsset = document.asset as
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
      const fileResponse = await fetch(
        document.asset.uri
      );

      if (!fileResponse.ok) {
        throw new Error(
          `Unable to read ${document.documentType}.`
        );
      }

      const blob = await fileResponse.blob();

      uploadData.append(
        "file",
        new Blob([blob], { type: mimeType }),
        fileName
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

    const response = await fetch(
      `${API_BASE_URL}/api/pandit/documents/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Unable to upload ${document.documentType}.`
      );
    }
  }

  async function submitApplication() {
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    setError("");

    try {
      let sessionToken = registrationSessionToken;
      let currentPanditCode = panditCode;

      /*
       * Create the account only once.
       *
       * If one of the document uploads fails after account
       * creation, the Pandit can tap Submit Application again.
       * We reuse the existing registration session instead of
       * trying to create a duplicate Pandit account.
       */
      if (!accountCreated || !sessionToken) {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/pandit-register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              client: "PANDIT_MOBILE",
              partnerAgreementAccepted:
                acceptedTerms,
              partnerAgreementVersion:
                PARTNER_AGREEMENT_VERSION,

              name: name.trim(),
              email: email.trim().toLowerCase(),
              mobile: mobile.trim(),
              password,

              gender: gender.trim(),
              dateOfBirth: dateOfBirth.trim(),
              experienceYears: experienceYears.trim(),
              bio: bio.trim(),

              address: address.trim(),
              city: city.trim(),
              state: stateName.trim(),
              country: "India",
              pincode: pincode.trim(),

              latitude: null,
              longitude: null,

              acceptsImmediate,
              acceptsScheduled,

              languages,
              services,

              serviceAreas: [
                {
                  city: serviceCity.trim(),
                  area: serviceArea.trim(),
                  pincode: servicePincode.trim(),
                  serviceRadiusKm:
                    serviceRadiusKm.trim() || "10",
                },
              ],

              documents: [],
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to create your Pandit application."
          );
        }

        if (!result.sessionToken) {
          throw new Error(
            "Account created, but secure mobile session could not be established."
          );
        }

        sessionToken = result.sessionToken;
        currentPanditCode =
          result.pandit?.panditCode || "";

        setRegistrationSessionToken(sessionToken);
        setPanditCode(currentPanditCode);
        setAccountCreated(true);

        /*
         * Keep this session temporarily so document uploads can
         * authenticate. It is removed after successful submission.
         */
        await storageSetItem(
          PANDIT_SESSION_KEY,
          sessionToken
        );

        if (result.sessionExpiresAt) {
          await storageSetItem(
            PANDIT_SESSION_EXPIRY_KEY,
            result.sessionExpiresAt
          );
        }

        await storageSetItem(
          PANDIT_USER_KEY,
          JSON.stringify({
            name:
              result.pandit?.name ||
              name.trim(),
            role: "PANDIT",
            panditCode: currentPanditCode,
            verificationStatus:
              result.pandit?.verificationStatus ||
              "PENDING",
          })
        );
      }

      /*
       * The upload endpoint upserts by document type, so retrying
       * all five documents is safe if an earlier attempt stopped
       * part-way through.
       */
      for (const document of documents) {
        await uploadDocument(
          document,
          sessionToken
        );
      }

      /*
       * Registration is pending Admin approval. Do not leave a
       * normal mobile app session active after successful KYC
       * submission.
       */
      /*
       * Keep the authenticated pending session so the
       * Pandit can immediately view and later refresh
       * verification status.
       */
      setRegistrationSessionToken("");
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your Pandit application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.successTitle}>
            Application Submitted
          </Text>

          <Text style={styles.successSubtitle}>
            Namaste {name.trim()}. Your Pandit Partner
            application and verification documents have
            been received.
          </Text>

          {panditCode ? (
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>
                APPLICATION REFERENCE
              </Text>
              <Text style={styles.codeValue}>
                {panditCode}
              </Text>
            </View>
          ) : null}

          <View style={styles.pendingBox}>
            <Text style={styles.pendingTitle}>
              Verification Pending
            </Text>
            <Text style={styles.pendingText}>
              The DivyaArpan Admin team will review your
              profile and documents. Dashboard access will
              become available only after approval.
            </Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.replace("/verification-pending")
            }
          >
            <Text style={styles.primaryButtonText}>
              View Verification Status
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!registrationStarted) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.brand}>DivyaArpan</Text>
            <Text style={styles.portal}>
              PANDIT PARTNER
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.becomeHero}>
            <Text style={styles.becomeEyebrow}>
              BECOME A PANDIT PARTNER
            </Text>

            <Text style={styles.becomeTitle}>
              Join DivyaArpan as a Pandit Partner
            </Text>

            <Text style={styles.becomeSubtitle}>
              Complete a simple verification process and
              start receiving eligible Pooja booking
              opportunities through DivyaArpan.
            </Text>
          </View>

          <View style={styles.guideCard}>
            <View style={styles.guideIconCircle}>
              <Text style={styles.guidePlayIcon}>▶</Text>
            </View>

            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>
                How to Register
              </Text>

              <Text style={styles.guideText}>
                Watch our short step-by-step registration
                guide before you begin.
              </Text>

              <View style={styles.videoComingSoon}>
                <Text style={styles.videoComingSoonText}>
                  Registration guide video
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.preparationCard}>
            <Text style={styles.preparationTitle}>
              Keep these ready before you start
            </Text>

            <Text style={styles.preparationSubtitle}>
              Having these details ready will help you
              complete registration without interruption.
            </Text>

            {[
              "Active mobile number and email ID",
              "Residential and service-area details",
              "Government Photo ID",
              "PAN Card",
              "Address Proof",
              "Police Verification",
              "Pooja / Vedic Qualification Certificate",
            ].map((item) => (
              <View
                key={item}
                style={styles.preparationRow}
              >
                <View style={styles.preparationCheck}>
                  <Text style={styles.preparationCheckText}>
                    ✓
                  </Text>
                </View>

                <Text style={styles.preparationItem}>
                  {item}
                </Text>
              </View>
            ))}

            <View style={styles.fileNotice}>
              <Text style={styles.fileNoticeText}>
                Documents can be uploaded as JPG, PNG or
                PDF. Maximum file size: 5 MB each.
              </Text>
            </View>
          </View>

          <View style={styles.processCard}>
            <Text style={styles.processTitle}>
              Registration Process
            </Text>

            {[
              ["1", "Personal Details"],
              ["2", "Address & Service Area"],
              ["3", "Languages & Pooja Services"],
              ["4", "KYC Documents"],
              ["5", "Agreement & Account"],
              ["6", "Verification by DivyaArpan"],
            ].map(([number, label]) => (
              <View
                key={number}
                style={styles.processRow}
              >
                <View style={styles.processNumber}>
                  <Text style={styles.processNumberText}>
                    {number}
                  </Text>
                </View>

                <Text style={styles.processLabel}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.afterRegistrationCard}>
            <Text style={styles.afterRegistrationTitle}>
              What happens after registration?
            </Text>

            <Text style={styles.afterRegistrationText}>
              Our team reviews your profile and KYC
              documents. Once approved, your Pandit
              Partner account is activated and you can
              access eligible booking opportunities.
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setError("");
              setRegistrationStarted(true);
            }}
            style={styles.startRegistrationButton}
          >
            <Text style={styles.startRegistrationText}>
              Start Registration
            </Text>
          </Pressable>

          <Text style={styles.registrationTime}>
            Registration usually takes around 5–10 minutes
            when your documents are ready.
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (step === 0) {
              /*
               * Return to Become-a-Pandit introduction without
               * unmounting this registration screen. All entered
               * form state therefore remains available.
               */
              setRegistrationStarted(false);
              setError("");
              setEmailError("");
              setMobileError("");
              return;
            }

            previousStep();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.brand}>DivyaArpan</Text>
          <Text style={styles.portal}>
            PANDIT PARTNER
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.stepCount}>
            STEP {progress}
          </Text>
          <Text style={styles.stepName}>
            {STEPS[step]}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((step + 1) / STEPS.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        {step === 0 ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              Personal Details
            </Text>
            <Text style={styles.description}>
              Tell us about yourself. These details will
              form your Pandit Partner profile.
            </Text>

            <Field
              label="Full Name *"
              value={name}
              onChangeText={setName}
              placeholder="Pandit full name"
              autoCapitalize="words"
            />

            <Field
              label="Email ID *"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError("");
                setError("");
              }}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {emailError ? (
              <Text style={styles.inlineError}>
                {emailError}
              </Text>
            ) : null}

            <Field
              label="Mobile Number *"
              value={mobile}
              onChangeText={(value) => {
                setMobile(
                  value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                );
                setMobileError("");
                setError("");
              }}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
            />

            {mobileError ? (
              <Text style={styles.inlineError}>
                {mobileError}
              </Text>
            ) : null}

            <View style={styles.genderField}>
              <Text style={styles.genderLabel}>
                Gender *
              </Text>

              <Pressable
                onPress={() =>
                  setGenderOpen(
                    (current) => !current
                  )
                }
                style={styles.genderSelector}
              >
                <Text
                  style={[
                    styles.genderValue,
                    !gender &&
                      styles.genderPlaceholder,
                  ]}
                >
                  {gender ||
                    "Select gender"}
                </Text>

                <Text style={styles.genderArrow}>
                  {genderOpen ? "▲" : "▼"}
                </Text>
              </Pressable>

              {genderOpen ? (
                <View style={styles.genderMenu}>
                  {[
                    "Male",
                    "Female",
                    "Other",
                  ].map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setGender(option);
                        setGenderOpen(false);
                        setError("");
                      }}
                      style={
                        styles.genderOption
                      }
                    >
                      <Text
                        style={
                          styles.genderOptionText
                        }
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <Field
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
            />

            <Field
              label="Years of Experience"
              value={experienceYears}
              onChangeText={setExperienceYears}
              placeholder="e.g. 10"
              keyboardType="numeric"
            />

            <Field
              label="About Your Vedic / Pooja Experience"
              value={bio}
              onChangeText={setBio}
              placeholder="Briefly describe your experience..."
              multiline
            />
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              Address & Service Area
            </Text>
            <Text style={styles.description}>
              Tell us where you are based and where you
              can perform Pooja services.
            </Text>

            <Field
              label="Residential Address *"
              value={address}
              onChangeText={setAddress}
              placeholder="Full address"
              multiline
            />

            <Field
              label="City *"
              value={city}
              onChangeText={(value) => {
                setCity(value);
                if (!serviceCity) setServiceCity(value);
              }}
              placeholder="Mumbai"
              autoCapitalize="words"
            />

            <Field
              label="State *"
              value={stateName}
              onChangeText={setStateName}
              placeholder="Maharashtra"
              autoCapitalize="words"
            />

            <Field
              label="Residential Pincode *"
              value={pincode}
              onChangeText={setPincode}
              placeholder="400001"
              keyboardType="numeric"
            />

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>
              Primary Service Area
            </Text>

            <Field
              label="Service City *"
              value={serviceCity}
              onChangeText={setServiceCity}
              placeholder="Mumbai"
              autoCapitalize="words"
            />

            <Field
              label="Area / Locality *"
              value={serviceArea}
              onChangeText={setServiceArea}
              placeholder="e.g. Andheri West"
              autoCapitalize="words"
            />

            <Field
              label="Service Area Pincode"
              value={servicePincode}
              onChangeText={setServicePincode}
              placeholder="400053"
              keyboardType="numeric"
            />

            <Field
              label="Service Radius (KM)"
              value={serviceRadiusKm}
              onChangeText={setServiceRadiusKm}
              placeholder="10"
              keyboardType="numeric"
            />
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              Languages & Pooja Services
            </Text>
            <Text style={styles.description}>
              Select all languages and services you can
              confidently provide.
            </Text>

            <Text style={styles.sectionTitle}>
              Languages *
            </Text>

            <View style={styles.chipWrap}>
              {LANGUAGES.map((language) => {
                const selected =
                  languages.includes(language);

                return (
                  <Pressable
                    key={language}
                    onPress={() =>
                      toggleValue(
                        languages,
                        language,
                        setLanguages
                      )
                    }
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {selected ? "✓ " : ""}
                      {language}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>
              Pooja Services *
            </Text>

            <View style={styles.chipWrap}>
              {SERVICES.map((service) => {
                const selected =
                  services.includes(service);

                return (
                  <Pressable
                    key={service}
                    onPress={() =>
                      toggleValue(
                        services,
                        service,
                        setServices
                      )
                    }
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {selected ? "✓ " : ""}
                      {service}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchTitle}>
                  Immediate Requests
                </Text>
                <Text style={styles.switchDescription}>
                  Receive urgent / immediate Pooja
                  requests.
                </Text>
              </View>
              <Switch
                value={acceptsImmediate}
                onValueChange={setAcceptsImmediate}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchTitle}>
                  Scheduled Bookings
                </Text>
                <Text style={styles.switchDescription}>
                  Receive advance scheduled bookings.
                </Text>
              </View>
              <Switch
                value={acceptsScheduled}
                onValueChange={setAcceptsScheduled}
              />
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              Verification Documents
            </Text>
            <Text style={styles.description}>
              Upload clear JPG, PNG or PDF documents.
              Maximum size is 5 MB per document.
            </Text>

            <View style={styles.securityBox}>
              <Text style={styles.securityTitle}>
                🔒 Private Verification
              </Text>
              <Text style={styles.securityText}>
                Your documents are submitted for
                DivyaArpan Admin verification and are not
                part of your public Pandit profile.
              </Text>
            </View>

            {documents.map((document, index) => (
              <View
                key={document.documentType}
                style={styles.documentCard}
              >
                <Text style={styles.documentTitle}>
                  {document.documentType} *
                </Text>

                <Field
                  label="Document / Reference Number *"
                  value={document.documentNumber}
                  onChangeText={(value) =>
                    updateDocumentNumber(index, value)
                  }
                  placeholder="Enter document number"
                  autoCapitalize="characters"
                />

                <Pressable
                  style={[
                    styles.uploadButton,
                    document.asset &&
                      styles.uploadButtonComplete,
                  ]}
                  onPress={() => chooseDocument(index)}
                >
                  <Text style={styles.uploadButtonText}>
                    {document.asset
                      ? "✓ Change Document"
                      : "＋ Choose Document"}
                  </Text>
                </Pressable>

                {document.asset ? (
                  <Text
                    style={styles.selectedFile}
                    numberOfLines={2}
                  >
                    {document.asset.name}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              Agreement & Account
            </Text>
            <Text style={styles.description}>
              Review the Pandit Partner Agreement,
              create your password and submit your
              application.
            </Text>

            <PasswordField
              label="Password *"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
            />

            <PasswordField
              label="Confirm Password *"
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder="Re-enter password"
            />

            <View style={styles.agreementCard}>
              <Text style={styles.agreementTitle}>
                Pandit Partner Agreement
              </Text>

              <Text style={styles.agreementDescription}>
                Please review the Partner Agreement before
                accepting and submitting your application.
              </Text>

              <Pressable
                onPress={() => setAgreementVisible(true)}
                style={styles.viewAgreementButton}
              >
                <Text style={styles.viewAgreementText}>
                  View Partner Agreement
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() =>
                setAcceptedTerms((value) => !value)
              }
              style={styles.consentRow}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms &&
                    styles.checkboxSelected,
                ]}
              >
                {acceptedTerms ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </View>

              <Text style={styles.consentText}>
                I have read and agree to the
                DivyaArpan Pandit Partner Agreement. I
                confirm that the information and documents
                provided by me are correct and genuine.
              </Text>
            </Pressable>

            <View style={styles.reviewBox}>
              <Text style={styles.reviewTitle}>
                What happens next?
              </Text>
              <Text style={styles.reviewText}>
                Your account will be created with
                verification status PENDING. DivyaArpan
                Admin will review your profile and KYC
                documents before dashboard access is
                activated.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.navigationRow}>
          {step > 0 ? (
            <Pressable
              disabled={submitting}
              onPress={previousStep}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Back
              </Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={submitting}
              onPress={() => {
                /*
                 * Do not discard a partially completed
                 * registration. Return to the introduction and
                 * keep the form values in memory.
                 */
                setRegistrationStarted(false);
                setError("");
                setEmailError("");
                setMobileError("");
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Back
              </Text>
            </Pressable>
          )}

          {step < STEPS.length - 1 ? (
            <Pressable
              onPress={nextStep}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                Continue
              </Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={submitting}
              onPress={submitApplication}
              style={[
                styles.primaryButton,
                submitting && styles.buttonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Submit Application
                </Text>
              )}
            </Pressable>
          )}
        </View>

        <Text style={styles.footer}>
          © 2026 DivyaArpan · Pandit Partner Onboarding
        </Text>
      </ScrollView>

      <Modal
        visible={agreementVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAgreementVisible(false)}
      >
        <View style={styles.agreementModal}>
          <View style={styles.agreementModalHeader}>
            <View style={styles.agreementModalHeaderText}>
              <Text style={styles.agreementModalTitle}>
                Pandit Partner Agreement
              </Text>
              <Text style={styles.agreementModalVersion}>
                Version {PARTNER_AGREEMENT_VERSION}
              </Text>
            </View>

            <Pressable
              onPress={() => setAgreementVisible(false)}
              style={styles.agreementCloseButton}
              accessibilityRole="button"
              accessibilityLabel="Close Partner Agreement"
            >
              <Text style={styles.agreementCloseText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.agreementModalScroll}
            contentContainerStyle={
              styles.agreementModalContent
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.agreementNotice}>
              <Text style={styles.agreementNoticeTitle}>
                Please read carefully
              </Text>

              <Text style={styles.agreementNoticeText}>
                These terms explain the responsibilities,
                expectations and operating policies for
                DivyaArpan Pandit Partners.
              </Text>
            </View>

            {PARTNER_AGREEMENT_TERMS.map((term) => (
              <View
                key={term.number}
                style={styles.agreementTerm}
              >
                <View style={styles.agreementTermNumber}>
                  <Text style={styles.agreementTermNumberText}>
                    {term.number}
                  </Text>
                </View>

                <View style={styles.agreementTermContent}>
                  <Text style={styles.agreementTermTitle}>
                    {term.title}
                  </Text>

                  <Text style={styles.agreementTermText}>
                    {term.text}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.agreementExtraSection}>
              <Text style={styles.agreementExtraTitle}>
                Privacy & Security
              </Text>
              <Text style={styles.agreementExtraText}>
                Never share your DivyaArpan login ID or
                password with anyone. DivyaArpan support will
                never require you to disclose your password.
              </Text>
            </View>

            <View style={styles.agreementExtraSection}>
              <Text style={styles.agreementExtraTitle}>
                Policy Updates
              </Text>
              <Text style={styles.agreementExtraText}>
                DivyaArpan may update partner terms and
                policies as the platform evolves. Partners
                will be expected to follow the latest
                applicable policies communicated through the
                platform.
              </Text>
            </View>

            <View style={styles.agreementExtraSection}>
              <Text style={styles.agreementExtraTitle}>
                Questions about these policies?
              </Text>
              <Text style={styles.agreementExtraText}>
                Contact DivyaArpan Partner Support if you need
                clarification about any partner policy.
              </Text>
            </View>

            <Pressable
              onPress={() => setAgreementVisible(false)}
              style={styles.agreementDoneButton}
            >
              <Text style={styles.agreementDoneButtonText}>
                Done Reading
              </Text>
            </Pressable>

            <Text style={styles.agreementElectronicNote}>
              Returning from this screen does not accept the
              agreement. You must separately select the
              agreement checkbox before submitting your
              application.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  agreementModal: {
    flex: 1,
    backgroundColor: CREAM,
  },
  agreementModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  agreementModalHeaderText: {
    flex: 1,
  },
  agreementModalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: TEXT,
  },
  agreementModalVersion: {
    marginTop: 4,
    fontSize: 12,
    color: MUTED,
  },
  agreementCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CREAM,
  },
  agreementCloseText: {
    fontSize: 20,
    color: TEXT,
    fontWeight: "700",
  },
  agreementModalScroll: {
    flex: 1,
  },
  agreementModalContent: {
    padding: 20,
    paddingBottom: 42,
  },
  agreementNotice: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    marginBottom: 18,
  },
  agreementNoticeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 6,
  },
  agreementNoticeText: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
  },
  agreementTerm: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  agreementTermNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GOLD,
    marginRight: 12,
  },
  agreementTermNumberText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  agreementTermContent: {
    flex: 1,
  },
  agreementTermTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 5,
  },
  agreementTermText: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
  },
  agreementExtraSection: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  agreementExtraTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 6,
  },
  agreementExtraText: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
  },
  agreementDoneButton: {
    marginTop: 24,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  agreementDoneButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  agreementElectronicNote: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: MUTED,
  },
  screen: {
    flex: 1,
    backgroundColor: CREAM,
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 38,
    color: DARK_GOLD,
    lineHeight: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSpacer: {
    width: 44,
  },
  brand: {
    fontSize: 21,
    fontWeight: "800",
    color: DARK_GOLD,
  },
  portal: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: MUTED,
  },
  content: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    padding: 18,
    paddingBottom: 50,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  stepCount: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: GOLD,
  },
  stepName: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT,
  },
  progressTrack: {
    height: 5,
    backgroundColor: "#EEE5D4",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 18,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GOLD,
  },
  errorBox: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#FFF0EE",
    borderWidth: 1,
    borderColor: "#F2C4BE",
    marginBottom: 14,
  },
  errorText: {
    color: ERROR,
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
  },
  description: {
    marginTop: 7,
    marginBottom: 20,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
  },
  fieldWrap: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 7,
    color: TEXT,
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: CREAM,
    paddingHorizontal: 14,
    color: TEXT,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 13,
    textAlignVertical: "top",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#EFE5D4",
    marginVertical: 18,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 99,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: CREAM,
  },
  chipSelected: {
    backgroundColor: "#F5E8C6",
    borderColor: GOLD,
  },
  chipText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: DARK_GOLD,
    fontWeight: "800",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  switchText: {
    flex: 1,
  },
  switchTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "800",
  },
  switchDescription: {
    marginTop: 3,
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  securityBox: {
    backgroundColor: "#F8F3E6",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  securityTitle: {
    color: DARK_GOLD,
    fontWeight: "800",
    fontSize: 14,
  },
  securityText: {
    color: MUTED,
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },
  documentCard: {
    borderTopWidth: 1,
    borderTopColor: "#EFE5D4",
    paddingTop: 17,
    marginTop: 5,
    marginBottom: 10,
  },
  documentTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 13,
  },
  uploadButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: GOLD,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9E9",
  },
  uploadButtonComplete: {
    borderStyle: "solid",
    backgroundColor: "#F0FAF4",
    borderColor: SUCCESS,
  },
  uploadButtonText: {
    color: DARK_GOLD,
    fontWeight: "800",
    fontSize: 13,
  },
  selectedFile: {
    marginTop: 7,
    color: SUCCESS,
    fontSize: 12,
    fontWeight: "600",
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxSelected: {
    backgroundColor: GOLD,
  },
  checkmark: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  consentText: {
    flex: 1,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
  },
  reviewBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#FFF8E6",
    borderWidth: 1,
    borderColor: "#E9D6A4",
  },
  reviewTitle: {
    color: DARK_GOLD,
    fontWeight: "800",
    fontSize: 14,
  },
  reviewText: {
    marginTop: 6,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
  },
  navigationRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: DARK_GOLD,
    fontSize: 14,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  footer: {
    marginTop: 28,
    textAlign: "center",
    color: "#9A8E7B",
    fontSize: 11,
  },
  successScreen: {
    flex: 1,
    backgroundColor: CREAM,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successCard: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    alignItems: "center",
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EAF8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  successIconText: {
    color: SUCCESS,
    fontSize: 34,
    fontWeight: "900",
  },
  successTitle: {
    marginTop: 18,
    color: TEXT,
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  successSubtitle: {
    marginTop: 10,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  codeBox: {
    width: "100%",
    marginTop: 20,
    padding: 14,
    borderRadius: 13,
    backgroundColor: "#F8F3E6",
    alignItems: "center",
  },
  codeLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  codeValue: {
    marginTop: 5,
    color: DARK_GOLD,
    fontSize: 18,
    fontWeight: "900",
  },
  pendingBox: {
    width: "100%",
    marginVertical: 20,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#FFF8E6",
  },
  pendingTitle: {
    color: DARK_GOLD,
    fontSize: 15,
    fontWeight: "900",
  },
  pendingText: {
    marginTop: 6,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
  },

  inlineError: {
    width: "100%",
    marginTop: -8,
    marginBottom: 10,
    color: ERROR,
    fontSize: 12,
    fontWeight: "700",
  },

  genderField: {
    width: "100%",
    marginBottom: 16,
  },

  genderLabel: {
    marginBottom: 8,
    color: TEXT,
    fontSize: 14,
    fontWeight: "700",
  },

  genderSelector: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  genderValue: {
    color: TEXT,
    fontSize: 16,
  },

  genderPlaceholder: {
    color: MUTED,
  },

  genderArrow: {
    color: DARK_GOLD,
    fontSize: 12,
    fontWeight: "900",
  },

  genderMenu: {
    marginTop: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },

  genderOptionText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "600",
  },


  onboardingNotice: {
    marginBottom: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5D6B8",
    borderRadius: 14,
    backgroundColor: "#FFF9EE",
  },

  onboardingNoticeTitle: {
    marginBottom: 7,
    color: "#7A4A10",
    fontSize: 16,
    fontWeight: "800",
  },

  onboardingNoticeText: {
    marginBottom: 12,
    color: "#5F5548",
    fontSize: 13,
    lineHeight: 19,
  },

  onboardingRequirement: {
    marginBottom: 6,
    color: "#3F382F",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  onboardingRequiredNote: {
    marginTop: 8,
    color: "#7A6C5A",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },

  passwordFieldWrap: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#DDD3C3",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordTextInput: {
    flex: 1,
    minHeight: 52,
    paddingLeft: 14,
    paddingRight: 8,
    color: "#2D2924",
    fontSize: 15,
  },

  passwordEyeButton: {
    width: 52,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  passwordEyeIcon: {
    color: "#7A4A10",
    fontSize: 25,
    fontWeight: "700",
  },


  becomeHero: {
    marginBottom: 18,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#FFF5E3",
  },

  becomeEyebrow: {
    marginBottom: 8,
    color: "#9A5B12",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  becomeTitle: {
    marginBottom: 9,
    color: "#2D2924",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
  },

  becomeSubtitle: {
    color: "#665D51",
    fontSize: 14,
    lineHeight: 21,
  },

  guideCard: {
    marginBottom: 16,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E5D6B8",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  guideIconCircle: {
    width: 46,
    height: 46,
    marginRight: 13,
    borderRadius: 23,
    backgroundColor: "#FFF1D7",
    alignItems: "center",
    justifyContent: "center",
  },

  guidePlayIcon: {
    marginLeft: 3,
    color: "#8A4D0F",
    fontSize: 17,
  },

  guideContent: {
    flex: 1,
  },

  guideTitle: {
    color: "#2D2924",
    fontSize: 16,
    fontWeight: "800",
  },

  guideText: {
    marginTop: 4,
    color: "#706659",
    fontSize: 13,
    lineHeight: 19,
  },

  videoComingSoon: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F5EFE5",
  },

  videoComingSoonText: {
    color: "#7B6D59",
    fontSize: 11,
    fontWeight: "700",
  },

  preparationCard: {
    marginBottom: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8DDCB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  preparationTitle: {
    color: "#2D2924",
    fontSize: 17,
    fontWeight: "800",
  },

  preparationSubtitle: {
    marginTop: 5,
    marginBottom: 15,
    color: "#706659",
    fontSize: 13,
    lineHeight: 19,
  },

  preparationRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  preparationCheck: {
    width: 23,
    height: 23,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#FFF1D7",
    alignItems: "center",
    justifyContent: "center",
  },

  preparationCheckText: {
    color: "#8A4D0F",
    fontSize: 13,
    fontWeight: "900",
  },

  preparationItem: {
    flex: 1,
    color: "#443D34",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  fileNotice: {
    marginTop: 6,
    padding: 11,
    borderRadius: 10,
    backgroundColor: "#F8F4EC",
  },

  fileNoticeText: {
    color: "#706659",
    fontSize: 12,
    lineHeight: 17,
  },

  processCard: {
    marginBottom: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8DDCB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  processTitle: {
    marginBottom: 14,
    color: "#2D2924",
    fontSize: 17,
    fontWeight: "800",
  },

  processRow: {
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  processNumber: {
    width: 28,
    height: 28,
    marginRight: 11,
    borderRadius: 14,
    backgroundColor: "#FFF1D7",
    alignItems: "center",
    justifyContent: "center",
  },

  processNumberText: {
    color: "#8A4D0F",
    fontSize: 12,
    fontWeight: "900",
  },

  processLabel: {
    color: "#443D34",
    fontSize: 13,
    fontWeight: "700",
  },

  afterRegistrationCard: {
    marginBottom: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F8F4EC",
  },

  afterRegistrationTitle: {
    marginBottom: 6,
    color: "#2D2924",
    fontSize: 15,
    fontWeight: "800",
  },

  afterRegistrationText: {
    color: "#706659",
    fontSize: 13,
    lineHeight: 19,
  },

  startRegistrationButton: {
    minHeight: 55,
    borderRadius: 14,
    backgroundColor: "#8A4D0F",
    alignItems: "center",
    justifyContent: "center",
  },

  startRegistrationText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  registrationTime: {
    marginTop: 10,
    marginBottom: 25,
    color: "#7B6D59",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },

  agreementCard: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5D6B8",
    borderRadius: 14,
    backgroundColor: "#FFF9EE",
  },

  agreementTitle: {
    color: "#2D2924",
    fontSize: 15,
    fontWeight: "800",
  },

  agreementDescription: {
    marginTop: 5,
    color: "#706659",
    fontSize: 12,
    lineHeight: 18,
  },

  viewAgreementButton: {
    alignSelf: "flex-start",
    marginTop: 11,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#C89A57",
    borderRadius: 9,
  },

  viewAgreementText: {
    color: "#8A4D0F",
    fontSize: 12,
    fontWeight: "800",
  },

});
