import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const getInstitutes = async (state, city) => {
  try {
    // Construct the filters object dynamically based on the input
    const searchFields = {
      ...(state && { state }),
      ...(city && { city }),
    };
    console.log("Search Fields:", searchFields);

    const response = await axios.get(`${baseURL}/institutes`, {
      params: {
        searchFields: JSON.stringify(searchFields),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching institutes:", error);
    throw error;
  }
};

export const addToWishlist = async (userId, instituteId) => {
  try {
    const response = await axios.post(
      `${baseURL}/wishlist/`,
      { userId, instituteId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const blogById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID :`, error);
    throw error;
  }
};

export const CarrerDetail = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/career/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID :`, error);
    throw error;
  }
};

export const getInstituteById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/institute/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID ${id}:`, error);
    throw error;
  }
};
export const getCoursesById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/course/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID ${id}:`, error);
    throw error;
  }
};

export const createReview = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/review`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID ${id}:`, error);
    throw error;
  }
};

export const getReviews = async () => {
  try {
    const response = await axios.get(`${baseURL}/review`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const adds = async () => {
  try {
    const response = await axios.get(`${baseURL}/promotions`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching adds `, error);
    throw error;
  }
};
export const homeBanner = async () => {
  try {
    const response = await axios.get(`${baseURL}/media`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);
    throw error;
  }
};
export const blogs = async () => {
  try {
    const response = await axios.get(`${baseURL}/blogs`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);

    throw error;
  }
};

export const createQuery = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/query`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID :`, error);
  }
};

export const postQuestion = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/question-answer`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID :`, error);
  }
};

export const careers = async () => {
  try {
    const response = await axios.get(`${baseURL}/careers`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);
    throw error;
  }
};
export const counsellers = async () => {
  try {
    const response = await axios.get(`${baseURL}/counselors`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);

    throw error;
  }
};
export const popularCourses = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/courses?filters={"isCoursePopular":true}&limit=3`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching Popular courses `, error);

    throw error;
  }
};
export const bestRatedInstitute = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/best-rated-institute?filters=limit=3`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching best-rated-institute `, error);

    throw error;
  }
};
export const trendingInstitute = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/institutes?filters={"isTrending":true}&limit=3`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching trending institute `, error);

    throw error;
  }
};
export const career = async () => {
  try {
    const response = await axios.get(`${baseURL}/careers?limit=3`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching career `, error);

    throw error;
  }
};
export const category = async () => {
  try {
    const response = await axios.get(`${baseURL}/streams?limit=8`);
    console.log("response", response);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching category `, error);

    throw error;
  }
};
