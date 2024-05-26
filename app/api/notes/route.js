// app/api/notes/route.js
import dbConnect from "../../../lib/db";
import Note from "../../../models/Note";

export async function GET(request) {
  await dbConnect();
  const notes = await Note.find({});
  return new Response(JSON.stringify(notes), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request) {
  await dbConnect();
  const { text } = await request.json();
  const note = new Note({ text });
  await note.save();
  return new Response(JSON.stringify(note), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request) {
  await dbConnect();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  await Note.findByIdAndDelete(id);
  return new Response(null, {
    status: 204,
  });
}

export async function PUT(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const { text } = await request.json();
    const note = await Note.findByIdAndUpdate(id, { text }, { new: true });
    if (!note) {
      return new Response(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return new Response(JSON.stringify(note), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return new Response(JSON.stringify({ message: "Error updating note" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
