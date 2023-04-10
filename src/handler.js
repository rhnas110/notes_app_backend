const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNotesHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNotes);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h
      .response({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: {
          noteId: id,
        },
      })
      .code(201);
    return response;
  }

  const response = h
    .response({
      status: "fail",
      message: "Catatan gagal ditambahkan",
    })
    .code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.filter((note) => note.id === id)[0];

  if (!note) {
    const response = h
      .response({
        status: "fail",
        message: "Catatan tidak ditemukan",
      })
      .code(404);
    return response;
  }

  return {
    status: "success",
    data: {
      note,
    },
  };
};

const editNoteByIdHandler = (req, h) => {
  const { title, tags, body } = req.payload;
  const { id } = req.params;

  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (!(index + 1)) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui catatan. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };
  const response = h
    .response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    })
    .code(200);
  return response;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Catatan gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  notes.splice(index, 1);
  const response = h.response({
    status: "success",
    message: "Catatan berhasil dihapus",
  });
  response.code(200);
  return response;
};

module.exports = {
  addNotesHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
