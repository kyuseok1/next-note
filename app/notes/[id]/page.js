// app/notes/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditNote() {
  const [note, setNote] = useState("");
  const router = useRouter();
  const { id } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/notes?id=${id}`)
      .then((response) => {
        const currentNote = response.data;
        if (currentNote) {
          setNote(currentNote.text);
        }
      })
      .catch((error) => {
        console.error("Error fetching note:", error);
        setError("Failed to fetch note");
      });
  }, [id]);

  const updateNote = () => {
    axios
      .put(`/api/notes?id=${id}`, { text: note })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Error updating note:", error);
        setError("Failed to update note");
      });
  };

  return (
    <div>
      <h1>Edit Note</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter note"
      />
      <button onClick={updateNote}>Update Note</button>
    </div>
  );
}
