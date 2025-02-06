import { bookValidationSchema } from "../helpers/bookValidation.js";
import Books from "../models/book.js";

const addBook = async (req, res) => {
  try {
    const { error } = bookValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);

      return res.status(403).json({ error: error.details });
    }
    const { title, author, ISBN, publishedYear, availableCopies } = req.body;

    const newBook = new Books({
      title,
      author,
      ISBN,
      publishedYear,
      availableCopies,
    });

    let data = newBook.save();

    return res.status(200).json({
      success: true,
      message: "Book added successfully",
    });
  } catch (err) {
    return res.json({ message: "Internal Server Error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const books = await Books.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalBooks = await Books.countDocuments();

    return res.status(200).json({
      success: true,
      data: books,
      pagination: {
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Books.find({}).sort({ created_at: -1 });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchBook = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter is required" });
    }

    const books = await Books.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });

    res.json({ success: true, data: books });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Books.findByIdAndDelete({ _id: id });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { error } = bookValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);

      return res.status(403).json({ error: error.details });
    }

    const { id } = req.params;

    const { title, author, ISBN, publishedYear, availableCopies } = req.body;

    const updateData = {
      title,
      author,
      ISBN,
      publishedYear,
      availableCopies,
    };

    const updateBook = await Books.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      { new: true }
    );

    if (!updateBook) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Book Updated Successfully",
      submission: updateBook,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.userId;
    console.log(userId);

    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    book.availableCopies -= 1;

    book.borrowedBy.push(userId);

    await book.save();

    res.status(200).json({ message: "Book borrowed successfully", book });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const returnBook = async (req, res) => {
  const { id } = req.params;

  const userId = req.user.userId;

  try {
    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.borrowedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "This user did not borrow the book" });
    }

    book.borrowedBy = book.borrowedBy.filter(
      (user) => user.toString() !== userId
    );

    book.availableCopies += 1;

    await book.save();

    res.status(200).json({ message: "Book returned successfully", book });
  } catch (err) {
    return res.status(500).json("Internal Server Error");
  }
};

const borrowHistory = async (req, res) => {
  try {
    const id = req.user.userId;
    console.log(id);

    const books = await Books.find({ borrowedBy: id }).populate({
      path: "borrowedBy",
      model: "user",
    });
    console.log("book", books);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No borrowing histroy" });
    }

    return res
      .status(200)
      .json({ message: "Borrowing history fetched successfully", books });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addBook,
  getAllBooks,
  deleteBook,
  updateBook,
  searchBook,
  borrowBook,
  getBooks,
  returnBook,
  borrowHistory,
};
