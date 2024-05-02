import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaLock, FaCloud, FaCheckCircle, FaSpinner } from "react-icons/fa";

const Index = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved"); // 'saving', 'saved'
  const [lastSaveTime, setLastSaveTime] = useState(null);

  useEffect(() => {
    if (selectedNotebook) {
      setNoteText(selectedNotebook.content);
    }
  }, [selectedNotebook]);

  useEffect(() => {
    const handleAutoSave = setTimeout(() => {
      if (selectedNotebook && noteText !== selectedNotebook.content) {
        saveNotebook();
      }
    }, 500); // Autosave every 500ms

    return () => clearTimeout(handleAutoSave);
  }, [noteText, selectedNotebook]);

  const addNotebook = () => {
    const newNotebook = {
      id: Date.now(),
      name: "New Notebook",
      content: "",
      isPrivate: false,
      pin: "",
    };
    setNotebooks([...notebooks, newNotebook]);
    setSelectedNotebook(newNotebook);
  };

  const deleteNotebook = (id) => {
    setNotebooks(notebooks.filter((notebook) => notebook.id !== id));
    if (selectedNotebook && selectedNotebook.id === id) {
      setSelectedNotebook(null);
      setNoteText("");
    }
  };

  const saveNotebook = () => {
    setAutoSaveStatus("saving");
    const startTime = performance.now();
    const updatedNotebooks = notebooks.map((notebook) => {
      if (notebook.id === selectedNotebook.id) {
        return { ...notebook, content: noteText };
      }
      return notebook;
    });
    setNotebooks(updatedNotebooks);
    const endTime = performance.now();
    setLastSaveTime(((endTime - startTime) / 1000).toFixed(2));
    setAutoSaveStatus("saved");
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notebooks</h1>
        <button onClick={addNotebook} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <FaPlus /> Add Notebook
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {notebooks.map((notebook) => (
          <div key={notebook.id} className="p-4 border rounded">
            <h2 className="text-xl font-semibold">{notebook.name}</h2>
            <p>{notebook.content.slice(0, 100)}...</p>
            <button onClick={() => setSelectedNotebook(notebook)} className="text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">
              Open
            </button>
            <button onClick={() => deleteNotebook(notebook.id)} className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      {selectedNotebook && (
        <div className="mt-4 p-4 border rounded">
          <textarea value={noteText} onChange={handleNoteChange} className="w-full h-64 p-2 border" />
          <div className="flex justify-between items-center mt-2">
            <span>
              Autosave: {autoSaveStatus === "saving" ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
              {lastSaveTime && ` in ${lastSaveTime}s`}
            </span>
            <button onClick={saveNotebook} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
