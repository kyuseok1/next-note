// app/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/notes")
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes");
      });
  }, []);

  const addNote = () => {
    axios
      .post("/api/notes", { text: note })
      .then((response) => {
        setNotes([...notes, response.data]);
        setNote("");
      })
      .catch((error) => {
        console.error("Error adding note:", error);
        setError("Failed to add note");
      });
  };

  const deleteNote = (id) => {
    axios
      .delete(`/api/notes?id=${id}`)
      .then(() => {
        setNotes(notes.filter((note) => note._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        setError("Failed to delete note");
      });
  };

  return (
    <div>
      <h1>Note CRUD App</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter note"
      />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            {note.text}
            <button onClick={() => deleteNote(note._id)}>Delete</button>
            <Link href={`/notes/${note._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
