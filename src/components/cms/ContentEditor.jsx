import React, { use, useEffect, useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  PencilIcon,
  TrashIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ReactImageUploading from "react-images-uploading";
import api from "../../utils/axios";
import { useAddAuditLog } from "../admin/UseAddAuditLog";
import toast from "react-hot-toast";
import ConfirmationDialog from "../admin/ConfirmationDialog";
import Placeholder from "@tiptap/extension-placeholder";
import { set } from "react-hook-form";

const ContentEditor = ({
  editingData,
  handleFileChange,
  handleTitleChange,
  handleDescriptionChange,
  handleSubmit,
  type,
  handleBackAfterSubmitForm,
  issueId,
  user,
  sectionsNewsletterByMonth,
}) => {
  const [isOverride, setIsOverride] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState([]);
  const maxNumber = 10;

  const [title, setTitle] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [section, setSection] = useState("");
  const [article, setArticle] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Click here to start writing...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleDescriptionChange(html);
      setArticle(html);
      checkArticleLength(editor.getText());
    },
  });

  if (!editor) {
    return null;
  }
  const handleTitleOnChange = (e) => {
    const value = e.target.value;
    const text = `${value}`;
    handleTitleChange(text);
  };

  const handleFileOnChange = (e) => {
    handleFileChange(e);
  };

  //IMAGE UPLOADING

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);

    setImages(imageList);
  };

  const addLog = useAddAuditLog();

  const uploadimages = async (e) => {
    e.preventDefault();
    try {
      for (var a = 0; a < images.length; a++) {
        const formData = new FormData();
        formData.append("image", images[a]["file"]);

        // UPLOAD newsletter IMAGEs
        const uploadResponse = await api.post(
          "/api/upload-image/newsletters",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // SET CLOUDINARY IMAGE URL TO TESTIMONIAL DETAILS
        testimonialDetails.employeeImageUrl = uploadResponse.data.imageUrl;

        // ADD to db
        response = await api.post("/api/testimonials", {
          ...testimonialDetails,
          userId: user.id,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Something went wrong. Please try again.");
    }

    //LOG
    // addLog({
    //   action: "CREATE",
    //   description: `A new testimonial has been added`,
    // });
  };
  const [articleLength, setArticleLength] = useState(0);

  const [toBeDeletedImageUrls, setToBeDeletedImageUrls] = useState([]);
  const [toBeAddedImagesFile, setToBeAddedImagesFile] = useState([]);

  useEffect(() => {
    console.log("editingData ETOOO BOIII", editingData);
  }, []);

  useEffect(() => {
    if (editingData) {
      setTitle(editingData.title || "");
      setPseudonym(editingData.pseudonym || "");
      setSection(editingData.section || 0);
      setImages(editingData.images || []);
      setArticle(editingData.article || "");
      editor.commands.setContent(editingData.article || "");
    }
  }, [editingData]);

  const resetForm = () => {
    setTitle("");
    setPseudonym("");
    setSection("");
    setImages([]);
    setArticle("");
    editor?.commands.setContent("");
    setArticleLength(0);
    setToBeAddedImagesFile([]);
    setToBeDeletedImageUrls([]);
  };
  function checkArticleLength(articleText) {
    if (typeof articleText !== "string") return false;

    // Strip HTML tags
    const plainText = articleText
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = plainText === "" ? 0 : plainText.split(" ").length;

    setArticleLength(wordCount);
    return wordCount < 150;
  }

  useEffect(() => {
    if (toBeAddedImagesFile.length > 0) {
      console.log("tobeaddedimagesfile", toBeAddedImagesFile);
    }
  }, [toBeAddedImagesFile]);

  const submitNewsletter = async (isOverride = false) => {
    setIsLoading(true);

    if (editingData && editingData.newsletterId) {
      //UPDATE DITOOOOO STARTT
      console.log("EDIIIIIT SUBMIIIIT");
      console.log("editingData", editingData);
      console.log("images", images);
      console.log("tobedeleted", toBeDeletedImageUrls);
      const filesToAdd = [];
      for (let image of images) {
        if (typeof image === "object" && image.file instanceof File) {
          filesToAdd.push(image.file);
        }
      }
      setToBeAddedImagesFile(filesToAdd);
      let uploadedImageUrlsForUpdate = [];
      if (filesToAdd.length > 0) {
        const uploadImagePromises = images.map((image) => {
          const formData = new FormData();
          formData.append("file", image.file);

          return api
            .post("/api/upload-image/newsletter", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                timeout: 30000,
              },
            })
            .then((response) => {
              setCurrentImageIndex((prevIndex) => prevIndex + 1);
              return response.data.imageUrl;
            })
            .catch((error) => {
              setCurrentImageIndex(0);
              console.error("Failed to upload image:", error);
              toast.error("Failed to upload images. Please try again.");
              setIsLoading(false);
              throw error;
            });
        });

        try {
          const uploadResponses = await Promise.all(uploadImagePromises);
          const isValidUrl = (url) =>
            /^https:\/\/res\.cloudinary\.com\/.+\.(webp|jpg|jpeg|png|heic)$/.test(
              url
            );

          const uniqueUrls = Array.from(new Set(uploadResponses));
          uploadedImageUrlsForUpdate = uniqueUrls.filter(isValidUrl);

          if (uploadedImageUrlsForUpdate.length === 0) {
            toast.error("All uploaded images are invalid or duplicate.");
            setIsLoading(false);
            return;
          }
        } catch (error) {
          setIsLoading(false);
          return;
        }
      }

      if (uploadedImageUrlsForUpdate.length > 0) {
        try {
          await api.post(
            "/api/newsletterImages",
            {
              newsletterId: editingData.newsletterId,
              images: uploadedImageUrlsForUpdate,
            },
            { timeout: 30000 }
          );
        } catch (error) {
          console.error("Failed to upload image:", error);
          toast.error("Failed to upload images. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      if (toBeDeletedImageUrls.length > 0) {
        try {
          for (let imageUrl of toBeDeletedImageUrls) {
            await api.delete("/api/delete-newsletter-by-imageurl", {
              data: { image_url: imageUrl },
            });
          }
        } catch (error) {
          console.error("Failed to delete image:", error);
          toast.error("Failed to delete images. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      try {
        await api.put("/api/newsletter", {
          newsletterId: editingData.newsletterId,
          title,
          pseudonym,
          section,
          article,
          userId: user.id,
          issueId,
        });
        toast.success("Article updated successfully!");
        addLog({
          action: "UPDATE",
          description: `Article "${editingData.title}" has been updated`,
        });

        handleBackAfterSubmitForm();
        resetForm();
      } catch (error) {
        console.error("Failed to update article:", error);
        toast.error("Failed to update article. Please try again.");
      } finally {
        setIsLoading(false);
      }

      //END NG EDITT DIITOOOOOO
    } else {
      //ADDING DITOOOOOO STARTT
      let uploadedImageUrls = [];
      console.log("images", images);
      if (images.length > 0) {
        setTotalImages(images.length);
        const uploadImagePromises = images.map((image) => {
          const formData = new FormData();
          formData.append("file", image.file);

          return api
            .post("/api/upload-image/newsletter", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                timeout: 30000,
              },
            })
            .then((response) => {
              setCurrentImageIndex((prevIndex) => prevIndex + 1);
              return response.data.imageUrl;
            })
            .catch((error) => {
              setCurrentImageIndex(0);
              console.error("Failed to upload image:", error);
              toast.error("Failed to upload images. Please try again.");
              setIsLoading(false);
              throw error;
            });
        });

        try {
          const uploadResponses = await Promise.all(uploadImagePromises);
          const isValidUrl = (url) =>
            /^https:\/\/res\.cloudinary\.com\/.+\.(webp|jpg|jpeg|png|heic)$/.test(
              url
            );

          const uniqueUrls = Array.from(new Set(uploadResponses));
          uploadedImageUrls = uniqueUrls.filter(isValidUrl);

          if (uploadedImageUrls.length === 0) {
            toast.error("All uploaded images are invalid or duplicate.");
            setIsLoading(false);
            return;
          }
        } catch (error) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await api.post("/api/newsletter", {
          title,
          pseudonym,
          section,
          article,
          images: uploadedImageUrls,
          userId: user.id,
          issueId,
          isOverride,
        });

        const newsletterId = response.data?.newsletterId;

        if (newsletterId && uploadedImageUrls.length > 0) {
          await api.post(
            "/api/newsletterImages",
            { newsletterId, images: uploadedImageUrls },
            { timeout: 30000 }
          );
        }

        addLog({
          action: "CREATE",
          description: `A new article has been added`,
        });

        toast.success("Article saved successfully!");
        handleBackAfterSubmitForm();
        resetForm();
      } catch (error) {
        console.error("Failed to save article:", error);
        toast.error("Failed to save article. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitNewsletter = async (e) => {
    e.preventDefault();

    if (section === "1" && images.length === 0) {
      toast.error("At least one image is required for Section 1.");
      return;
    }
    if (!article) {
      toast.error("Please write the content of the article.");
      setIsLoading(false);
      return;
    }

    if (checkArticleLength(article)) {
      toast.error("Article must be at least 150 words.");
      setIsLoading(false);
      return;
    }

    if (sectionsNewsletterByMonth.includes(Number(section))) {
      setIsOverrideModalOpen(true);
      return;
    }

    await submitNewsletter(false);
  };

  return (
    <div>
      {type === "newsletter" ? (
        // START DITOOOOOOO NEWSLETTER FORM
        <div>
          <form onSubmit={handleSubmitNewsletter} className="space-y-4">
            {" "}
            <label className="block mb-4">
              <span className="text-primary text-sm ">Section</span>
              <select
                required
                className="border border-gray-400 focus:border-primary outline-none p-2 font-avenir-black w-full rounded-md mt-1"
                onChange={(e) => {
                  setSection(Number(e.target.value));
                }}
                value={section}
              >
                <option value="" disabled hidden>
                  Select a section
                </option>
                <option value={0}>Assign later</option>
                {[...Array(7)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Section {index + 1}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-primary text-sm">Title</span>
              <input
                required
                type="text"
                className="border border-gray-400 focus:border-primary outline-none p-2 font-avenir-black w-full rounded-md mb-4"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
                placeholder="Write the title here"
              />
            </label>
            <label className="">
              <span className="text-primary text-sm">Author</span>
              <input
                required
                type="text"
                className="border border-gray-400 focus:border-primary outline-none p-2 font-avenir-roman w-full rounded-md mb-4"
                onChange={(e) => {
                  setPseudonym(e.target.value);
                }}
                value={pseudonym}
                placeholder="Write the pen name (pseudonym) here"
              />
            </label>
            <span className="text-primary text-sm ">
              Photos{" "}
              <span className=" text-xs text-gray-400 font-avenir-roman-oblique ">
                Optional — but required for the main article (Section 1)
              </span>
            </span>
            <ReactImageUploading
              allowNonImageTypes={false}
              acceptType={["jpg", "png", "jpeg", "webp", "heic"]}
              maxFileSize={10 * 1024 * 1024} // 10MB lang max size or what
              name="images"
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              onError={(errors, files) => {
                if (errors.maxNumber) {
                  toast.error("Maximum of 10 images allowed");
                }
                if (errors.acceptType) {
                  toast.error(
                    "Only jpg, png, jpeg, webp, heic formats are allowed"
                  );
                }
                if (errors.maxFileSize) {
                  toast.error("Maximum file size is 10MB");
                }
              }}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`group w-full  h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition hover:border-primary ${
                      isDragging
                        ? "border-primary bg-primary/15"
                        : "border-gray-400 bg-white"
                    } `}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <p
                      className={`font-avenir-roman  ${
                        isDragging ? "text-primary/50" : "text-gray-400"
                      } `}
                    >
                      {" "}
                      {isDragging
                        ? "Drop images here..."
                        : "Click or drag images here to upload"}
                    </p>
                  </div>
                  {imageList.length > 0 && (
                    <button
                      type="button"
                      className="mt-4 text-sm text-red-700 hover:underline cursor-pointer"
                      onClick={() => {
                        setToBeDeletedImageUrls(images);
                        onImageRemoveAll();
                      }}
                    >
                      Remove All Images
                    </button>
                  )}
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-5xl mt-6">
                    {imageList.map((image, index) => {
                      const imageUrl = image.data_url || image;

                      return (
                        <div
                          key={index}
                          className="relative group rounded overflow-hidden shadow-md aspect-square bg-gray-100"
                        >
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onImageUpdate(index);
                              }}
                              className="bg-white p-2 rounded-full hover:bg-gray-200"
                            >
                              <PencilIcon className="h-5 w-5 text-gray-800" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onImageRemove(index);
                                if (editingData) {
                                  setToBeDeletedImageUrls((prev) => [
                                    ...prev,
                                    imageUrl,
                                  ]);
                                }
                              }}
                              className="bg-white p-2 rounded-full hover:bg-gray-200"
                            >
                              <TrashIcon className="h-5 w-5 text-gray-800" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </ReactImageUploading>
            {/* <input
                type="file"
                accept="image/*"
                onChange={handleFileOnChange}
                className="border border-gray-400 focus:border-primary mb-4 outline-none p-2 rounded w-full "
                multiple
              /> */}
            <label className="text-sm text-primary ">
              Write the article below
            </label>
            <div className="flex gap-3 mb-2 mt-3 place-items-center">
              <BoldIcon
                className="size-5 cursor-pointer"
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
              <ItalicIcon
                className="size-5 cursor-pointer"
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
              <UnderlineIcon
                className="size-5 cursor-pointer"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
              <ListBulletIcon
                className="size-6 cursor-pointer"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
              <NumberedListIcon
                className="size-5 cursor-pointer"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </div>
            <div className="border border-gray-400 focus-within:border-primary outline-none p-2 min-h-50 rounded  bg-[--color-accent-1] text-[--color-dark]">
              <EditorContent
                editor={editor}
                className="is-editor-empty:before:content-[attr(data-placeholder)] font-avenir w-full
                          [&_ul]:list-disc [&_ul]:pl-6
                          [&_ol]:list-decimal [&_ol]:pl-6
                          [&_em]:font-inherit
                          [&_strong]:font-avenir-black
                          [&_strong_em]:font-inherit
                          [&_em_strong]:font-inherit"
              />
            </div>
            <p className="text-right text-gray-500 text-sm">
              {articleLength} words
            </p>
            <section className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary p-3 mt-10 rounded-md cursor-pointer w-full mx-auto text-white font-avenir-black disabled:opacity-50"
              >
                {isLoading && totalImages > 0 ? (
                  <p>
                    Uploading {currentImageIndex} of {totalImages} images...
                  </p>
                ) : isLoading ? (
                  "Saving..."
                ) : editingData ? (
                  <p>Save Changes to this Article</p>
                ) : (
                  "Save this Article"
                )}
              </button>
            </section>
            {/* <section className="flex justify-center">
              <button className=" rounded-md cursor-pointer mx-auto text-primary font-avenir-black" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </section> */}
          </form>
          <ConfirmationDialog
            open={isOverrideModalOpen}
            onClose={() => setIsOverrideModalOpen(false)}
            onConfirm={async () => {
              setIsOverrideModalOpen(false);
              await submitNewsletter(true);
            }}
            title={`Replace existing article in Section ${section}?`}
            description={`The current article in Section ${section} will be unassigned. You can reassign it to a different section later if needed.`}
            confirmLabel="Continue"
            cancelBtnClass="p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-200 duration-500 text-gray-700"
            confirmBtnClass="p-2 px-4 cursor-pointer rounded-lg bg-red-700 hover:bg-red-800 duration-500 text-white"
          />
        </div>
      ) : (
        // END NA DITOOO FORMMMM FOR NEWSLETTER
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileOnChange}
            className="border p-2 rounded w-full "
            multiple
          />

          <input
            type="text"
            className="border p-2 font-avenir-black w-full rounded-md"
            onChange={handleTitleOnChange}
            style={{
              fontSize: "1.17em",
              margin: "0.75em 0",
            }}
            placeholder="Write your title here"
          />
          <div className="flex gap-3 mb-2 place-items-center">
            <BoldIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ItalicIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <UnderlineIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ListBulletIcon
              className="size-6 cursor-pointer"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <NumberedListIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </div>
          <EditorContent
            editor={editor}
            className="border p-2 rounded bg-[--color-accent-1] text-[--color-dark] 
             font-avenir
             [&_ul]:list-disc [&_ul]:pl-6 
             [&_ol]:list-decimal [&_ol]:pl-6
             [&_em]:font-inherit
             [&_strong]:font-avenir-black
             [&_strong_em]:font-inherit
             [&_em_strong]:font-inherit"
          />

          <section className="flex justify-center">
            <button className="bg-primary p-3 rounded-md cursor-pointer w-full mx-auto text-white font-avenir-black">
              Publish
            </button>
          </section>
        </form>
      )}
    </div>
  );
};

export default ContentEditor;
