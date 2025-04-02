import React, { useRef, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  TextInput,
  Button,
  FileUploader,
  Checkbox,
  Form,
  ComposedModal,
} from "@carbon/react";

interface UploadRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    libraryName: string,
    libraryVersion: string,
    description: string,
    enabled: boolean,
    file: File
  ) => void; // Callback for form submission
}

const UploadRuleDialog: React.FC<UploadRuleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [libraryName, setLibraryName] = useState("");
  const [libraryVersion, setLibraryVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // if (!file) {
    //   alert("Please upload a CQL file.");
    //   return;
    // }
    const versionExpr = new RegExp(
      "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"
    );

    const versionValid: boolean = versionExpr.test(libraryVersion);
    if (versionValid)
      onSubmit(libraryName, libraryVersion, description, isEnabled, file);
    else {
      alert("Version string is not valid. Please use Major.Minor.build");
      return;
    }

    // Reset form fields after submission
    setLibraryName("");
    setLibraryVersion("");
    setDescription("");
    setIsEnabled(false);
    setFile(null);

    onClose(); // Close modal after form submission
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      modalHeading="Add a custom domain"
      modalLabel="Account resources"
      primaryButtonText="Upload"
      secondaryButtonText="Cancel"
      onRequestClose={() => onClose()}
      onRequestSubmit={handleSubmit}
      closeButton={onClose}
    >
      <ModalBody>
        <Form>
          <TextInput
            id="libraryName"
            labelText="Library Name"
            value={libraryName}
            onChange={(e) => setLibraryName(e.target.value)}
            required
          />
          <TextInput
            id="libraryVersion"
            labelText="Library Version"
            value={libraryVersion}
            onChange={(e) => setLibraryVersion(e.target.value)}
            required
          />
          <TextInput
            id="description"
            labelText="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Checkbox
            id="enabled"
            labelText="Enabled"
            checked={isEnabled}
            onChange={setIsEnabled}
          />
          <FileUploader
            accept={[".cql"]}
            buttonKind="primary"
            filenameStatusText={file ? file.name : "No file chosen"}
            labelDescription="Click or drag and drop a cql file here"
            labelTitle="Upload CQL File"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
                handleFileChange(event);
              }
            }}
            required
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          ></div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UploadRuleDialog;
