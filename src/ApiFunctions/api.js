import { Sort } from "@mui/icons-material";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const getInstitutes = async (state, city,instituteName,courseTitle) => {
  try {
    // Construct the filters object dynamically based on the input
    const searchFields = {
      ...(state && { state }),
      ...(city && { city }),
      ...(instituteName && { instituteName }),
      ...courseTitle && { courseTitle },
    };
    // console.log("Search Fields:", searchFields);

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
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')  }
        }    );
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const blogById = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);
    
    // Determine if we're dealing with an ID or a slug
    const isSlug = isNaN(parseInt(idOrSlug)) || idOrSlug.includes("-");
    
    let response;

    if (isSlug) {
      // If it's a slug, pass field="slug" in the body
      response = await axios.get(`${baseURL}/blog/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      // It's an ID, use the original endpoint
      response = await axios.get(`${baseURL}/blog/${idOrSlug}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog:`, error);
    throw error;
  }
};
//getRecentBlogs
export const getRecentBlogs = async () => {
  try {
    const response = await axios.get(`${baseURL}/blogs?limit=5&sort={"createdAt":"desc"}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recent blogs:`, error);
    throw error;
  }
};


export const CarrerDetail = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);
    
    // Determine if we're dealing with an ID or a slug
    const isSlug = isNaN(parseInt(idOrSlug)) || idOrSlug.includes("-");
    
    let response;

    if (isSlug) {
      // If it's a slug, pass field="slug" in the body
      response = await axios.get(`${baseURL}/career/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      // It's an ID, use the original endpoint
      response = await axios.get(`${baseURL}/career/${idOrSlug}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching career detail:`, error);
    throw error;
  }
};

export const getInstituteById = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);
    
    // Determine if we're dealing with an ID or a slug
    const isSlug = isNaN(parseInt(idOrSlug)) || idOrSlug.includes("-");
    
    let response;

    if (isSlug) {
      // If it's a slug, pass field="slug" in the body
      response = await axios.get(`${baseURL}/institute/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      // It's an ID, use the original endpoint
      response = await axios.get(`${baseURL}/institute/${idOrSlug}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute detail:`, error);
    throw error;
  }
};
export const getCoursesById = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);
    
    // Determine if we're dealing with an ID or a slug
    const isSlug = isNaN(parseInt(idOrSlug)) || idOrSlug.includes("-");
    
    let response;

    if (isSlug) {
      // If it's a slug, pass field="slug" in the body
      response = await axios.get(`${baseURL}/course/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      // It's an ID, use the original endpoint
      response = await axios.get(`${baseURL}/course/${idOrSlug}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching course detail:`, error);
    throw error;
  }
};

export const createReview = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/review`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating review:`, error.message);
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
export const blogs = async (page) => {
  try {
    console.log("blogs");
    const response = await axios.get(`${baseURL}/blogs?sortCon={"createdAt":"desc"}`, {
      params: {
        page,
        limit:8
            },
    });
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);

    throw error;
  }
};

export const getBlogs = async () => {
  try {
    console.log("blogs");
    const response = await axios.get(`${baseURL}/blogs?sort={"createdAt":"desc"}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blogs `, error.message);
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

export const careers = async (page) => {
  try {
    const response = await axios.get(`${baseURL}/careers?sort={"createdAt":"desc"}`, {
      params: {
        page,
        limit:8
            },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching careers:`, error);
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

export const AllpopularCourses = async (params = {}) => {
  try {
    // Destructure with default values
    const { 
      page = 1, 
      limit = 10, 
      filters = {}, 
      search = '' 
    } = params;

    // Prepare query parameters
    const queryParams = {
      page: page - 1, // Convert to 0-indexed
      limit,
      filters: typeof filters === 'object' ? JSON.stringify(filters) : filters,
      search
    };

    // Remove undefined or null values
    Object.keys(queryParams).forEach(key => 
      queryParams[key] === undefined && delete queryParams[key]
    );

    const response = await axios.get( `${baseURL}/courses`, {
      params: queryParams
    });
    

    return response;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const courseCategoriesList = async (params = {}) => {
  try {
    const { page = 0 } = params;

    const response = await axios.get(`${baseURL}/course-categories`, {
      params: { page }
    });

    console.log('courseCategoriesList', response);

    return response;
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }
};


export const bestRatedInstitute = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/best-rated-institute?filters={"limit":3}&sort={"createdAt":"desc"}`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching best-rated-institute `, error);

    throw error;
  }
};



export const allbestRatedInstitute = async () => {  
  try {
    const response = await axios.get(`${baseURL}/best-rated-institute`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching best-rated-institute `, error);
    throw error;
  }
};

export const trendingInstitute = async () => {
  try {
    console.log("trendingInstitute",`${baseURL}/institutes?filters={"isTrending":true}&limit=3`);
    const response = await axios.get(
      `${baseURL}/institutes?filters={"isTrending":true}&limit=3`
    );
    console.log('tred',response.data);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching trending institute `, error);

    throw error;
  }
};

export const alltrendingInstitute = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/institutes?filters={"isTrending":true}`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching trending institute `, error);

    throw error;
  }
};

//careerCategories
export const careerCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/career-category?page=0`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching career categories `, error);
    throw error;
  }
};



export const career = async () => {
  try {
    const response = await axios.get(`${baseURL}/careers?limit=3&sort={"createdAt":"desc"}`);
    return response.data;

    // return response.data;s
  } catch (error) {
    console.error(`Error fetching career `, error);

    throw error;
  }
};
export const category = async () => {
  try {
    const response = await axios.get(`${baseURL}/streams?limit=8&sort={"createdAt":"asc"}`);
    console.log("response", response);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching category `, error);

    throw error;
  }
};
