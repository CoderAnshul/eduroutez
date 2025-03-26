import React, { useState } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Modal from "@mui/material/Modal";

const ReviewBox = ({ review }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Truncate the review text to 30 words
  const splitText = (text, wordLimit) => {
    const words = text ? text.split(" ") : [];
    return words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")}...`
      : text;
  };

  return (
    <>
      {/* Review Card */}
      <div
        key={review.id}
        className="h-64 max-w-[480px] sm:max-w-auto min-w-56 p-3 rounded-xl bg-white shadow-lg flex-1"
      >
        <div className="flex items-baseline justify-between">
          <div
            className="userImage h-20 w-20 rounded-full bg-gray-400"
            style={{
              backgroundImage: `url(${review.userImage})`,
              backgroundSize: "cover",
            }}
          ></div>
          <Box sx={{ "& > legend": { mt: 2 } }}>
            <Rating
              className="!text-sm"
              name="half-rating-read"
              defaultValue={2.5}
              value={review.rating}
              precision={0.1}
              readOnly
            />
          </Box>
        </div>
        <div className="flex flex-col justify-around h-40">
          {/* Truncated Review Text */}
          <p className="text-xs mt-3">
            {splitText(review.text, 30)}{" "}
            <span
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={handleOpen}
            >
              Read More
            </span>
          </p>
          <div className="min-h-8 w-full pl-2 py-1 bg-[#b82025]">
            <h5 className="text-sm text-white font-semibold">{review.name}</h5>
            <p className="text-xs font-regular text-white">{review.company}</p>
          </div>
        </div>
      </div>

      {/* Modal for Full Review */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
        className="flex justify-center items-center"
      >
        <div
          className="p-6 bg-white max-h-[450px] relative shadow-lg rounded-lg max-w-lg ml-2 mr-2 mx-auto mt-20"
          style={{ outline: "none" }}
        >
          <h2
            className="text-lg font-semibold mb-2 mt-6"
            id="review-modal-title"
          >
            Full Review
          </h2>
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-sm text-black font-semibold">{review.name}</h5>
            <Box sx={{ "& > legend": { mt: 2 } }}>
              <Rating
                className="!text-sm"
                name="half-rating-read"
                defaultValue={2.5}
                value={review.rating}
                precision={0.1}
                readOnly
              />
            </Box>
          </div>
          <p id="review-modal-description" className="text-sm">
            {review.text}
          </p>
          <button
            className="mt-4 px-3 py-1 rounded-full absolute top-0 transition-transform transform active:scale-95 hover:scale-105 right-2 bg-blue-500 text-white"
            onClick={handleClose}
          >
            X
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ReviewBox;
