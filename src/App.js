import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageGenerate from './Components/ImageGenerate/ImageGenerate';
import Nav from './Components/MyGPTNav/Nav';
import TextGenerate from './Components/TextGenerate/TextGenerate';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path='/' element={<TextGenerate />} />
        <Route path='/imageGenerate' element={<ImageGenerate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
