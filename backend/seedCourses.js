import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/courseModel.js';
import User from './models/userModel.js';
import Lecture from './models/lectureModel.js';

dotenv.config();

const seedManyCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/lms');
        console.log("Connected to MongoDB for seeding...");

        const educator = await User.findOne({ role: 'educator' });
        if (!educator) {
            console.error("No educator found! Please create an educator account first.");
            process.exit(1);
        }

        // Clear existing sample data
        await Course.deleteMany({ isPublished: true });
        console.log("Cleared all existing published courses for fresh start.");

        const coursesToSeed = [
            {
                title: "Ultimate Web Development Bootcamp",
                subTitle: "MERN Stack from zero to hero",
                category: "Web Development",
                description: "Full-stack development using MongoDB, Express, React, and Node.js. Build 10+ real world projects.",
                level: "Intermediate", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "MERN Stack Intro", url: "https://www.youtube.com/watch?v=7CqJlxBYj-M" }]
            },
            {
                title: "AI & Machine Learning for Beginners",
                subTitle: "Unlock the power of artificial intelligence",
                category: "AI/ML",
                description: "Learn Python, Scikit-Learn, TensorFlow and more. Understand neural networks and deep learning.",
                level: "Beginner", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "What is AI?", url: "https://www.youtube.com/watch?v=2ePf9rue1Ao" }]
            },
            {
                title: "Ethical Hacking & Cybersecurity",
                subTitle: "Become a professional pentester",
                category: "Ethical Hacking",
                description: "Master Kali Linux, network scanning, and vulnerability assessment. Protect systems from hackers.",
                level: "Intermediate", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "Ethical Hacking Course", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE" }]
            },
            {
                title: "Flutter App Development",
                subTitle: "Build cross-platform mobile apps",
                category: "App Development",
                description: "Create beautiful native apps for iOS and Android with a single codebase using Dart and Flutter.",
                level: "Beginner", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "Flutter Crash Course", url: "https://www.youtube.com/watch?v=VPvVD8t02U8" }]
            },
            {
                title: "Advanced Data Analytics with SQL",
                subTitle: "Master data manipulation and insights",
                category: "Data Analytics",
                description: "Learn advanced SQL queries, data cleaning, and visualization techniques for business intelligence.",
                level: "Advanced", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "SQL for Data Science", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" }]
            },
            {
                title: "Mastering UI UX with Figma",
                subTitle: "The complete design workflow",
                category: "UI UX Designing",
                description: "User research, wireframing, prototyping and handoff. Everything you need to be a top designer.",
                level: "Beginner", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "Figma UI Design", url: "https://www.youtube.com/watch?v=g6B7X07pS0Q" }]
            },
            {
                title: "Cloud Computing with AWS",
                subTitle: "Deploy scalable applications",
                category: "Others",
                description: "Learn EC2, S3, Lambda and more. Prepare for the AWS Certified Solutions Architect exam.",
                level: "Intermediate", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "AWS Full Course", url: "https://www.youtube.com/watch?v=ulprqHHWlng" }]
            },
            {
                title: "Deep Learning with PyTorch",
                subTitle: "Neural networks from scratch",
                category: "AI/ML",
                description: "Build and train complex models for image recognition and natural language processing.",
                level: "Advanced", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "PyTorch Basics", url: "https://www.youtube.com/watch?v=GIsg-ZUy0MY" }]
            },
            {
                title: "JavaScript Engine Internals",
                subTitle: "Understand how V8 works",
                category: "Web Development",
                description: "Memory management, call stacks, and execution contexts. Become a senior developer.",
                level: "Advanced", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "JS Under the Hood", url: "https://www.youtube.com/watch?v=hGlnlsR76Xk" }]
            },
            {
                title: "Blockchain & Web3 Fundamentals",
                subTitle: "The future of the internet",
                category: "Others",
                description: "Smart contracts, Ethereum, and decentralized apps. Learn Solidity programming.",
                level: "Beginner", price: 0,
                thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
                videos: [{ title: "Blockchain Tutorial", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ" }]
            }
        ];

        for (const data of coursesToSeed) {
            const lectureIds = [];
            for (const v of data.videos) {
                const newLecture = await Lecture.create({
                    lectureTitle: v.title,
                    videoUrl: v.url,
                    isPreviewFree: true
                });
                lectureIds.push(newLecture._id);
            }

            const newCourse = new Course({
                ...data,
                creator: educator._id,
                isPublished: true,
                lectures: lectureIds
            });
            await newCourse.save();
            console.log(`Added: ${data.title}`);
        }

        console.log("Seeding complete! 10 premium courses added.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedManyCourses();
