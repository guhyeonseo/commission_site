import { useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import apiClient from "../../../services/apiClient";

export default function useTiptapEditor() {
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(14);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post(
      "/commissions/upload",
      formData
    );

    return "http://localhost:8484" + res.data;
  };

  const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
      return {
        types: ["textStyle"],
      };
    },

    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            fontSize: {
              default: null,
              parseHTML: (element) =>
                element.style.fontSize?.replace(/['"]+/g, ""),
              renderHTML: (attributes) => {
                if (!attributes.fontSize) {
                  return {};
                }

                return {
                  style: `font-size: ${attributes.fontSize}`,
                };
              },
            },
          },
        },
      ];
    },

    addCommands() {
      return {
        setFontSize:
          (fontSize) =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontSize })
              .run();
          },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: "<p>내용을 입력하세요...</p>",

    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },

    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;

        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith("image")) {
            const file = item.getAsFile();

            uploadImage(file).then((url) => {
              editor.chain().focus().setImage({ src: url }).run();
            });

            return true;
          }
        }

        return false;
      },

      handleDrop(view, event) {
        const files = event.dataTransfer?.files;

        if (files && files[0]) {
          uploadImage(files[0]).then((url) => {
            editor.chain().focus().setImage({ src: url }).run();
          });

          return true;
        }

        return false;
      },
    },
  });

  const handleEditorImage = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];

      if (!file) return;

      try {
        const url = await uploadImage(file);

        editor
          .chain()
          .focus()
          .setImage({ src: url })
          .run();
      } catch (err) {
        console.error(err);
        alert("이미지 업로드 실패");
      }
    };
  };

  return {
    editor,
    content,
    fontSize,
    setFontSize,
    handleEditorImage,
  };
}