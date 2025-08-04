import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import parse from "html-react-parser";

interface TinyEditorProps {
  handleChange: (content: string) => void;
  initialContent?: string;
  value?: string;
}

export interface TinyEditorRef {
  clearContent: () => void;
  getContent: () => string;
}

const TinyEditor = forwardRef<TinyEditorRef, TinyEditorProps>(({ handleChange, initialContent, value }, ref) => {
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    clearContent: () => {
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
    },
    getContent: () => {
      return editorRef.current ? editorRef.current.getContent() : "";
    },
  }));

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentContent = editorRef.current.getContent();
      if (currentContent !== value) {
        editorRef.current.setContent(value);
      }
    }
  }, [value]);

  return (
    <Editor
      onInit={(evt: any, editor: any) => {
        editorRef.current = editor;
      }}
      initialValue={parse(initialContent ?? "") as string}
      onChange={(e: any) => handleChange(e.target.getContent())}
      apiKey={process.env.TINYMCE_API_KEY}
      init={{
        placeholder: "Type your message here...",
        height: 200,
        menubar: "insert view",
        // plugins: [
        //   "insert advlist autolink lists link image charmap print preview anchor codesample",
        //   "searchreplace visualblocks code fullscreen",
        //   "insertdatetime media table paste code help wordcount autolink",
        // ],
        toolbar:
          "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link unlink image media | codesample | searchreplace visualblocks code fullscreen | insertdatetime table | help wordcount",
        content_style: "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
        codesample_languages: [
          { text: "HTML/XML", value: "markup" },
          { text: "JavaScript", value: "javascript" },
          { text: "CSS", value: "css" },
        ],
      }}
    />
  );
});

TinyEditor.displayName = "TinyEditor";

export default TinyEditor;
