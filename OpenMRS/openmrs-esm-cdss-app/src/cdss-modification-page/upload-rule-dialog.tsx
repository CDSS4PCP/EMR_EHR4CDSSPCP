import React, { useRef, useState } from "react";
import {
  Modal,
  ModalBody,
  TextInput,
  FileUploader,
  Checkbox,
  Form,
  FormGroup,
  SelectItem,
  Select,
  IconButton,
  ComposedModal,
  ModalHeader,
  ModalFooter,
} from "@carbon/react";
import { Subtract, Add, Close } from "@carbon/react/icons";

interface ParameterProps {
  // onChange: (index: number, key: keyof Variable, value: string) => void;
  onRemove: (index: number) => void;
  index: number;
}

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

const ParameterInput: React.FC<ParameterProps> = ({ index, onRemove }) => {
  const [paramId, setParamId] = useState<string>("");

  return (
    <div style={{ borderStyle: "solid", borderWidth: "2px", padding: "10px" }}>
      <Form>
        <IconButton
          hasIconOnly
          onClick={() => {
            onRemove(index);
          }}
        >
          <Subtract></Subtract>
        </IconButton>
        <FormGroup>
          <TextInput
            id={"parameterInput-id-" + index}
            labelText="Parameter Name"
            value={paramId}
            required={true}
            onChange={(e) => setParamId(e.target.value)}
          />
          <Select id="type" labelText="Type" required={true}>
            <SelectItem text={"String"} value="String">
              String
            </SelectItem>
            <SelectItem text={"Integer"} value="Number">
              Integer
            </SelectItem>
            <SelectItem text={"Boolean"} value="Boolean">
              Boolean
            </SelectItem>
          </Select>
          <TextInput
            id="defaultValue"
            labelText="Default Value"
            required={true}
          />
        </FormGroup>
      </Form>
    </div>
  );
};

const UploadRuleDialog: React.FC<UploadRuleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [libraryName, setLibraryName] = useState("");
  const [libraryVersion, setLibraryVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parameterComponents, setParameterComponents] = useState<
    React.ReactNode[]
  >([]);

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
    } else {
      setFile(null);
    }
  };

  const handleRemove = (index) => {
    setParameterComponents((parameterComponents) =>
      parameterComponents.filter((_, i) => {
        return i !== index + 1;
      })
    );
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
        <ModalHeader></ModalHeader>
        <ModalBody>
          {/*<div>*/}
          {/*  <h4>Upload a Rule</h4>*/}
          {/*</div>*/}
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

            <Checkbox
              id="advanced"
              labelText="Advanced"
              checked={isAdvancedOpen}
              onChange={(e) => {
                setAdvancedOpen(e.target.checked);
              }}
            />
            {isAdvancedOpen && (
              <div>
                <FormGroup legendText="Parameters">
                  <IconButton
                    onClick={() => {
                      const index = parameterComponents.length;
                      console.log(parameterComponents.length);
                      const component = (
                        <ParameterInput
                          index={index}
                          onRemove={handleRemove}
                        ></ParameterInput>
                      );
                      setParameterComponents((parameterComponents) => [
                        ...parameterComponents,
                        component,
                      ]);
                    }}
                  >
                    <Add></Add>
                  </IconButton>
                  {parameterComponents.map((c) => c)}
                </FormGroup>
              </div>
            )}
          </Form>
        </ModalBody>
        <ModalFooter primaryButtonText="Upload" secondaryButtonText="Cancel" />
      </ComposedModal>
    </React.Fragment>
  );
};

export default UploadRuleDialog;
