import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const CreateCourseHandler = async () => {
    if (!title || !category) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${serverUrl}/api/course/create`,
        {
          title,
          category,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);

      toast.success(data.message || "Course Created Successfully");

      setTitle("");
      setCategory("");

      navigate("/courses");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="relative w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
        <FaArrowLeftLong
          onClick={() => navigate("/courses")}
          className="absolute left-6 top-7 h-6 w-6 cursor-pointer"
        />

        <h1 className="mb-8 text-center text-3xl font-bold">
          Create Course
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block font-medium">
              Course Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Course Title"
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="AI">AI</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Programming">Programming</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button
            onClick={CreateCourseHandler}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-black py-3 text-white transition hover:bg-gray-900"
          >
            {loading ? (
              <ClipLoader size={25} color="white" />
            ) : (
              "Create Course"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;