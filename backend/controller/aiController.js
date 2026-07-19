import { GoogleGenAI } from "@google/genai";
import Course from "../model/courseModel.js";



export const searchWithAi = async(req,res)=>{


    try{


        const {input}=req.body;



        if(!input){

            return res.status(400).json({

                success:false,
                message:"Search query is required"

            });

        }




        const safeInput =
        input.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );



        const CATEGORY_KEYWORDS=[

            "App Development",
            "AI/ML",
            "AI Tools",
            "Data Science",
            "Data Analytics",
            "Ethical Hacking",
            "UI UX Designing",
            "Web Development",
            "Others",
            "Beginner",
            "Intermediate",
            "Advanced"

        ];



        let keyword=input;



        try{


            const ai =
            new GoogleGenAI({

                apiKey:
                process.env.GEMINI_API_KEY

            });



            const prompt=`

You are an LMS search assistant.

Return only one keyword from:

${CATEGORY_KEYWORDS.join(",")}

User query:
${input}

`;



            const response =
            await ai.models.generateContent({

                model:"gemini-2.5-flash",

                contents:prompt

            });



            keyword =
            response.text.trim();



        }
        catch(error){


            console.log(
                "Gemini failed, using fallback"
            );


        }




        const courses =
        await Course.find({

            isPublished:true,

            $or:[

                {
                    title:{
                        $regex:safeInput,
                        $options:"i"
                    }
                },

                {
                    category:{
                        $regex:keyword,
                        $options:"i"
                    }
                },

                {
                    level:{
                        $regex:keyword,
                        $options:"i"
                    }
                }

            ]

        })
        .populate(
            "creator",
            "name photoUrl"
        );



        return res.status(200).json({

            success:true,

            courses

        });



    }
    catch(error){


        console.log(
            "AI Search Error:",
            error.message
        );


        return res.status(500).json({

            success:false,

            message:"AI search failed"

        });


    }

};