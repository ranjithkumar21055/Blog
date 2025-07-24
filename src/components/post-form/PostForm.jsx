import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appWriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Custom dropdown component for images
const ImageDropdown = ({ images, onSelect, selectedId }) => {
  const [open, setOpen] = useState(false);

  const selectedImage = images.find((img) => img.$id === selectedId);

  return (
    <div className="relative mb-4 text-black">
      <button
        type="button"
        className="w-full border px-4 py-2 rounded-[10px] bg-white flex items-center justify-between"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedImage ? (
          <div className="flex items-center gap-2">
            <img
              src={appWriteService.getFilePreview(selectedImage.$id)}
              alt="Selected"
              className="w-8 h-8 object-cover rounded"
            />
            <span className="text-sm">{selectedImage.name}</span>
          </div>
        ) : (
          <span>Select an image</span>
        )}
        <span className="text-black-500">▼</span>
      </button>

      {open && (
        <ul className="absolute z-10 w-full bg-white border mt-1 max-h-64 overflow-y-auto rounded-[10px] shadow-md">
          {images.map((img) => (
            <li
              key={img.$id}
              onClick={() => {
                onSelect(img.$id);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={appWriteService.getFilePreview(img.$id)}
                alt={img.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="text-sm">{img.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, reset } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [imageOption, setImageOption] = useState("upload");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        slug: post.$id || "",
        content: post.content || "",
        status: post.status || "active",
      });
    }
  }, [post, reset]);

  useEffect(() => {
    if (imageOption === "select") {
      appWriteService.listFiles().then((res) => {
        setUploadedFiles(res.files || []);
      });
    }
  }, [imageOption]);

  // manually register featuredImage for react-hook-form when using custom dropdown
  useEffect(() => {
    register("featuredImage", { required: imageOption === "select" });
  }, [register, imageOption]);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 36);
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data) => {
    try {
      if (post) {
        const file =
          data.image && data.image[0]
            ? await appWriteService.uploadFile(data.image[0])
            : null;

        let updatedData = { ...data };
        if (file) {
          await appWriteService.deleteFile(post.featuredImage);
          updatedData.featuredImage = file.$id;
          setValue("featuredImage", file.$id);
        }

        const dbPost = await appWriteService.updatePost(post.$id, updatedData);
        if (dbPost) {
          navigate(`/post/${dbPost.slug}`);
        }
      } else {
        const file =
          data.image && data.image[0]
            ? await appWriteService.uploadFile(data.image[0])
            : null;

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;
          setValue("featuredImage", fileId);
          const dbPost = await appWriteService.createPost({
            ...data,
            userId: userData.$id,
          });
          if (dbPost) {
            navigate(`/post/${dbPost.slug}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <div className="mb-2">
          <label className="mr-2">
            <input
              type="radio"
              value="upload"
              checked={imageOption === "upload"}
              onChange={() => setImageOption("upload")}
            />
            Upload New Image
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="select"
              checked={imageOption === "select"}
              onChange={() => setImageOption("select")}
            />
            Select Existing Image
          </label>
        </div>

        {imageOption === "upload" ? (
          <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", {
              required: !post && imageOption === "upload",
            })}
          />
        ) : (
          <ImageDropdown
            images={uploadedFiles}
            selectedId={getValues("featuredImage")}
            onSelect={(id) => setValue("featuredImage", id)}
          />
        )}

        {post && post.featuredImage && imageOption === "upload" && (
          <div className="w-full mb-4">
            <img
              src={appWriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
