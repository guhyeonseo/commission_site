import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

export default function useTiptapEditor(
  uploadImageApi,
  initialContent = "<p>내용을 입력하세요...</p>"
) {
  const [content, setContent] = useState(initialContent);
  const [fontSize, setFontSize] = useState(14);

  const uploadImage = (file) => uploadImageApi(file);

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

    content: initialContent,

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

  // 수정 페이지에서 기존 내용을 에디터에 표시
  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== initialContent) {
      editor.commands.setContent(
        initialContent || "<p>내용을 입력하세요...</p>"
      );

      setContent(
        initialContent || "<p>내용을 입력하세요...</p>"
      );
    }
  }, [editor, initialContent]);

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