import axios from "axios";
import USER_ENDPOINTS from "./authRoutes";

//Login user
export const loginService = async (userData) => {
  const response = await axios.post(USER_ENDPOINTS.LOGIN_USER, userData, {
    withCredentials: true,
  });
  return response.data;
};

//Verify user
export const verifyService = async () => {
  const response = await axios.get(USER_ENDPOINTS.VERIFY_USER, {
    withCredentials: true,
  });
  return response.data;
};

//Logout User
export const logoutService = async () => {
  const response = await axios.post(USER_ENDPOINTS.LOGOUT_USER, {}, {
    withCredentials: true,
  });
  return response.data;
};

//signup user
export const signupService = async (userData) => {
  const response = await axios.post(USER_ENDPOINTS.SIGNUP_USER, userData, {
    withCredentials: true,
  });
  return response.data;
}

//get logged in user profile
export const getProfileService = async () => {
  const response = await axios.get(USER_ENDPOINTS.GET_LOGGED_USER_DETAIL, {
    withCredentials: true,
  });
  return response.data;
};

//update profile
export const updateProfileService = async (userData) => {
  const response = await axios.put(USER_ENDPOINTS.UPDATEPROFILE_USER, userData, {
    withCredentials: true,
  });
  return response.data;
}

//get all users by its type
export const getAllusersByType = async (type, page, limit, sortBy, sortOrder) => {
  const params = new URLSearchParams({ type });

  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const response = await axios.get(`${USER_ENDPOINTS.GETALLUSERS}?${params.toString()}`);
  return response.data;
}

//delete users/admin
export const deleteUsersService = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Please provide an array of user IDs");
  }

  const response = await axios.delete(USER_ENDPOINTS.DELETE_USERS, {
    data: { ids },
    withCredentials: true,
  });

  return response.data;
};

//edit users/admin details
export const editUserDetails = async (id, data) => {
  if (!id) throw new Error("User ID is required");
  if (!data || typeof data !== "object") throw new Error("Data object is required");

  const response = await axios.put(
    `${USER_ENDPOINTS.EDIT_USER}/${id}`,
    data,
    { withCredentials: true }
  );

  return response.data;
};

//add new event
export const addEventService = async (eventData) => {
  const response = await axios.post(USER_ENDPOINTS.ADD_NEW_EVENT, eventData, {
    withCredentials: true,
  });
  return response.data;
}

//get all events
export const getAllEventsService = async (page = 1, limit = 20) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.GET_ALL_EVENTS}?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return response.data;
};

//update event
export const updateEventService = async (eventId, eventData) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.UPDATE_EVENT}/${eventId}`,
    eventData,
    { withCredentials: true }
  );
  return response.data;
};

//delete event
export const deleteEventService = async (eventId) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.DELETE_EVENT}/${eventId}`,
    { withCredentials: true }
  );
  return response.data;
};

//dashboard overview
export const getDashboardService = async (type = "week") => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_DASHBOARD_OVERVIEW}?type=${type}`,
    { withCredentials: true }
  );
  return response.data;
};


export const getActivitiesService = async () => {
  return axios.get(USER_ENDPOINTS.GET_ALL_ACTIVITIES, { withCredentials: true });
};

export const getUSersActivitiesService = async () => {
  return axios.get(USER_ENDPOINTS.GET_ALL_USER_ACTIVITIES, { withCredentials: true });
};




//change password
export const changePasswordService = async ({ currentPassword, newPassword }) => {
  const response = await axios.post(
    USER_ENDPOINTS.CHANGE_PASSWORD,
    { currentPassword, newPassword },
    { withCredentials: true }
  );
  return response.data;
};


// Request password reset (send OTP)
export const requestPasswordResetService = async (email) => {
  const response = await axios.post(`${USER_ENDPOINTS.RESET_PASSWORD}`, { email });
  return response.data;
};

// Verify code and set new password
export const verifyResetCodeService = async ({ email, code, newPassword }) => {
  const response = await axios.post(`${USER_ENDPOINTS.VERIFY_RESET_CODE}`, { email, code, newPassword });
  return response.data;
};



export const analyticsService = {
  getType3Analytics: async (period = 'week') => {
    try {
      const response = await axios.get(
        `${USER_ENDPOINTS.GET_TYPE3_ANALYTICS}?period=${period}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics data' };
    }
  },
};


//create room
export const createRoomService = async () => {
  // Hit first API → get room code
  const firstResponse = await axios.get("https://talkbrush.com/accent/create_room", {
    withCredentials: true,
  });

  const roomCode = firstResponse.data?.room_code;

  if (!roomCode) {
    throw new Error("Room code not returned from GET API");
  }

  console.log("🎉 Room code received:", roomCode);

  // Hit your POST API with that room code
  const secondResponse = await axios.post(
    USER_ENDPOINTS.CREATE_ROOM,
    { room_code: roomCode },
    { withCredentials: true }
  );

  console.log("📤 Room saved:", secondResponse.data);

  // Return final response + room code if you need it
  return {
    room_code: roomCode,
    ...secondResponse.data,
  };
};


//join existed room
export const joinRoomService = async (roomCode) => {
  const response = await axios.post(
    USER_ENDPOINTS.JOIN_ROOM,
    { room_code: roomCode },
    { withCredentials: true }
  );
  return response.data;

}


// get room details
export const getRoomDetailsService = async (roomCode) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.GET_ROOM_DETAILS}/${roomCode}/info`,
    { withCredentials: true }
  );

  return response.data;
};


// leave room
export const leaveRoomService = async (roomCode) => {
  const response = await axios.post(
    USER_ENDPOINTS.LEAVE_ROOM,
    { room_code: roomCode },
    { withCredentials: true }
  );

  return response.data;
};
