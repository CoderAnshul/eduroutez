import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

export const getInstitutes = async (state = null, city = null, organisationType = null) => {
  try {
    // Construct the filters object dynamically based on the input
    const filters = {
      ...(state && { state }),
      ...(city && { city }),
      ...(organisationType && { organisationType }),
    };

    const response = await axios.get(`${baseURL}/institutes`, {
      params: {
        filters: JSON.stringify(filters),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching institutes:", error);
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

export const createReview= async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/review`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID ${id}:`, error);
    throw error;
  }
};

export const getReviews= async () => {
  try {
    const response = await axios.get(`${baseURL}/review`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};