import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaBookOpen, FaUsers, FaQuoteLeft, FaUserCircle, FaGoogle } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    fetchBlogs();
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogsData);
  };

  const handleAddBlog = async () => {
    const title = prompt("Enter blog title:");
    const content = prompt("Enter blog content:");
    if (title && content) {
      await addDoc(collection(db, "blogs"), { title, content, author: user.displayName });
      fetchBlogs();
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-600 min-h-screen text-white p-6">
      {/* Header */}
      <header className="text-center text-4xl font-bold my-6">
        📖 Shri Krishnaya Vasudevaya Namah 🙏
      </header>
      
      {/* Introduction */}
      <p className="text-center text-lg mb-8">
        A Krishna-conscious platform for competitive exam aspirants to grow, connect, and excel.
      </p>

      {/* Login/Signup Section */}
      <div className="flex justify-center mb-8 gap-4">
        {user ? (
          <>
            <p className="text-center">Welcome, {user.displayName}!</p>
            <Button onClick={handleLogout} className="bg-red-600 text-white">Logout</Button>
          </>
        ) : (
          <Button onClick={handleGoogleLogin} className="bg-red-600 text-white flex items-center px-6 py-2 rounded-lg shadow-md">
            <FaGoogle className="mr-2" /> Sign in with Google
          </Button>
        )}
      </div>

      {/* Feature Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Study Hub */}
        <Card className="bg-white text-black p-4 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center">
            <FaBookOpen size={40} className="text-blue-600 mb-2" />
            <h2 className="text-xl font-semibold">Study Hub 📚</h2>
            <p className="text-center text-sm mt-2">
              Notes, PYQs, mock tests, and a community-driven doubt-solving forum.
            </p>
            <Button className="mt-4 bg-blue-600 text-white">Explore</Button>
          </CardContent>
        </Card>

        {/* Krishna-Conscious Motivation */}
        <Card className="bg-white text-black p-4 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center">
            <FaQuoteLeft size={40} className="text-green-600 mb-2" />
            <h2 className="text-xl font-semibold">Gita Wisdom ✨</h2>
            <p className="text-center text-sm mt-2">
              Daily Bhagavad Gita quotes, guided meditation, and Krishna-conscious study techniques.
            </p>
            <Button className="mt-4 bg-green-600 text-white">Read More</Button>
          </CardContent>
        </Card>

        {/* Community Section */}
        <Card className="bg-white text-black p-4 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center">
            <FaUsers size={40} className="text-yellow-600 mb-2" />
            <h2 className="text-xl font-semibold">Student Community 🌍</h2>
            <p className="text-center text-sm mt-2">
              Connect with aspirants, join study groups, and attend virtual Gita study circles.
            </p>
            <Button className="mt-4 bg-yellow-600 text-white">Join Now</Button>
          </CardContent>
        </Card>
      </div>

      {/* Guest Blog Section */}
      <section className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold">🌟 Guest Blogs by Toppers</h2>
        <p className="text-center text-lg mt-2">
          Learn study strategies and experiences from Krishna-conscious achievers.
        </p>
        {user && <Button className="mt-4 block mx-auto bg-purple-600 text-white" onClick={handleAddBlog}>Add Blog</Button>}
        <div className="mt-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="bg-white text-black p-4 my-4 rounded-2xl shadow-lg">
              <CardContent>
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-sm mt-2">{blog.content}</p>
                <p className="text-right text-gray-500 mt-2">- {blog.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
