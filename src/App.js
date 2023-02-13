import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageGenerate from './Components/ImageGenerate/ImageGenerate';
import TextGenerate from './Components/TextGenerate/TextGenerate';
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TextGenerate />} />
        <Route path='/imageGenerate' element={<ImageGenerate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
