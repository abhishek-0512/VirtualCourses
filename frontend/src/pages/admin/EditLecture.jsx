import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";


function EditLecture() {

  const [loading,setLoading] = useState(false);
  const [loading1,setLoading1] = useState(false);

  const {courseId, lectureId} = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  const {lectureData} = useSelector(
    state=>state.lecture
  );


  const selectedLecture = lectureData.find(
    lecture => lecture._id === lectureId
  );


  const [lectureTitle,setLectureTitle] = useState(
    selectedLecture?.lectureTitle || ""
  );

  const [videoUrl,setVideoUrl] = useState(null);

  const [isPreviewFree,setIsPreviewFree] = useState(
    selectedLecture?.isPreviewFree || false
  );



  // UPDATE LECTURE

  const editLecture = async()=>{

    setLoading(true);


    try{

      const formData = new FormData();

      formData.append(
        "lectureTitle",
        lectureTitle
      );


      if(videoUrl){
        formData.append(
          "videoUrl",
          videoUrl
        );
      }


      formData.append(
        "isPreviewFree",
        isPreviewFree
      );



      const {data} = await axios.put(

        `${serverUrl}/api/lecture/${lectureId}`,

        formData,

        {
          withCredentials:true
        }

      );



      const updatedLectures = lectureData.map(
        (lecture)=>
          lecture._id === lectureId
          ?
          data.lecture
          :
          lecture
      );



      dispatch(
        setLectureData(updatedLectures)
      );


      toast.success(
        "Lecture Updated"
      );


      navigate(
        `/createlecture/${courseId}`
      );



    }catch(error){

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Lecture update failed"
      );


    }finally{

      setLoading(false);

    }

  };




  // DELETE LECTURE

  const removeLecture = async()=>{

    setLoading1(true);


    try{


      await axios.delete(

        `${serverUrl}/api/lecture/${lectureId}`,

        {
          withCredentials:true
        }

      );



      const updatedLectures =
        lectureData.filter(
          lecture=>lecture._id !== lectureId
        );



      dispatch(
        setLectureData(updatedLectures)
      );



      toast.success(
        "Lecture Removed"
      );



      navigate(
        `/createlecture/${courseId}`
      );



    }catch(error){

      console.log(error);

      toast.error(
        "Lecture remove error"
      );


    }finally{

      setLoading1(false);

    }


  };





  return (

<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

<div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">


<div className="flex items-center gap-2 mb-2">

<FaArrowLeft
className="text-gray-600 cursor-pointer"
onClick={()=>navigate(`/createlecture/${courseId}`)}
/>


<h2 className="text-xl font-semibold text-gray-800">
Update Your Lecture
</h2>


</div>



<button
className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
disabled={loading1}
onClick={removeLecture}
>

{
loading1
?
<ClipLoader size={25} color="white"/>
:
"Remove Lecture"
}

</button>




<div className="space-y-4">


<div>

<label className="block text-sm font-medium">
Title
</label>


<input

type="text"

className="w-full p-3 border rounded-md"

onChange={(e)=>setLectureTitle(e.target.value)}

value={lectureTitle}

/>


</div>




<div>

<label className="block text-sm font-medium">
Video
</label>


<input

type="file"

accept="video/*"

className="w-full border p-2"

onChange={(e)=>setVideoUrl(e.target.files[0])}

/>


</div>




<div className="flex items-center gap-3">


<input

type="checkbox"

checked={isPreviewFree}

onChange={()=>
setIsPreviewFree(prev=>!prev)
}

/>


<label>
Is this video FREE
</label>


</div>



</div>



<button

className="w-full bg-black text-white py-3 rounded-md"

disabled={loading}

onClick={editLecture}

>


{
loading
?
<ClipLoader size={30} color="white"/>
:
"Update Lecture"
}


</button>



</div>

</div>

  );

}


export default EditLecture;