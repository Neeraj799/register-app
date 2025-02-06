import express from "express";

import { adminAuthCheck, userAuthCheck } from "../middlewares/Auth.js";
import {
  addBook,
  borrowBook,
  borrowHistory,
  deleteBook,
  getAllBooks,
  getBooks,
  returnBook,
  searchBook,
  updateBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.post("/addBook", adminAuthCheck, addBook);
router.get("/books", getAllBooks);
router.get("/search", searchBook);
router.delete("/:id", adminAuthCheck, deleteBook);
router.patch("/updateBook/:id", adminAuthCheck, updateBook);
router.post("/borrowBook/:id", userAuthCheck, borrowBook);
router.post("/returnBook/:id", userAuthCheck, returnBook);
router.get("/borrowHistory/", userAuthCheck, borrowHistory);
router.get("/allBooks", getBooks);

export default router;
