import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Editor } from './features/editor/components/editor';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/editor/:projectId" element={
          <div className="h-screen">
            <Editor />
          </div>

        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;