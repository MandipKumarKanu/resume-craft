import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import Header from "./components/Header";
import AnimatedTitle from "./components/AnimatedTitle";
import BeforeAfterShowcase from "./components/BeforeAfterShowcase";
import UploadForm from "./components/UploadForm";
import Footer from "./components/Footer";
import ResponsePage from "./components/ResponsePage";
import "./App.css";

function HomePage() {
  return (
    <div className="app-container">
      <AnimatedBackground />

      <div className="content-layer flex flex-col items-center justify-center min-h-screen">
        <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 flex items-center justify-center relative">
          <Header />

          <div className="max-w-4xl w-full mt-10 sm:mt-16">
            <AnimatedTitle />
            <BeforeAfterShowcase />
            <UploadForm />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/response" element={<ResponsePage />} />
      </Routes>
    </Router>
  );
}

export default App;
