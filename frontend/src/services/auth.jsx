import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('placepilot_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [parsedResume, setParsedResume] = useState(() => {
    const saved = localStorage.getItem('placepilot_resume');
    return saved ? JSON.parse(saved) : null;
  });

  const [tailoredQuestions, setTailoredQuestions] = useState(() => {
    const saved = localStorage.getItem('placepilot_questions');
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('placepilot_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.detail || 'Invalid email or password',
      };
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', { name, email, password });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.detail || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setParsedResume(null);
    setTailoredQuestions(null);
    localStorage.removeItem('placepilot_user');
    localStorage.removeItem('placepilot_resume');
    localStorage.removeItem('placepilot_questions');
  };

  const updateParsedResume = (resumeData) => {
    setParsedResume(resumeData);
    if (resumeData) {
      localStorage.setItem('placepilot_resume', JSON.stringify(resumeData));
    } else {
      localStorage.removeItem('placepilot_resume');
    }
  };

  const updateTailoredQuestions = (questions) => {
    setTailoredQuestions(questions);
    if (questions) {
      localStorage.setItem('placepilot_questions', JSON.stringify(questions));
    } else {
      localStorage.removeItem('placepilot_questions');
    }
  };

  const fetchProfile = async () => {
    if (!user) return null;
    try {
      const res = await api.get(`/auth/profile/${user.id}`);
      setProfile(res.data.profile);
      return res.data.profile;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const res = await api.post('/auth/profile', {
        user_id: user.id,
        ...profileData,
      });
      await fetchProfile();
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Profile update failed',
      };
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        parsedResume,
        tailoredQuestions,
        loading,
        login,
        signup,
        logout,
        updateParsedResume,
        updateTailoredQuestions,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
