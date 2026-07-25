import "dotenv/config";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import Course from "./model/courseModel.js";
import Lecture from "./model/lectureModel.js";
import User from "./model/userModel.js";

// Reliable sample video URLs with clean, working stereo audio tracks
const AUDIO_VIDEOS = {
  sample1: "https://www.w3schools.com/html/mov_bbb.mp4",
  sample2: "https://res.cloudinary.com/demo/video/upload/v1688562300/samples/cld-sample-video.mp4",
  sample3: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  sample4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
};

const coursesData = [
  {
    title: "Full-Stack Web Development Bootcamp (MERN)",
    subTitle: "Master MongoDB, Express, React, and Node.js from scratch.",
    description: "Learn modern full-stack web development building real-world applications with state management, REST APIs, and database integration.",
    category: "Web Development",
    level: "Beginner",
    price: 499,
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. HTML5 & Semantic Web Standards", desc: "Understand page layouts, accessibility, and semantically correct elements.", video: AUDIO_VIDEOS.sample1, free: true },
      { title: "2. Modern CSS3, Flexbox & Grid", desc: "Master responsive layout design without external libraries.", video: AUDIO_VIDEOS.sample2, free: false },
      { title: "3. JavaScript ES6+ Core Principles", desc: "Arrow functions, destructuring, promises, and async/await.", video: AUDIO_VIDEOS.sample3, free: false },
    ],
  },
  {
    title: "Python for Data Science & Machine Learning",
    subTitle: "Analyze data, build models, and deploy machine learning pipelines.",
    description: "Comprehensive guide to NumPy, Pandas, Matplotlib, Scikit-Learn, and building predictive AI models.",
    category: "Data Science",
    level: "Intermediate",
    price: 599,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Python Data Structures for Analytics", desc: "Lists, dictionaries, list comprehensions, and functional methods.", video: AUDIO_VIDEOS.sample2, free: true },
      { title: "2. Data Wrangling with Pandas", desc: "Cleaning messy datasets, aggregations, and merging dataframes.", video: AUDIO_VIDEOS.sample1, free: false },
    ],
  },
  {
    title: "Complete Mobile App Development with React Native",
    subTitle: "Build cross-platform mobile apps for iOS and Android.",
    description: "Learn React Native core components, native navigation, state hooks, and device storage integration.",
    category: "App Development",
    level: "Beginner",
    price: 399,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. React Native Architecture & Setup", desc: "Configuring Metro bundler, Android Studio, and iOS Simulators.", video: AUDIO_VIDEOS.sample1, free: true },
      { title: "2. Navigation & Component Lifecycle", desc: "Stack, Tab, and Drawer navigators in React Navigation 6.", video: AUDIO_VIDEOS.sample3, free: false },
    ],
  },
  {
    title: "Practical Cyber Security & Ethical Hacking",
    subTitle: "Network security, penetration testing, and ethical exploit analysis.",
    description: "Understand system vulnerabilities, Wireshark packet capture, network scanning, and securing Web APIs.",
    category: "Ethical Hacking",
    level: "Intermediate",
    price: 699,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Network Protocols & Wireshark Fundamentals", desc: "Inspecting TCP/IP handshakes, DNS packets, and HTTP payloads.", video: AUDIO_VIDEOS.sample3, free: true },
      { title: "2. Reconnaissance & Nmap Port Scanning", desc: "Target discovery, OS detection, and service enumeration.", video: AUDIO_VIDEOS.sample4, free: false },
    ],
  },
  {
    title: "Generative AI Engineering & Prompt Mastery",
    subTitle: "Harness LLMs, OpenAI API, and Gemini AI for software products.",
    description: "Master prompt structuring, context windows, API integrations, and AI workflow automation.",
    category: "AI Tools",
    level: "Beginner",
    price: 299,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Prompt Frameworks & System Role Design", desc: "Designing structured system prompts for predictable JSON output.", video: AUDIO_VIDEOS.sample1, free: true },
      { title: "2. Streaming AI Responses with Node.js", desc: "Setting up server-sent events (SSE) with Google Gemini API.", video: AUDIO_VIDEOS.sample2, free: false },
    ],
  },
  {
    title: "UI/UX Design Essentials with Figma",
    subTitle: "Design intuitive interfaces, high-fidelity prototypes, and design systems.",
    description: "Learn wireframing, color theory, typography, component auto-layout, and interactive prototypes in Figma.",
    category: "UI UX Designing",
    level: "Beginner",
    price: 349,
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Figma Interface & Auto-Layout Masterclass", desc: "Building responsive components with padding and flex properties.", video: AUDIO_VIDEOS.sample4, free: true },
      { title: "2. Creating Design Tokens & Variants", desc: "Organizing color palettes, typography styles, and UI libraries.", video: AUDIO_VIDEOS.sample1, free: false },
    ],
  },
  {
    title: "Mastering Data Analytics with SQL & PowerBI",
    subTitle: "Transform raw data into interactive business dashboards.",
    description: "Master complex SQL joins, aggregations, CTEs, and import queries directly into PowerBI dashboards.",
    category: "Data Analytics",
    level: "Intermediate",
    price: 449,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Advanced SQL Joins & Subqueries", desc: "INNER, LEFT, RIGHT, FULL joins and window functions.", video: AUDIO_VIDEOS.sample2, free: true },
      { title: "2. Building Executive Dashboards in PowerBI", desc: "Creating measures using DAX and setting up interactive filters.", video: AUDIO_VIDEOS.sample3, free: false },
    ],
  },
  {
    title: "Node.js Microservices & System Design",
    subTitle: "Build scalable REST APIs, microservices, and distributed backend systems.",
    description: "Deep dive into Express routes, JWT auth, MongoDB aggregations, Redis caching, and Docker containers.",
    category: "Web Development",
    level: "Advanced",
    price: 649,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. RESTful API Architecture & Middleware Pattern", desc: "Designing maintainable controller layers and standard responses.", video: AUDIO_VIDEOS.sample1, free: true },
      { title: "2. Redis Caching & Database Optimization", desc: "Implementing cache-aside pattern to reduce DB load.", video: AUDIO_VIDEOS.sample4, free: false },
    ],
  },
  {
    title: "Deep Learning & Neural Networks with PyTorch",
    subTitle: "Train artificial neural networks, CNNs, and object detection systems.",
    description: "Build neural networks from scratch, utilize PyTorch tensors, train image classifiers, and process video frames.",
    category: "AI/ML",
    level: "Advanced",
    price: 799,
    thumbnail: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Tensor Operations & Backpropagation Math", desc: "Understanding computational graphs and automatic differentiation.", video: AUDIO_VIDEOS.sample3, free: true },
      { title: "2. Building Convolutional Neural Networks (CNN)", desc: "Image feature extraction using Conv2D and MaxPooling layers.", video: AUDIO_VIDEOS.sample2, free: false },
    ],
  },
  {
    title: "Flutter & Dart: The Complete Cross-Platform Guide",
    subTitle: "Design responsive iOS and Android apps with custom UI widgets.",
    description: "Learn Dart syntax, state management with Riverpod, and REST API consumption.",
    category: "App Development",
    level: "Intermediate",
    price: 429,
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Dart Language Syntax & Async Programming", desc: "Futures, Streams, and null-safety in Dart 3.", video: AUDIO_VIDEOS.sample1, free: true },
      { title: "2. Building Custom Flutter Widgets", desc: "Stateless vs Stateful widgets, layout trees, and gesture detectors.", video: AUDIO_VIDEOS.sample4, free: false },
    ],
  },
  {
    title: "DevOps Engineering: Docker, Kubernetes & CI/CD",
    subTitle: "Automate software delivery pipelines and manage cloud infrastructure.",
    description: "Learn containerization with Docker, orchestration with Kubernetes, and automated deployment with GitHub Actions.",
    category: "Others",
    level: "Advanced",
    price: 749,
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Dockerizing Full-Stack Web Applications", desc: "Writing optimized Multi-stage Dockerfiles and docker-compose configurations.", video: AUDIO_VIDEOS.sample2, free: true },
      { title: "2. Deploying Microservices on Kubernetes", desc: "Configuring Pods, Deployments, Services, and Ingress Controllers.", video: AUDIO_VIDEOS.sample3, free: false },
    ],
  },
  {
    title: "AWS Cloud Practitioner & Solutions Architect",
    subTitle: "Deploy and secure cloud infrastructure on Amazon Web Services.",
    description: "Comprehensive guide to EC2, S3, RDS, Lambda, VPC networking, and IAM security policies.",
    category: "Others",
    level: "Intermediate",
    price: 699,
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. AWS Identity & Access Management (IAM)", desc: "Securing resources with granular user policies and roles.", video: AUDIO_VIDEOS.sample1, free: true },
      { title: "2. Serverless Computing with AWS Lambda & API Gateway", desc: "Building event-driven cloud architecture without managing servers.", video: AUDIO_VIDEOS.sample4, free: false },
    ],
  },
  {
    title: "Next.js 14 & Server Components Masterclass",
    subTitle: "Build ultra-fast web applications using the React framework for production.",
    description: "Master App Router, Server Actions, SSR, SSG, streaming interfaces, and Tailwind CSS styling.",
    category: "Web Development",
    level: "Intermediate",
    price: 549,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Next.js App Router & Layout Architecture", desc: "Nested layouts, loading states, and error boundaries.", video: AUDIO_VIDEOS.sample3, free: true },
      { title: "2. Mutations with Server Actions", desc: "Handling form submissions and cache revalidation directly on the server.", video: AUDIO_VIDEOS.sample2, free: false },
    ],
  },
  {
    title: "Graph Neural Networks & Modern AI Research",
    subTitle: "Explore graph structure learning, node classification, and link prediction.",
    description: "Learn PyTorch Geometric, graph convolutional networks (GCN), and molecular graph analysis.",
    category: "AI/ML",
    level: "Advanced",
    price: 899,
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Introduction to Graph Theory & PyTorch Geometric", desc: "Representing graphs as adjacency matrices and node feature vectors.", video: AUDIO_VIDEOS.sample4, free: true },
    ],
  },
  {
    title: "Tailwind CSS & Modern UI Component Libraries",
    subTitle: "Build clean, responsive, and beautiful web designs at lighting speed.",
    description: "Master utility-first CSS, custom config themes, dark mode toggling, and Framer Motion animations.",
    category: "UI UX Designing",
    level: "Beginner",
    price: 249,
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Utility-First Workflow & Responsive Breakpoints", desc: "Designing mobile-first layouts without writing raw CSS files.", video: AUDIO_VIDEOS.sample1, free: true },
    ],
  },
  {
    title: "Clean Code & Software Design Patterns in Java",
    subTitle: "Write maintainable, scalable, and object-oriented enterprise code.",
    description: "Master SOLID principles, Gang of Four design patterns, unit testing with JUnit, and refactoring techniques.",
    category: "Others",
    level: "Intermediate",
    price: 499,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. The SOLID Principles Explained", desc: "Single responsibility, open-closed, and dependency inversion principles.", video: AUDIO_VIDEOS.sample2, free: true },
    ],
  },
  {
    title: "GraphQL API Development with Node.js & Apollo",
    subTitle: "Query exactly what you need with modern declarative APIs.",
    description: "Build GraphQL schemas, resolvers, mutations, subscriptions, and integrate with MongoDB.",
    category: "Web Development",
    level: "Intermediate",
    price: 479,
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Schemas, Types, and Query Resolvers", desc: "Defining object types, scalar types, and root query handlers.", video: AUDIO_VIDEOS.sample3, free: true },
    ],
  },
  {
    title: "SwiftUI & iOS App Development Blueprint",
    subTitle: "Build modern Apple iOS apps using Swift 5 and declarative UI design.",
    description: "Learn SwiftUI layout views, `@State` and `@Binding` property wrappers, CoreData storage, and async network calls.",
    category: "App Development",
    level: "Beginner",
    price: 529,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. SwiftUI Layout Basics & State Management", desc: "VStack, HStack, ZStack and state reactive data flows.", video: AUDIO_VIDEOS.sample4, free: true },
    ],
  },
  {
    title: "Data Visualization with D3.js & WebGL",
    subTitle: "Build custom dynamic charts and 3D visual data experiences.",
    description: "Learn scale functions, SVG path manipulation, force simulation graphs, and interactive canvas charts.",
    category: "Data Analytics",
    level: "Advanced",
    price: 599,
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. SVG Manipulations & D3 Selections", desc: "Binding data to DOM elements and generating dynamic SVG shapes.", video: AUDIO_VIDEOS.sample1, free: true },
    ],
  },
  {
    title: "Web Security & OWASP Top 10 Defense",
    subTitle: "Secure your web applications against real-world malicious attacks.",
    description: "Understand SQL injection, Cross-Site Scripting (XSS), CSRF, broken access control, and security headers.",
    category: "Ethical Hacking",
    level: "Intermediate",
    price: 619,
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    lectures: [
      { title: "1. Preventing Cross-Site Scripting (XSS) & Injection", desc: "Sanitizing user inputs, escaping outputs, and enforcing Content Security Policy (CSP).", video: AUDIO_VIDEOS.sample2, free: true },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await connectDb();

    // Get instructor user to assign as creator
    let adminUser = await User.findOne({ role: "instructor" });
    if (!adminUser) {
      adminUser = await User.findOne();
    }

    if (!adminUser) {
      console.error("⚠️ Please sign up at least 1 user in your database before running this seed script!");
      process.exit(1);
    }

    // Wipe existing collections
    await Course.deleteMany({});
    await Lecture.deleteMany({});
    console.log("🧹 Cleared old courses and lectures.");

    for (const item of coursesData) {
      // 1. Create course document
      const newCourse = await Course.create({
        title: item.title,
        courseTitle: item.title,
        subTitle: item.subTitle,
        description: item.description,
        category: item.category,
        level: item.level,
        price: item.price,
        coursePrice: item.price,
        thumbnail: item.thumbnail,
        courseThumbnail: item.thumbnail,
        creator: adminUser._id,
        isPublished: true,
        lectures: [],
      });

      // 2. Create lectures linked to creator AND course
      const createdLectureIds = [];

      for (const lec of item.lectures) {
        const lectureDoc = await Lecture.create({
          lectureTitle: lec.title,
          title: lec.title,
          description: lec.desc,
          videoUrl: lec.video,
          lectureUrl: lec.video,
          url: lec.video,
          publicUrl: lec.video,
          isPreviewFree: lec.free,
          isFree: lec.free,
          creator: adminUser._id,
          course: newCourse._id,
        });
        createdLectureIds.push(lectureDoc._id);
      }

      // 3. Attach lecture references back to course
      newCourse.lectures = createdLectureIds;
      await newCourse.save();
    }

    console.log("🚀 Successfully seeded 20 legitimate courses with video and audio streams!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();