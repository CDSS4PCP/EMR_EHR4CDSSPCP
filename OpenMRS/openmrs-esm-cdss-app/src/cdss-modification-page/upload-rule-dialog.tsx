import React, { useState } from "react";
import {
  ModalBody,
  TextInput,
  FileUploader,
  Checkbox,
  Form,
  ComposedModal,
  ModalFooter,
  ContainedList,
  ContainedListItem,
} from "@carbon/react";

interface ParameterProps {
  type: string;
  value: any;
  default?: any;
}

interface LibraryNameProps {
  libraryName: string;
  libraryVersion: string;
}

interface UploadRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    libraryName: string,
    libraryVersion: string,
    description: string,
    enabled: boolean,
    file: File,
    params: { [key: string]: ParameterProps }
  ) => void; // Callback for form submission
}

const UploadRuleDialog: React.FC<UploadRuleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [libraryName, setLibraryName] = useState("");
  const [libraryVersion, setLibraryVersion] = useState("");
  const [libraryNameAutomaticallySet, setLibraryNameAutomaticallySet] =
    useState(false);
  const [libraryVersionAutomaticallySet, setLibraryVersionAutomaticallySet] =
    useState(false);
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [params, setParams] = useState<{ [key: string]: ParameterProps }>({});

  // Attempt to detect library name and version using regex
  const extractLibraryName = async (file: File) => {
    const text: string = await file.text();
    const nameAndVersionPattern = new RegExp(
      "library\\s+\"?(\\w*)\"?\\s+version\\s+'(.*)'",
      "g"
    );
    const namePattern = new RegExp('library\\s+"?(\\w*)"?\\s+', "g");
    const nameAndVersionMatches = [...text.matchAll(nameAndVersionPattern)];
    const nameMatches = [...text.matchAll(namePattern)];
    if (nameAndVersionMatches && nameAndVersionMatches.length > 0) {
      return {
        libraryName: nameAndVersionMatches[0][1],
        libraryVersion: nameAndVersionMatches[0][2],
      };
    } else if (nameMatches && nameMatches.length > 0) {
      return {
        libraryName: nameMatches[0][1],
        libraryVersion: null,
      };
    }
    return null;
  };

  // Attempt to detect all parameters using regex
  const extractParams = async (file: File) => {
    const text: string = await file.text();
    const integerPattern = new RegExp(
      'define\\s*"(\\$.+)":\\s*([-]?\\d+)',
      "g"
    );
    const integerMatches = [...text.matchAll(integerPattern)];
    const booleanPattern = new RegExp(
      'define\\s*"(\\$.+)":\\s*(true|false)',
      "g"
    );
    const booleanMatches = [...text.matchAll(booleanPattern)];
    const stringPattern = new RegExp(
      "define\\s*\"(\\$.+)\":\\s*'([a-zA-Z0-9 _]*)'",
      "g"
    );
    const stringMatches = [...text.matchAll(stringPattern)];

    const foundParams: { [key: string]: ParameterProps } = {};
    integerMatches.forEach((match) => {
      const rawValue = match[2].trim();
      const paramName = match[1].trim();

      const parsedValue: ParameterProps = {
        type: "Integer",
        value: parseInt(rawValue, 10),
        default: parseInt(rawValue, 10),
      };
      foundParams[paramName] = parsedValue;
    });
    booleanMatches.forEach((match) => {
      const rawValue = match[2].trim();
      const paramName = match[1].trim();
      const parsedValue: ParameterProps = {
        type: "Boolean",
        value: rawValue === "true",
        default: rawValue === "true",
      };

      foundParams[paramName] = parsedValue;
    });
    stringMatches.forEach((match) => {
      const rawValue = match[2].trim();
      const paramName = match[1].trim();

      const parsedValue: ParameterProps = {
        type: "String",
        value: rawValue,
        default: rawValue,
      };
      foundParams[paramName] = parsedValue;
    });
    return foundParams;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a CQL file.");
      return;
    }
    const versionExpr = new RegExp(
      "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"
    );

    const versionValid: boolean = versionExpr.test(libraryVersion);
    if (versionValid)
      onSubmit(
        libraryName,
        libraryVersion,
        description,
        isEnabled,
        file,
        params
      );
    else {
      alert("Version string is not valid. Please use Major.Minor.build");
      return;
    }

    // Reset form fields after submission
    setLibraryName("");
    setLibraryVersion("");
    setDescription("");
    setIsEnabled(false);
    setLibraryNameAutomaticallySet(false);
    setLibraryVersionAutomaticallySet(false);
    setFile(null);
    setParams({});

    onClose(); // Close modal after form submission
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      extractParams(event.target.files[0]).then((extractedParams) =>
        setParams(extractedParams)
      );
      if (libraryName == null || libraryName.trim() === "") {
        extractLibraryName(event.target.files[0]).then(
          (libraryNameANdVersion) => {
            if (libraryNameANdVersion) {
              if (libraryNameANdVersion.libraryName) {
                setLibraryName(libraryNameANdVersion.libraryName);
                setLibraryNameAutomaticallySet(true);
              }
              if (libraryNameANdVersion.libraryVersion) {
                setLibraryVersion(libraryNameANdVersion.libraryVersion);
                setLibraryVersionAutomaticallySet(true);
              }
            }
          }
        );
      }
    } else {
      setFile(null);
      setParams({});
      if (libraryNameAutomaticallySet) {
        setLibraryName("");
      }
      if (libraryVersionAutomaticallySet) {
        setLibraryVersion("");
      }
    }
  };

  return (
    <React.Fragment>
      <ComposedModal
        open={isOpen}
        onClose={onClose}
        passiveModal={true}
        modalHeading="Upload a rule"
        modalLabel="Rule Management"
        primaryButtonText="Upload"
        secondaryButtonText="Cancel"
        onRequestClose={() => onClose()}
        onRequestSubmit={handleSubmit}
        closeButton={onClose}
        size="md"
      >
        <ModalBody>
          <Form>
            <TextInput
              id="libraryName"
              labelText="Library Name"
              value={libraryName}
              onChange={(e) => {
                setLibraryNameAutomaticallySet(false);
                return setLibraryName(e.target.value);
              }}
              required
            />
            <TextInput
              id="libraryVersion"
              labelText="Library Version"
              value={libraryVersion}
              onChange={(e) => {
                setLibraryVersionAutomaticallySet(false);
                return setLibraryVersion(e.target.value);
              }}
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
              onChange={(e) => {
                setIsEnabled(e.target.checked);
              }}
            />
            <FileUploader
              accept={[".cql"]}
              buttonKind="primary"
              filenameStatus={"edit"}
              filenameStatusText={file ? file.name : "No file chosen"}
              labelDescription="Click or drag and drop a cql file here"
              labelTitle="Upload CQL File"
              onChange={(event) => {
                handleFileChange(event);
              }}
              onDelete={(event) => {
                handleFileChange(event);
              }}
              required
            />

            {params && Object.keys(params).length > 0 && (
              <div>
                <h4>Detected Parameters</h4>
                <ContainedList>
                  {Object.keys(params).map((paramName) => {
                    return (
                      <ContainedListItem key={"Param-" + paramName}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            columnGap: "1rem",
                          }}
                        >
                          <span>{paramName}</span>
                          <span>{params[paramName].type + ""}</span>
                          <span>{params[paramName].value + ""}</span>
                        </div>
                      </ContainedListItem>
                    );
                  })}
                </ContainedList>
              </div>
            )}
          </Form>
        </ModalBody>
        <ModalFooter
          primaryButtonText="Upload"
          secondaryButtonText="Cancel"
          onRequestClose={() => onClose()}
          onRequestSubmit={(event) => handleSubmit(event)}
        />
      </ComposedModal>
    </React.Fragment>
  );
};

export default UploadRuleDialog;
export { ParameterProps };
